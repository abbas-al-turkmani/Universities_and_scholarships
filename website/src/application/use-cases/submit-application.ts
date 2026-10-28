import type { Application, ApplicationStatus } from "@/domain/model";
import type { IApplicationRepository, IProgramRepository, IStudentRepository } from "@/domain/repositories";
import { ForbiddenError, NotFoundError, ValidationError } from "@/domain/errors";
import type { Actor, IClock, IIdGenerator, INotificationSender } from "@/application/ports";

export interface SubmitApplicationInput {
  studentId: string;
  opportunityId: string;
  documents: { name: string; type: string; size: number }[];
}

export class SubmitApplication {
  constructor(
    private readonly applications: IApplicationRepository,
    private readonly programs: IProgramRepository,
    private readonly students: IStudentRepository,
    private readonly clock: IClock,
    private readonly ids: IIdGenerator,
    private readonly notifications: INotificationSender,
  ) {}

  /** Validates ownership and program availability before persisting a submission. */
  async execute(input: SubmitApplicationInput, actor: Actor): Promise<Application> {
    if (actor.role !== "STUDENT") throw new ForbiddenError("Only students can submit an application.");
    const student = await this.students.findById(input.studentId);
    if (!student) throw new NotFoundError("Student", input.studentId);
    if (student.id !== actor.userId && `user-${student.id}` !== actor.userId) {
      throw new ForbiddenError("Students may only submit applications for their own profile.");
    }

    const opportunity = await this.programs.findById(input.opportunityId);
    if (!opportunity) throw new NotFoundError("Opportunity", input.opportunityId);
    if (opportunity.status !== "OPEN" || new Date(opportunity.deadline) < this.clock.now()) {
      throw new ValidationError("This opportunity is closed.");
    }
    if (input.documents.length === 0) throw new ValidationError("At least one required document must be attached.");

    const id = this.ids.next();
    const reference = `MNH-${this.clock.now().getUTCFullYear()}-${id.replace(/\D/g, "").slice(-6).padStart(6, "0")}`;
    const status: ApplicationStatus = "SUBMITTED";
    const application: Application = {
      id,
      reference,
      studentId: student.id,
      opportunityId: opportunity.id,
      status,
      submittedAt: this.clock.now().toISOString(),
      assignedReviewer: "",
      history: [{ status, date: this.clock.now().toISOString(), note: "Application submitted" }],
      documents: input.documents,
    };
    await this.applications.save(application);
    await this.notifications.send(student.email, "Application submitted", `Your reference number is ${reference}.`);
    return application;
  }
}

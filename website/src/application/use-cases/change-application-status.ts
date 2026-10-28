import type { Application, ApplicationStatus } from "@/domain/model";
import type { IApplicationRepository } from "@/domain/repositories";
import { ForbiddenError, NotFoundError, ValidationError } from "@/domain/errors";
import type { Actor, IClock, INotificationSender } from "@/application/ports";

export interface ChangeApplicationStatusInput {
  applicationId: string;
  status: ApplicationStatus;
  comment: string;
}

export class ChangeApplicationStatus {
  constructor(
    private readonly applications: IApplicationRepository,
    private readonly clock: IClock,
    private readonly notifications: INotificationSender,
  ) {}

  /** Checks reviewer assignment and records an auditable status-history entry. */
  async execute(input: ChangeApplicationStatusInput, actor: Actor): Promise<Application> {
    const application = await this.applications.findById(input.applicationId);
    if (!application) throw new NotFoundError("Application", input.applicationId);
    if (actor.role === "STUDENT") throw new ForbiddenError();
    if (actor.role === "REVIEWER" && application.assignedReviewer !== actor.userId) {
      throw new ForbiddenError("Reviewers may only update applications assigned to them.");
    }
    if (input.status === "DRAFT") throw new ValidationError("An application cannot be moved back to draft.");
    const updated: Application = {
      ...application,
      status: input.status,
      history: [...application.history, {
        status: input.status,
        date: this.clock.now().toISOString(),
        note: input.comment.trim() || "Status updated",
      }],
    };
    await this.applications.save(updated);
    await this.notifications.send(application.studentId, "Application status updated", `Your application status is now ${input.status}.`);
    return updated;
  }
}

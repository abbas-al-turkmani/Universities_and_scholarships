import { recommendProgramsForStudent } from "@/domain/eligibility-matcher";
import type { Opportunity, Student } from "@/domain/model";
import type { IProgramRepository, IStudentRepository } from "@/domain/repositories";
import { ForbiddenError, NotFoundError } from "@/domain/errors";
import type { Actor } from "@/application/ports";

export class RecommendProgramsForStudent {
  constructor(
    private readonly programs: IProgramRepository,
    private readonly students: IStudentRepository,
  ) {}

  /** Ranks open programs and explains which eligibility rules are met. */
  async execute(studentId: string, actor: Actor) {
    if (actor.role === "STUDENT" && actor.userId !== studentId) {
      throw new ForbiddenError("Students may only view recommendations for their own profile.");
    }
    const [student, opportunities] = await Promise.all([
      this.students.findById(studentId),
      this.programs.list(),
    ]);
    if (!student) throw new NotFoundError("Student", studentId);
    return recommendProgramsForStudent(student, opportunities);
  }
}

export function getDashboardStats(input: {
  applications: { status: string }[];
  programs: Opportunity[];
  students: Student[];
}) {
  return {
    totalApplications: input.applications.length,
    pendingReview: input.applications.filter((application) =>
      ["SUBMITTED", "UNDER_REVIEW", "DOCUMENTS_REQUESTED"].includes(application.status),
    ).length,
    accepted: input.applications.filter((application) => application.status === "ACCEPTED").length,
    activePrograms: input.programs.filter((program) => program.status === "OPEN").length,
    totalStudents: input.students.length,
  };
}

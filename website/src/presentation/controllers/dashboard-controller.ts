import type { Application, Notification, Opportunity, Student, University, User } from "@/domain/model";
import type {
  IApplicationRepository,
  INotificationRepository,
  IProgramRepository,
  IStudentRepository,
  IUniversityRepository,
  IUserRepository,
} from "@/domain/repositories";
import { NotFoundError } from "@/domain/errors";
import { RecommendProgramsForStudent } from "@/application/use-cases/recommend-programs";
import type { Actor } from "@/application/ports";

export interface StudentDashboardViewModel {
  user: User;
  student: Student;
  applications: (Application & { opportunity?: Opportunity; university?: University })[];
  recommendations: { opportunity: Opportunity; score: number }[];
  notifications: Notification[];
}

export class DashboardController {
  constructor(
    private readonly users: IUserRepository,
    private readonly students: IStudentRepository,
    private readonly applications: IApplicationRepository,
    private readonly programs: IProgramRepository,
    private readonly universities: IUniversityRepository,
    private readonly notifications: INotificationRepository,
    private readonly recommendPrograms: RecommendProgramsForStudent,
  ) {}

  async getStudentDashboard(userId: string): Promise<StudentDashboardViewModel> {
    const user = await this.users.findById(userId);
    if (!user?.studentId || user.role !== "STUDENT") throw new NotFoundError("Student user", userId);
    const student = await this.students.findById(user.studentId);
    if (!student) throw new NotFoundError("Student", user.studentId);

    const [allApplications, programs, universities, recommendations, notifications] = await Promise.all([
      this.applications.list(),
      this.programs.list(),
      this.universities.list(),
      this.recommendPrograms.execute(student.id, { userId: user.id, role: user.role } satisfies Actor),
      this.notifications.listForUser(user.id),
    ]);

    return {
      user,
      student,
      applications: allApplications
        .filter((application) => application.studentId === student.id)
        .map((application) => {
          const opportunity = programs.find((program) => program.id === application.opportunityId);
          const university = opportunity
            ? universities.find((entry) => entry.id === opportunity.universityId)
            : undefined;
          return { ...application, opportunity, university };
        }),
      recommendations: recommendations.map(({ opportunity, score }) => ({ opportunity, score })),
      notifications,
    };
  }
}

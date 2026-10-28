import { ChangeApplicationStatus } from "@/application/use-cases/change-application-status";
import { RecommendProgramsForStudent } from "@/application/use-cases/recommend-programs";
import { SubmitApplication } from "@/application/use-cases/submit-application";
import { MockNotificationSender } from "@/infrastructure/services/mock-notification-sender";
import { SystemClock } from "@/infrastructure/services/system-clock";
import { UuidGenerator } from "@/infrastructure/services/uuid-generator";
import { createDatabaseRepositories } from "@/infrastructure/repositories/mock/in-memory";
import { ProgramController } from "@/presentation/controllers/program-controller";
import { UniversityController } from "@/presentation/controllers/university-controller";
import { AuthController } from "@/presentation/controllers/auth-controller";
import { ApplicationController } from "@/presentation/controllers/application-controller";
import { StudentController } from "@/presentation/controllers/student-controller";
import { AdminController } from "@/presentation/controllers/admin-controller";
import { ReviewerController } from "@/presentation/controllers/reviewer-controller";
import { DashboardController } from "@/presentation/controllers/dashboard-controller";

function createContainer() {
  const repositories = createDatabaseRepositories();
  const clock = new SystemClock();
  const ids = new UuidGenerator();
  const notificationSender = new MockNotificationSender();

  return {
    repositories,
    useCases: {
      submitApplication: new SubmitApplication(
        repositories.applications,
        repositories.programs,
        repositories.students,
        clock,
        ids,
        notificationSender,
      ),
      changeApplicationStatus: new ChangeApplicationStatus(
        repositories.applications,
        clock,
        notificationSender,
      ),
      recommendPrograms: new RecommendProgramsForStudent(
        repositories.programs,
        repositories.students,
      ),
    },
    controllers: {
      programs: new ProgramController(repositories.programs, repositories.universities),
      universities: new UniversityController(repositories.universities),
      auth: new AuthController(repositories.users),
      applications: new ApplicationController(repositories.applications, repositories.students),
      students: new StudentController(repositories.students),
      admin: new AdminController(
        repositories.applications,
        repositories.programs,
        repositories.students,
        repositories.universities,
      ),
      reviewer: new ReviewerController(repositories.applications),
      dashboard: new DashboardController(
        repositories.users,
        repositories.students,
        repositories.applications,
        repositories.programs,
        repositories.universities,
        repositories.notifications,
        new RecommendProgramsForStudent(repositories.programs, repositories.students),
      ),
    },
  };
}

type RuntimeGlobal = typeof globalThis & {
  __manhalContainer?: ReturnType<typeof createContainer>;
};

const runtimeGlobal = globalThis as RuntimeGlobal;
export const container = runtimeGlobal.__manhalContainer ??= createContainer();

import type {
  IApplicationRepository,
  IProgramRepository,
  IStudentRepository,
  IUniversityRepository,
} from "@/domain/repositories";
import { getDashboardStats } from "@/application/use-cases/recommend-programs";

export class AdminController {
  constructor(
    private readonly applications: IApplicationRepository,
    private readonly programs: IProgramRepository,
    private readonly students: IStudentRepository,
    private readonly universities: IUniversityRepository,
  ) {}

  async getDashboardStats() {
    const [applications, programs, students] = await Promise.all([
      this.applications.list(),
      this.programs.list(),
      this.students.list(),
    ]);
    return getDashboardStats({ applications, programs, students });
  }

  async getDashboardData() {
    const [applications, opportunities, students, universities] = await Promise.all([
      this.applications.list(),
      this.programs.list(),
      this.students.list(),
      this.universities.list(),
    ]);
    return { applications, opportunities, students, universities };
  }
}

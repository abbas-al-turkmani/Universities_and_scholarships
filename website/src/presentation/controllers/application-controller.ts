import type { Application, Student } from "@/domain/model";
import type { IApplicationRepository, IStudentRepository } from "@/domain/repositories";

export class ApplicationController {
  constructor(
    private readonly applications: IApplicationRepository,
    private readonly students: IStudentRepository,
  ) {}

  list() {
    return this.applications.list();
  }

  findById(id: string) {
    return this.applications.findById(id);
  }

  async findForStudent(reference: string, studentId: string) {
    const applications = await this.applications.list();
    return applications.find((application) =>
      application.reference === reference && application.studentId === studentId,
    );
  }

  async track(reference: string, email: string): Promise<Application | undefined> {
    const applications = await this.applications.list();
    const application = applications.find((entry) => entry.reference === reference);
    if (!application) return undefined;
    const student = await this.students.findById(application.studentId);
    return student?.email.toLowerCase() === email.toLowerCase() ? application : undefined;
  }

  async getStudent(studentId: string): Promise<Student | undefined> {
    return this.students.findById(studentId);
  }
}

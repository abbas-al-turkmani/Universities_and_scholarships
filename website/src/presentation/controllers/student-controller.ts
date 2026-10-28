import type { Student } from "@/domain/model";
import type { IStudentRepository } from "@/domain/repositories";

export class StudentController {
  constructor(private readonly students: IStudentRepository) {}

  list() {
    return this.students.list();
  }

  getProfile(studentId: string): Promise<Student | undefined> {
    return this.students.findById(studentId);
  }
}

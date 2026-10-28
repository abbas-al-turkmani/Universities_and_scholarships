import type { IUniversityRepository } from "@/domain/repositories";

export class UniversityController {
  constructor(private readonly universities: IUniversityRepository) {}

  list() {
    return this.universities.list();
  }
}

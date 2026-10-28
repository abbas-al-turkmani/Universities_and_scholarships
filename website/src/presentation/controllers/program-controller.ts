import type { Opportunity, University } from "@/domain/model";
import type { IProgramRepository, IUniversityRepository } from "@/domain/repositories";
import { NotFoundError } from "@/domain/errors";

export interface ProgramViewModel {
  opportunity: Opportunity;
  university: University;
}

export class ProgramController {
  constructor(
    private readonly programs: IProgramRepository,
    private readonly universities: IUniversityRepository,
  ) {}

  async list(): Promise<ProgramViewModel[]> {
    const [programs, universities] = await Promise.all([
      this.programs.list(),
      this.universities.list(),
    ]);
    return programs.flatMap((opportunity) => {
      const university = universities.find((entry) => entry.id === opportunity.universityId);
      return university ? [{ opportunity, university }] : [];
    });
  }

  async getBySlug(slug: string): Promise<ProgramViewModel> {
    const [programs, universities] = await Promise.all([
      this.programs.list(),
      this.universities.list(),
    ]);
    const opportunity = programs.find((entry) => entry.slug === slug);
    if (!opportunity) throw new NotFoundError("Opportunity", slug);
    const university = universities.find((entry) => entry.id === opportunity.universityId);
    if (!university) throw new NotFoundError("University", opportunity.universityId);
    return { opportunity, university };
  }
}

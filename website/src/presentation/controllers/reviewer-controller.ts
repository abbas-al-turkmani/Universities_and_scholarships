import type { Application } from "@/domain/model";
import type { IApplicationRepository } from "@/domain/repositories";

export class ReviewerController {
  constructor(private readonly applications: IApplicationRepository) {}

  async listAssigned(reviewerId: string): Promise<Application[]> {
    return (await this.applications.list()).filter(
      (application) => application.assignedReviewer === reviewerId,
    );
  }

  async getAssigned(applicationId: string, reviewerId: string) {
    const application = await this.applications.findById(applicationId);
    return application?.assignedReviewer === reviewerId ? application : undefined;
  }
}

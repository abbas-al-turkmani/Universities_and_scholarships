import { beforeEach, describe, expect, it } from "vitest";

import type { Actor } from "@/application/ports";
import { ChangeApplicationStatus } from "@/application/use-cases/change-application-status";
import { RecommendProgramsForStudent } from "@/application/use-cases/recommend-programs";
import { SubmitApplication } from "@/application/use-cases/submit-application";
import { ForbiddenError, ValidationError } from "@/domain/errors";
import { applications, opportunities, students, users } from "@/infrastructure/mock-data";
import { MockApplicationRepository, MockProgramRepository, MockStudentRepository } from "@/infrastructure/repositories/mock/in-memory";

const clock = { now: () => new Date("2026-10-28T00:00:00.000Z") };
const notifications = { send: async () => undefined };
let applicationRepository: MockApplicationRepository;
let programRepository: MockProgramRepository;
let studentRepository: MockStudentRepository;

beforeEach(() => {
  applicationRepository = new MockApplicationRepository();
  programRepository = new MockProgramRepository();
  studentRepository = new MockStudentRepository();
});

describe("SubmitApplication", () => {
  it("submits a student application with a reference and history", async () => {
    const useCase = new SubmitApplication(
      applicationRepository,
      programRepository,
      studentRepository,
      clock,
      { next: () => "application-000999" },
      notifications,
    );
    const actor: Actor = { userId: students[0].id, role: "STUDENT" };

    const result = await useCase.execute({
      studentId: students[0].id,
      opportunityId: opportunities[0].id,
      documents: [{ name: "transcript.pdf", type: "Transcript", size: 100 }],
    }, actor);

    expect(result.reference).toBe("MNH-2026-000999");
    expect(result.status).toBe("SUBMITTED");
    expect(result.history).toHaveLength(1);
    expect(await applicationRepository.findById(result.id)).toEqual(result);
  });

  it("rejects submissions by non-students and without documents", async () => {
    const useCase = new SubmitApplication(applicationRepository, programRepository, studentRepository, clock, { next: () => "id-1" }, notifications);
    const adminUser = users.find((user) => user.role === "ADMIN")!;
    await expect(useCase.execute({ studentId: students[0].id, opportunityId: opportunities[0].id, documents: [{ name: "transcript.pdf", type: "Transcript", size: 100 }] }, { userId: adminUser.id, role: "ADMIN" })).rejects.toBeInstanceOf(ForbiddenError);
    await expect(useCase.execute({ studentId: students[0].id, opportunityId: opportunities[0].id, documents: [] }, { userId: students[0].id, role: "STUDENT" })).rejects.toBeInstanceOf(ValidationError);
  });
});

describe("ChangeApplicationStatus", () => {
  it("allows an assigned reviewer to update status and preserves history", async () => {
    const existing = applications.find((application) => application.assignedReviewer === users.find((user) => user.role === "REVIEWER")?.id)!;
    const useCase = new ChangeApplicationStatus(applicationRepository, clock, notifications);
    const reviewer = users.find((user) => user.role === "REVIEWER")!;
    const updated = await useCase.execute(
      { applicationId: existing.id, status: "ACCEPTED", comment: "Meets the requirements." },
      { userId: reviewer.id, role: "REVIEWER" },
    );
    expect(updated.status).toBe("ACCEPTED");
    expect(updated.history.at(-1)?.note).toBe("Meets the requirements.");
  });

  it("rejects unassigned reviewers and students", async () => {
    const existing = applications[0];
    const useCase = new ChangeApplicationStatus(applicationRepository, clock, notifications);
    await expect(useCase.execute({ applicationId: existing.id, status: "ACCEPTED", comment: "" }, { userId: "another-reviewer", role: "REVIEWER" })).rejects.toBeInstanceOf(ForbiddenError);
    await expect(useCase.execute({ applicationId: existing.id, status: "ACCEPTED", comment: "" }, { userId: students[0].id, role: "STUDENT" })).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe("RecommendProgramsForStudent", () => {
  it("returns ranked and explainable suggestions to the profile owner", async () => {
    const useCase = new RecommendProgramsForStudent(programRepository, studentRepository);
    const results = await useCase.execute(students[0].id, { userId: students[0].id, role: "STUDENT" });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("matchedRules");
    expect(results[0]).toHaveProperty("unmetRules");
  });

  it("blocks students from reading another student's matches", async () => {
    const useCase = new RecommendProgramsForStudent(programRepository, studentRepository);
    await expect(useCase.execute(students[1].id, { userId: students[0].id, role: "STUDENT" })).rejects.toBeInstanceOf(ForbiddenError);
  });
});

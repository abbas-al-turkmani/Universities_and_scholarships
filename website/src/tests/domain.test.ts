import { describe, expect, it } from "vitest";

import { matchEligibility, recommendProgramsForStudent } from "@/domain/eligibility-matcher";
import { applications, opportunities, students, universities } from "@/infrastructure/mock-data";

describe("EligibilityMatcher", () => {
  it("ships consistent seed data for the required demo scale", () => {
    expect(universities).toHaveLength(12);
    expect(opportunities).toHaveLength(24);
    expect(students).toHaveLength(30);
    expect(applications).toHaveLength(40);
    expect(opportunities.every((opportunity) => universities.some((university) => university.id === opportunity.universityId))).toBe(true);
    expect(applications.every((application) =>
      students.some((student) => student.id === application.studentId) &&
      opportunities.some((opportunity) => opportunity.id === application.opportunityId),
    )).toBe(true);
    expect(universities.some((university) => university.country.en === "United Arab Emirates")).toBe(true);
  });

  it("returns a deterministic score and explains unmet rules", () => {
    const result = matchEligibility(students[0], opportunities[0].rules);

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.matchedRules.length + result.unmetRules.length).toBe(6);
    expect(result.unmetRules).toContain("GPA ≥ 3.0");
    expect(matchEligibility(students[0], opportunities[0].rules)).toEqual(result);
  });

  it("returns only open program opportunities ordered by score", () => {
    const results = recommendProgramsForStudent(students[0], opportunities);

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.opportunity.type === "program")).toBe(true);
    expect(results.every((result) => result.opportunity.status === "OPEN")).toBe(true);
    expect(results[0].score).toBeGreaterThanOrEqual(results.at(-1)!.score);
  });
});

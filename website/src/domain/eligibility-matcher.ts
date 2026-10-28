import type { EligibilityRules, Opportunity, Student } from "@/domain/model";

export interface MatchResult {
  score: number;
  matchedRules: string[];
  unmetRules: string[];
}

/**
 * Evaluates a student against an opportunity using only deterministic rules.
 */
export function matchEligibility(
  student: Student,
  rules: EligibilityRules,
): MatchResult {
  const checks: { label: string; matches: boolean }[] = [
    { label: `GPA ≥ ${rules.minimumGpa.toFixed(1)}`, matches: student.gpa >= rules.minimumGpa },
    { label: `Degree: ${rules.acceptedDegrees.join(", ")}`, matches: rules.acceptedDegrees.includes(student.degree) },
    { label: "Field of study", matches: rules.requiredFields.length === 0 || rules.requiredFields.some((field) => student.field.toLowerCase().includes(field.toLowerCase())) },
    { label: `${rules.language} language score ≥ ${rules.minimumLanguageScore}`, matches: (student.languageScores[rules.language] ?? 0) >= rules.minimumLanguageScore },
    { label: `Age ≤ ${rules.maximumAge}`, matches: student.age <= rules.maximumAge },
    { label: "Nationality eligibility", matches: rules.nationalities.length === 0 || rules.nationalities.includes(student.nationality) },
  ];

  const matchedRules = checks.filter((check) => check.matches).map((check) => check.label);
  const unmetRules = checks.filter((check) => !check.matches).map((check) => check.label);

  return {
    score: Math.round((matchedRules.length / checks.length) * 100),
    matchedRules,
    unmetRules,
  };
}

export function recommendProgramsForStudent(
  student: Student,
  opportunities: Opportunity[],
) {
  return opportunities
    .filter((opportunity) => opportunity.type === "program" && opportunity.status === "OPEN")
    .map((opportunity) => ({
      opportunity,
      ...matchEligibility(student, opportunity.rules),
    }))
    .sort((a, b) => b.score - a.score || a.opportunity.deadline.localeCompare(b.opportunity.deadline));
}

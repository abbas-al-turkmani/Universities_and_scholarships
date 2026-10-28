export type Locale = "ar" | "en";
export type Role = "SUPER_ADMIN" | "ADMIN" | "REVIEWER" | "STUDENT";
export type OpportunityType = "program" | "scholarship";
export type DegreeLevel = "Bachelor" | "Master" | "PhD";
export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "DOCUMENTS_REQUESTED"
  | "ACCEPTED"
  | "REJECTED"
  | "WAITLISTED"
  | "WITHDRAWN";

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface University {
  id: string;
  name: LocalizedText;
  country: LocalizedText;
  city: LocalizedText;
  logo: string;
  website: string;
  ranking: number;
  description: LocalizedText;
}

export interface EligibilityRules {
  minimumGpa: number;
  acceptedDegrees: DegreeLevel[];
  requiredFields: string[];
  language: "English" | "Arabic" | "German";
  minimumLanguageScore: number;
  maximumAge: number;
  nationalities: string[];
}

export interface Opportunity {
  id: string;
  slug: string;
  type: OpportunityType;
  title: LocalizedText;
  universityId: string;
  field: LocalizedText;
  degree: DegreeLevel;
  country: LocalizedText;
  city: LocalizedText;
  funding: LocalizedText;
  amount: number;
  currency: string;
  tuition: number;
  duration: string;
  language: string;
  seats: number;
  deadline: string;
  opensAt: string;
  status: "OPEN" | "CLOSED";
  description: LocalizedText;
  requirements: LocalizedText[];
  rules: EligibilityRules;
}

export interface Student {
  id: string;
  name: LocalizedText;
  email: string;
  country: string;
  countryName: LocalizedText;
  nationality: string;
  degree: DegreeLevel;
  field: string;
  gpa: number;
  age: number;
  languageScores: Record<string, number>;
  phone: string;
}

export interface Application {
  id: string;
  reference: string;
  studentId: string;
  opportunityId: string;
  status: ApplicationStatus;
  submittedAt: string;
  assignedReviewer: string;
  history: { status: ApplicationStatus; date: string; note: string }[];
  documents: { name: string; type: string; size: number }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: Role;
  studentId?: string;
  active: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: LocalizedText;
  body: LocalizedText;
  date: string;
  read: boolean;
}

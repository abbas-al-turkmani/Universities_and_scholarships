import type {
  Application,
  Notification,
  Opportunity,
  Student,
  University,
  User,
} from "@/domain/model";

export interface IUniversityRepository {
  list(): Promise<University[]>;
  findById(id: string): Promise<University | undefined>;
}

export interface IProgramRepository {
  list(): Promise<Opportunity[]>;
  findById(id: string): Promise<Opportunity | undefined>;
  save(opportunity: Opportunity): Promise<void>;
}

export interface IStudentRepository {
  list(): Promise<Student[]>;
  findById(id: string): Promise<Student | undefined>;
}

export interface IApplicationRepository {
  list(): Promise<Application[]>;
  findById(id: string): Promise<Application | undefined>;
  save(application: Application): Promise<void>;
}

export interface IUserRepository {
  list(): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
}

export interface INotificationRepository {
  listForUser(userId: string): Promise<Notification[]>;
  save(notification: Notification): Promise<void>;
}

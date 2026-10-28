import type {
  IApplicationRepository,
  INotificationRepository,
  IProgramRepository,
  IStudentRepository,
  IUniversityRepository,
  IUserRepository,
} from "@/domain/repositories";
import type { Application, Notification, Opportunity, Student, University, User } from "@/domain/model";
import { applications as applicationSeed, notifications as notificationSeed, opportunities as programSeed, students as studentSeed, universities as universitySeed, users as userSeed } from "@/infrastructure/mock-data";
import { findTableRecordBySourceId, listTableRecords, saveTableRecord } from "@/infrastructure/database/sqlite";

class ArrayRepository<T extends { id: string }> {
  constructor(private readonly records: T[]) {}

  async list(): Promise<T[]> {
    return [...this.records];
  }

  async findById(id: string): Promise<T | undefined> {
    return this.records.find((record) => record.id === id);
  }

  async save(record: T): Promise<void> {
    const index = this.records.findIndex((entry) => entry.id === record.id);
    if (index < 0) this.records.push(record);
    else this.records[index] = record;
  }
}

export class MockUniversityRepository implements IUniversityRepository {
  private readonly store = new ArrayRepository<University>([...universitySeed]);
  list() { return this.store.list(); }
  findById(id: string) { return this.store.findById(id); }
}

export class MockProgramRepository implements IProgramRepository {
  private readonly store = new ArrayRepository<Opportunity>([...programSeed]);
  list() { return this.store.list(); }
  findById(id: string) { return this.store.findById(id); }
  save(program: Opportunity) { return this.store.save(program); }
}

export class MockStudentRepository implements IStudentRepository {
  private readonly store = new ArrayRepository<Student>([...studentSeed]);
  list() { return this.store.list(); }
  findById(id: string) { return this.store.findById(id); }
}

export class MockApplicationRepository implements IApplicationRepository {
  private readonly store = new ArrayRepository<Application>([...applicationSeed]);
  list() { return this.store.list(); }
  findById(id: string) { return this.store.findById(id); }
  save(application: Application) { return this.store.save(application); }
}

export class MockUserRepository implements IUserRepository {
  private readonly store = new ArrayRepository<User>([...userSeed]);
  list() { return this.store.list(); }
  findById(id: string) { return this.store.findById(id); }
}

export class MockNotificationRepository implements INotificationRepository {
  private readonly store = new ArrayRepository<Notification>([...notificationSeed]);
  async listForUser(userId: string) {
    return (await this.store.list()).filter((notification) => notification.userId === userId);
  }
  save(notification: Notification) { return this.store.save(notification); }
}

export class SqliteUniversityRepository implements IUniversityRepository {
  async list() { return listTableRecords<University>("universities"); }
  async findById(id: string) { return findTableRecordBySourceId<University>("universities", id); }
}

export class SqliteProgramRepository implements IProgramRepository {
  async list() { return listTableRecords<Opportunity>("opportunities"); }
  async findById(id: string) { return findTableRecordBySourceId<Opportunity>("opportunities", id); }
  async save(program: Opportunity) { saveTableRecord<Opportunity>("opportunities", program); }
}

export class SqliteStudentRepository implements IStudentRepository {
  async list() { return listTableRecords<Student>("students"); }
  async findById(id: string) { return findTableRecordBySourceId<Student>("students", id); }
}

export class SqliteApplicationRepository implements IApplicationRepository {
  async list() { return listTableRecords<Application>("applications"); }
  async findById(id: string) { return findTableRecordBySourceId<Application>("applications", id); }
  async save(application: Application) { saveTableRecord<Application>("applications", application); }
}

export class SqliteUserRepository implements IUserRepository {
  async list() { return listTableRecords<User>("users"); }
  async findById(id: string) { return findTableRecordBySourceId<User>("users", id); }
}

export class SqliteNotificationRepository implements INotificationRepository {
  async listForUser(userId: string) {
    return (await this.list()).filter((notification) => notification.userId === userId);
  }
  async list() { return listTableRecords<Notification>("notifications"); }
  async save(notification: Notification) { saveTableRecord<Notification>("notifications", notification); }
}

export function createMockRepositories() {
  return {
    universities: new MockUniversityRepository(),
    programs: new MockProgramRepository(),
    students: new MockStudentRepository(),
    applications: new MockApplicationRepository(),
    users: new MockUserRepository(),
    notifications: new MockNotificationRepository(),
  };
}

export function createDatabaseRepositories() {
  return {
    universities: new SqliteUniversityRepository(),
    programs: new SqliteProgramRepository(),
    students: new SqliteStudentRepository(),
    applications: new SqliteApplicationRepository(),
    users: new SqliteUserRepository(),
    notifications: new SqliteNotificationRepository(),
  };
}

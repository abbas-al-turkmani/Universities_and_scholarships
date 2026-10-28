export interface IClock {
  now(): Date;
}

export interface IIdGenerator {
  next(): string;
}

export interface INotificationSender {
  send(recipient: string, subject: string, body: string): Promise<void>;
}

export interface IFileStorage {
  store(file: { name: string; type: string; size: number }): Promise<string>;
}

export interface Actor {
  userId: string;
  role: "SUPER_ADMIN" | "ADMIN" | "REVIEWER" | "STUDENT";
}

export const systemClock: IClock = { now: () => new Date() };
export const uuidGenerator: IIdGenerator = { next: () => crypto.randomUUID() };

import type { IIdGenerator } from "@/application/ports";

export class UuidGenerator implements IIdGenerator {
  next() {
    return crypto.randomUUID();
  }
}

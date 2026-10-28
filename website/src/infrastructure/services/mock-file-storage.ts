import type { IFileStorage } from "@/application/ports";
import type { IIdGenerator } from "@/application/ports";

export class MockFileStorage implements IFileStorage {
  readonly metadata = new Map<string, { name: string; type: string; size: number }>();

  constructor(private readonly ids: IIdGenerator) {}

  async store(file: { name: string; type: string; size: number }): Promise<string> {
    const id = this.ids.next();
    this.metadata.set(id, { ...file });
    return id;
  }
}

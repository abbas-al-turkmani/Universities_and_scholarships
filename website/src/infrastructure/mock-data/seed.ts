import { createMockRepositories } from "@/infrastructure/repositories/mock/in-memory";

export function seedRepositories() {
  return createMockRepositories();
}

export function resetMockData() {
  return createMockRepositories();
}

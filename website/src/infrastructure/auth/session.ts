import { cookies } from "next/headers";

import type { Role, User } from "@/domain/model";
import { ForbiddenError } from "@/domain/errors";
import { users } from "@/infrastructure/mock-data";

export async function getMockSession(): Promise<User | undefined> {
  const sessionId = (await cookies()).get("manhal-session")?.value;
  return users.find((user) => user.id === sessionId && user.active);
}

export function requireRole(user: User | undefined, roles: Role[]): User {
  if (!user || !roles.includes(user.role)) throw new ForbiddenError();
  return user;
}

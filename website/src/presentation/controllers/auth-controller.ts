import type { User } from "@/domain/model";
import type { IUserRepository } from "@/domain/repositories";

export class AuthController {
  constructor(private readonly users: IUserRepository) {}

  async findActiveUser(userId: string | undefined): Promise<User | undefined> {
    if (!userId) return undefined;
    const user = await this.users.findById(userId);
    return user?.active ? user : undefined;
  }

  async findActiveUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.users.list();
    return users.find((user) => user.email === email && user.active);
  }
}

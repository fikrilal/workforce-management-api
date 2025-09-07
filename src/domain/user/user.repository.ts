import type { User, UserCreateInput, UserWithPassword } from './user';

export interface UserRepository {
  findByEmail(email: string): Promise<UserWithPassword | null>;
  findById(id: string): Promise<User | null>;
  create(data: UserCreateInput): Promise<User>;
}


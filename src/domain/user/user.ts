export type User = {
  id: string;
  email: string;
  fullName: string | null;
};

export type UserCreateInput = {
  email: string;
  passwordHash: string;
  fullName?: string;
};

export type UserWithPassword = User & { passwordHash: string | null };


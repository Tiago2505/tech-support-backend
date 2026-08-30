import { UserRole } from "../enums";

export interface CreateUserResponseDto {
  id: number;

  fullname: string;

  email: string;

  phone: string;

  role: UserRole;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}

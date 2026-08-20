export interface CreateUserResponseDto {
  id: number;

  fullname: string;

  email: string;

  phone: string;

  role: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}

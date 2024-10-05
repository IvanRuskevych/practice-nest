import type { Role } from '@prisma/client';

export class CreateUserDto {
    id?: string;
    email: string;
    password: string;
    roles: Role[];
}

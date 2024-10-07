import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service';
import type { IJwtPayload } from '../shared/types';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }

    createUser(user: Partial<User>) {
        const hashedPassword = this.hashPassword(user.password);

        return this.prismaService.user.create({
            data: {
                email: user.email,
                password: hashedPassword,
                roles: ['ADMIN'],
            },
        });
    }

    findAllUsers() {
        return this.prismaService.user.findMany();
    }

    findUser(idOrEmail: string): Promise<User> {
        return this.prismaService.user.findFirst({
            where: { OR: [{ id: idOrEmail }, { email: idOrEmail }] },
        });
    }

    //     update(id: number, updateUserDto: UpdateUserDto) {
    //         return `This action updates a #${id} user`;
    //     }

    removeUser(id: string, currentUser: IJwtPayload) {
        if (currentUser.id !== id && !currentUser.roles.includes(Role.ADMIN)) {
            throw new ForbiddenException();
        }
        return this.prismaService.user.delete({ where: { id }, select: { id: true } });
    }
}

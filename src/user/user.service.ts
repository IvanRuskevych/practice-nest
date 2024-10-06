import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service';

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
                roles: ['USER'],
            },
        });
    }

    findAllUsers() {
        return this.prismaService.user.findMany();
    }

    findUser(idOrEmail: string) {
        return this.prismaService.user.findFirst({
            where: { OR: [{ id: idOrEmail }, { email: idOrEmail }] },
        });
    }

    //     update(id: number, updateUserDto: UpdateUserDto) {
    //         return `This action updates a #${id} user`;
    //     }

    removeUser(id: string) {
        return this.prismaService.user.delete({ where: { id } });
    }
}

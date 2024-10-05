import { Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }

    create(user: CreateUserDto) {
        const hashedPassword = this.hashPassword(user.password);

        return this.prismaService.user.create({
            data: {
                email: user.email,
                password: hashedPassword,
                roles: ['USER'],
            },
        });
    }

    findAll() {
        return this.prismaService.user.findMany();
    }

    findOne(idOrEmail: string) {
        return this.prismaService.user.findFirst({
            where: { OR: [{ id: idOrEmail }, { email: idOrEmail }] },
        });
    }

    //     update(id: number, updateUserDto: UpdateUserDto) {
    //         return `This action updates a #${id} user`;
    //     }

    remove(id: string) {
        return this.prismaService.user.delete({ where: { id } });
    }
}

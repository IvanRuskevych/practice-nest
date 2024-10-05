import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    create(user: CreateUserDto) {
        return this.prismaService.user.create({
            data: {
                email: user.email,
                password: user.password,
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

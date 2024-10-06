import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import { compareSync } from 'bcryptjs';
import { add } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import type { ITokens } from '../shared/types';
import { UserService } from '../user';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
    ) {}

    private async generateTokens(user: User): Promise<ITokens> {
        const accessToken =
            // 'Bearer ' +
            this.jwtService.sign({
                id: user.id,
                email: user.email,
                roles: user.roles,
            });

        const generatedRefreshToken =
            // 'Bearer ' +
            this.jwtService.sign({
                id: user.id,
            });

        const refreshToken = await this.prismaService.token.create({
            data: {
                token: generatedRefreshToken,
                exp: add(new Date(), { months: 1 }),
                userId: user.id,
            },
        });

        return { accessToken, refreshToken };
    }

    async register(dto: RegisterDto) {
        const user: User = await this.userService.findOne(dto.email).catch((err) => {
            this.logger.error(err);
            return null;
        });

        if (user) {
            throw new ConflictException('User already exists');
        }

        return this.userService.create(dto).catch((err) => {
            this.logger.error(err);
            return null;
        });
    }

    async login(dto: LoginDto): Promise<ITokens> {
        const user = await this.userService.findOne(dto.email);

        if (!user || !compareSync(dto.password, user.password)) {
            throw new UnauthorizedException('Login or password wrong');
        }

        return await this.generateTokens(user);
    }

    async refreshTokens(refreshToken: string): Promise<ITokens> {
        const token = await this.prismaService.token.delete({ where: { token: refreshToken } });
        // TODO: якщо такого токену не існує в базі, то prisma поверне P2025 - як її обробляти???
        // TODO: як варіант спочатку перевірити чи існує токен - findFirst()
        // const token = await this.prismaService.token.findFirst({ where: { token: refreshToken } });

        if (!token) {
            throw new UnauthorizedException('Refresh token failed !!');
        }
        const user = await this.userService.findOne(token.userId);

        return this.generateTokens(user);
    }
}

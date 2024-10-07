import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { type RefreshToken, User } from '@prisma/client';
import { add } from 'date-fns';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { TOKENS_KEY } from '../shared/constants';
import { ITokens } from '../shared/types';

const { REFRESH_TOKEN } = TOKENS_KEY;

@Injectable()
export class TokensService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
    ) {}

    private getAccessToken(user: User) {
        return this.jwtService.sign({
            id: user.id,
            email: user.email,
            roles: user.roles,
        });
    }

    private async getRefreshToken(user: User, userAgent: string): Promise<RefreshToken> {
        const newRefreshToken = this.jwtService.sign({
            id: user.id,
        });

        const _token = await this.prismaService.refreshToken.findFirst({
            where: { userId: user.id },
        });
        const token = _token?.token ?? '';
        // TODO: якщо токен існує то далі upsert({}) виконає update
        // TODO: якщо токен НЕ існує, то необхідно передати ВИКЛЮЧНО пусту строку "", щоб далі upsert({}) виконав create
        // TODO: null, undefined - не працюють з upsert({})

        return this.prismaService.refreshToken.upsert({
            where: { token },
            //  якщо токен знайшовся то виконуємо update
            update: {
                token: newRefreshToken,
                exp: add(new Date(), { months: 1 }),
            },
            //  якщо токен НЕ знайшовся то виконуємо create
            create: {
                token: newRefreshToken,
                exp: add(new Date(), { months: 1 }),
                userId: user.id,
                userAgent,
            },
        });
    }

    async generateTokens(user: User, userAgent: string): Promise<ITokens> {
        const accessToken = this.getAccessToken(user);
        const refreshToken = await this.getRefreshToken(user, userAgent);
        return { accessToken, refreshToken };
    }

    async validateRefreshToken(refreshToken: string): Promise<RefreshToken> {
        const existingRefreshToken = await this.prismaService.refreshToken.findUnique({
            where: { token: refreshToken },
        });

        if (!existingRefreshToken || new Date(existingRefreshToken.exp) < new Date()) {
            await this.prismaService.refreshToken.delete({
                where: { token: refreshToken },
            });

            throw new UnauthorizedException(
                !existingRefreshToken ? 'Refresh token failed 3.' : 'Refresh token expired.',
            );
        }

        await this.prismaService.refreshToken.delete({
            where: { token: refreshToken },
        });

        return existingRefreshToken;
    }

    setRefreshTokenToCookies(tokens: ITokens, res: Response) {
        if (!tokens) {
            throw new UnauthorizedException();
        }

        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            secure: this.configService.get('NODE_ENV', 'development') === 'production',
            path: '/',
        });
    }
}

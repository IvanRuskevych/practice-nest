import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    InternalServerErrorException,
    Post,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ITokens } from '../shared/types';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Response } from 'express';

const REFRESH_TOKEN = 'refresh_token';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    private setRefreshTokenToCookies(tokens: ITokens, res: Response) {
        if (!tokens) {
            throw new UnauthorizedException();
        }

        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV', 'development') === 'production',
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            path: '/',
        });

        res.status(HttpStatus.CREATED).json(tokens);
    }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const newUser = await this.authService.register(dto);

        if (!newUser) {
            throw new InternalServerErrorException('Registration failed. Please try again later.');
        }
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        const tokens = await this.authService.login(dto);

        if (!tokens) {
            throw new BadRequestException('Login failed. Please try again later.');
        }

        // return { accessToken: tokens.accessToken };
        this.setRefreshTokenToCookies(tokens, res);
    }

    @Get('refresh')
    refreshToken() {}
}

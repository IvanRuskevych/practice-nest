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
import { Response } from 'express';
import { CookiesDecorator } from '../shared/decorators';
import { ITokens } from '../shared/types';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

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
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            secure: this.configService.get('NODE_ENV', 'development') === 'production',
            path: '/',
        });

        res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
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

    @Get('refresh-tokens')
    async refreshToken(
        @CookiesDecorator(REFRESH_TOKEN) refreshToken: string,
        @Res() res: Response,
    ) {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token failed 1. Please try again later.');
        }
        const tokens = await this.authService.refreshTokens(refreshToken);

        if (!tokens) {
            throw new UnauthorizedException('Refresh token failed 2. Please try again later.');
        }

        this.setRefreshTokenToCookies(tokens, res);
    }
}

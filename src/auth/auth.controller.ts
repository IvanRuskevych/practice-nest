import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    InternalServerErrorException,
    Post,
    Res,
    UnauthorizedException,
    UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { TOKENS_KEY } from '../shared/constants';
import { CookiesDecorator, PublicDecorator, UserAgentDecorator } from '../shared/decorators';
import { TokensService } from '../tokens';
import { UserService } from '../user';
import { UserResponse } from '../user/responses';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

const { REFRESH_TOKEN } = TOKENS_KEY;

@PublicDecorator()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly tokensService: TokensService,
        private readonly userService: UserService,
    ) {}

    /* TODO: @UseInterceptors(ClassSerializerInterceptor) потрібен для використання new UserResponse() */
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('register')
    async register(@Body() dto: RegisterDto, @Res() res: Response) {
        const newUser = await this.authService.register(dto);

        if (!newUser) {
            throw new InternalServerErrorException('Registration failed. Please try again later.');
        }

        //TODO: якщо використовуємо ручну відправку res.status(), то
        // Серіалізуємо вручну об'єкт, застосовуючи `UserResponse`:
        const userResponse = plainToInstance(UserResponse, newUser);
        res.status(HttpStatus.OK).send({
            message: 'Registration successful',
            user: userResponse,
        });
    }

    //TODO: return { message: 'Registration successful', user: newUser }; - такий варіант також можливий, але якщо не використовується @Res() res: Response
    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res() res: Response,
        @UserAgentDecorator() userAgent: string,
    ) {
        const tokens = await this.authService.login(dto, userAgent);

        if (!tokens) {
            throw new BadRequestException('Login failed. Please try again later.');
        }

        // return { accessToken: tokens.accessToken };
        this.tokensService.setRefreshTokenToCookies(tokens, res);
        const userExists = await this.userService.findUser(dto.email);
        res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken, user: userExists });
    }

    @Get('refresh-tokens')
    async refreshToken(
        @CookiesDecorator(REFRESH_TOKEN) refreshToken: string,
        @Res() res: Response,
        @UserAgentDecorator() userAgent: string,
    ) {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token failed 1. Please try again later.');
        }

        const tokens = await this.authService.refreshTokens(refreshToken, userAgent);

        if (!tokens) {
            throw new UnauthorizedException('Refresh token failed 2. Please try again later.');
        }

        this.tokensService.setRefreshTokenToCookies(tokens, res);
        res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
    }
}

import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
} from '@nestjs/common';
import { UserService } from '../user';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const newUser = await this.authService.register(dto);

        if (!newUser) {
            throw new InternalServerErrorException('Registration failed. Please try again later.');
        }
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const tokens = await this.authService.login(dto);

        if (!tokens) {
            throw new BadRequestException('Login failed. Please try again later.');
        }

        return { accessToken: tokens.accessToken };
    }

    @Get('refresh')
    refreshToken() {}
}

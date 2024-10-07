import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { compareSync } from 'bcryptjs';
import { ITokens } from '../shared/types';
import { TokensService } from '../tokens';
import { UserService } from '../user';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly userService: UserService,
        private readonly tokensService: TokensService,
    ) {}

    async register(dto: RegisterDto) {
        const user: User = await this.userService.findUser(dto.email).catch((err) => {
            this.logger.error(err);
            return null;
        });

        if (user) {
            throw new ConflictException('User already exists');
        }

        return this.userService.createUser(dto).catch((err) => {
            this.logger.error(err);
            return null;
        });
    }

    async login(dto: LoginDto, userAgent: string): Promise<ITokens> {
        const user = await this.userService.findUser(dto.email);

        if (!user || !compareSync(dto.password, user.password)) {
            throw new UnauthorizedException('Login or password wrong');
        }

        return await this.tokensService.generateTokens(user, userAgent);
    }

    async refreshTokens(refreshToken: string, userAgent: string): Promise<ITokens> {
        const token = await this.tokensService.validateRefreshToken(refreshToken);

        const user = await this.userService.findUser(token.userId);

        return this.tokensService.generateTokens(user, userAgent);
    }
}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { TokensModule } from '../tokens';
import { UserModule } from '../user';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { options } from './config';
import { GUARDS } from './guards';
import { STRATEGIES } from './strategy';

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.registerAsync(options()),
        UserModule,
        TokensModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, ...STRATEGIES, ...GUARDS],
})
export class AuthModule {}

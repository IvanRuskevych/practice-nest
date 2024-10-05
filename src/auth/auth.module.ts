import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { options } from './config/jwt-module-async-options';

@Module({
    imports: [PassportModule, JwtModule.registerAsync(options()), UserModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { options } from '../auth/config';
import { PrismaModule } from '../prisma/prisma.module';
import { TokensService } from './tokens.service';

@Module({
    imports: [PrismaModule, PassportModule, JwtModule.registerAsync(options())],
    providers: [TokensService],
    exports: [TokensService],
})
export class TokensModule {}

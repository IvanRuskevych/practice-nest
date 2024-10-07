import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TokensModule } from './tokens';
import { UserModule } from './user';

@Module({
    imports: [UserModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), TokensModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}

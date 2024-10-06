import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { TokensModule } from './tokens';
import { UserModule } from './user';

@Module({
    imports: [UserModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), TokensModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

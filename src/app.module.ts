import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `/environments/.env.${process.env.NODE_ENV}`,
            isGlobal: true,
        }),
        LoggerModule.forRoot({
            pinoHttp: {
                name: 'Http-logs',
                level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
                transport:
                    process.env.NODE_ENV === 'development'
                        ? {
                              target: 'pino-pretty',
                              // options: { colorize: true },
                          }
                        : undefined,
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

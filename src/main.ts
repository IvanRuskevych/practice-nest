import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { Logger } from 'nestjs-pino';
import * as path from 'path';
import { AppModule } from './app.module';

const envFile = process.env.NODE_ENV || 'production' ? '.env.production' : '.env.development';

dotenv.config({ path: path.join(__dirname, `../environments/${envFile}`) });

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true, bufferLogs: true });
    const port = process.env.PORT || 3000;

    app.useLogger(app.get(Logger));

    await app.listen(port, () => {
        console.log(`Server run on port ${port} (${process.env.NODE_ENV})`);
    });
}
bootstrap();

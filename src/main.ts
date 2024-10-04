import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule, {
        abortOnError: false,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // TODO: дозволяє автоматично перетворювати (трансформувати) вхідні дані в очікувані типи, визначені у вашому DTO.
        }),
    );

    await app.listen(3000);
}
bootstrap();

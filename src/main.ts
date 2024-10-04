import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Увімкнути глобальну валідацію
  app.useGlobalPipes(new ValidationPipe()); // TODO: найкраща практика
  await app.listen(3000);
}
bootstrap();

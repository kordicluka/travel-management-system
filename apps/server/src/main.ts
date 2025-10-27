import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { useContainer } from 'class-validator';
import { nestCsrf, CsrfFilter } from 'ncsrf';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe());
  app.use(cookieParser());
  const isDevelopment = process.env.NODE_ENV !== 'production';
  if (!isDevelopment) {
    app.use(nestCsrf());
    app.useGlobalFilters(new CsrfFilter());
  }
  app.use(helmet());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new PrismaExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

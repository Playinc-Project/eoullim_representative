import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix (Spring: /api)
  app.setGlobalPrefix('api');

  // Validation 파이프 (Spring Boot와 동일한 에러 처리)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          value: error.value,
          constraints: error.constraints,
        }));
        return new BadRequestException({
          message: 'Validation failed',
          errors: result,
        });
      },
    }),
  );

  // CORS 설정 (Spring WebConfig와 동일)
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // 타임존 설정
  process.env.TZ = 'Asia/Seoul';

  const port = process.env.PORT || 8081;
  await app.listen(port, '127.0.0.1');
  console.log(`🚀 Server running on http://localhost:${port}/api at ${new Date().toLocaleTimeString()}`);
}
bootstrap();

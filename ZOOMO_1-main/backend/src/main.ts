import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      process.env.CUSTOMER_APP_URL,
      process.env.MERCHANT_APP_URL,
      process.env.DRIVER_APP_URL,
      process.env.ADMIN_APP_URL,
    ].filter(Boolean),
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Backend running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();

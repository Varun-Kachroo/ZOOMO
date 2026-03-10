import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    // your current Vercel customer URL:
    'https://zoomo-lxn1l1zca-varun-kachroos-projects.vercel.app',//main page for customer
    'https://zoomo-hc64.vercel.app',//merchant
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // allow tools like curl/Postman (no Origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


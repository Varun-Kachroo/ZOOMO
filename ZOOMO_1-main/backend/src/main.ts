import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile)
      if (!origin) return callback(null, true);

      // Allow all localhost ports
      if (origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }

      // Allow ALL vercel.app subdomains permanently
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

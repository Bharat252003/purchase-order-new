import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createDocument } from './swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.PORT ? Number(process.env.PORT) : 8000;
  createDocument(app);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://purchase-order-frontend.vercel.app', // add your deployed Next.js domain
    ],
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${port}`);
}
// Ensure you have this catch block!
bootstrap().catch(err => {
  // Log the specific error that caused the crash
  console.error("Vercel Dev Startup Error:", err);
  // Re-throw to ensure the process exits with failure
  throw err;
});


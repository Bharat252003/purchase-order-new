// src/vercel.app.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedHandler: any = null;

export default async function handler(req: Request, res: any) {
  if (!cachedHandler) {
    const app = await NestFactory.create(AppModule);
    await app.init();
    cachedHandler = app.getHttpAdapter().getInstance();
  }
  return cachedHandler(req, res);
}
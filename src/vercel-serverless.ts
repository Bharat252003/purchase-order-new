// src/serverless.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let handler: any;

export default async function (req: any, res: any) {
  if (!handler) {
    const app = await NestFactory.create(AppModule);
    await app.init();
    handler = app.getHttpAdapter().getInstance();
  }
  return handler(req, res);
}
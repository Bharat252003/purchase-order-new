import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverless from 'serverless-http';
import express from 'express';
import { AppModule } from '../src/app.module';

let server: any;

async function bootstrap() {
  if (!server) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), { logger: false });
    // initialize the app so Express handlers are bound
    await app.init();
    server = serverless(expressApp);
  }
  return server;
}

export default async function handler(req: any, res: any) {
  const fn = await bootstrap();
  return fn(req, res);
}

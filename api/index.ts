import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverless from 'serverless-http';
import express from 'express';
import { AppModule } from '../src/app.module';

let cachedHandler: any = null;
let bootstrapError: any = null;

async function bootstrapHandler() {
  if (cachedHandler || bootstrapError) return;
  try {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), { logger: false });
    // optional global pipes/middleware from main.ts
    app.useGlobalPipes && app.useGlobalPipes();
    await app.init();
    cachedHandler = serverless(expressApp);
  } catch (err) {
    // keep the error so we can return a 500 response on invocations
    bootstrapError = err;
    // ensure we log the error for Vercel diagnostics
    // eslint-disable-next-line no-console
    console.error('Failed to bootstrap Nest app in serverless handler:', err);
  }
}

export default async function handler(req: any, res: any) {
  if (!cachedHandler && !bootstrapError) {
    // attempt to bootstrap on first request
    // don't await indefinitely; allow bootstrap to complete before invoking
    await bootstrapHandler();
  }

  if (bootstrapError) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain');
    res.end('Server failed to start. Check function logs for details.');
    return;
  }

  return cachedHandler(req, res);
}

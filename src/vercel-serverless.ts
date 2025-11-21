import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express = require('express');

// Bootstrap a Nest app on top of an express instance once per container
let expressServer: express.Express | undefined;
const bootstrapPromise = (async () => {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableShutdownHooks();
  await app.init();
  expressServer = server;
})();

export async function handler(req: any, res: any) {
  await bootstrapPromise;
  if (!expressServer) {
    res.statusCode = 500;
    return res.end('Server not initialized');
  }
  return expressServer(req, res);
}

export default async function vercelHandler(req: any, res: any) {
  return handler(req, res);
}

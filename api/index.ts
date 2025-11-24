require('dotenv/config');
require('reflect-metadata');
const serverless = require('serverless-http');
const express = require('express');
const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { AppModule } = require('../src/app.module');

let cachedHandler = null;
let bootstrapError = null;

async function bootstrapHandler() {
  if (cachedHandler || bootstrapError) return;
  try {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), { logger: false });
    // replicate main.ts global pipes if any
    if (app.useGlobalPipes) {
      // no-op: main.ts uses ValidationPipe which is applied in runtime bootstrap
    }
    await app.init();
    cachedHandler = serverless(expressApp);
  } catch (err) {
    bootstrapError = err;
    // eslint-disable-next-line no-console
    console.error('Failed to bootstrap Nest app in serverless handler:', err && err.stack ? err.stack : err);
  }
}

async function handler(req, res) {
  if (!cachedHandler && !bootstrapError) {
    await bootstrapHandler();
  }

  if (bootstrapError) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain');
    // In non-production show the bootstrap error to aid local debugging
    if (process.env.NODE_ENV !== 'production') {
      // coerce to string safely
      const msg = String((bootstrapError as any && ((bootstrapError as any).stack || (bootstrapError as any).toString())) || bootstrapError);
      res.end('Server failed to start. Bootstrap error:\n' + msg);
    } else {
      res.end('Server failed to start. Check function logs for details.');
    }
    return;
  }

  if (!cachedHandler) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain');
    res.end('Server failed to start (handler missing).');
    return;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (cachedHandler)(req, res);
}

module.exports = handler;
exports.default = handler;

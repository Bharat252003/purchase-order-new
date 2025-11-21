Deployment notes for Vercel

- This project is a NestJS server. Vercel will run it as a serverless function.

Files added:
- `api/index.ts` — serverless entrypoint using `serverless-http` and `express`.
- `vercel.json` — Vercel build config.

Environment variables:
- Set your DB connection strings and other secrets in the Vercel dashboard (Settings → Environment Variables). The app uses `process.env` (see `data-source.ts`).

Build & deploy:
- Commit and push these changes to your repo connected to Vercel.
- Vercel will detect `api/index.ts` and build it with `@vercel/node`.

Local test (recommended):
1. Install dependencies: `pnpm install` (or `npm install`).
2. Build once so TypeScript files under `src` are available to imports:
   - `pnpm run build`
3. Start local dev server (optional): `pnpm run start:dev`

Notes:
- Cold-start: the Nest app is bootstrapped at first invocation; expect slightly longer cold starts.
- For production-scale APIs consider deploying to a proper Node host (Heroku, Fly, Railway, or use Vercel with a Docker-based deployment).

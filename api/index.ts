// Vercel shim: require the built Nest serverless handler from `dist`
try {
  const mod = require('../dist/vercel-serverless');
  const handler = mod && (mod.default || mod.handler);
  if (!handler) throw new Error('Handler not found in dist/vercel-serverless');
  module.exports = (req, res) => handler(req, res);
} catch (err) {
  module.exports = (req, res) => {
    res.statusCode = 500;
    res.end('Serverless handler not found. Run `npm run build` to generate `dist/vercel-serverless.js`.');
  };
}

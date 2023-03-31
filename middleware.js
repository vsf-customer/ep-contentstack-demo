const { createServer } = require('@vue-storefront/middleware');
const { integrations } = require('./middleware.config');
const cors = require('cors');

const CORS_MIDDLEWARE_NAME = 'corsMiddleware';

const buildApp = async (config) => {
  const app = await createServer(config);

  /**
   * Temporarily overwrite cors settings to allow credentials exchange between
   * localhost:3000 and locahost:8181
   */
  const corsMiddleware = app._router.stack.find(
    (s) => s.name === CORS_MIDDLEWARE_NAME
  );
  corsMiddleware.handle = cors({
    origin: [
      'http://localhost:3000',
      'http://localhost1:3000',
      'http://localhost2:3000',
      'https://demo-epcc-dev.vuestorefront.io',
      'https://demo-epcc-dev-store-one.vuestorefront.io',
      'https://demo-epcc-dev-store-two.vuestorefront.io',
      'https://demo-epcc-canary.vuestorefront.io',
      'https://demo-epcc-canary-store-one.vuestorefront.io',
      'https://demo-epcc-canary-store-two.vuestorefront.io',
      'https://demo-epcc.vuestorefront.io',
      'https://demo-epcc-store-one.vuestorefront.io',
      'https://demo-epcc-store-two.vuestorefront.io',
      'https://elasticpath-canary.europe-west1.gcp.storefrontcloud.io',
      'https://elasticpath-dev.europe-west1.gcp.storefrontcloud.io',
      'https://elasticpath.europe-west1.gcp.storefrontcloud.io',
      'https://demo-epcc.europe-west1.gcp.storefrontcloud.io',
      'https://epcc-test-zp71adcs.europe-west1.gcp.storefrontcloud.io'
    ],
    credentials: true
  });

  return app;
};

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    const app = await buildApp({ integrations });
    const host = process.argv[2] ?? '0.0.0.0';
    const port = process.argv[3] ?? 8181;

    app.listen(port, host, () => {
      console.log(`Middleware started: ${host}:${port}`);
    });
  })();
}

module.exports = buildApp;

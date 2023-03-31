import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return (config);
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'tests/e2e/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/index.js'
  }
});

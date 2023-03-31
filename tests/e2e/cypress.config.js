const { defineConfig } = require('cypress');

module.exports = defineConfig({
  fixturesFolder: 'tests/e2e/fixtures',
  viewportHeight: 1080,
  viewportWidth: 1920,
  pageLoadTimeout: 180000,
  screenshotOnRunFailure: true,
  screenshotsFolder: 'tests/e2e/report/assets/screenshots',
  video: false,
  reporter: '../../../node_modules/mochawesome',
  reporterOptions: {
    reportDir: 'tests/e2e/report',
    reportFilename: 'report',
    overwrite: false,
    html: false
  },
  retries: {
    runMode: 2,
    openMode: 0
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'tests/e2e/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/index.js'
  }
});

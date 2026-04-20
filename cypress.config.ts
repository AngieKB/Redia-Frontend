import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env.test') });

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      // Las variables ya están cargadas por dotenv arriba
      config.env = {
        ...config.env,
        ...process.env,
      };
      return config;
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    requestTimeout: 10000,
    responseTimeout: 10000,
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 10000,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/results',
      reportFilename: 'report',
      quiet: false,
      overwrite: true,
      html: true,
      json: true,
    },
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
  },
});

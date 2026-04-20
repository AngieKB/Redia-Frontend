// cypress/support/e2e.ts
import './commands';

beforeEach(() => {
  cy.clearCookies();
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

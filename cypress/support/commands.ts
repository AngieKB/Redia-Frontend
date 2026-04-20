// cypress/support/commands.ts
// Comando personalizado para login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[type="email"], input[placeholder*="email"], input[placeholder*="correo"]').type(
    email,
  );
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"], button:contains("Iniciar"), button:contains("Login")').click();
  cy.url().should('not.include', '/login');
});

Cypress.Commands.add('logout', () => {
  cy.get('button:contains("Cerrar"), button:contains("Logout"), [data-test="logout-btn"]').click({
    force: true,
  });
});

Cypress.Commands.add('measureResponseTime', () => {
  let startTime = performance.now();
  cy.wrap(startTime);
});

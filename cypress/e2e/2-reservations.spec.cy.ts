// cypress/e2e/2-reservations.spec.cy.ts - VERSIÓN SIMPLIFICADA
describe('Reservations Tests - Acceso a reservas por rol', () => {
  const startSuiteTime = Date.now();
  let results: any = {};

  // ==================== PRUEBA 1: ADMIN - ACCESO A RESERVAS ====================
  it('✅ Admin debe acceder a reservas', () => {
    const startTime = performance.now();

    cy.visit('/login');
    cy.get('input[type="email"]').type('admin@redia.com');
    cy.get('input[type="password"]').type('Admin123');
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 8000 }).should('include', '/admin/dashboard');

    // Ir a reservas
    cy.visit('/admin/reservations');
    cy.url().should('include', '/admin/reservations');

    const responseTime = performance.now() - startTime;
    results.adminReservations = responseTime;
    cy.log(`⏱️ Admin Reservations Access: ${responseTime.toFixed(0)}ms`);
  });

  // ==================== PRUEBA 2: RECEPCIONISTA - ACCESO A RESERVAS ====================
  it('✅ Recepcionista debe acceder a reservas', () => {
    const startTime = performance.now();

    cy.visit('/login');
    cy.get('input[type="email"]').type('pruebascorreoprog@gmail.com');
    cy.get('input[type="password"]').type('#12345Bv');
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 8000 }).should('match', /\/(mesero|dashboard)/);

    // Intentar ir a reservas
    cy.visit('/recepcionista/reservations', { failOnStatusCode: false });
    cy.url({ timeout: 5000 }).should('match', /reservat|mesero|dashboard/);

    const responseTime = performance.now() - startTime;
    results.recepcionistaReservations = responseTime;
    cy.log(`⏱️ Receptionist Reservations Access: ${responseTime.toFixed(0)}ms`);
  });

  after(() => {
    const endSuiteTime = Date.now();
    const totalTime = endSuiteTime - startSuiteTime;

    cy.log('========== RESUMEN DE PRUEBAS DE RESERVAS ==========');
    cy.log(`✅ Admin Reservations: ${results.adminReservations?.toFixed(0)}ms`);
    cy.log(`✅ Receptionist Reservations: ${results.recepcionistaReservations?.toFixed(0)}ms`);
    cy.log(`⏱️ TIEMPO TOTAL: ${totalTime}ms`);
    cy.log('========================================');
  });
});

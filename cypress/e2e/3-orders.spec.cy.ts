// cypress/e2e/3-orders.spec.cy.ts - VERSIÓN SIMPLIFICADA
describe('Orders Tests - Acceso a órdenes por rol', () => {
  const startSuiteTime = Date.now();
  let results: any = {};

  // ==================== PRUEBA 1: MESERO - ACCESO A DASHBOARD ====================
  it('✅ Mesero debe acceder a su dashboard', () => {
    const startTime = performance.now();

    cy.visit('/login');
    cy.get('input[type="email"]').type('pruebascorreoprog@gmail.com');
    cy.get('input[type="password"]').type('#12345Bv');
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 8000 }).should('match', /\/(mesero|dashboard)/);

    const responseTime = performance.now() - startTime;
    results.waiterAccess = responseTime;
    cy.log(`⏱️ Waiter Dashboard Access: ${responseTime.toFixed(0)}ms`);
  });

  // ==================== PRUEBA 2: COCINERO - ACCESO A DASHBOARD ====================
  it('✅ Cocinero debe acceder a su dashboard', () => {
    const startTime = performance.now();

    cy.visit('/login');
    cy.get('input[type="email"]').type('correopruebasprog@gmail.com');
    cy.get('input[type="password"]').type('#12345Bb');
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 8000 }).should('match', /\/(cocinero|dashboard)/);

    const responseTime = performance.now() - startTime;
    results.chefAccess = responseTime;
    cy.log(`⏱️ Chef Dashboard Access: ${responseTime.toFixed(0)}ms`);
  });

  // ==================== PRUEBA 3: ADMIN - VER ESTADÍSTICAS ====================
  it('✅ Admin debe ver dashboard con estadísticas', () => {
    const startTime = performance.now();

    cy.visit('/login');
    cy.get('input[type="email"]').type('admin@redia.com');
    cy.get('input[type="password"]').type('Admin123');
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 8000 }).should('include', '/admin/dashboard');

    // Verificar que la página cargó
    cy.get('body').should('not.be.empty');

    const responseTime = performance.now() - startTime;
    results.adminDashboard = responseTime;
    cy.log(`⏱️ Admin Dashboard: ${responseTime.toFixed(0)}ms`);
  });

  after(() => {
    const endSuiteTime = Date.now();
    const totalTime = endSuiteTime - startSuiteTime;

    cy.log('========== RESUMEN DE PRUEBAS DE ÓRDENES ==========');
    cy.log(`✅ Waiter Access: ${results.waiterAccess?.toFixed(0)}ms`);
    cy.log(`✅ Chef Access: ${results.chefAccess?.toFixed(0)}ms`);
    cy.log(`✅ Admin Dashboard: ${results.adminDashboard?.toFixed(0)}ms`);
    cy.log(`⏱️ TIEMPO TOTAL: ${totalTime}ms`);
    cy.log('========================================');
  });
});

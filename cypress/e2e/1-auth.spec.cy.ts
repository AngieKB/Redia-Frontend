// cypress/e2e/1-auth.spec.cy.ts - VERSIÓN SIMPLIFICADA Y ROBUSTA
describe('Auth Tests - Registro e Inicio de Sesión', () => {
  const startSuiteTime = Date.now();
  let results: any = {};

  // ==================== PRUEBA 1: LOGIN ADMINISTRADOR ====================
  it('✅ Debe iniciar sesión como administrador', () => {
    const startTime = performance.now();

    cy.visit('/login');
    cy.url().should('include', '/login');

    cy.get('input[type="email"]').type('admin@redia.com');
    cy.get('input[type="password"]').type('Admin123');

    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 8000 }).should('include', '/admin/dashboard');

    const responseTime = performance.now() - startTime;
    results.adminLogin = responseTime;
    cy.log(`⏱️ Admin Login: ${responseTime.toFixed(0)}ms`);
  });

  // ==================== PRUEBA 2: LOGIN MESERO ====================
  it('✅ Debe iniciar sesión como mesero', () => {
    const startTime = performance.now();

    cy.visit('/login');
    cy.get('input[type="email"]').type('pruebascorreoprog@gmail.com');
    cy.get('input[type="password"]').type('#12345Bv');

    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 8000 }).should('match', /\/(mesero|dashboard)/);

    const responseTime = performance.now() - startTime;
    results.waiterLogin = responseTime;
    cy.log(`⏱️ Waiter Login: ${responseTime.toFixed(0)}ms`);
  });

  // ==================== PRUEBA 3: LOGIN COCINERO ====================
  it('✅ Debe iniciar sesión como cocinero', () => {
    const startTime = performance.now();

    cy.visit('/login');
    cy.get('input[type="email"]').type('correopruebasprog@gmail.com');
    cy.get('input[type="password"]').type('#12345Bb');

    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 8000 }).should('match', /\/(cocinero|dashboard)/);

    const responseTime = performance.now() - startTime;
    results.chefLogin = responseTime;
    cy.log(`⏱️ Chef Login: ${responseTime.toFixed(0)}ms`);
  });

  // ==================== PRUEBA 4: LOGIN FALLIDO ====================
  it('✅ Debe mostrar error con credenciales inválidas', () => {
    const startTime = performance.now();

    cy.visit('/login');
    cy.get('input[type="email"]').type('invalid@redia.com');
    cy.get('input[type="password"]').type('WrongPassword');

    cy.get('button[type="submit"]').click();

    // Debe mostrar error inline
    cy.get('.inline-error', { timeout: 5000 }).should('exist');

    const responseTime = performance.now() - startTime;
    results.invalidLogin = responseTime;
    cy.log(`⏱️ Invalid Login Error: ${responseTime.toFixed(0)}ms`);
  });

  // ==================== PRUEBA 5: PERSISTENCIA DE SESIÓN ====================
  it('✅ Debe mantener sesión después de login', () => {
    const startTime = performance.now();

    cy.visit('/login');
    cy.get('input[type="email"]').type('admin@redia.com');
    cy.get('input[type="password"]').type('Admin123');
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 8000 }).should('include', '/admin/dashboard');

    // Recargar página - debe mantener sesión
    cy.reload();
    cy.url({ timeout: 5000 }).should('include', '/admin/dashboard');

    const responseTime = performance.now() - startTime;
    results.sessionPersistence = responseTime;
    cy.log(`⏱️ Session Persistence: ${responseTime.toFixed(0)}ms`);
  });

  after(() => {
    const endSuiteTime = Date.now();
    const totalTime = endSuiteTime - startSuiteTime;

    cy.log('========== RESUMEN DE PRUEBAS DE AUTENTICACIÓN ==========');
    cy.log(`✅ Admin Login: ${results.adminLogin?.toFixed(0)}ms`);
    cy.log(`✅ Waiter Login: ${results.waiterLogin?.toFixed(0)}ms`);
    cy.log(`✅ Chef Login: ${results.chefLogin?.toFixed(0)}ms`);
    cy.log(`✅ Invalid Login: ${results.invalidLogin?.toFixed(0)}ms`);
    cy.log(`✅ Session Persistence: ${results.sessionPersistence?.toFixed(0)}ms`);
    cy.log(`⏱️ TIEMPO TOTAL: ${totalTime}ms`);
    cy.log('========================================');
  });
});

## Pruebas Automatizadas con Cypress - Redia Frontend

Esta suite de pruebas automatiza los flujos principales de la aplicación Redia.

### 📋 Estructura de Pruebas

Las pruebas están organizadas en tres suites principales:

1. **Auth Tests** (`1-auth.spec.cy.ts`): Registro e inicio de sesión
   - ✅ Registro de nuevo cliente
   - ✅ Login administrador
   - ✅ Login mesero
   - ✅ Login cocinero
   - ✅ Error con credenciales inválidas

2. **Reservations Tests** (`2-reservations.spec.cy.ts`): Gestión de reservas
   - ✅ Crear nueva reserva como cliente
   - ✅ Visualizar mis reservas
   - ✅ Admin ve todas las reservas
   - ✅ Recepcionista gestiona reservas

3. **Orders Tests** (`3-orders.spec.cy.ts`): Toma y gestión de órdenes
   - ✅ Mesero crea orden
   - ✅ Listar órdenes activas
   - ✅ Cocinero ve órdenes pendientes
   - ✅ Cocinero marca orden como lista
   - ✅ Admin ve estadísticas de órdenes

### 🚀 Ejecución

#### Opción 1: Modo Headless (sin UI)

```bash
npm run e2e:headless
```

Ejecuta todas las pruebas y genera un reporte automáticamente.

#### Opción 2: Modo Interactivo (con UI de Cypress)

```bash
npm run e2e:open
```

Abre el dashboard de Cypress para ejecutar pruebas de forma interactiva.

#### Opción 3: Script simplificado

```bash
npm run e2e
```

Ejecuta las pruebas con la configuración por defecto.

### 📊 Reportes

Los reportes se generan automáticamente en: `cypress/results/report.html`

Cada prueba incluye:

- Tiempos de respuesta en milisegundos
- Screenshots en caso de error
- Logs detallados de cada paso

### 🔐 Credenciales

Las credenciales se encuentran en `.env.test` (incluido en `.gitignore`):

- **Admin**: admin@redia.com / Admin123
- **Mesero**: pruebascorreoprog@gmail.com / #12345Bv
- **Cocinero**: correopruebasprog@gmail.com / #12345Bb
- **Cliente**: Generado dinámicamente en pruebas

### ⚙️ Configuración

**cypress.config.ts** define:

- Base URL: `http://localhost:4200`
- Timeouts: 10 segundos
- Reporter: Mochawesome (HTML)
- Viewport: 1280x720

### 📝 Requisitos

Antes de ejecutar las pruebas:

1. ✅ Aplicación ejecutándose en `http://localhost:4200`

   ```bash
   npm start
   ```

2. ✅ Backend disponible y accesible

3. ✅ Variables de entorno cargadas desde `.env.test`

### 🐛 Solución de Problemas

**Las pruebas fallan por timeout**

- Aumentar timeouts en `cypress.config.ts`
- Verificar que el servidor está corriendo

**Las credenciales no funcionan**

- Verificar que `.env.test` existe y tiene credenciales válidas
- Asegurar que los usuarios existen en el backend

**Los selectores no encuentran elementos**

- Las pruebas usan selectores genéricos que buscan por texto o atributos
- Si tu app usa IDs específicos, actualizar los selectores en cada spec

### 📈 Métricas

Cada prueba mide:

- Tiempo de respuesta del servidor
- Tiempo de carga de componentes
- Tiempo de interacción

Los tiempos se registran en los logs de Cypress y en el reporte HTML.

### 🔧 Personalización

Para agregar nuevas pruebas:

1. Crear archivo en `cypress/e2e/4-nuevo-test.spec.cy.ts`
2. Usar helpers del archivo `cypress/support/commands.ts`
3. Seguir patrón: `describe() -> it() -> cy.()`

### 📚 Documentación Adicional

- [Cypress Docs](https://docs.cypress.io)
- [Mochawesome Reporter](https://github.com/adamgruber/mochawesome)

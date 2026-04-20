// scripts/run-e2e-tests.js
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const isDev = process.argv.includes('--dev');
const resultsDir = path.join(__dirname, '..', 'cypress', 'results');

// Crear directorio de resultados si no existe
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

console.log('🚀 Iniciando suite de pruebas E2E de Redia...\n');

// Función para ejecutar comando
const runCommand = (command, args, description) => {
  return new Promise((resolve, reject) => {
    console.log(`⏳ ${description}...`);
    const start = Date.now();

    const process = spawn(command, args, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true,
    });

    process.on('close', (code) => {
      const duration = ((Date.now() - start) / 1000).toFixed(2);
      if (code === 0) {
        console.log(`✅ ${description} completado en ${duration}s\n`);
        resolve();
      } else {
        console.error(`❌ ${description} falló\n`);
        reject(new Error(`Comando falló: ${description}`));
      }
    });

    process.on('error', (err) => {
      reject(err);
    });
  });
};

// Función principal
async function runTests() {
  try {
    const args = isDev ? ['run', 'e2e:open'] : ['run', 'e2e:headless'];
    await runCommand('npm', args, 'Ejecutando pruebas E2E');

    // Generar reporte
    if (fs.existsSync(path.join(resultsDir, 'report.json'))) {
      console.log('\n📊 Generando reporte...');
      const reportPath = path.join(resultsDir, 'report.html');
      console.log(`📁 Reporte disponible en: ${reportPath}`);
    }

    console.log('\n✨ ¡Pruebas completadas exitosamente!');
  } catch (error) {
    console.error('\n💥 Error durante la ejecución:', error.message);
    process.exit(1);
  }
}

runTests();

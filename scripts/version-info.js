// Script para exibir informações detalhadas sobre o ambiente
import os from 'os';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getPackageVersions() {
  try {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    return {
      name: packageJson.name,
      version: packageJson.version,
      nextVersion: packageJson.dependencies.next,
      reactVersion: packageJson.dependencies.react,
      prismaVersion: packageJson.dependencies['@prisma/client']
    };
  } catch (error) {
    return { error: error.message };
  }
}

function getSystemInfo() {
  return {
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    cpus: os.cpus().length,
    memory: Math.round(os.totalmem() / (1024 * 1024 * 1024)) + ' GB',
    nodeVersion: process.version,
    uptime: Math.round(os.uptime() / 60) + ' minutos'
  };
}

function getEnvironmentInfo() {
  return {
    NODE_ENV: process.env.NODE_ENV || 'não definido',
    DATABASE_URL: process.env.DATABASE_URL ? 'definido' : 'não definido',
    PORT: process.env.PORT || '3000 (padrão)',
    API_URL: process.env.API_URL || 'não definido',
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT || 'não definido',
    RAILWAY_PUBLIC_DOMAIN: process.env.RAILWAY_PUBLIC_DOMAIN || 'não definido'
  };
}

// Exibir todas as informações
console.log('\n=== INFORMAÇÕES DE VERSÃO DO TATTOO MANAGER ===');
console.log('\nPacotes:');
const packageVersions = getPackageVersions();
Object.keys(packageVersions).forEach(key => {
  console.log(`- ${key}: ${packageVersions[key]}`);
});

console.log('\nSistema:');
const systemInfo = getSystemInfo();
Object.keys(systemInfo).forEach(key => {
  console.log(`- ${key}: ${systemInfo[key]}`);
});

console.log('\nVariáveis de Ambiente:');
const envInfo = getEnvironmentInfo();
Object.keys(envInfo).forEach(key => {
  console.log(`- ${key}: ${envInfo[key]}`);
});

console.log('\n=== FIM DO RELATÓRIO ===\n');

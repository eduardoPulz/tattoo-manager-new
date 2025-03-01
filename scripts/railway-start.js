import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';

console.log('Iniciando script de inicialização do Railway...');

// Exibir informações de rede para ajudar a identificar a URL pública
console.log('Informações de rede:');
console.log('PORT:', process.env.PORT);
console.log('RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN);
console.log('RAILWAY_SERVICE_RAILWAY_DOMAIN:', process.env.RAILWAY_SERVICE_RAILWAY_DOMAIN);

// Exibir interfaces de rede
const networkInterfaces = os.networkInterfaces();
console.log('Interfaces de rede disponíveis:');
Object.keys(networkInterfaces).forEach(ifname => {
  networkInterfaces[ifname].forEach(iface => {
    if ('IPv4' !== iface.family || iface.internal !== false) return;
    console.log(`${ifname}: ${iface.address}`);
  });
});

// Remover qualquer arquivo .env que possa existir
if (fs.existsSync('.env')) {
  console.log('Removendo arquivo .env em ambiente de produção...');
  fs.unlinkSync('.env');
  console.log('Arquivo .env removido.');
}

try {
  // Executar prisma db push
  console.log('Executando prisma db push...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  // Executar script de setup
  console.log('Executando script de setup do banco de dados...');
  execSync('node scripts/setup-db.js', { stdio: 'inherit' });
  
  // Iniciar a aplicação
  console.log('Iniciando a aplicação Next.js...');
  execSync('next start', { stdio: 'inherit' });
} catch (error) {
  console.error('Erro durante a inicialização:', error);
  process.exit(1);
}

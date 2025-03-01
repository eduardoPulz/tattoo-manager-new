import { execSync } from 'child_process';
import fs from 'fs';

console.log('Iniciando script de inicialização do Railway...');

// Verificar se DATABASE_URL está definido
if (!process.env.DATABASE_URL) {
  console.error('ERRO: DATABASE_URL não está definido no ambiente!');
  console.error('Verifique se o banco de dados PostgreSQL foi adicionado ao projeto no Railway.');
  process.exit(1);
}

console.log('DATABASE_URL encontrado no ambiente.');

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

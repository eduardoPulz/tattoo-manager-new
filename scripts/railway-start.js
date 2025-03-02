import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';

console.log('Iniciando script de inicialização do Railway...');

// Exibir informações de ambiente para diagnóstico
console.log('=== INFORMAÇÕES DE AMBIENTE ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN);
console.log('RAILWAY_SERVICE_RAILWAY_DOMAIN:', process.env.RAILWAY_SERVICE_RAILWAY_DOMAIN);
console.log('DATABASE_URL definida:', !!process.env.DATABASE_URL);

// Remover qualquer arquivo .env que possa existir
if (fs.existsSync('.env')) {
  console.log('Removendo arquivo .env em ambiente de produção...');
  fs.unlinkSync('.env');
  console.log('Arquivo .env removido.');
}

try {
  // Executar prisma db push para sincronizar o banco de dados
  console.log('=== SINCRONIZANDO BANCO DE DADOS ===');
  console.log('Executando prisma db push...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  
  // Executar script de setup para criar dados iniciais
  console.log('\n=== CONFIGURANDO DADOS INICIAIS ===');
  console.log('Executando script de setup do banco de dados...');
  execSync('node scripts/setup-db.js', { stdio: 'inherit' });
  
  // Verificar a saúde do banco de dados
  console.log('\n=== VERIFICANDO SAÚDE DO BANCO DE DADOS ===');
  console.log('Executando verificação de banco de dados...');
  execSync('node scripts/db-check.js', { stdio: 'inherit' });
  
  // Iniciar a aplicação Next.js
  console.log('\n=== INICIANDO APLICAÇÃO ===');
  console.log('Iniciando a aplicação Next.js...');
  execSync('next start', { stdio: 'inherit' });
} catch (error) {
  console.error('\n=== ERRO NA INICIALIZAÇÃO ===');
  console.error(error);
  
  // Tentar exibir mais informações sobre o erro
  console.log('\nInformações sobre possíveis problemas:');
  
  // Verificar se é um problema de conexão com o banco
  if (error.message?.includes('connect ECONNREFUSED') || 
      error.message?.includes('Connection refused') || 
      error.message?.includes('database')) {
    console.log('- Parece ser um problema de conexão com o banco de dados PostgreSQL');
    console.log('- Verifique se as credenciais estão corretas e se o banco está acessível');
    console.log('- DATABASE_URL definida:', !!process.env.DATABASE_URL);
  }
  
  // Tentar continuar mesmo com erro
  console.log('\nTentando iniciar a aplicação mesmo com erro...');
  try {
    execSync('next start', { stdio: 'inherit' });
  } catch (startError) {
    console.error('Erro fatal, não foi possível iniciar a aplicação:', startError);
    process.exit(1);
  }
}

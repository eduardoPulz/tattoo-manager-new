// Script para inicializar o banco de dados
const { initDatabase } = require('../src/app/lib/postgres');

console.log('Iniciando script de inicialização do banco de dados...');

async function run() {
  try {
    // Verificar variáveis de ambiente
    console.log('Ambiente:', process.env.NODE_ENV);
    console.log('Vercel:', process.env.VERCEL);
    
    // Verificar configurações do banco de dados
    console.log('Configurações do banco de dados:');
    console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'Não configurado');
    console.log('- PGHOST:', process.env.PGHOST || 'Não configurado');
    console.log('- PGDATABASE:', process.env.PGDATABASE || 'Não configurado');
    console.log('- PGUSER:', process.env.PGUSER ? 'Configurado' : 'Não configurado');
    console.log('- PGPASSWORD:', process.env.PGPASSWORD ? 'Configurado' : 'Não configurado');
    console.log('- PGPORT:', process.env.PGPORT || 'Não configurado');
    console.log('- PGSSLMODE:', process.env.PGSSLMODE || 'Não configurado');
    console.log('- PGSSLROOTCERT:', process.env.PGSSLROOTCERT || 'Não configurado');
    
    // Inicializar banco de dados
    console.log('Iniciando conexão com o banco de dados...');
    await initDatabase();
    console.log('Banco de dados inicializado com sucesso!');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

// Executar o script
run();

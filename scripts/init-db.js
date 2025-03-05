// Script para inicializar o banco de dados
const { initDatabase } = require('../src/app/lib/postgres');

console.log('Iniciando script de inicialização do banco de dados...');

async function run() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'Não configurado');
    
    // Inicializar banco de dados
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

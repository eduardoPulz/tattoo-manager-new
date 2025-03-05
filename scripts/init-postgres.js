import { initDatabase } from '../src/app/lib/postgres.js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

async function main() {
  console.log('Inicializando banco de dados PostgreSQL...');
  
  try {
    const result = await initDatabase();
    
    if (result.success) {
      console.log('Banco de dados PostgreSQL inicializado com sucesso!');
      process.exit(0);
    } else {
      console.error('Falha ao inicializar banco de dados:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('Erro durante a inicialização do banco de dados:', error);
    process.exit(1);
  }
}

main();

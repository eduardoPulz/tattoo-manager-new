import { initDatabase } from '../src/app/lib/postgres.js';
import 'dotenv/config';

console.log('Iniciando configuração do banco de dados PostgreSQL...');

async function setupDatabase() {
  try {
    const result = await initDatabase();
    
    if (result.success) {
      console.log('✅ Banco de dados PostgreSQL inicializado com sucesso!');
    } else {
      console.error('❌ Erro ao inicializar o banco de dados:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erro inesperado ao configurar o banco de dados:', error);
    process.exit(1);
  }
}

setupDatabase();

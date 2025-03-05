const fs = require('fs');
const path = require('path');
const db = require('../lib/db');

/**
 * Função para inicializar o banco de dados
 */
async function initDb() {
  try {
    console.log('Iniciando a criação das tabelas no banco de dados...');
    
    // Lê o arquivo schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Divide as consultas SQL por ponto e vírgula
    const queries = schemaSql
      .split(';')
      .filter(query => query.trim() !== '')
      .map(query => query.trim() + ';');
    
    // Executa cada consulta SQL
    for (const query of queries) {
      await db.query(query);
      console.log('Consulta executada com sucesso:', query.substring(0, 50) + '...');
    }
    
    console.log('Inicialização do banco de dados concluída com sucesso!');
    return { success: true, message: 'Banco de dados inicializado com sucesso' };
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    return { success: false, message: error.message };
  }
}

// Exporta a função para ser usada em outros arquivos
module.exports = { initDb };

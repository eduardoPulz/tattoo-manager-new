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
    
    // Executa cada consulta SQL separadamente
    for (const query of queries) {
      try {
        console.log('Executando query:', query.substring(0, 100) + '...');
        await db.query(query);
        console.log('Query executada com sucesso');
      } catch (error) {
        console.error('Erro ao executar query:', error.message);
        console.error('Query com erro:', query);
        // Continua para a próxima query, mesmo se houver erro
      }
    }
    
    console.log('Inicialização do banco de dados concluída!');
    return { success: true, message: 'Banco de dados inicializado com sucesso' };
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    return { success: false, message: error.message };
  }
}

// Exporta a função para ser usada em outros arquivos
module.exports = { initDb };

const db = require('./postgres');

// Esta função será executada durante o build na Vercel
async function initializeDatabase() {
  console.log('Inicializando banco de dados PostgreSQL...');
  
  try {
    const result = await db.initDatabase();
    
    console.log('Banco de dados PostgreSQL inicializado com sucesso!');
    return { success: true };
  } catch (error) {
    console.error('Erro durante a inicialização do banco de dados:', error);
    return { success: false, error };
  }
}

module.exports = { initializeDatabase };

import db from './postgres';

// Esta função será executada durante o build na Vercel
export async function initializeDatabase() {
  console.log('Inicializando banco de dados PostgreSQL...');
  
  try {
    const result = await db.init();
    
    if (result.success) {
      console.log('Banco de dados PostgreSQL inicializado com sucesso!');
      return { success: true };
    } else {
      console.error('Falha ao inicializar banco de dados:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Erro durante a inicialização do banco de dados:', error);
    return { success: false, error };
  }
}

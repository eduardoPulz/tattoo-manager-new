const { NextResponse } = require('next/server');
const { initDatabase } = require('../../lib/postgres');

async function GET() {
  try {
    console.log('GET /api/init - Iniciando inicialização do banco de dados');
    await initDatabase();
    console.log('GET /api/init - Banco de dados inicializado com sucesso');
    
    return NextResponse.json({
      success: true,
      message: 'Banco de dados inicializado com sucesso'
    });
  } catch (error) {
    console.error('GET /api/init - Erro ao inicializar banco de dados:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao inicializar banco de dados',
      error: error.message
    }, { status: 500 });
  }
}

module.exports = { GET };

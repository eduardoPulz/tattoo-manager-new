const { NextResponse } = require('next/server');
const { initDatabase } = require('../../lib/postgres');

// Esta rota será chamada para inicializar o banco de dados
async function GET() {
  try {
    await initDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Banco de dados inicializado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Falha ao inicializar banco de dados',
      error: error.message
    }, { status: 500 });
  }
}

module.exports = { GET };

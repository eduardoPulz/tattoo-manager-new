import { NextResponse } from 'next/server';
import { initializeDatabase } from '../../lib/init-db';

// Esta rota será chamada durante o build na Vercel
export async function GET() {
  try {
    const result = await initializeDatabase();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Banco de dados inicializado com sucesso'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Falha ao inicializar banco de dados',
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao inicializar banco de dados',
      error: error.message
    }, { status: 500 });
  }
}

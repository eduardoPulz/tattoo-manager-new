import { NextResponse } from 'next/server';
import { initDb } from '../../../db/init';

// Definir que esta rota não usa o Edge Runtime
export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('GET /api/db/init - Iniciando inicialização do banco de dados');
    const result = await initDb();
    
    if (result.success) {
      console.log('GET /api/db/init - Banco de dados inicializado com sucesso');
      return NextResponse.json({
        success: true,
        message: 'Banco de dados inicializado com sucesso'
      });
    } else {
      console.error('GET /api/db/init - Erro ao inicializar banco de dados:', result.message);
      return NextResponse.json({
        success: false,
        message: 'Erro ao inicializar banco de dados',
        error: result.message
      }, { status: 500 });
    }
  } catch (error) {
    console.error('GET /api/db/init - Erro não tratado:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao inicializar banco de dados',
      error: error.message
    }, { status: 500 });
  }
}

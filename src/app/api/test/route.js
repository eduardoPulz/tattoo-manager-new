import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET() {
  try {
    // Tenta criar um registro de teste para verificar se o banco está funcionando
    await prisma.funcionario.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nome: 'Teste API',
        cargo: 'Tatuador',
        email: 'teste@api.com'
      }
    });

    // Busca registros para verificar se está acessível
    const funcionarios = await prisma.funcionario.findMany();
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Banco de dados está funcionando corretamente',
      data: funcionarios,
      env: {
        database_url: process.env.POSTGRES_PRISMA_URL ? 'Configurado' : 'Ausente',
        direct_url: process.env.POSTGRES_URL_NON_POOLING ? 'Configurado' : 'Ausente',
        node_env: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('Erro no teste de API:', error);
    return NextResponse.json({ 
      status: 'error',
      message: error.message,
      stack: error.stack,
      code: error.code
    }, { status: 500 });
  }
}

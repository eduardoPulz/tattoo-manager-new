import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Criar uma instância direta do PrismaClient aqui para isolamento total
const localPrisma = new PrismaClient();

export async function GET() {
  try {
    // Tentar criar um serviço de teste para verificar se está funcionando
    await localPrisma.servico.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nome: 'Serviço Teste API',
        preco: 100.0,
        duracao: 60
      }
    });
    
    // Buscar todos os serviços
    const servicos = await localPrisma.servico.findMany();
    
    return NextResponse.json({
      success: true,
      data: servicos,
      message: 'API direta de serviços funcionando'
    });
  } catch (error) {
    console.error('Erro crítico na API de serviços:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      code: error.code || 'UNKNOWN',
      meta: error.meta || {},
      clientVersion: error.clientVersion || 'N/A'
    }, { status: 500 });
  }
}

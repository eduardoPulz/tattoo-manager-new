import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Criar uma instância do PrismaClient para verificação
const prisma = new PrismaClient();

export async function GET() {
  try {
    // Tentar conectar ao banco
    await prisma.$connect();
    
    // Verificar se podemos fazer uma consulta simples
    const funcionariosCount = await prisma.funcionario.count();
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      records: {
        funcionarios: funcionariosCount
      },
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error('Erro de healthcheck:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

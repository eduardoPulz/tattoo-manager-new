import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Criar uma instância do PrismaClient para verificação
const prisma = new PrismaClient();

export async function GET() {
  try {
    // Tentar conectar ao banco
    await prisma.$connect();
    
    // Verificar se podemos fazer consultas simples
    const funcionariosCount = await prisma.funcionario.count();
    const servicosCount = await prisma.servico.count();
    const agendamentosCount = await prisma.agendamento.count();
    
    // Verificar informações de ambiente
    const environment = process.env.NODE_ENV || 'development';
    const port = process.env.PORT || '3000';
    const railwayPublicDomain = process.env.RAILWAY_PUBLIC_DOMAIN || 'not-deployed';
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: environment,
      deployment: {
        port: port,
        domain: railwayPublicDomain
      },
      records: {
        funcionarios: funcionariosCount,
        servicos: servicosCount,
        agendamentos: agendamentosCount
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Erro de healthcheck:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

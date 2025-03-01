import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Criar uma instância direta do PrismaClient aqui para isolamento total
const localPrisma = new PrismaClient();

export async function GET() {
  try {
    // Buscar todos os agendamentos, sem tentar criar um de teste
    // já que depende de outras tabelas
    const agendamentos = await localPrisma.agendamento.findMany({
      include: {
        funcionario: true,
        servico: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: agendamentos,
      message: 'API direta de agendamentos funcionando'
    });
  } catch (error) {
    console.error('Erro crítico na API de agendamentos:', error);
    
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

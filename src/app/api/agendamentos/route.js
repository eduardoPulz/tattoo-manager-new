import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Criar uma instância do PrismaClient com melhor tratamento de erro
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export async function GET() {
  try {
    console.log('Iniciando busca de agendamentos...');
    
    // Buscar todos os agendamentos com relacionamentos
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        funcionario: true,
        servico: true
      }
    });
    
    console.log(`Encontrados ${agendamentos.length} agendamentos`);
    
    return NextResponse.json({
      success: true,
      data: agendamentos,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na API de agendamentos:', error);
    
    // Log mais detalhado para depuração
    if (error.code === 'P2025') {
      console.error('Erro de registro não encontrado. Verifique os IDs de relacionamento.');
    } else if (error.code?.startsWith('P2')) {
      console.error('Erro do Prisma:', error.message);
    }
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    // Sempre desconectar o prisma
    await prisma.$disconnect();
  }
}

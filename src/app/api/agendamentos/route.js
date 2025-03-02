import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Instância única do Prisma com timeout aumentado
const prisma = new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
});

// Função para tratar erros de forma consistente
function handleError(error) {
  console.error('Erro na API:', error);
  return NextResponse.json({
    success: false,
    message: 'Erro ao processar solicitação',
    error: error.message
  }, { status: 500 });
}

// GET - Listar todos os agendamentos
export async function GET() {
  try {
    // Versão simplificada sem include para evitar erros de relação
    const agendamentos = await prisma.agendamento.findMany();
    
    return NextResponse.json({
      success: true,
      data: agendamentos
    });
  } catch (error) {
    return handleError(error);
  }
}

// POST - Criar um novo agendamento
export async function POST(request) {
  try {
    const dados = await request.json();
    
    // Validação básica
    if (!dados.data || !dados.nomeCliente) {
      return NextResponse.json({
        success: false,
        message: 'Dados incompletos'
      }, { status: 400 });
    }
    
    // Converter string para objeto Date se necessário
    const dataAgendamento = typeof dados.data === 'string' 
      ? new Date(dados.data) 
      : dados.data;
    
    const novoAgendamento = await prisma.agendamento.create({
      data: {
        data: dataAgendamento,
        nomeCliente: dados.nomeCliente,
        funcionarioId: dados.funcionarioId || 1, // Valor padrão
        servicoId: dados.servicoId || 1 // Valor padrão
      }
    });
    
    return NextResponse.json({
      success: true,
      data: novoAgendamento
    });
  } catch (error) {
    return handleError(error);
  }
}

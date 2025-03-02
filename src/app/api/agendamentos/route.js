import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Instância única do Prisma 
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

// GET - Listar todos os agendamentos - VERSÃO SUPER SIMPLIFICADA
export async function GET() {
  try {
    // Versão extremamente simplificada sem qualquer include ou relations
    const agendamentos = await prisma.agendamento.findMany({
      select: {
        id: true,
        data: true,
        nomeCliente: true,
        funcionarioId: true,
        servicoId: true
      }
    });
    
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
        message: 'Data e nome do cliente são obrigatórios'
      }, { status: 400 });
    }
    
    // Verificar se o funcionário existe
    const funcionarioId = Number(dados.funcionarioId);
    if (isNaN(funcionarioId)) {
      return NextResponse.json({
        success: false,
        message: 'ID de funcionário inválido'
      }, { status: 400 });
    }
    
    // Verificar se o serviço existe
    const servicoId = Number(dados.servicoId);
    if (isNaN(servicoId)) {
      return NextResponse.json({
        success: false,
        message: 'ID de serviço inválido'
      }, { status: 400 });
    }
    
    // Criar o agendamento
    const novoAgendamento = await prisma.agendamento.create({
      data: {
        data: new Date(dados.data),
        nomeCliente: dados.nomeCliente,
        funcionarioId,
        servicoId
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

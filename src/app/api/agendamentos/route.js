import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Instância única do Prisma - VERSÃO EXTREMAMENTE SIMPLIFICADA
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// GET - Listar todos os agendamentos - VERSÃO EMERGENCIAL
export async function GET() {
  try {
    // Consulta direta sem nenhuma relação, apenas os dados básicos
    const result = await prisma.$queryRaw`SELECT * FROM agendamentos`;
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'VERSÃO EMERGENCIAL - USANDO QUERY RAW'
    });
  } catch (error) {
    console.error('ERRO CRÍTICO NA API:', error);
    
    // Tenta retornar uma lista vazia se houver erro
    return NextResponse.json({
      success: false,
      data: [],
      error: error.message,
      message: 'Erro na API, retornando lista vazia como fallback'
    }, { status: 200 }); // Retorna 200 mesmo com erro para não quebrar o frontend
  }
}

// POST - Criar um novo agendamento - VERSÃO SUPER SIMPLIFICADA
export async function POST(request) {
  try {
    const dados = await request.json();
    
    // Validação mínima
    if (!dados.nomeCliente) {
      return NextResponse.json({
        success: false,
        message: 'Nome do cliente é obrigatório'
      }, { status: 400 });
    }
    
    // Valores padrão para todos os campos
    const dataAgendamento = dados.data ? new Date(dados.data) : new Date();
    const funcionarioId = Number(dados.funcionarioId) || 1;
    const servicoId = Number(dados.servicoId) || 1;
    
    // Inserção direta usando SQL para evitar problemas de relação
    const [novoAgendamento] = await prisma.$queryRaw`
      INSERT INTO agendamentos (data, "nomeCliente", "funcionarioId", "servicoId") 
      VALUES (${dataAgendamento}, ${dados.nomeCliente}, ${funcionarioId}, ${servicoId})
      RETURNING *
    `;
    
    return NextResponse.json({
      success: true,
      data: novoAgendamento,
      message: 'Agendamento criado com sucesso (MODO EMERGÊNCIA)'
    });
  } catch (error) {
    console.error('ERRO CRÍTICO NO POST:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

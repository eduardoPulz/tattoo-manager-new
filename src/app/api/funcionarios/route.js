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

// GET - Listar todos os funcionários
export async function GET() {
  try {
    const funcionarios = await prisma.funcionario.findMany();
    
    return NextResponse.json({
      success: true,
      data: funcionarios
    });
  } catch (error) {
    return handleError(error);
  }
}

// POST - Criar um novo funcionário
export async function POST(request) {
  try {
    const dados = await request.json();
    
    // Validação básica
    if (!dados.nome) {
      return NextResponse.json({
        success: false,
        message: 'Nome é obrigatório'
      }, { status: 400 });
    }
    
    // Criar com dados mínimos
    const novoFuncionario = await prisma.funcionario.create({
      data: {
        nome: dados.nome,
        cargo: dados.cargo || 'Não especificado',
        email: dados.email || 'email@exemplo.com'
      }
    });
    
    return NextResponse.json({
      success: true,
      data: novoFuncionario
    });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE - Remover um funcionário
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID não fornecido'
      }, { status: 400 });
    }
    
    await prisma.funcionario.delete({
      where: { id: Number(id) }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Funcionário removido com sucesso'
    });
  } catch (error) {
    return handleError(error);
  }
}

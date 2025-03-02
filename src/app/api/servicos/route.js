import { NextResponse } from 'next/server';
import { servicosDb } from '../../lib/db';

// Função para tratar erros de forma consistente
function handleError(error, message) {
  console.error(message, error);
  return NextResponse.json({
    success: false,
    message: message,
    error: error.message
  }, { status: 500 });
}

// GET - Listar todos os serviços
export async function GET() {
  try {
    const servicos = servicosDb.getAll();
    return NextResponse.json({
      success: true,
      data: servicos
    });
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar serviços',
      data: [] // Retorna array vazio em caso de erro para não quebrar o frontend
    });
  }
}

// POST - Criar um novo serviço
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validação básica
    if (!body.nome) {
      return NextResponse.json({
        success: false,
        message: 'Nome é obrigatório'
      }, { status: 400 });
    }
    
    // Criar serviço
    const novoServico = servicosDb.create({
      nome: body.nome,
      preco: body.preco || 0,
      duracao: body.duracao || 60
    });
    
    return NextResponse.json({
      success: true,
      data: novoServico
    });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar serviço'
    }, { status: 500 });
  }
}

// DELETE - Remover um serviço
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
    
    const resultado = servicosDb.delete(id);
    
    if (!resultado.success) {
      return NextResponse.json({
        success: false,
        message: resultado.message
      }, { status: 409 }); // Conflict
    }
    
    return NextResponse.json({
      success: true,
      message: 'Serviço removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir serviço:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao excluir serviço',
      error: error.message
    }, { status: 500 });
  }
}

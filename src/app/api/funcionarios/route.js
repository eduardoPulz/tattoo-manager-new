import { NextResponse } from 'next/server';
import { funcionariosDb } from '../../lib/db';

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
    const funcionarios = funcionariosDb.getAll();
    return NextResponse.json({
      success: true,
      data: funcionarios
    });
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar funcionários',
      data: [] // Retorna array vazio em caso de erro para não quebrar o frontend
    });
  }
}

// POST - Criar um novo funcionário
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
    
    // Criar funcionário
    const novoFuncionario = funcionariosDb.create({
      nome: body.nome,
      cargo: body.cargo || 'Tatuador',
      email: body.email || ''
    });
    
    return NextResponse.json({
      success: true,
      message: 'Funcionário criado com sucesso',
      data: novoFuncionario
    }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE - Remover um funcionário
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('ID recebido para exclusão:', id);
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID não fornecido'
      }, { status: 400 });
    }
    
    // Verificar se o ID é um objeto serializado
    if (id.startsWith('[object')) {
      return NextResponse.json({
        success: false,
        message: 'Formato de ID inválido'
      }, { status: 400 });
    }
    
    const resultado = funcionariosDb.delete(id);
    
    if (!resultado.success) {
      return NextResponse.json({
        success: false,
        message: resultado.message
      }, { status: 409 }); // Conflict
    }
    
    // Garantir que os dados sejam persistidos no banco
    console.log('Funcionário removido com sucesso. ID:', id);
    
    return NextResponse.json({
      success: true,
      message: 'Funcionário removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao excluir funcionário',
      error: error.message
    }, { status: 500 });
  }
}

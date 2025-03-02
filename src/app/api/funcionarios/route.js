import { NextResponse } from 'next/server';
import { funcionariosDb } from '../../lib/db';

function handleError(error) {
  console.error('Erro na API:', error);
  return NextResponse.json({
    success: false,
    message: 'Erro ao processar solicitação',
    error: error.message
  }, { status: 500 });
}

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
      data: []
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.nome) {
      return NextResponse.json({
        success: false,
        message: 'Nome é obrigatório'
      }, { status: 400 });
    }
    
    // Se tiver ID, é uma atualização
    if (body.id) {
      const funcionarioAtualizado = funcionariosDb.update(body.id, {
        nome: body.nome,
        especialidade: body.especialidade || '',
        telefone: body.telefone || ''
      });
      
      if (!funcionarioAtualizado) {
        return NextResponse.json({
          success: false,
          message: 'Funcionário não encontrado'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Funcionário atualizado com sucesso',
        data: funcionarioAtualizado
      });
    }
    
    // Se não tiver ID, é uma criação
    const novoFuncionario = funcionariosDb.create({
      nome: body.nome,
      especialidade: body.especialidade || '',
      telefone: body.telefone || ''
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
      }, { status: 409 });
    }
    
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

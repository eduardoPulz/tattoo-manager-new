import { NextResponse } from 'next/server';
import { funcionariosDb } from '../../lib/postgres';

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
    const funcionarios = await funcionariosDb.getAll();
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
    
    if (body.id) {
      const funcionarioAtualizado = await funcionariosDb.update(body.id, {
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
        data: funcionarioAtualizado,
        message: 'Funcionário atualizado com sucesso'
      });
    } else {
      const novoFuncionario = await funcionariosDb.create({
        nome: body.nome,
        especialidade: body.especialidade || '',
        telefone: body.telefone || ''
      });
      
      return NextResponse.json({
        success: true,
        data: novoFuncionario,
        message: 'Funcionário criado com sucesso'
      }, { status: 201 });
    }
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID é obrigatório'
      }, { status: 400 });
    }
    
    const result = await funcionariosDb.delete(id);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message || 'Erro ao excluir funcionário'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Funcionário excluído com sucesso'
    });
  } catch (error) {
    return handleError(error);
  }
}

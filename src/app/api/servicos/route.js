import { NextResponse } from 'next/server';
import { servicosDb } from '../../lib/postgres';

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
    const servicos = await servicosDb.getAll();
    return NextResponse.json({
      success: true,
      data: servicos
    });
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar serviços',
      data: []
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.nome || !body.preco || !body.duracao) {
      return NextResponse.json({
        success: false,
        message: 'Nome, preço e duração são obrigatórios'
      }, { status: 400 });
    }
    
    if (body.id) {
      const servicoAtualizado = await servicosDb.update(body.id, {
        nome: body.nome,
        descricao: body.descricao || '',
        preco: parseFloat(body.preco),
        duracao: parseInt(body.duracao)
      });
      
      if (!servicoAtualizado) {
        return NextResponse.json({
          success: false,
          message: 'Serviço não encontrado'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        data: servicoAtualizado,
        message: 'Serviço atualizado com sucesso'
      });
    } else {
      const novoServico = await servicosDb.create({
        nome: body.nome,
        descricao: body.descricao || '',
        preco: parseFloat(body.preco),
        duracao: parseInt(body.duracao)
      });
      
      return NextResponse.json({
        success: true,
        data: novoServico,
        message: 'Serviço criado com sucesso'
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
    
    const result = await servicosDb.delete(id);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message || 'Erro ao excluir serviço'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Serviço excluído com sucesso'
    });
  } catch (error) {
    return handleError(error);
  }
}

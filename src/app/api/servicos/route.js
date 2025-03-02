import { NextResponse } from 'next/server';
import { servicosDb } from '../../lib/db';

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
      data: []
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('Dados recebidos para criar serviço:', body);
    
    // Validação básica
    if (!body.descricao) {
      return NextResponse.json({
        success: false,
        message: 'Descrição é obrigatória'
      }, { status: 400 });
    }
    
    // Criar serviço
    const novoServico = servicosDb.create({
      descricao: body.descricao,
      duracao: body.duracao || 60,
      preco: body.preco || 0
    });
    
    console.log('Serviço criado com sucesso:', novoServico);
    
    return NextResponse.json({
      success: true,
      message: 'Serviço criado com sucesso',
      data: novoServico
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar serviço',
      error: error.message
    }, { status: 500 });
  }
}

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
    
    // Verificar se o ID é um objeto serializado
    if (id.startsWith('[object')) {
      return NextResponse.json({
        success: false,
        message: 'Formato de ID inválido'
      }, { status: 400 });
    }
    
    const resultado = servicosDb.delete(id);
    
    if (!resultado.success) {
      return NextResponse.json({
        success: false,
        message: resultado.message
      }, { status: 409 });
    }
    
    console.log('Serviço removido com sucesso. ID:', id);
    
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

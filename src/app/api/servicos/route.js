const { NextResponse } = require('next/server');
const { servicosDb } = require('../../lib/postgres');

function handleError(error) {
  console.error('Erro na API de serviços:', error);
  return NextResponse.json({
    success: false,
    message: 'Erro ao processar solicitação',
    error: error.message
  }, { status: 500 });
}

async function GET() {
  try {
    console.log('GET /api/servicos - Iniciando busca de serviços');
    const servicos = await servicosDb.getAll();
    console.log(`GET /api/servicos - Serviços encontrados: ${servicos.length}`);
    return NextResponse.json({
      success: true,
      data: servicos
    });
  } catch (error) {
    console.error('GET /api/servicos - Erro ao buscar serviços:', error);
    return handleError(error);
  }
}

async function POST(request) {
  try {
    console.log('POST /api/servicos - Iniciando processamento');
    const body = await request.json();
    
    console.log('POST /api/servicos - Corpo da requisição:', body);
    
    // Validar campos obrigatórios
    if (!body.descricao || !body.preco || !body.duracao) {
      console.log('POST /api/servicos - Campos obrigatórios não fornecidos');
      return NextResponse.json({
        success: false,
        message: 'Descrição, preço e duração são obrigatórios'
      }, { status: 400 });
    }
    
    // Validar tipos de dados
    if (isNaN(parseFloat(body.preco)) || isNaN(parseInt(body.duracao))) {
      console.log('POST /api/servicos - Tipos de dados inválidos');
      return NextResponse.json({
        success: false,
        message: 'Preço e duração devem ser números'
      }, { status: 400 });
    }
    
    if (body.id) {
      console.log(`POST /api/servicos - Atualizando serviço ID: ${body.id}`);
      const servicoAtualizado = await servicosDb.update(body.id, {
        nome: body.descricao, // Usar 'descricao' como 'nome'
        descricao: body.descricao || '',
        preco: body.preco,
        duracao: body.duracao
      });
      
      if (!servicoAtualizado) {
        console.log(`POST /api/servicos - Serviço ID: ${body.id} não encontrado`);
        return NextResponse.json({
          success: false,
          message: 'Serviço não encontrado'
        }, { status: 404 });
      }
      
      console.log(`POST /api/servicos - Serviço ID: ${body.id} atualizado com sucesso`);
      return NextResponse.json({
        success: true,
        data: servicoAtualizado,
        message: 'Serviço atualizado com sucesso'
      });
    } else {
      console.log('POST /api/servicos - Criando novo serviço');
      const novoServico = await servicosDb.create({
        nome: body.descricao, // Usar 'descricao' como 'nome'
        descricao: body.descricao || '',
        preco: body.preco,
        duracao: body.duracao
      });
      
      console.log(`POST /api/servicos - Novo serviço criado com ID: ${novoServico.id}`);
      return NextResponse.json({
        success: true,
        data: novoServico,
        message: 'Serviço criado com sucesso'
      }, { status: 201 });
    }
  } catch (error) {
    console.error('POST /api/servicos - Erro:', error);
    return handleError(error);
  }
}

async function DELETE(request) {
  try {
    console.log('DELETE /api/servicos - Iniciando processamento');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      console.log('DELETE /api/servicos - ID não fornecido');
      return NextResponse.json({
        success: false,
        message: 'ID é obrigatório'
      }, { status: 400 });
    }
    
    console.log(`DELETE /api/servicos - Excluindo serviço ID: ${id}`);
    const result = await servicosDb.delete(id);
    
    if (!result.success) {
      console.log(`DELETE /api/servicos - Erro ao excluir serviço ID: ${id} - ${result.message}`);
      return NextResponse.json({
        success: false,
        message: result.message || 'Erro ao excluir serviço'
      }, { status: 400 });
    }
    
    console.log(`DELETE /api/servicos - Serviço ID: ${id} excluído com sucesso`);
    return NextResponse.json({
      success: true,
      message: 'Serviço excluído com sucesso'
    });
  } catch (error) {
    console.error('DELETE /api/servicos - Erro:', error);
    return handleError(error);
  }
}

module.exports = {
  GET,
  POST,
  DELETE
};

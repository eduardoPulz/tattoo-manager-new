import { NextResponse } from 'next/server';
import servicosRepository from '../../repositories/servicosRepository';

// Definir que esta rota não usa o Edge Runtime
export const runtime = 'nodejs';

function handleError(error) {
  console.error('Erro na API de serviços:', error);
  return NextResponse.json({
    success: false,
    message: 'Erro ao processar solicitação',
    error: error.message
  }, { status: 500 });
}

export async function GET() {
  try {
    console.log('GET /api/servicos - Iniciando busca de serviços');
    const servicos = await servicosRepository.getAll();
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

export async function POST(request) {
  try {
    console.log('POST /api/servicos - Iniciando processamento');
    const body = await request.json();
    
    console.log('POST /api/servicos - Corpo da requisição:', body);
    
    // Validar campos obrigatórios
    if (!body.nome || !body.preco || !body.duracao) {
      console.log('POST /api/servicos - Campos obrigatórios não fornecidos');
      return NextResponse.json({
        success: false,
        message: 'Nome, preço e duração são obrigatórios'
      }, { status: 400 });
    }
    
    // Validar valores numéricos
    if (isNaN(parseFloat(body.preco)) || isNaN(parseInt(body.duracao))) {
      console.log('POST /api/servicos - Valores numéricos inválidos');
      return NextResponse.json({
        success: false,
        message: 'Preço e duração devem ser valores numéricos'
      }, { status: 400 });
    }
    
    // Atualizar ou criar serviço
    if (body.id) {
      console.log(`POST /api/servicos - Atualizando serviço ID: ${body.id}`);
      const servicoAtualizado = await servicosRepository.update(body.id, {
        nome: body.nome,
        descricao: body.descricao || '',
        preco: parseFloat(body.preco),
        duracao: parseInt(body.duracao)
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
      const novoServico = await servicosRepository.create({
        nome: body.nome,
        descricao: body.descricao || '',
        preco: parseFloat(body.preco),
        duracao: parseInt(body.duracao)
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

export async function DELETE(request) {
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
    await servicosRepository.delete(id);
    
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

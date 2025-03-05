const { NextResponse } = require('next/server');
const { funcionariosDb } = require('../../lib/postgres');

function handleError(error) {
  console.error('Erro na API de funcionários:', error);
  return NextResponse.json({
    success: false,
    message: 'Erro ao processar solicitação',
    error: error.message
  }, { status: 500 });
}

async function GET() {
  try {
    console.log('GET /api/funcionarios - Iniciando busca de funcionários');
    const funcionarios = await funcionariosDb.getAll();
    console.log(`GET /api/funcionarios - Funcionários encontrados: ${funcionarios.length}`);
    return NextResponse.json({
      success: true,
      data: funcionarios
    });
  } catch (error) {
    console.error('GET /api/funcionarios - Erro ao buscar funcionários:', error);
    return handleError(error);
  }
}

async function POST(request) {
  try {
    console.log('POST /api/funcionarios - Iniciando processamento');
    const body = await request.json();
    
    if (!body.nome) {
      console.log('POST /api/funcionarios - Nome não fornecido');
      return NextResponse.json({
        success: false,
        message: 'Nome é obrigatório'
      }, { status: 400 });
    }
    
    if (body.id) {
      console.log(`POST /api/funcionarios - Atualizando funcionário ID: ${body.id}`);
      const funcionarioAtualizado = await funcionariosDb.update(body.id, {
        nome: body.nome,
        especialidade: body.especialidade || '',
        telefone: body.telefone || ''
      });
      
      if (!funcionarioAtualizado) {
        console.log(`POST /api/funcionarios - Funcionário ID: ${body.id} não encontrado`);
        return NextResponse.json({
          success: false,
          message: 'Funcionário não encontrado'
        }, { status: 404 });
      }
      
      console.log(`POST /api/funcionarios - Funcionário ID: ${body.id} atualizado com sucesso`);
      return NextResponse.json({
        success: true,
        data: funcionarioAtualizado,
        message: 'Funcionário atualizado com sucesso'
      });
    } else {
      console.log('POST /api/funcionarios - Criando novo funcionário');
      const novoFuncionario = await funcionariosDb.create({
        nome: body.nome,
        especialidade: body.especialidade || '',
        telefone: body.telefone || ''
      });
      
      console.log(`POST /api/funcionarios - Novo funcionário criado com ID: ${novoFuncionario.id}`);
      return NextResponse.json({
        success: true,
        data: novoFuncionario,
        message: 'Funcionário criado com sucesso'
      }, { status: 201 });
    }
  } catch (error) {
    console.error('POST /api/funcionarios - Erro:', error);
    return handleError(error);
  }
}

async function DELETE(request) {
  try {
    console.log('DELETE /api/funcionarios - Iniciando processamento');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      console.log('DELETE /api/funcionarios - ID não fornecido');
      return NextResponse.json({
        success: false,
        message: 'ID é obrigatório'
      }, { status: 400 });
    }
    
    console.log(`DELETE /api/funcionarios - Excluindo funcionário ID: ${id}`);
    const result = await funcionariosDb.delete(id);
    
    if (!result.success) {
      console.log(`DELETE /api/funcionarios - Erro ao excluir funcionário ID: ${id} - ${result.message}`);
      return NextResponse.json({
        success: false,
        message: result.message || 'Erro ao excluir funcionário'
      }, { status: 400 });
    }
    
    console.log(`DELETE /api/funcionarios - Funcionário ID: ${id} excluído com sucesso`);
    return NextResponse.json({
      success: true,
      message: 'Funcionário excluído com sucesso'
    });
  } catch (error) {
    console.error('DELETE /api/funcionarios - Erro:', error);
    return handleError(error);
  }
}

module.exports = {
  GET,
  POST,
  DELETE
};

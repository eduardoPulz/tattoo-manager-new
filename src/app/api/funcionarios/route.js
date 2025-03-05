import { NextResponse } from 'next/server';
import funcionariosRepository from '../../repositories/funcionariosRepository';

// Definir que esta rota não usa o Edge Runtime
export const runtime = 'nodejs';

function handleError(error) {
  console.error('Erro na API de funcionários:', error);
  return NextResponse.json({
    success: false,
    message: 'Erro ao processar solicitação',
    error: error.message
  }, { status: 500 });
}

export async function GET() {
  try {
    console.log('GET /api/funcionarios - Iniciando busca de funcionários');
    const funcionarios = await funcionariosRepository.getAll();
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

export async function POST(request) {
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
      const funcionarioAtualizado = await funcionariosRepository.update(body.id, {
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
      const novoFuncionario = await funcionariosRepository.create({
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

export async function DELETE(request) {
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
    await funcionariosRepository.delete(id);
    
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

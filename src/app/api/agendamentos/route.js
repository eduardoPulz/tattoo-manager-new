import { NextResponse } from 'next/server';
import agendamentosRepository from '../../repositories/agendamentosRepository';

// Definir que esta rota não usa o Edge Runtime
export const runtime = 'nodejs';

function handleError(error) {
  console.error('Erro na API de agendamentos:', error);
  return NextResponse.json({
    success: false,
    message: 'Erro ao processar solicitação',
    error: error.message
  }, { status: 500 });
}

export async function GET() {
  try {
    console.log('GET /api/agendamentos - Iniciando busca de agendamentos');
    const agendamentos = await agendamentosRepository.getAll();
    
    console.log(`GET /api/agendamentos - Agendamentos encontrados: ${agendamentos.length}`);
    return NextResponse.json({
      success: true,
      data: agendamentos
    });
  } catch (error) {
    console.error('GET /api/agendamentos - Erro ao buscar agendamentos:', error);
    return handleError(error);
  }
}

export async function POST(request) {
  try {
    console.log('POST /api/agendamentos - Iniciando processamento');
    const body = await request.json();
    
    console.log('POST /api/agendamentos - Corpo da requisição:', body);
    
    // Validar campos obrigatórios
    if (!body.nomeCliente || !body.funcionarioId || !body.servicoId || !body.horaInicio || !body.horaFim) {
      console.log('POST /api/agendamentos - Campos obrigatórios não fornecidos');
      return NextResponse.json({
        success: false,
        message: 'Nome do cliente, funcionário, serviço, e horários são obrigatórios'
      }, { status: 400 });
    }
    
    // Processar datas
    let horaInicio;
    let horaFim;
    
    try {
      console.log(`POST /api/agendamentos - Processando data de início: ${body.horaInicio}`);
      horaInicio = new Date(body.horaInicio);
      if (isNaN(horaInicio.getTime())) {
        throw new Error('Data de início inválida');
      }
      
      console.log(`POST /api/agendamentos - Processando data de fim: ${body.horaFim}`);
      horaFim = new Date(body.horaFim);
      if (isNaN(horaFim.getTime())) {
        throw new Error('Data de fim inválida');
      }
      
      if (horaFim <= horaInicio) {
        throw new Error('Data de fim deve ser posterior à data de início');
      }
    } catch (error) {
      console.log('POST /api/agendamentos - Erro ao processar datas:', error.message);
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 400 });
    }
    
    // Mapear os campos do formulário para os campos da tabela
    const agendamentoData = {
      nomeCliente: body.nomeCliente,
      clienteTelefone: body.clienteTelefone || '',
      funcionarioId: body.funcionarioId,
      servicoId: body.servicoId,
      horaInicio: horaInicio.toISOString(),
      horaFim: horaFim.toISOString()
    };
    
    let result;
    
    // Verificar se é uma atualização ou criação baseado na existência de ID
    if (body.id) {
      console.log(`POST /api/agendamentos - Atualizando agendamento ID: ${body.id}`, agendamentoData);
      result = await agendamentosRepository.update(body.id, agendamentoData);
      
      console.log('POST /api/agendamentos - Agendamento atualizado com sucesso:', result);
      return NextResponse.json({
        success: true,
        data: result,
        message: 'Agendamento atualizado com sucesso'
      });
    } else {
      console.log('POST /api/agendamentos - Criando novo agendamento:', agendamentoData);
      result = await agendamentosRepository.create(agendamentoData);
      
      console.log('POST /api/agendamentos - Agendamento criado com sucesso:', result);
      return NextResponse.json({
        success: true,
        data: result,
        message: 'Agendamento criado com sucesso'
      });
    }
  } catch (error) {
    console.error('POST /api/agendamentos - Erro ao processar agendamento:', error);
    return handleError(error);
  }
}

export async function DELETE(request) {
  try {
    console.log('DELETE /api/agendamentos - Iniciando processamento');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      console.log('DELETE /api/agendamentos - ID não fornecido');
      return NextResponse.json({
        success: false,
        message: 'ID é obrigatório'
      }, { status: 400 });
    }
    
    console.log(`DELETE /api/agendamentos - Excluindo agendamento ID: ${id}`);
    await agendamentosRepository.delete(id);
    
    console.log(`DELETE /api/agendamentos - Agendamento ID: ${id} excluído com sucesso`);
    return NextResponse.json({
      success: true,
      message: 'Agendamento excluído com sucesso'
    });
  } catch (error) {
    console.error('DELETE /api/agendamentos - Erro:', error);
    return handleError(error);
  }
}

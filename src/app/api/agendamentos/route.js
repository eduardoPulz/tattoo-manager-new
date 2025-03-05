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
    if (!body.nomeCliente || !body.clienteTelefone || !body.funcionarioId || !body.servicoId || !body.horaInicio || !body.horaFim) {
      console.log('POST /api/agendamentos - Campos obrigatórios não fornecidos');
      return NextResponse.json({
        success: false,
        message: 'Todos os campos são obrigatórios'
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
    
    // Mapear os campos do formulário para os campos da tabela (clienteNome vs nomeCliente)
    const agendamentoData = {
      nomeCliente: body.nomeCliente,
      clienteTelefone: body.clienteTelefone,
      funcionarioId: body.funcionarioId,
      servicoId: body.servicoId,
      horaInicio: horaInicio.toISOString(),
      horaFim: horaFim.toISOString()
    };
    
    console.log('POST /api/agendamentos - Criando agendamento:', agendamentoData);
    const novoAgendamento = await agendamentosRepository.create(agendamentoData);
    
    console.log('POST /api/agendamentos - Agendamento criado com sucesso:', novoAgendamento);
    return NextResponse.json({
      success: true,
      data: novoAgendamento,
      message: 'Agendamento criado com sucesso'
    });
  } catch (error) {
    console.error('POST /api/agendamentos - Erro ao criar agendamento:', error);
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
        message: 'ID do agendamento não fornecido'
      }, { status: 400 });
    }
    
    console.log(`DELETE /api/agendamentos - Excluindo agendamento: ${id}`);
    const resultado = await agendamentosRepository.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Agendamento excluído com sucesso'
    });
  } catch (error) {
    console.error('DELETE /api/agendamentos - Erro ao excluir agendamento:', error);
    return handleError(error);
  }
}

import { NextResponse } from 'next/server';
import { agendamentosDb } from '../../lib/postgres';

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
    const agendamentos = await agendamentosDb.getAll();
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
    
    if (!body.clienteNome || !body.clienteTelefone || !body.funcionarioId || !body.servicoId || !body.horaInicio) {
      console.log('POST /api/agendamentos - Campos obrigatórios não fornecidos');
      return NextResponse.json({
        success: false,
        message: 'Todos os campos obrigatórios devem ser preenchidos'
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
      
      if (body.horaFim) {
        console.log(`POST /api/agendamentos - Processando data de fim: ${body.horaFim}`);
        horaFim = new Date(body.horaFim);
        if (isNaN(horaFim.getTime())) {
          throw new Error('Data de fim inválida');
        }
      } else if (body.duracao) {
        console.log(`POST /api/agendamentos - Calculando data de fim com duração: ${body.duracao} minutos`);
        horaFim = new Date(horaInicio.getTime() + parseInt(body.duracao) * 60000);
      } else {
        // Se não tiver hora fim nem duração, assume 1 hora
        console.log('POST /api/agendamentos - Duração não fornecida, assumindo 60 minutos');
        horaFim = new Date(horaInicio.getTime() + 60 * 60000);
      }
    } catch (error) {
      console.error('POST /api/agendamentos - Erro ao processar datas:', error);
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 400 });
    }
    
    // Atualizar ou criar agendamento
    if (body.id) {
      console.log(`POST /api/agendamentos - Atualizando agendamento ID: ${body.id}`);
      const agendamentoAtualizado = await agendamentosDb.update(body.id, {
        clienteNome: body.clienteNome,
        clienteTelefone: body.clienteTelefone,
        funcionarioId: body.funcionarioId,
        servicoId: body.servicoId,
        horaInicio: horaInicio,
        horaFim: horaFim,
        observacoes: body.observacoes
      });
      
      if (!agendamentoAtualizado) {
        console.log(`POST /api/agendamentos - Agendamento ID: ${body.id} não encontrado`);
        return NextResponse.json({
          success: false,
          message: 'Agendamento não encontrado'
        }, { status: 404 });
      }
      
      console.log(`POST /api/agendamentos - Agendamento ID: ${body.id} atualizado com sucesso`);
      return NextResponse.json({
        success: true,
        data: agendamentoAtualizado,
        message: 'Agendamento atualizado com sucesso'
      });
    } else {
      console.log('POST /api/agendamentos - Criando novo agendamento');
      const novoAgendamento = await agendamentosDb.create({
        clienteNome: body.clienteNome,
        clienteTelefone: body.clienteTelefone,
        funcionarioId: body.funcionarioId,
        servicoId: body.servicoId,
        horaInicio: horaInicio,
        horaFim: horaFim,
        observacoes: body.observacoes
      });
      
      console.log(`POST /api/agendamentos - Novo agendamento criado com ID: ${novoAgendamento.id}`);
      return NextResponse.json({
        success: true,
        data: novoAgendamento,
        message: 'Agendamento criado com sucesso'
      }, { status: 201 });
    }
  } catch (error) {
    console.error('POST /api/agendamentos - Erro:', error);
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
    const result = await agendamentosDb.delete(id);
    
    if (!result.success) {
      console.log(`DELETE /api/agendamentos - Erro ao excluir agendamento ID: ${id} - ${result.message}`);
      return NextResponse.json({
        success: false,
        message: result.message || 'Erro ao excluir agendamento'
      }, { status: 400 });
    }
    
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

import { NextResponse } from 'next/server';
import { agendamentosDb } from '../../lib/postgres';

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
    const agendamentos = await agendamentosDb.getAll();
    return NextResponse.json({
      success: true,
      data: agendamentos
    });
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar agendamentos',
      data: []
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.clienteNome || !body.clienteTelefone || !body.funcionarioId || !body.servicoId || !body.horaInicio) {
      return NextResponse.json({
        success: false,
        message: 'Todos os campos obrigatórios devem ser preenchidos'
      }, { status: 400 });
    }
    
    // Processar datas
    const horaInicio = new Date(body.horaInicio);
    
    // Calcular horaFim se não foi fornecida
    let horaFim;
    if (body.horaFim) {
      horaFim = new Date(body.horaFim);
    } else if (body.duracao) {
      horaFim = new Date(horaInicio.getTime() + body.duracao * 60000);
    } else {
      // Padrão: 1 hora
      horaFim = new Date(horaInicio.getTime() + 60 * 60000);
    }
    
    if (body.id) {
      const agendamentoAtualizado = await agendamentosDb.update(body.id, {
        clienteNome: body.clienteNome,
        clienteTelefone: body.clienteTelefone,
        funcionarioId: body.funcionarioId,
        servicoId: body.servicoId,
        horaInicio,
        horaFim,
        observacoes: body.observacoes || ''
      });
      
      if (!agendamentoAtualizado) {
        return NextResponse.json({
          success: false,
          message: 'Agendamento não encontrado'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        data: agendamentoAtualizado,
        message: 'Agendamento atualizado com sucesso'
      });
    } else {
      const novoAgendamento = await agendamentosDb.create({
        clienteNome: body.clienteNome,
        clienteTelefone: body.clienteTelefone,
        funcionarioId: body.funcionarioId,
        servicoId: body.servicoId,
        horaInicio,
        horaFim,
        observacoes: body.observacoes || ''
      });
      
      return NextResponse.json({
        success: true,
        data: novoAgendamento,
        message: 'Agendamento criado com sucesso'
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
    
    const result = await agendamentosDb.delete(id);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message || 'Erro ao excluir agendamento'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Agendamento excluído com sucesso'
    });
  } catch (error) {
    return handleError(error);
  }
}

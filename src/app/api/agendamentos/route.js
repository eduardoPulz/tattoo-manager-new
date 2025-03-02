import { NextResponse } from 'next/server';
import { agendamentosDb, funcionariosDb, servicosDb } from '../../lib/db';

export async function GET() {
  try {
    const agendamentos = agendamentosDb.getAll();
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
    
    const errors = {};
    
    if (!body.nomeCliente) {
      errors.nomeCliente = 'Nome do cliente é obrigatório';
    }
    
    if (!body.funcionarioId) {
      errors.funcionarioId = 'Funcionário é obrigatório';
    } else {
      const funcionario = funcionariosDb.getById(body.funcionarioId);
      if (!funcionario) {
        errors.funcionarioId = 'Funcionário não encontrado';
      }
    }
    
    if (!body.servicoId) {
      errors.servicoId = 'Serviço é obrigatório';
    } else {
      const servico = servicosDb.getById(body.servicoId);
      if (!servico) {
        errors.servicoId = 'Serviço não encontrado';
      }
    }
    
    if (!body.horaInicio) {
      errors.horaInicio = 'Hora de início é obrigatória';
    }
    
    if (!body.horaFim) {
      errors.horaFim = 'Hora de fim é obrigatória';
    }
    
    const horaInicio = new Date(body.horaInicio);
    const horaFim = new Date(body.horaFim);
    
    if (isNaN(horaInicio.getTime())) {
      errors.horaInicio = 'Data de início inválida';
    }
    
    if (isNaN(horaFim.getTime())) {
      errors.horaFim = 'Data de fim inválida';
    }
    
    if (horaInicio && horaFim && horaFim <= horaInicio) {
      errors.horaFim = 'A data de fim deve ser posterior à data de início';
    }
    
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Erros de validação',
        errors
      }, { status: 400 });
    }
    
    if (body.id) {
      const agendamentoAtualizado = agendamentosDb.update(body.id, {
        nomeCliente: body.nomeCliente,
        funcionarioId: body.funcionarioId,
        servicoId: body.servicoId,
        horaInicio: body.horaInicio,
        horaFim: body.horaFim,
      });
      
      if (!agendamentoAtualizado) {
        return NextResponse.json({
          success: false,
          message: 'Agendamento não encontrado'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Agendamento atualizado com sucesso',
        data: agendamentoAtualizado
      });
    }
    
    const novoAgendamento = agendamentosDb.create({
      nomeCliente: body.nomeCliente,
      funcionarioId: body.funcionarioId,
      servicoId: body.servicoId,
      horaInicio: body.horaInicio,
      horaFim: body.horaFim,
    });
    
    console.log('Agendamento criado com sucesso:', novoAgendamento);
    
    return NextResponse.json({
      success: true,
      message: 'Agendamento criado com sucesso',
      data: novoAgendamento
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar/atualizar agendamento:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar/atualizar agendamento',
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
    
    if (id.startsWith('[object')) {
      return NextResponse.json({
        success: false,
        message: 'Formato de ID inválido'
      }, { status: 400 });
    }
    
    const resultado = agendamentosDb.delete(id);
    
    if (!resultado.success) {
      return NextResponse.json({
        success: false,
        message: resultado.message
      }, { status: 409 });
    }
    
    console.log('Agendamento removido com sucesso. ID:', id);
    
    return NextResponse.json({
      success: true,
      message: 'Agendamento removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao excluir agendamento',
      error: error.message
    }, { status: 500 });
  }
}

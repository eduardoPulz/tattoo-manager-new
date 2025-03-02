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
    
    console.log('Dados recebidos para criar agendamento:', body);
    
    // Validar campos obrigatórios
    if (!body.nomeCliente || !body.funcionarioId || !body.servicoId || !body.horaInicio || !body.horaFim) {
      return NextResponse.json({
        success: false,
        message: 'Dados incompletos do agendamento'
      }, { status: 400 });
    }
    
    // Validar existência do funcionário
    const funcionario = funcionariosDb.getById(body.funcionarioId);
    if (!funcionario) {
      return NextResponse.json({
        success: false,
        message: 'Funcionário não encontrado'
      }, { status: 404 });
    }
    
    // Validar existência do serviço
    const servico = servicosDb.getById(body.servicoId);
    if (!servico) {
      return NextResponse.json({
        success: false,
        message: 'Serviço não encontrado'
      }, { status: 404 });
    }
    
    // Validar datas
    const horaInicio = new Date(body.horaInicio);
    const horaFim = new Date(body.horaFim);
    
    if (isNaN(horaInicio.getTime()) || isNaN(horaFim.getTime())) {
      return NextResponse.json({
        success: false,
        message: 'Datas inválidas'
      }, { status: 400 });
    }
    
    if (horaFim <= horaInicio) {
      return NextResponse.json({
        success: false,
        message: 'A data de fim deve ser posterior à data de início'
      }, { status: 400 });
    }
    
    // Criar agendamento
    const novoAgendamento = agendamentosDb.create({
      nomeCliente: body.nomeCliente,
      funcionarioId: body.funcionarioId,
      servicoId: body.servicoId,
      horaInicio: body.horaInicio,
      horaFim: body.horaFim,
      observacoes: body.observacoes || '',
      status: 'Agendado'
    });
    
    console.log('Agendamento criado com sucesso:', novoAgendamento);
    
    return NextResponse.json({
      success: true,
      message: 'Agendamento criado com sucesso',
      data: novoAgendamento
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar agendamento',
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
    
    const resultado = agendamentosDb.delete(id);
    
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

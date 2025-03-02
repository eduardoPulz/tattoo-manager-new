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
      data: [] // Retorna array vazio em caso de erro para não quebrar o frontend
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validar campos obrigatórios
    if (!body.data || !body.funcionarioId || !body.servicoId) {
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
    
    // Criar agendamento
    const novoAgendamento = agendamentosDb.create({
      data: body.data,
      hora: body.hora || '00:00',
      funcionarioId: body.funcionarioId,
      servicoId: body.servicoId,
      clienteNome: body.clienteNome || 'Cliente sem nome',
      clienteEmail: body.clienteEmail || '',
      clienteTelefone: body.clienteTelefone || '',
      observacoes: body.observacoes || '',
      status: body.status || 'Pendente'
    });
    
    return NextResponse.json({
      success: true,
      data: novoAgendamento
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar agendamento'
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
    
    const resultado = agendamentosDb.delete(id);
    
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

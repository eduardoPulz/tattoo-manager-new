import { NextResponse } from 'next/server';
import { AgendamentoService } from '@/services/agendamentoService';

export async function GET(request) {
  try {
    const agendamentos = await AgendamentoService.listarTodos();
    return NextResponse.json(agendamentos);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const dados = await request.json();
    const agendamento = await AgendamentoService.criar(dados);
    return NextResponse.json(agendamento, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const dados = await request.json();
    
    const agendamento = await AgendamentoService.atualizar(id, dados);
    return NextResponse.json(agendamento);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await AgendamentoService.excluir(id);
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

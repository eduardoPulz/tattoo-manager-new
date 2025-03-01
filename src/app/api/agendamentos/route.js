import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

// API simplificada de agendamentos
export async function GET() {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        funcionario: true,
        servico: true
      },
      orderBy: { data: 'asc' }
    });
    return NextResponse.json(agendamentos);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar agendamentos: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const dados = await request.json();
    const agendamento = await prisma.agendamento.create({
      data: {
        data: new Date(dados.data),
        nomeCliente: dados.nomeCliente,
        funcionarioId: parseInt(dados.funcionarioId),
        servicoId: parseInt(dados.servicoId)
      },
      include: {
        funcionario: true,
        servico: true
      }
    });
    return NextResponse.json(agendamento, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar agendamento: ' + error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    const dados = await request.json();
    
    const agendamento = await prisma.agendamento.update({
      where: { id },
      data: {
        data: new Date(dados.data),
        nomeCliente: dados.nomeCliente,
        funcionarioId: parseInt(dados.funcionarioId),
        servicoId: parseInt(dados.servicoId)
      },
      include: {
        funcionario: true,
        servico: true
      }
    });
    
    return NextResponse.json(agendamento);
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar agendamento: ' + error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    
    await prisma.agendamento.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir agendamento: ' + error.message },
      { status: 400 }
    );
  }
}

import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

// API simplificada de serviços
export async function GET() {
  try {
    const servicos = await prisma.servico.findMany();
    return NextResponse.json(servicos);
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    return NextResponse.json(
      { error: 'Erro ao listar serviços: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const dados = await request.json();
    const servico = await prisma.servico.create({
      data: {
        nome: dados.nome,
        preco: parseFloat(dados.preco),
        duracao: parseInt(dados.duracao)
      }
    });
    return NextResponse.json(servico, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao criar serviço: ' + error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    const dados = await request.json();
    
    const servico = await prisma.servico.update({
      where: { id },
      data: {
        nome: dados.nome,
        preco: parseFloat(dados.preco),
        duracao: parseInt(dados.duracao)
      }
    });
    
    return NextResponse.json(servico);
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar serviço: ' + error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    
    await prisma.servico.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir serviço: ' + error.message },
      { status: 400 }
    );
  }
}

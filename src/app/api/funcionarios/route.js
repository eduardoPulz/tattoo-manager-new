import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

// API simplificada de funcionários
export async function GET() {
  try {
    const funcionarios = await prisma.funcionario.findMany();
    return NextResponse.json(funcionarios);
  } catch (error) {
    console.error('Erro ao listar funcionários:', error);
    return NextResponse.json(
      { error: 'Erro ao listar funcionários: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const dados = await request.json();
    const funcionario = await prisma.funcionario.create({
      data: {
        nome: dados.nome,
        cargo: dados.cargo,
        email: dados.email
      }
    });
    return NextResponse.json(funcionario, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    return NextResponse.json(
      { error: 'Erro ao criar funcionário: ' + error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    const dados = await request.json();
    
    const funcionario = await prisma.funcionario.update({
      where: { id },
      data: {
        nome: dados.nome,
        cargo: dados.cargo,
        email: dados.email
      }
    });
    
    return NextResponse.json(funcionario);
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar funcionário: ' + error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    
    await prisma.funcionario.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir funcionário: ' + error.message },
      { status: 400 }
    );
  }
}

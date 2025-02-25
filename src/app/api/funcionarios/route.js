import { NextResponse } from 'next/server';
import { FuncionarioService } from '@/services/funcionarioService';

export async function GET(request) {
  try {
    const funcionarios = await FuncionarioService.listarTodos();
    return NextResponse.json(funcionarios);
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
    const funcionario = await FuncionarioService.criar(dados);
    return NextResponse.json(funcionario, { status: 201 });
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
    
    const funcionario = await FuncionarioService.atualizar(id, dados);
    return NextResponse.json(funcionario);
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
    
    await FuncionarioService.excluir(id);
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

import { NextResponse } from 'next/server';
import { ServicoService } from '@/services/servicoService';

export async function GET(request) {
  try {
    const servicos = await ServicoService.listarTodos();
    return NextResponse.json(servicos);
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
    const servico = await ServicoService.criar(dados);
    return NextResponse.json(servico, { status: 201 });
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
    
    const servico = await ServicoService.atualizar(id, dados);
    return NextResponse.json(servico);
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
    
    await ServicoService.excluir(id);
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

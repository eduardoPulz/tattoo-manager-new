import { NextResponse } from 'next/server';
import { funcionariosDb, servicosDb, agendamentosDb } from '../../lib/db';

export async function GET() {
  try {
    const funcionarios = funcionariosDb.getAll();
    const servicos = servicosDb.getAll();
    const agendamentos = agendamentosDb.getAll();

    return NextResponse.json({
      success: true,
      data: {
        funcionarios,
        servicos,
        agendamentos,
        sistema: {
          versao: '2.0',
          ambiente: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar dados',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { tipo, dados } = await request.json();
    
    if (!tipo || !dados) {
      return NextResponse.json({
        success: false,
        message: 'Tipo e dados são obrigatórios'
      }, { status: 400 });
    }

    let resultado;
    
    switch (tipo) {
      case 'funcionario':
        resultado = funcionariosDb.create(dados);
        break;
      
      case 'servico':
        resultado = servicosDb.create(dados);
        break;
      
      case 'agendamento':
        resultado = agendamentosDb.create(dados);
        break;
      
      default:
        return NextResponse.json({
          success: false,
          message: `Tipo inválido: ${tipo}`
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      data: resultado
    });
  } catch (error) {
    console.error('Erro ao criar registro:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar registro',
      error: error.message
    }, { status: 500 });
  }
}

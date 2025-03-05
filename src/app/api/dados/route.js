const { NextResponse } = require('next/server');
const { funcionariosDb, servicosDb, agendamentosDb } = require('../../lib/postgres');

async function GET() {
  try {
    const funcionarios = funcionariosDb.getAll();
    const servicos = servicosDb.getAll();
    const agendamentos = agendamentosDb.getAll();
    
    const [funcionariosData, servicosData, agendamentosData] = await Promise.all([
      funcionarios,
      servicos,
      agendamentos
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        funcionarios: funcionariosData,
        servicos: servicosData,
        agendamentos: agendamentosData,
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
      message: 'Erro ao processar solicitação',
      error: error.message
    }, { status: 500 });
  }
}

async function POST(request) {
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
        resultado = await funcionariosDb.create(dados);
        break;
      case 'servico':
        resultado = await servicosDb.create(dados);
        break;
      case 'agendamento':
        resultado = await agendamentosDb.create(dados);
        break;
      default:
        return NextResponse.json({
          success: false,
          message: 'Tipo inválido'
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      data: resultado
    });
  } catch (error) {
    console.error('Erro ao processar dados:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao processar solicitação',
      error: error.message
    }, { status: 500 });
  }
}

module.exports = { GET, POST };

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Criar uma instância direta do PrismaClient para essa API
const prisma = new PrismaClient();

export async function GET() {
  try {
    // Buscar todos os dados de cada modelo
    const [funcionarios, servicos, agendamentos] = await Promise.all([
      prisma.funcionario.findMany(),
      prisma.servico.findMany(),
      prisma.agendamento.findMany()
    ]);

    // Criar dados de teste se necessário
    if (funcionarios.length === 0) {
      await prisma.funcionario.create({
        data: {
          nome: 'Funcionário Teste',
          cargo: 'Tatuador',
          email: 'teste@exemplo.com'
        }
      });
    }

    if (servicos.length === 0) {
      await prisma.servico.create({
        data: {
          nome: 'Tatuagem Pequena',
          preco: 150.0,
          duracao: 60
        }
      });
    }

    // Buscar os dados novamente após possíveis inserções
    const dadosAtualizados = {
      funcionarios: await prisma.funcionario.findMany(),
      servicos: await prisma.servico.findMany(),
      agendamentos: await prisma.agendamento.findMany()
    };

    return NextResponse.json({
      success: true,
      data: dadosAtualizados,
      info: {
        env: process.env.NODE_ENV,
        database: process.env.POSTGRES_PRISMA_URL ? 'Configurado' : 'Não configurado',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro na API de dados:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        code: error.code,
        stack: error.stack
      }
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { tipo, dados } = await request.json();

    let resultado;

    // Criar novo registro baseado no tipo
    switch (tipo) {
      case 'funcionario':
        resultado = await prisma.funcionario.create({
          data: {
            nome: dados.nome || 'Nome padrão',
            cargo: dados.cargo || 'Cargo padrão',
            email: dados.email || 'email@padrao.com'
          }
        });
        break;
      
      case 'servico':
        resultado = await prisma.servico.create({
          data: {
            nome: dados.nome || 'Serviço padrão',
            preco: parseFloat(dados.preco || 100),
            duracao: parseInt(dados.duracao || 60)
          }
        });
        break;
      
      case 'agendamento':
        resultado = await prisma.agendamento.create({
          data: {
            data: new Date(dados.data || new Date()),
            nomeCliente: dados.nomeCliente || 'Cliente padrão',
            funcionarioId: parseInt(dados.funcionarioId || 1),
            servicoId: parseInt(dados.servicoId || 1)
          }
        });
        break;
      
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Tipo não reconhecido. Use: funcionario, servico ou agendamento' 
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: resultado
    }, { status: 201 });
  } catch (error) {
    console.error(`Erro ao criar ${request.tipo}:`, error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        code: error.code
      }
    }, { status: 400 });
  }
}

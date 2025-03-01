import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Criar uma instância direta do PrismaClient para essa API
const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('API /dados iniciada');
    console.log('Versão do Node:', process.version);
    console.log('Variáveis de ambiente:', {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.POSTGRES_PRISMA_URL ? 'Configurado' : 'Ausente',
      DIRECT_URL: process.env.POSTGRES_URL_NON_POOLING ? 'Configurado' : 'Ausente',
    });

    // Tentar conectar ao banco
    console.log('Tentando conectar ao banco de dados...');
    await prisma.$connect();
    console.log('Conexão com o banco estabelecida com sucesso!');

    // Verificar tabelas existentes
    console.log('Verificando tabelas no banco de dados...');
    
    // Buscar todos os dados de cada modelo
    console.log('Buscando dados...');
    const [funcionarios, servicos, agendamentos] = await Promise.all([
      prisma.funcionario.findMany(),
      prisma.servico.findMany(),
      prisma.agendamento.findMany()
    ]);

    console.log(`Dados encontrados: ${funcionarios.length} funcionários, ${servicos.length} serviços, ${agendamentos.length} agendamentos`);

    // Criar dados de teste se necessário
    if (funcionarios.length === 0) {
      console.log('Criando funcionário de teste...');
      await prisma.funcionario.create({
        data: {
          nome: 'Funcionário Teste',
          cargo: 'Tatuador',
          email: 'teste@exemplo.com'
        }
      });
    }

    if (servicos.length === 0) {
      console.log('Criando serviço de teste...');
      await prisma.servico.create({
        data: {
          nome: 'Tatuagem Pequena',
          preco: 150.0,
          duracao: 60
        }
      });
    }

    // Buscar os dados novamente após possíveis inserções
    console.log('Buscando dados atualizados...');
    const dadosAtualizados = {
      funcionarios: await prisma.funcionario.findMany(),
      servicos: await prisma.servico.findMany(),
      agendamentos: await prisma.agendamento.findMany()
    };

    console.log('API /dados concluída com sucesso');
    
    return NextResponse.json({
      success: true,
      data: dadosAtualizados,
      info: {
        env: process.env.NODE_ENV,
        database: process.env.POSTGRES_PRISMA_URL ? 'Configurado' : 'Não configurado',
        direct_url: process.env.POSTGRES_URL_NON_POOLING ? 'Configurado' : 'Não configurado',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('ERRO CRÍTICO na API de dados:', error);
    console.error('Nome do erro:', error.name);
    console.error('Código do erro:', error.code);
    console.error('Stack trace:', error.stack);
    
    if (error.meta) {
      console.error('Metadados do erro:', JSON.stringify(error.meta));
    }
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        code: error.code,
        stack: error.stack,
        meta: error.meta || {}
      }
    }, { status: 500 });
  } finally {
    // Desconectar o prisma para evitar conexões pendentes
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    console.log('API /dados (POST) iniciada');
    const { tipo, dados } = await request.json();
    console.log(`Criando novo registro do tipo: ${tipo}`, dados);

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
        console.log(`Tipo inválido: ${tipo}`);
        return NextResponse.json({ 
          success: false, 
          error: 'Tipo não reconhecido. Use: funcionario, servico ou agendamento' 
        }, { status: 400 });
    }

    console.log('Registro criado com sucesso:', resultado);
    console.log('API /dados (POST) concluída');

    return NextResponse.json({
      success: true,
      data: resultado
    }, { status: 201 });
  } catch (error) {
    console.error(`ERRO na API /dados (POST):`, error);
    console.error('Nome do erro:', error.name);
    console.error('Código do erro:', error.code);
    console.error('Stack trace:', error.stack);
    
    if (error.meta) {
      console.error('Metadados do erro:', JSON.stringify(error.meta));
    }
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        code: error.code,
        stack: error.stack,
        meta: error.meta || {}
      }
    }, { status: 400 });
  } finally {
    // Desconectar o prisma para evitar conexões pendentes
    await prisma.$disconnect();
  }
}

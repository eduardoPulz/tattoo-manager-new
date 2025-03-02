import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error'],
});

export async function GET() {
  try {
    // Tenta criar um registro de teste para verificar se o banco está funcionando
    await prisma.funcionario.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nome: 'Teste API',
        cargo: 'Tatuador',
        email: 'teste@api.com'
      }
    });

    // Também tenta criar um serviço de teste
    await prisma.servico.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nome: 'Serviço Teste',
        preco: 100.0,
        duracao: 60
      }
    });

    // Busca registros para verificar se está acessível
    const funcionarios = await prisma.funcionario.count();
    const servicos = await prisma.servico.count();
    const agendamentos = await prisma.agendamento.count();
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Sistema funcionando corretamente',
      timestamp: new Date().toISOString(),
      contagem: {
        funcionarios,
        servicos,
        agendamentos
      },
      ambiente: {
        node_env: process.env.NODE_ENV || 'development',
        database_url: process.env.DATABASE_URL ? 'Configurado' : 'Ausente',
      }
    });
  } catch (error) {
    console.error('Erro no teste de API:', error);
    return NextResponse.json({ 
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

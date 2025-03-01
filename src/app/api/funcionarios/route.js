import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Criar uma instância direta do PrismaClient aqui para isolamento total
const localPrisma = new PrismaClient();

export async function GET() {
  try {
    // Tentar criar um registro de teste para verificar se está funcionando
    await localPrisma.funcionario.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nome: 'Funcionário Teste API',
        cargo: 'Tatuador',
        email: 'funcionario@teste.com'
      }
    });
    
    // Buscar todos os funcionários
    const funcionarios = await localPrisma.funcionario.findMany();
    
    return NextResponse.json({
      success: true,
      data: funcionarios,
      message: 'API direta de funcionários funcionando'
    });
  } catch (error) {
    console.error('Erro crítico na API de funcionários:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      code: error.code || 'UNKNOWN',
      meta: error.meta || {},
      clientVersion: error.clientVersion || 'N/A'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const dados = await request.json();
    
    // Criar funcionário com dados mínimos
    const funcionario = await localPrisma.funcionario.create({
      data: {
        nome: dados.nome || 'Nome padrão',
        cargo: dados.cargo || 'Cargo padrão',
        email: dados.email || 'email@padrao.com'
      }
    });
    
    return NextResponse.json({
      success: true,
      data: funcionario
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      code: error.code || 'UNKNOWN'
    }, { status: 400 });
  }
}

const { NextResponse } = require('next/server');
const { funcionariosDb, servicosDb, agendamentosDb } = require('../../lib/postgres');

export async function GET() {
  try {
    console.log('Testando conexão com o banco de dados PostgreSQL...');
    
    // Verificar conexão com o banco de dados
    const funcionarios = await funcionariosDb.getAll();
    const servicos = await servicosDb.getAll();
    const agendamentos = await agendamentosDb.getAll();
    
    // Criar dados de teste se necessário
    if (funcionarios.length === 0) {
      await funcionariosDb.create({
        nome: 'Teste API',
        especialidade: 'Tatuador',
        telefone: '(11) 99999-9999'
      });
    }
    
    if (servicos.length === 0) {
      await servicosDb.create({
        nome: 'Tatuagem Pequena',
        descricao: 'Tatuagem de até 5cm',
        preco: 150.00,
        duracao: 60
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Conexão com o banco de dados PostgreSQL estabelecida com sucesso',
      data: {
        funcionarios: funcionarios.length,
        servicos: servicos.length,
        agendamentos: agendamentos.length
      },
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'Configurado' : 'Não configurado',
        NODE_ENV: process.env.NODE_ENV || 'development',
        VERCEL: process.env.VERCEL || 'local'
      }
    });
  } catch (error) {
    console.error('Erro ao testar conexão com o banco de dados:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao conectar ao banco de dados PostgreSQL',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : null,
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'Configurado' : 'Não configurado',
        NODE_ENV: process.env.NODE_ENV || 'development',
        VERCEL: process.env.VERCEL || 'local'
      }
    }, { status: 500 });
  }
}

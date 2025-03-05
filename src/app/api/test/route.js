const { NextResponse } = require('next/server');
const funcionariosDb = require('../../lib/db').funcionariosDb;
const servicosDb = require('../../lib/db').servicosDb;
const agendamentosDb = require('../../lib/db').agendamentosDb;
const fs = require('fs');
const path = require('path');

async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbExists = fs.existsSync(dbPath);
    
    if (dbExists) {
      const funcionarios = funcionariosDb.getAll();
      if (funcionarios.length === 0) {
        funcionariosDb.create({
          nome: 'Teste API',
          cargo: 'Tatuador',
          email: 'teste@api.com'
        });
      }
      
      const servicos = servicosDb.getAll();
      if (servicos.length === 0) {
        servicosDb.create({
          nome: 'Serviço Teste',
          preco: 100.0,
          duracao: 60
        });
      }
    }
    
    const funcionariosCount = funcionariosDb.getAll().length;
    const servicosCount = servicosDb.getAll().length;
    const agendamentosCount = agendamentosDb.getAll().length;
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Sistema funcionando corretamente',
      timestamp: new Date().toISOString(),
      banco: {
        arquivoExiste: dbExists,
        caminho: dbPath
      },
      contagem: {
        funcionarios: funcionariosCount,
        servicos: servicosCount,
        agendamentos: agendamentosCount
      },
      ambiente: {
        node_env: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error) {
    console.error('Erro na API de teste:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Erro ao testar a aplicação',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

module.exports = { GET };

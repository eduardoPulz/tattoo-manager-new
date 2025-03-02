import { NextResponse } from 'next/server';
import { funcionariosDb, servicosDb, agendamentosDb } from '../../lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Verificar e criar o arquivo de banco de dados se não existir
    const dbPath = path.join(process.cwd(), 'db.json');
    let dbExists = fs.existsSync(dbPath);
    
    if (!dbExists) {
      // Criar arquivo com estrutura inicial
      const initialDb = {
        funcionarios: [],
        servicos: [],
        agendamentos: []
      };
      
      fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2));
      dbExists = true;
    }
    
    // Verificar e criar dados iniciais se necessário
    const funcionarios = funcionariosDb.getAll();
    const servicos = servicosDb.getAll();
    
    // Criar funcionário padrão se não existir nenhum
    if (funcionarios.length === 0) {
      funcionariosDb.create({
        nome: 'Tatuador Padrão',
        cargo: 'Tatuador',
        email: 'tatuador@exemplo.com'
      });
    }
    
    // Criar serviço padrão se não existir nenhum
    if (servicos.length === 0) {
      servicosDb.create({
        nome: 'Tatuagem Pequena',
        preco: 150,
        duracao: 60
      });
    }
    
    // Buscar dados atualizados
    const dadosAtualizados = {
      funcionarios: funcionariosDb.getAll(),
      servicos: servicosDb.getAll(),
      agendamentos: agendamentosDb.getAll()
    };
    
    return NextResponse.json({
      success: true,
      message: 'Sistema inicializado com sucesso',
      data: dadosAtualizados
    });
  } catch (error) {
    console.error('Erro ao inicializar sistema:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao inicializar sistema',
      error: error.message
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { funcionariosDb, servicosDb, agendamentosDb } from '../../lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    let dbExists = fs.existsSync(dbPath);
    
    if (!dbExists) {
      const initialDb = {
        funcionarios: [],
        servicos: [],
        agendamentos: []
      };
      
      fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2));
      dbExists = true;
    }
    
    const funcionarios = funcionariosDb.getAll();
    const servicos = servicosDb.getAll();
    
    if (funcionarios.length === 0) {
      funcionariosDb.create({
        nome: 'Tatuador Padrão',
        cargo: 'Tatuador',
        email: 'tatuador@exemplo.com'
      });
    }
    
    if (servicos.length === 0) {
      servicosDb.create({
        nome: 'Tatuagem Pequena',
        preco: 150,
        duracao: 60
      });
    }
    
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

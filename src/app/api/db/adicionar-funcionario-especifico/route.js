import { NextResponse } from 'next/server';
import db from '../../../lib/db';

// Definir que esta rota não usa o Edge Runtime
export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('GET /api/db/adicionar-funcionario-especifico - Iniciando adição de funcionário específico');
    
    // ID específico que está sendo usado no frontend
    const funcionarioId = 'ceee2ce9-9521-4ef2-87a1-b1a289a262a9';
    
    // Verificar se já existe um funcionário com esse ID
    const funcionarioExistente = await db.query('SELECT id FROM funcionarios WHERE id = $1', [funcionarioId]);
    
    // Se não existir, adicionar o funcionário
    if (funcionarioExistente.rows.length === 0) {
      const resultado = await db.query(
        `INSERT INTO funcionarios (id, nome, especialidade, telefone)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [funcionarioId, 'Funcionário Específico', 'Tatuagem', '(44) 99999-8888']
      );
      
      console.log('Funcionário adicionado com ID específico:', resultado.rows[0]);
      
      return NextResponse.json({
        success: true,
        message: 'Funcionário específico adicionado com sucesso',
        data: resultado.rows[0]
      });
    } else {
      console.log('Funcionário com esse ID já existe');
      
      return NextResponse.json({
        success: true,
        message: 'Funcionário com esse ID já existe',
        data: funcionarioExistente.rows[0]
      });
    }
  } catch (error) {
    console.error('Erro ao adicionar funcionário específico:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao adicionar funcionário específico',
      error: error.message
    }, { status: 500 });
  }
}

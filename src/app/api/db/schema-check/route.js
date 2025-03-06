import { NextResponse } from 'next/server';
import db from '../../../lib/db';

// Definir que esta rota não usa o Edge Runtime
export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('GET /api/db/schema-check - Verificando schema das tabelas');
    
    // Verificar schema da tabela de funcionários
    const funcionariosSchema = await db.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'funcionarios' 
      ORDER BY ordinal_position;
    `);
    
    // Verificar schema da tabela de serviços
    const servicosSchema = await db.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'servicos' 
      ORDER BY ordinal_position;
    `);
    
    // Verificar schema da tabela de agendamentos
    const agendamentosSchema = await db.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'agendamentos' 
      ORDER BY ordinal_position;
    `);
    
    // Verificar chaves estrangeiras da tabela de agendamentos
    const foreignKeys = await db.query(`
      SELECT
        tc.constraint_name,
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu 
          ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='agendamentos';
    `);
    
    return NextResponse.json({
      success: true,
      data: {
        funcionarios: funcionariosSchema.rows,
        servicos: servicosSchema.rows,
        agendamentos: agendamentosSchema.rows,
        foreignKeys: foreignKeys.rows
      }
    });
  } catch (error) {
    console.error('Erro ao verificar schema das tabelas:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao verificar schema das tabelas',
      error: error.message
    }, { status: 500 });
  }
}

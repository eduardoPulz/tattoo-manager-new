import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import 'dotenv/config';

export async function GET() {
  console.log('Verificando status do banco de dados...');
  
  // Configuração do pool de conexões
  const poolConfig = {
    connectionString: process.env.DATABASE_URL,
  };

  // Adiciona SSL apenas em produção (Vercel)
  if (process.env.VERCEL === '1') {
    poolConfig.ssl = {
      rejectUnauthorized: false
    };
  }

  // Criar pool de conexões
  const pool = new Pool(poolConfig);
  
  try {
    // Verificar conexão
    const client = await pool.connect();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    
    // Verificar tabelas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    // Verificar dados
    const funcionariosCount = await client.query('SELECT COUNT(*) FROM funcionarios');
    const servicosCount = await client.query('SELECT COUNT(*) FROM servicos');
    const agendamentosCount = await client.query('SELECT COUNT(*) FROM agendamentos');
    
    // Liberar cliente
    client.release();
    
    // Encerrar pool
    await pool.end();
    
    return NextResponse.json({
      success: true,
      message: 'Banco de dados está operacional',
      tables: tables.rows.map(row => row.table_name),
      counts: {
        funcionarios: parseInt(funcionariosCount.rows[0].count),
        servicos: parseInt(servicosCount.rows[0].count),
        agendamentos: parseInt(agendamentosCount.rows[0].count)
      },
      env: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasDbUrl: !!process.env.DATABASE_URL
      }
    });
  } catch (error) {
    console.error('Erro ao verificar status do banco de dados:', error);
    
    try {
      // Encerrar pool mesmo em caso de erro
      await pool.end();
    } catch (endError) {
      console.error('Erro ao encerrar pool:', endError);
    }
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao verificar status do banco de dados',
      error: error.message,
      stack: error.stack,
      env: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasDbUrl: !!process.env.DATABASE_URL
      }
    }, { status: 500 });
  }
}

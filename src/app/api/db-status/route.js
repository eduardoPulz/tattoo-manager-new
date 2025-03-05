const { NextResponse } = require('next/server');
const { Pool } = require('pg');
require('dotenv/config');

async function GET() {
  let client;
  try {
    console.log('GET /api/db-status - Verificando status do banco de dados');
    
    // Configuração do pool de conexões
    const poolConfig = {
      connectionString: process.env.DATABASE_URL,
      max: 1,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    };

    // Adiciona SSL em produção
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
      console.log('Ambiente de produção detectado, configurando SSL');
      poolConfig.ssl = {
        rejectUnauthorized: false
      };
    }
    
    console.log('Configuração do pool:', JSON.stringify({
      ...poolConfig,
      connectionString: poolConfig.connectionString ? 'CONFIGURADO' : 'NÃO CONFIGURADO'
    }, null, 2));
    
    const pool = new Pool(poolConfig);
    client = await pool.connect();
    
    // Executar uma consulta simples para testar a conexão
    const result = await client.query('SELECT NOW() as time');
    const time = result.rows[0].time;
    
    console.log(`GET /api/db-status - Conexão bem-sucedida, hora do banco: ${time}`);
    
    return NextResponse.json({
      success: true,
      message: 'Conexão com o banco de dados estabelecida com sucesso',
      data: {
        time,
        config: {
          host: process.env.PGHOST || 'não configurado',
          database: process.env.PGDATABASE || 'não configurado',
          user: process.env.PGUSER ? 'configurado' : 'não configurado',
          ssl: process.env.PGSSLMODE || 'não configurado',
          url: process.env.DATABASE_URL ? 'configurado' : 'não configurado'
        }
      }
    });
  } catch (error) {
    console.error('GET /api/db-status - Erro ao conectar ao banco de dados:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao conectar ao banco de dados',
      error: error.message,
      config: {
        host: process.env.PGHOST || 'não configurado',
        database: process.env.PGDATABASE || 'não configurado',
        user: process.env.PGUSER ? 'configurado' : 'não configurado',
        ssl: process.env.PGSSLMODE || 'não configurado',
        url: process.env.DATABASE_URL ? 'configurado' : 'não configurado'
      }
    }, { status: 500 });
  } finally {
    if (client) {
      client.release();
      console.log('GET /api/db-status - Cliente liberado');
    }
  }
}

module.exports = { GET };

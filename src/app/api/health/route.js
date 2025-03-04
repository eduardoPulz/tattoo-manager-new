import { NextResponse } from 'next/server';
import { funcionariosDb, servicosDb, agendamentosDb } from '../../lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    
    let dbStatus = 'unknown';
    
    if (process.env.VERCEL === '1') {
      dbStatus = 'memory';
    } else {
      dbStatus = fs.existsSync(dbPath) ? 'file' : 'not found';
    }
    
    const funcionariosCount = funcionariosDb.getAll().length;
    const servicosCount = servicosDb.getAll().length;
    const agendamentosCount = agendamentosDb.getAll().length;
    
    const environment = process.env.NODE_ENV || 'development';
    const isVercel = process.env.VERCEL === '1';
    
    return NextResponse.json({
      status: 'healthy',
      database: {
        type: dbStatus,
        accessible: true
      },
      timestamp: new Date().toISOString(),
      environment: environment,
      deployment: {
        platform: isVercel ? 'vercel' : 'local',
        vercel: isVercel ? true : false,
        vercelEnv: process.env.VERCEL_ENV || 'none'
      },
      records: {
        funcionarios: funcionariosCount,
        servicos: servicosCount,
        agendamentos: agendamentosCount
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Erro de healthcheck:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

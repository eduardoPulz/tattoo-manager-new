import { NextResponse } from 'next/server';
import { funcionariosDb, servicosDb, agendamentosDb } from '../../lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbExists = fs.existsSync(dbPath);
    
    const funcionariosCount = funcionariosDb.getAll().length;
    const servicosCount = servicosDb.getAll().length;
    const agendamentosCount = agendamentosDb.getAll().length;
    
    const environment = process.env.NODE_ENV || 'development';
    const port = process.env.PORT || '3000';
    const railwayPublicDomain = process.env.RAILWAY_PUBLIC_DOMAIN || 'not-deployed';
    
    return NextResponse.json({
      status: 'healthy',
      database: dbExists ? 'accessible' : 'not found',
      timestamp: new Date().toISOString(),
      environment: environment,
      deployment: {
        port: port,
        domain: railwayPublicDomain
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

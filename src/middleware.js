import { NextResponse } from 'next/server';
import { initDatabase } from './app/lib/postgres';

let databaseInitialized = false;

export async function middleware(request) {
  // Inicializar o banco de dados apenas uma vez
  if (!databaseInitialized) {
    try {
      console.log('Middleware: Inicializando banco de dados PostgreSQL...');
      const result = await initDatabase();
      
      if (result.success) {
        console.log('Middleware: Banco de dados PostgreSQL inicializado com sucesso!');
        databaseInitialized = true;
      } else {
        console.error('Middleware: Erro ao inicializar o banco de dados:', result.error);
      }
    } catch (error) {
      console.error('Middleware: Erro inesperado ao inicializar o banco de dados:', error);
    }
  }
  
  return NextResponse.next();
}

// Configurar o middleware para ser executado apenas em produção e apenas uma vez
export const config = {
  matcher: '/:path*',
};

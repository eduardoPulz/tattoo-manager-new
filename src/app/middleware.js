import { NextResponse } from 'next/server';
import { initDatabase } from './lib/postgres';

let dbInitialized = false;

export async function middleware(request) {
  // Inicializar o banco de dados apenas uma vez
  if (!dbInitialized) {
    try {
      console.log('Middleware: Inicializando banco de dados...');
      await initDatabase();
      dbInitialized = true;
      console.log('Middleware: Banco de dados inicializado com sucesso');
    } catch (error) {
      console.error('Middleware: Erro ao inicializar banco de dados:', error);
      // Continuar com a requisição mesmo em caso de erro
      // para não bloquear o funcionamento da aplicação
    }
  }

  // Continuar com a requisição
  return NextResponse.next();
}

// Configurar o middleware para ser executado em rotas específicas
export const config = {
  matcher: [
    // Aplicar a todas as rotas da API exceto a rota de inicialização
    '/api/:path*',
    // Aplicar a rotas específicas que precisam do banco de dados
    '/(admin|funcionarios|servicos|agendamentos|estatisticas)/:path*'
  ],
};

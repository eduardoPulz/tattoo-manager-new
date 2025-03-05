import { NextResponse } from 'next/server';
import { initDatabase } from './app/lib/postgres';

// Variável para controlar a inicialização do banco de dados
let databaseInitialized = false;
let initializationInProgress = false;
let initializationError = null;

export async function middleware(request) {
  // Não inicializar o banco de dados para requisições de assets estáticos
  if (
    request.nextUrl.pathname.startsWith('/_next') || 
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }
  
  // Se já inicializou com sucesso, apenas prosseguir
  if (databaseInitialized) {
    return NextResponse.next();
  }
  
  // Se já tentou inicializar e falhou, retornar erro
  if (initializationError) {
    console.error('Middleware: Erro anterior ao inicializar banco de dados:', initializationError);
    
    // Se for uma rota de API, retornar erro JSON
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({
        success: false,
        message: 'Erro ao inicializar banco de dados',
        error: initializationError.message
      }, { status: 500 });
    }
    
    // Para outras rotas, apenas prosseguir (o erro será tratado na UI)
    return NextResponse.next();
  }
  
  // Evitar múltiplas inicializações simultâneas
  if (initializationInProgress) {
    console.log('Middleware: Inicialização do banco de dados em andamento...');
    return NextResponse.next();
  }
  
  // Inicializar o banco de dados
  try {
    console.log('Middleware: Inicializando banco de dados PostgreSQL...');
    initializationInProgress = true;
    
    const result = await initDatabase();
    
    if (result.success) {
      console.log('Middleware: Banco de dados PostgreSQL inicializado com sucesso!');
      databaseInitialized = true;
      initializationInProgress = false;
    } else {
      console.error('Middleware: Erro ao inicializar o banco de dados:', result.error);
      initializationError = new Error(result.error?.message || 'Falha na inicialização do banco de dados');
      initializationInProgress = false;
      
      // Se for uma rota de API, retornar erro JSON
      if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.json({
          success: false,
          message: 'Erro ao inicializar banco de dados',
          error: initializationError.message
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Middleware: Erro inesperado ao inicializar o banco de dados:', error);
    initializationError = error;
    initializationInProgress = false;
    
    // Se for uma rota de API, retornar erro JSON
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({
        success: false,
        message: 'Erro inesperado ao inicializar banco de dados',
        error: error.message
      }, { status: 500 });
    }
  }
  
  return NextResponse.next();
}

// Configurar o middleware para ser executado apenas em produção e apenas uma vez
export const config = {
  matcher: [
    // Aplicar a todas as rotas exceto assets estáticos
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
};

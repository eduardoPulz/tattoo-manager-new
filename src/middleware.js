import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    // Excluir apenas assets estáticos e imagens
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
};

export default function middleware(request) {
  // Simplesmente passa a requisição adiante
  return NextResponse.next();
}

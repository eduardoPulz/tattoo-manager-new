import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const recentSchedules = await prisma.agendamento.findMany({
      take: 5,
      orderBy: {
        horaInicio: 'desc'
      },
      include: {
        servico: true,
        funcionario: true
      }
    });
    
    return NextResponse.json(recentSchedules);
    
  } catch (error) {
    console.error('Erro ao buscar agendamentos recentes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar agendamentos recentes' },
      { status: 500 }
    );
  }
}

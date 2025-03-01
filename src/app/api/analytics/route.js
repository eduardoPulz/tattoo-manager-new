import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Esta API é chamada pelo cron job configurado no vercel.json
// Ela realiza análises e limpeza de dados para manter a performance do banco

export async function GET() {
  try {
    // Obtém estatísticas do banco de dados
    const [
      totalFuncionarios,
      totalServicos,
      totalAgendamentos,
      agendamentosHoje
    ] = await Promise.all([
      prisma.funcionario.count(),
      prisma.servico.count(),
      prisma.agendamento.count(),
      prisma.agendamento.count({
        where: {
          horaInicio: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      })
    ]);

    // Limpa agendamentos antigos (opcional - remova se quiser manter histórico completo)
    // const umMesAtras = new Date();
    // umMesAtras.setMonth(umMesAtras.getMonth() - 1);
    // await prisma.agendamento.deleteMany({
    //   where: {
    //     horaFim: {
    //       lt: umMesAtras
    //     }
    //   }
    // });

    // Retorna estatísticas
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      stats: {
        totalFuncionarios,
        totalServicos,
        totalAgendamentos,
        agendamentosHoje
      }
    });
  } catch (error) {
    console.error('Erro na API de analytics:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

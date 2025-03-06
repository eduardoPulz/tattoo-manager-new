const db = require('../../lib/db');

export async function GET(request) {
  try {
    // Buscar agendamentos com informações completas
    const agendamentosResult = await db.query(`
      SELECT 
        a.*
      FROM 
        agendamentos a
      ORDER BY 
        a."horaInicio" DESC
    `);

    // Buscar serviços
    const servicosResult = await db.query('SELECT * FROM servicos ORDER BY nome');

    // Buscar funcionários
    const funcionariosResult = await db.query('SELECT * FROM funcionarios ORDER BY nome');

    return Response.json({
      status: 'success',
      data: {
        agendamentos: agendamentosResult.rows,
        servicos: servicosResult.rows,
        funcionarios: funcionariosResult.rows
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dados para estatísticas:', error);
    return Response.json(
      {
        status: 'error',
        message: 'Erro ao buscar dados para estatísticas',
        error: error.message
      },
      { status: 500 }
    );
  }
}

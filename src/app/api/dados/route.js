const db = require('../../lib/db');

export async function GET(request) {
  try {
    // Buscar agendamentos com informações completas
    const agendamentosResult = await db.query(`
      SELECT 
        a.*,
        f.nome AS "funcionarioNome",
        f.id AS "funcionarioId",
        s.nome AS "servicoNome",
        s.id AS "servicoId",
        s.preco
      FROM 
        agendamentos a
        LEFT JOIN funcionarios f ON a.funcionarioid = f.id
        LEFT JOIN servicos s ON a.servicoid = s.id
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

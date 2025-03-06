import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid';

// Definir que esta rota não usa o Edge Runtime
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    console.log('POST /api/db/debug-agendamentos - Iniciando diagnóstico');
    const body = await request.json();
    
    // Logar todos os dados que estão sendo recebidos
    console.log('Dados recebidos:', JSON.stringify(body, null, 2));
    
    // Verificar se funcionário e serviço existem
    const funcionarioId = body.funcionarioId;
    const servicoId = body.servicoId;
    
    const funcionarioCheck = await db.query('SELECT id FROM funcionarios WHERE id = $1', [funcionarioId]);
    const servicoCheck = await db.query('SELECT id FROM servicos WHERE id = $1', [servicoId]);
    
    // Criar resposta de diagnóstico
    const diagnostico = {
      dados_recebidos: body,
      funcionario_existe: funcionarioCheck.rows.length > 0,
      servico_existe: servicoCheck.rows.length > 0,
      todos_funcionarios: [],
      todos_servicos: []
    };
    
    // Buscar todos os funcionários e serviços para comparação
    const funcionariosResult = await db.query('SELECT id, nome FROM funcionarios');
    const servicosResult = await db.query('SELECT id, descricao FROM servicos');
    
    diagnostico.todos_funcionarios = funcionariosResult.rows;
    diagnostico.todos_servicos = servicosResult.rows;
    
    // Se ambos existirem, tentar inserir diretamente via SQL com todos os cuidados com colunas camelCase
    if (diagnostico.funcionario_existe && diagnostico.servico_existe) {
      const id = uuidv4();
      try {
        const sql = `
          INSERT INTO agendamentos 
          ("id", "nomeCliente", "clienteTelefone", "funcionarioId", "servicoId", "horaInicio", "horaFim") 
          VALUES ($1, $2, $3, $4, $5, $6, $7) 
          RETURNING *
        `;
        
        // Logar a consulta SQL e os valores para diagnóstico
        console.log('SQL:', sql);
        console.log('Valores:', [
          id,
          body.nomeCliente,
          body.clienteTelefone || '',
          funcionarioId,
          servicoId,
          body.horaInicio,
          body.horaFim
        ]);
        
        const resultado = await db.query(sql, [
          id,
          body.nomeCliente,
          body.clienteTelefone || '',
          funcionarioId,
          servicoId,
          body.horaInicio,
          body.horaFim
        ]);
        
        diagnostico.resultado_insercao = {
          sucesso: true,
          dados: resultado.rows[0]
        };
      } catch (error) {
        diagnostico.resultado_insercao = {
          sucesso: false,
          erro: error.message
        };
      }
    }
    
    // Verificar o schema exato da tabela
    const schemaResult = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'agendamentos'
    `);
    
    diagnostico.schema_atual = schemaResult.rows;
    
    // Verificar as constraints exatas
    const constraintsResult = await db.query(`
      SELECT 
        tc.constraint_name, 
        tc.constraint_type, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu 
          ON ccu.constraint_name = tc.constraint_name
      WHERE tc.table_name = 'agendamentos'
    `);
    
    diagnostico.constraints = constraintsResult.rows;
    
    return NextResponse.json({
      success: true,
      diagnostico
    });
  } catch (error) {
    console.error('Erro no diagnóstico de agendamentos:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro no diagnóstico de agendamentos',
      error: error.message
    }, { status: 500 });
  }
}

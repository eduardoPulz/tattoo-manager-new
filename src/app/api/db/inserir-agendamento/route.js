import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid';

// Definir que esta rota não usa o Edge Runtime
export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('GET /api/db/inserir-agendamento - Iniciando inserção de agendamento de teste');
    
    // Gerar um UUID para o novo agendamento
    const id = uuidv4();
    
    // Verificar funcionário e serviço existentes
    const funcionarios = await db.query('SELECT id FROM funcionarios LIMIT 1');
    const servicos = await db.query('SELECT id FROM servicos LIMIT 1');
    
    if (funcionarios.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Nenhum funcionário encontrado no banco de dados'
      }, { status: 404 });
    }
    
    if (servicos.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Nenhum serviço encontrado no banco de dados'
      }, { status: 404 });
    }
    
    const funcionarioId = funcionarios.rows[0].id;
    const servicoId = servicos.rows[0].id;
    
    console.log(`Funcionário ID: ${funcionarioId}`);
    console.log(`Serviço ID: ${servicoId}`);
    
    // Definir as datas de início e fim
    const horaInicio = new Date();
    const horaFim = new Date(horaInicio.getTime() + 60 * 60 * 1000); // +1 hora
    
    // Inserir o agendamento usando SQL direto
    const inserirResultado = await db.query(
      `INSERT INTO agendamentos 
       (id, "nomeCliente", "clienteTelefone", "funcionarioId", "servicoId", "horaInicio", "horaFim") 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        id,
        'Cliente Teste Direto',
        '11988888888',
        funcionarioId,
        servicoId,
        horaInicio.toISOString(),
        horaFim.toISOString()
      ]
    );
    
    // Verificar o resultado da inserção
    console.log('Agendamento inserido:', inserirResultado.rows[0]);
    
    return NextResponse.json({
      success: true,
      message: 'Agendamento inserido com sucesso',
      data: inserirResultado.rows[0],
      debug: {
        funcionarioId,
        servicoId,
        horaInicio: horaInicio.toISOString(),
        horaFim: horaFim.toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao inserir agendamento de teste:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao inserir agendamento de teste',
      error: error.message
    }, { status: 500 });
  }
}

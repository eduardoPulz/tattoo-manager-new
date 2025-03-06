import { NextResponse } from 'next/server';
import db from '../../../lib/db';

// Definir que esta rota não usa o Edge Runtime
export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('GET /api/db/adicionar-dados-especificos - Iniciando adição de dados específicos');
    
    // IDs específicos usados no frontend
    const funcionarioId = 'e94f4d21-f778-4bbe-bbb8-63d6d763991f';
    const servicoId = 'd67bb7ae-cce4-4573-97e2-d2465375ecf4';
    
    // Verificar se já existem registros com esses IDs para evitar duplicação
    const funcionarioExistente = await db.query('SELECT id FROM funcionarios WHERE id = $1', [funcionarioId]);
    const servicoExistente = await db.query('SELECT id FROM servicos WHERE id = $1', [servicoId]);
    
    // Resultados das operações
    const resultados = {
      funcionario: null,
      servico: null
    };
    
    // Adicionar funcionário se não existir
    if (funcionarioExistente.rows.length === 0) {
      const funcionarioResultado = await db.query(
        `INSERT INTO funcionarios (id, nome, especialidade, telefone)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [funcionarioId, 'Tatuador Frontend', 'Tradicional', '(44) 99999-9999']
      );
      resultados.funcionario = funcionarioResultado.rows[0];
      console.log('Funcionário adicionado com ID específico:', resultados.funcionario);
    } else {
      resultados.funcionario = 'Funcionário com esse ID já existe';
    }
    
    // Adicionar serviço se não existir
    if (servicoExistente.rows.length === 0) {
      const servicoResultado = await db.query(
        `INSERT INTO servicos (id, nome, preco, duracao, descricao)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [servicoId, 'Tatuagem Tradicional', 300.00, 60, 'Tatuagem Tradicional Média']
      );
      resultados.servico = servicoResultado.rows[0];
      console.log('Serviço adicionado com ID específico:', resultados.servico);
    } else {
      resultados.servico = 'Serviço com esse ID já existe';
    }
    
    return NextResponse.json({
      success: true,
      message: 'Dados específicos adicionados com sucesso',
      data: resultados
    });
  } catch (error) {
    console.error('Erro ao adicionar dados específicos:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao adicionar dados específicos',
      error: error.message
    }, { status: 500 });
  }
}

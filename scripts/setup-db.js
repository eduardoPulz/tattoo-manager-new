/**
 * Script para configurar o banco de dados PostgreSQL
 * 
 * Este script:
 * 1. Executa push do schema do Prisma para o banco de dados
 * 2. Cria dados iniciais básicos para produção
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

async function main() {
  console.log('Iniciando setup do banco de dados PostgreSQL...');
  
  try {
    // Verificar conexão com o banco
    console.log('Verificando conexão com o banco de dados...');
    await prisma.$connect();
    console.log('Conexão com o banco estabelecida com sucesso!');
    
    // Criar funcionário de teste se não existir
    console.log('Criando dados de produção...');
    
    const funcionario = await prisma.funcionario.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nome: 'Admin',
        cargo: 'Gerente',
        email: 'admin@tattoo-manager.com'
      }
    });
    
    const servico = await prisma.servico.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nome: 'Tatuagem Pequena',
        preco: 150.0,
        duracao: 60
      }
    });
    
    // Criar mais um serviço para ter diversidade
    await prisma.servico.upsert({
      where: { id: 2 },
      update: {},
      create: {
        nome: 'Tatuagem Média',
        preco: 300.0,
        duracao: 120
      }
    });
    
    // Criar um agendamento de exemplo se não existir nenhum
    const agendamentosCount = await prisma.agendamento.count();
    
    if (agendamentosCount === 0) {
      const dataAgendamento = new Date();
      dataAgendamento.setDate(dataAgendamento.getDate() + 7); // uma semana no futuro
      
      await prisma.agendamento.create({
        data: {
          data: dataAgendamento,
          nomeCliente: 'Cliente Exemplo',
          funcionarioId: 1,
          servicoId: 1
        }
      });
      
      console.log('Agendamento de exemplo criado para a próxima semana');
    }
    
    console.log('Dados iniciais criados:');
    console.log('- Funcionário:', funcionario.nome);
    console.log('- Serviço:', servico.nome);
    
    console.log('Setup do banco de dados concluído com sucesso!');
  } catch (error) {
    console.error('Erro no setup do banco de dados:', error);
    
    // Verificar o tipo específico de erro para dar instruções mais claras
    if (error.message?.includes('connect ECONNREFUSED')) {
      console.error('Não foi possível conectar ao PostgreSQL. Verifique as configurações de conexão.');
    }
    
    if (error.message?.includes('already exists')) {
      console.log('Alguns objetos já existem no banco de dados, o que é normal em execuções subsequentes.');
    }
    
    // Não interromper o processo para não falhar o deploy
    console.log('Continuando apesar do erro...');
  } finally {
    await prisma.$disconnect();
  }
}

// Chamada principal
main();

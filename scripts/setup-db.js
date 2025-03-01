/**
 * Script para configurar o banco de dados
 * 
 * Este script:
 * 1. Executa push do schema do Prisma para o banco de dados
 * 2. Cria dados iniciais básicos para teste
 */

import { PrismaClient } from '@prisma/client';

async function main() {
  console.log('Iniciando setup do banco de dados...');
  
  const prisma = new PrismaClient();
  
  try {
    // Verificar conexão com o banco
    console.log('Verificando conexão com o banco de dados...');
    await prisma.$connect();
    console.log('Conexão com o banco estabelecida com sucesso!');
    
    // Criar funcionário de teste se não existir
    console.log('Criando dados de teste...');
    
    const funcionario = await prisma.funcionario.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nome: 'Funcionário Teste',
        cargo: 'Tatuador',
        email: 'teste@exemplo.com'
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
    
    console.log('Dados iniciais criados:');
    console.log('- Funcionário:', funcionario.nome);
    console.log('- Serviço:', servico.nome);
    
    console.log('Setup do banco de dados concluído com sucesso!');
  } catch (error) {
    console.error('Erro no setup do banco de dados:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

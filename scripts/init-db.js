// Script para inicializar o banco de dados
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

async function main() {
  console.log('Iniciando verificação do banco de dados...');

  try {
    // Tenta conectar ao banco de dados
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');

    // Verifica se existem tabelas
    const tabelas = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    if (tabelas.length === 0) {
      console.log('Banco de dados vazio. Executando migração...');
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('Migração concluída!');

      console.log('Populando banco de dados com dados iniciais...');
      // Criar funcionários
      await prisma.funcionario.createMany({
        data: [
          { nome: 'João Silva', cargo: 'Tatuador', email: 'joao@exemplo.com' },
          { nome: 'Maria Oliveira', cargo: 'Piercer', email: 'maria@exemplo.com' },
          { nome: 'Carlos Santos', cargo: 'Tatuador', email: 'carlos@exemplo.com' }
        ],
        skipDuplicates: true,
      });

      // Criar serviços
      await prisma.servico.createMany({
        data: [
          { nome: 'Tatuagem Pequena', preco: 150, duracao: 60 },
          { nome: 'Tatuagem Média', preco: 300, duracao: 120 },
          { nome: 'Tatuagem Grande', preco: 500, duracao: 240 },
          { nome: 'Piercing Básico', preco: 80, duracao: 30 },
          { nome: 'Piercing Especial', preco: 120, duracao: 45 }
        ],
        skipDuplicates: true,
      });

      console.log('Dados iniciais inseridos com sucesso!');
    } else {
      console.log(`Banco de dados já contém ${tabelas.length} tabelas.`);
    }

    await prisma.$disconnect();
    console.log('Verificação do banco de dados concluída!');
  } catch (error) {
    console.error('Erro durante a inicialização do banco de dados:', error);
    process.exit(1);
  }
}

main();

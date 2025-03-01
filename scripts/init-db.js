// Script simplificado para inicializar o banco de dados
const { PrismaClient } = require('@prisma/client');

async function main() {
  console.log('Inicializando banco de dados...');
  
  try {
    // Conecta ao banco de dados
    const prisma = new PrismaClient();
    
    // Testa a conexão criando um funcionário de teste
    await prisma.funcionario.upsert({
      where: { id: 1 },
      update: {},
      create: { 
        nome: 'Funcionário Teste', 
        cargo: 'Tatuador', 
        email: 'teste@exemplo.com' 
      }
    });
    
    console.log('Banco de dados inicializado com sucesso!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

main();

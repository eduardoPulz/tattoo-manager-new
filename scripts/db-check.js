// Script para verificar e corrigir problemas de conexão com o banco de dados
const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  console.log('Verificando conexão com o banco de dados...');
  
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    // Tenta realizar uma consulta simples
    const funcionariosCount = await prisma.funcionario.count();
    const servicosCount = await prisma.servico.count();
    const agendamentosCount = await prisma.agendamento.count();

    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    console.log(`📊 Estatísticas do banco de dados:`);
    console.log(`   - Funcionários: ${funcionariosCount}`);
    console.log(`   - Serviços: ${servicosCount}`);
    console.log(`   - Agendamentos: ${agendamentosCount}`);

    // Verifica se há dados básicos no banco
    if (funcionariosCount === 0 || servicosCount === 0) {
      console.log('⚠️ O banco de dados parece estar vazio. Considere executar o comando de seed:');
      console.log('   npm run seed');
    }

  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:');
    console.error(error);
    
    if (error.message.includes('database file is locked')) {
      console.log('\n⚠️ O banco de dados SQLite está bloqueado. Isso pode acontecer se:');
      console.log('   1. Outra instância da aplicação estiver rodando');
      console.log('   2. Um processo anterior não foi encerrado corretamente');
      console.log('\n   Tente encerrar todos os processos Node.js e tente novamente.');
    }
    
    if (error.message.includes('connect ECONNREFUSED')) {
      console.log('\n⚠️ Não foi possível conectar ao servidor PostgreSQL. Verifique se:');
      console.log('   1. O servidor PostgreSQL está em execução');
      console.log('   2. As credenciais no arquivo .env estão corretas');
      console.log('   3. O host e a porta estão acessíveis');
    }
    
    console.log('\n📋 Checklist para resolução de problemas:');
    console.log('   1. Verifique se o arquivo .env existe e contém a variável DATABASE_URL');
    console.log('   2. Certifique-se de que o banco de dados existe e está acessível');
    console.log('   3. Execute "npx prisma generate" para regenerar o cliente Prisma');
    console.log('   4. Execute "npx prisma db push" para sincronizar o esquema');
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase()
  .then(() => {
    console.log('\nVerificação concluída!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erro inesperado:', error);
    process.exit(1);
  });

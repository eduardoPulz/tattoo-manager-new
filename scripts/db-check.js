// Script para verificar e corrigir problemas de conexão com o banco de dados PostgreSQL
import { PrismaClient } from '@prisma/client';

async function checkDatabase() {
  console.log('Verificando conexão com o banco de dados PostgreSQL...');
  
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  });

  try {
    // Tenta realizar consultas simples
    const funcionariosCount = await prisma.funcionario.count();
    const servicosCount = await prisma.servico.count();
    const agendamentosCount = await prisma.agendamento.count();

    console.log('✅ Conexão com o banco de dados PostgreSQL estabelecida com sucesso!');
    console.log(`📊 Estatísticas do banco de dados:`);
    console.log(`   - Funcionários: ${funcionariosCount}`);
    console.log(`   - Serviços: ${servicosCount}`);
    console.log(`   - Agendamentos: ${agendamentosCount}`);

    // Verifica se há dados básicos no banco
    if (funcionariosCount === 0 || servicosCount === 0) {
      console.log('⚠️ O banco de dados parece estar vazio. Executando script de seed...');
      await seedDatabase();
    }

  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados PostgreSQL:');
    console.error(error);
    
    if (error.message.includes('connect ECONNREFUSED') || error.message.includes('Connection refused')) {
      console.log('\n⚠️ Não foi possível conectar ao servidor PostgreSQL. Verifique se:');
      console.log('   1. O servidor PostgreSQL está em execução');
      console.log('   2. As credenciais no ambiente estão corretas');
      console.log('   3. O host e a porta estão acessíveis');
      console.log('   4. A variável de ambiente DATABASE_URL está configurada corretamente');
    }
    
    if (error.message.includes('does not exist')) {
      console.log('\n⚠️ O banco de dados não existe. Verifique se:');
      console.log('   1. O nome do banco de dados está correto na URL de conexão');
      console.log('   2. O banco precisa ser criado manualmente no PostgreSQL');
    }
    
    console.log('\n📋 Checklist para resolução de problemas no Railway:');
    console.log('   1. Verifique se a variável de ambiente DATABASE_URL está configurada no Railway');
    console.log('   2. Certifique-se de que o serviço PostgreSQL está provisionado e funcionando');
    console.log('   3. Execute "railway run npx prisma db push" para sincronizar o esquema');
    console.log('   4. Verifique os logs do Railway para mais detalhes sobre o erro');
  } finally {
    await prisma.$disconnect();
  }
}

// Função simples para adicionar dados básicos se necessário
async function seedDatabase() {
  const prisma = new PrismaClient();
  
  try {
    // Criar um funcionário de teste
    await prisma.funcionario.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nome: 'Funcionário Teste',
        cargo: 'Tatuador',
        email: 'teste@exemplo.com'
      }
    });
    
    // Criar um serviço de teste
    await prisma.servico.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nome: 'Tatuagem Pequena',
        preco: 150.0,
        duracao: 60
      }
    });
    
    console.log('✅ Dados básicos inseridos com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inserir dados básicos:', error);
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

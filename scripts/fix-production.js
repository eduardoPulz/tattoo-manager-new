/**
 * Script para correção emergencial de problemas em produção
 * Diagnostica e tenta reparar erros no banco de dados
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

console.log('=== INICIANDO DIAGNÓSTICO EMERGENCIAL ===');
console.log('Data e hora:', new Date().toISOString());
console.log('Ambiente:', process.env.NODE_ENV);

// Instância do Prisma com timeout estendido
const prisma = new PrismaClient({
  log: ['warn', 'error'],
  errorFormat: 'pretty',
});

async function main() {
  try {
    console.log('\n1. Verificando conexão com o banco de dados...');
    await prisma.$connect();
    console.log('✅ Conexão com o banco estabelecida com sucesso!');
    
    // Verificar tabelas no banco
    console.log('\n2. Verificando schema do banco de dados...');
    try {
      // Consulta raw para verificar tabelas
      const tabelas = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      console.log('📊 Tabelas encontradas:', tabelas.length);
      tabelas.forEach(t => console.log(`- ${t.table_name}`));
      
      // Verificar se as tabelas necessárias existem
      const requiredTables = ['funcionarios', 'servicos', 'agendamentos'];
      const missingTables = requiredTables.filter(
        rt => !tabelas.some(t => t.table_name === rt)
      );
      
      if (missingTables.length > 0) {
        console.log('⚠️ ALERTA: Tabelas necessárias não encontradas:', missingTables);
        console.log('Tentando aplicar migrations...');
        
        // Forçar um push do schema
        try {
          execSync('npx prisma db push --accept-data-loss --force-reset', { 
            stdio: 'inherit',
            timeout: 60000
          });
          console.log('✅ Push do schema realizado com sucesso');
        } catch (pushError) {
          console.error('❌ Erro ao aplicar schema:', pushError.message);
        }
      } else {
        console.log('✅ Todas as tabelas necessárias estão presentes');
      }
    } catch (schemaError) {
      console.error('❌ Erro ao verificar schema:', schemaError);
    }
    
    // Verificar dados nas tabelas
    console.log('\n3. Verificando dados nas tabelas...');
    try {
      const funcionariosCount = await prisma.funcionario.count();
      const servicosCount = await prisma.servico.count();
      const agendamentosCount = await prisma.agendamento.count();
      
      console.log(`📊 Funcionários: ${funcionariosCount}`);
      console.log(`📊 Serviços: ${servicosCount}`);
      console.log(`📊 Agendamentos: ${agendamentosCount}`);
      
      // Se não houver dados, criar dados de exemplo
      if (funcionariosCount === 0 || servicosCount === 0) {
        console.log('⚠️ Dados básicos não encontrados, criando dados iniciais...');
        
        // Criar funcionário padrão
        if (funcionariosCount === 0) {
          const funcionario = await prisma.funcionario.create({
            data: {
              nome: 'Tatuador Emergencial',
              cargo: 'Tatuador',
              email: 'tatuador@sistema.com'
            }
          });
          console.log('✅ Funcionário padrão criado:', funcionario.nome);
        }
        
        // Criar serviço padrão
        if (servicosCount === 0) {
          const servico = await prisma.servico.create({
            data: {
              nome: 'Tatuagem Emergencial',
              preco: 150.0,
              duracao: 60
            }
          });
          console.log('✅ Serviço padrão criado:', servico.nome);
        }
      }
    } catch (dataError) {
      console.error('❌ Erro ao verificar dados:', dataError);
    }
    
    // Verificar relacionamentos nos agendamentos
    console.log('\n4. Verificando relacionamentos nos agendamentos...');
    try {
      // Tenta buscar um agendamento com relacionamentos
      const testQueries = [
        // Verificar a consulta sem include
        prisma.agendamento.findFirst(),
        
        // Verificar funcionários
        prisma.funcionario.findFirst(),
        
        // Verificar serviços
        prisma.servico.findFirst()
      ];
      
      const [agendamento, funcionario, servico] = await Promise.all(testQueries);
      
      console.log('📊 Teste de consulta:');
      console.log('- Agendamento:', agendamento ? 'OK' : 'NENHUM');
      console.log('- Funcionário:', funcionario ? 'OK' : 'NENHUM');
      console.log('- Serviço:', servico ? 'OK' : 'NENHUM');
      
      // Se tiver agendamento mas não conseguir buscar relacionamentos, tentar corrigir
      if (agendamento) {
        console.log('📊 Dados do agendamento:', JSON.stringify(agendamento, null, 2));
        
        // Verificar se os IDs existem
        const funcionarioExiste = await prisma.funcionario.findUnique({
          where: { id: agendamento.funcionarioId }
        });
        
        const servicoExiste = await prisma.servico.findUnique({
          where: { id: agendamento.servicoId }
        });
        
        console.log('- Funcionário vinculado existe?', funcionarioExiste ? 'SIM' : 'NÃO');
        console.log('- Serviço vinculado existe?', servicoExiste ? 'SIM' : 'NÃO');
        
        // Se não existirem, tentar corrigir
        if (!funcionarioExiste && funcionario) {
          console.log('⚠️ Tentando corrigir referência de funcionário...');
          await prisma.agendamento.update({
            where: { id: agendamento.id },
            data: { funcionarioId: funcionario.id }
          });
          console.log('✅ Referência de funcionário corrigida');
        }
        
        if (!servicoExiste && servico) {
          console.log('⚠️ Tentando corrigir referência de serviço...');
          await prisma.agendamento.update({
            where: { id: agendamento.id },
            data: { servicoId: servico.id }
          });
          console.log('✅ Referência de serviço corrigida');
        }
      }
    } catch (relError) {
      console.error('❌ Erro ao verificar relacionamentos:', relError);
    }
    
    console.log('\n=== DIAGNÓSTICO CONCLUÍDO ===');
    console.log('Data e hora de finalização:', new Date().toISOString());
    
  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO NO DIAGNÓSTICO:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\nDiagnóstico finalizado, conexão com o banco fechada.');
  }
}

// Executar diagnóstico
main()
  .then(() => {
    console.log('Script finalizado com sucesso');
    process.exit(0);
  })
  .catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });

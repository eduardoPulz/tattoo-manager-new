import { PrismaClient } from '@prisma/client';

/**
 * Script para bootstrap inicial do banco de dados
 * Cria dados mínimos necessários para o funcionamento do sistema
 */

console.log('Inicializando banco de dados com dados mínimos...');

// Cria um cliente do Prisma
const prisma = new PrismaClient();

// Função principal
async function main() {
  try {
    console.log('Verificando conexão com o banco de dados...');
    
    // Verifica a conexão
    await prisma.$connect();
    console.log('Conexão estabelecida com sucesso!');
    
    // Criar funcionário padrão se não existir
    const funcionario = await prisma.funcionario.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nome: 'Tatuador Padrão',
        cargo: 'Tatuador',
        email: 'tatuador@exemplo.com'
      }
    });
    console.log('Funcionário padrão criado/verificado:', funcionario.nome);
    
    // Criar serviço padrão se não existir
    const servico = await prisma.servico.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nome: 'Tatuagem Simples',
        preco: 150.0,
        duracao: 60
      }
    });
    console.log('Serviço padrão criado/verificado:', servico.nome);
    
    // Verificar se já existe algum agendamento
    const agendamentoCount = await prisma.agendamento.count();
    
    // Se não existe, criar um agendamento de exemplo
    if (agendamentoCount === 0) {
      // Data para amanhã às 14:00
      const dataAgendamento = new Date();
      dataAgendamento.setDate(dataAgendamento.getDate() + 1);
      dataAgendamento.setHours(14, 0, 0, 0);
      
      const agendamento = await prisma.agendamento.create({
        data: {
          data: dataAgendamento,
          nomeCliente: 'Cliente Exemplo',
          funcionarioId: funcionario.id,
          servicoId: servico.id
        }
      });
      console.log('Agendamento de exemplo criado para:', agendamento.nomeCliente);
    } else {
      console.log(`${agendamentoCount} agendamentos já existem no banco.`);
    }
    
    console.log('Inicialização concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar a função principal
main()
  .then(() => {
    console.log('Script finalizado com sucesso.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Limpar dados existentes
    await prisma.agendamento.deleteMany({});
    await prisma.funcionario.deleteMany({});
    await prisma.servico.deleteMany({});
    
    console.log('Banco de dados limpo com sucesso.');

    // Criar funcionários
    const funcionario1 = await prisma.funcionario.create({
      data: {
        nome: 'João Silva',
        especialidade: 'Tatuador',
        telefone: '(11) 98765-4321'
      }
    });

    const funcionario2 = await prisma.funcionario.create({
      data: {
        nome: 'Maria Oliveira',
        especialidade: 'Piercer',
        telefone: '(11) 91234-5678'
      }
    });

    console.log('Funcionários criados:', funcionario1.nome, funcionario2.nome);

    // Criar serviços
    const servico1 = await prisma.servico.create({
      data: {
        descricao: 'Tatuagem pequena',
        duracao: 60,
        preco: 150.0
      }
    });

    const servico2 = await prisma.servico.create({
      data: {
        descricao: 'Piercing básico',
        duracao: 30,
        preco: 80.0
      }
    });

    const servico3 = await prisma.servico.create({
      data: {
        descricao: 'Tatuagem média',
        duracao: 120,
        preco: 300.0
      }
    });

    console.log('Serviços criados:', servico1.descricao, servico2.descricao, servico3.descricao);

    // Criar agendamentos
    const agendamento1 = await prisma.agendamento.create({
      data: {
        nomeCliente: 'Pedro Santos',
        horaInicio: new Date('2025-03-01T10:00:00Z'),
        horaFim: new Date('2025-03-01T11:00:00Z'),
        funcionarioId: funcionario1.id,
        servicoId: servico1.id
      }
    });

    const agendamento2 = await prisma.agendamento.create({
      data: {
        nomeCliente: 'Ana Souza',
        horaInicio: new Date('2025-03-02T14:00:00Z'),
        horaFim: new Date('2025-03-02T14:30:00Z'),
        funcionarioId: funcionario2.id,
        servicoId: servico2.id
      }
    });

    const agendamento3 = await prisma.agendamento.create({
      data: {
        nomeCliente: 'Carlos Ferreira',
        horaInicio: new Date('2025-03-03T15:00:00Z'),
        horaFim: new Date('2025-03-03T17:00:00Z'),
        funcionarioId: funcionario1.id,
        servicoId: servico3.id
      }
    });

    console.log('Agendamentos criados para:', agendamento1.nomeCliente, agendamento2.nomeCliente, agendamento3.nomeCliente);

    console.log('Dados inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

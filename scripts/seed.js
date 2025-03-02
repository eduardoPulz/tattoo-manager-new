// Script de seed para popular o banco de dados com dados de teste
// Compatível com o esquema atual do PostgreSQL

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Iniciando seed do banco de dados...');
    
    // Limpar dados existentes
    console.log('Limpando dados existentes...');
    await prisma.agendamento.deleteMany({});
    await prisma.funcionario.deleteMany({});
    await prisma.servico.deleteMany({});
    
    console.log('Banco de dados limpo com sucesso.');

    // Criar funcionários
    console.log('Criando funcionários...');
    const funcionario1 = await prisma.funcionario.create({
      data: {
        nome: 'João Silva',
        cargo: 'Tatuador',
        email: 'joao.silva@tattoo.com'
      }
    });

    const funcionario2 = await prisma.funcionario.create({
      data: {
        nome: 'Maria Oliveira',
        cargo: 'Piercer',
        email: 'maria.oliveira@tattoo.com'
      }
    });

    console.log('Funcionários criados:', funcionario1.nome, funcionario2.nome);

    // Criar serviços
    console.log('Criando serviços...');
    const servico1 = await prisma.servico.create({
      data: {
        nome: 'Tatuagem pequena',
        duracao: 60,
        preco: 150.0
      }
    });

    const servico2 = await prisma.servico.create({
      data: {
        nome: 'Piercing básico',
        duracao: 30,
        preco: 80.0
      }
    });

    const servico3 = await prisma.servico.create({
      data: {
        nome: 'Tatuagem média',
        duracao: 120,
        preco: 300.0
      }
    });

    console.log('Serviços criados:', servico1.nome, servico2.nome, servico3.nome);

    // Criar agendamentos
    console.log('Criando agendamentos...');
    
    // Datas para os agendamentos (próximos dias)
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    const doisDiasDepois = new Date(hoje);
    doisDiasDepois.setDate(doisDiasDepois.getDate() + 2);
    
    const agendamento1 = await prisma.agendamento.create({
      data: {
        nomeCliente: 'Pedro Santos',
        data: hoje,
        funcionarioId: funcionario1.id,
        servicoId: servico1.id
      }
    });

    const agendamento2 = await prisma.agendamento.create({
      data: {
        nomeCliente: 'Ana Souza',
        data: amanha,
        funcionarioId: funcionario2.id,
        servicoId: servico2.id
      }
    });

    const agendamento3 = await prisma.agendamento.create({
      data: {
        nomeCliente: 'Carlos Ferreira',
        data: doisDiasDepois,
        funcionarioId: funcionario1.id,
        servicoId: servico3.id
      }
    });

    console.log('Agendamentos criados para:', agendamento1.nomeCliente, agendamento2.nomeCliente, agendamento3.nomeCliente);

    console.log('Dados de teste inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

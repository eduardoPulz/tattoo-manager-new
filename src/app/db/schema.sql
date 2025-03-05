-- Criação da tabela de funcionários
CREATE TABLE IF NOT EXISTS funcionarios (
    id UUID PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    email VARCHAR(255),
    especialidade VARCHAR(100) NOT NULL,
    telefone VARCHAR(20)
);

-- Criação da tabela de serviços
CREATE TABLE IF NOT EXISTS servicos (
    id UUID PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    duracao INTEGER NOT NULL,
    descricao TEXT
);

-- Criação da tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id UUID PRIMARY KEY,
    nomeCliente VARCHAR(255) NOT NULL,
    clienteTelefone VARCHAR(20),
    funcionarioId UUID NOT NULL,
    servicoId UUID NOT NULL,
    horaInicio TIMESTAMP NOT NULL,
    horaFim TIMESTAMP NOT NULL,
    FOREIGN KEY (funcionarioId) REFERENCES funcionarios(id) ON DELETE CASCADE,
    FOREIGN KEY (servicoId) REFERENCES servicos(id) ON DELETE CASCADE
);

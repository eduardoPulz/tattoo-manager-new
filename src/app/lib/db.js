const { Pool } = require('pg');

// Verificar se estamos em ambiente de desenvolvimento para facilitar o debug
const isDevelopment = process.env.NODE_ENV !== 'production';

// Configuração da conexão com o PostgreSQL
let pool;

try {
  // Verifica se temos uma URL de conexão do PostgreSQL da Vercel
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  if (connectionString) {
    console.log('Usando conexão via string de conexão');
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
  } else {
    // Configuração manual de parâmetros
    console.log('Usando conexão via parâmetros individuais');
    pool = new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT || 5432,
      database: process.env.POSTGRES_DATABASE,
      ssl: process.env.POSTGRES_SSL === 'true' ? {
        rejectUnauthorized: false
      } : false
    });
  }
  
  // Testar a conexão
  if (isDevelopment) {
    pool.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.error('Erro ao conectar ao PostgreSQL:', err);
      } else {
        console.log('Conectado ao PostgreSQL com sucesso:', res.rows[0]);
      }
    });
  }
} catch (error) {
  console.error('Erro ao configurar conexão com PostgreSQL:', error);
  // Em desenvolvimento, podemos usar um fallback para um objeto que não faz nada
  if (isDevelopment) {
    console.log('Usando pool de conexão simulado para desenvolvimento');
    pool = {
      query: (text, params) => {
        console.log('DB SIMULADO - Query:', { text, params });
        return Promise.reject(new Error('Banco de dados não configurado'));
      },
      connect: () => {
        console.log('DB SIMULADO - Tentativa de conexão');
        return Promise.reject(new Error('Banco de dados não configurado'));
      }
    };
  } else {
    throw error; // Em produção, queremos que o erro seja lançado
  }
}

// Exportar as funções para interagir com o banco de dados
module.exports = {
  query: (text, params) => {
    console.log('Executando query:', { text });
    return pool.query(text, params);
  },
  getClient: () => pool.connect(),
};

const { Pool } = require('pg');

// Configuração da string de conexão para o PostgreSQL da Vercel
const connectionString = process.env.POSTGRES_URL;

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT || 5432,
        database: process.env.POSTGRES_DATABASE,
        ssl: process.env.POSTGRES_SSL === 'true' ? {
          rejectUnauthorized: false
        } : false,
      }
);

module.exports = {
  query: (text, params) => {
    console.log('Executando query:', { text });
    return pool.query(text, params);
  },
  getClient: () => pool.connect(),
};

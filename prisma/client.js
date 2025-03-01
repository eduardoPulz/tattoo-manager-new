import { PrismaClient } from '@prisma/client';

// Criando uma única instância do PrismaClient
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;

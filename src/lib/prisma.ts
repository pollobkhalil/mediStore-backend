import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient is instantiated once and reused across the application
 * to prevent exhausting database connections.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Log queries in development to help with debugging
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Save the instance to the global object in non-production environments
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
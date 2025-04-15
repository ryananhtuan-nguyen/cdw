import { PrismaClient } from '@prisma/client/extension'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function makeClient() {
  return new PrismaClient({ log: ['info', 'warn', 'error'] })
}

export const prisma = globalForPrisma.prisma || makeClient()
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

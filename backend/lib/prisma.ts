import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

export const getPrisma = (databaseUrl: string) => {
    if (!globalForPrisma.prisma) {
        const pgPool = new Pool({
            connectionString: databaseUrl,
            max: 5,
            idleTimeoutMillis: 0,
            allowExitOnIdle: true
        });
        const adapter = new PrismaPg(pgPool);
        globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    return globalForPrisma.prisma;
};
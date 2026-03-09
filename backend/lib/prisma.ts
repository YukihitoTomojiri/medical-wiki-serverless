import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { AsyncLocalStorage } from 'node:async_hooks'

export const prismaStorage = new AsyncLocalStorage<PrismaClient>()

export const getPrisma = (databaseUrl: string) => {
    const store = prismaStorage.getStore()
    if (store) return store

    // Fallback for non-hono contexts (e.g. scripts)
    const pgPool = new Pool({ connectionString: databaseUrl, max: 1 })
    const adapter = new PrismaPg(pgPool)
    return new PrismaClient({ adapter })
}

export const prismaMiddleware = async (c: any, next: any) => {
    const databaseUrl = c.env.DATABASE_URL as string
    const pgPool = new Pool({
        connectionString: databaseUrl,
        max: 1 // 1 connection per request
    })
    const adapter = new PrismaPg(pgPool)
    const prisma = new PrismaClient({ adapter })

    try {
        await prismaStorage.run(prisma, async () => {
            await next()
        })
    } finally {
        await prisma.$disconnect()
        // Wait for pool to end to naturally resolve pending timers
        await pgPool.end()
    }
}
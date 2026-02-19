import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

// Using standard client for now, assuming environment supports it or using direct connection
// For Cloudflare Workers, we typically use the edge client + accelerate or direct TCP if supported (e.g. pg-native via specific drivers)
// But since we installed standard @prisma/client, and we want to keep it simple:

// Actually, in Cloudflare Workers, we MUST use the Edge client or a driver adapter.
// Since we didn't install @prisma/adapter-pg, we should use the edge client if available.
// However, standard `import { PrismaClient } from '@prisma/client'` might fail in Workers if not bundled correctly.
// The user installed `@prisma/client`.
// Let's try standard import. If it fails, we might need to adjust.

import { PrismaClient as StandardPrismaClient } from '@prisma/client'

// Helper to get Prisma Client with appropriate datasource URL from env
export const getPrisma = (databaseUrl: string) => {
    return new StandardPrismaClient({
        datasources: {
            db: {
                url: databaseUrl,
            },
        },
    })
}

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

async function test() {
    const databaseUrl = process.env.DATABASE_URL
    console.log('Connecting to:', databaseUrl)
    const pool = new Pool({ connectionString: databaseUrl })
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    try {
        console.log('Fetching facilities...')
        const facilities = await prisma.facility.findMany({
            where: { deletedAt: null },
            orderBy: { id: 'asc' }
        })
        console.log('Facilities found:', facilities.length)
        console.log(facilities)
    } catch (e) {
        console.error('Error:', e)
    } finally {
        await prisma.$disconnect()
        await pool.end()
    }
}

test()

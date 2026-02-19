import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import * as dotenv from 'dotenv'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const password = await hash('password123', 10)

    // Developer User
    const devUser = await prisma.user.upsert({
        where: { employeeId: 'dev001' },
        update: {},
        create: {
            employeeId: 'dev001',
            password,
            name: 'Developer User',
            facility: 'Headquarters',
            department: 'IT',
            role: 'DEVELOPER',
            email: 'dev@example.com',
        },
    })
    console.log({ devUser })

    // Admin User
    const adminUser = await prisma.user.upsert({
        where: { employeeId: 'admin001' },
        update: {},
        create: {
            employeeId: 'admin001',
            password,
            name: 'Admin User',
            facility: 'Headquarters',
            department: 'Management',
            role: 'ADMIN',
            email: 'admin@example.com',
        },
    })
    console.log({ adminUser })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

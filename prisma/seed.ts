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

    // テストユーザー: 佐藤 健太（理学療法士）
    const satoUser = await prisma.user.upsert({
        where: { employeeId: 'user001' },
        update: {},
        create: {
            employeeId: 'user001',
            password,
            name: '佐藤 健太',
            facility: 'Headquarters',
            department: 'リハビリテーション科',
            role: 'USER',
            email: 'kenta.sato@example.com',
            profession: '理学療法士',
        },
    })
    console.log({ satoUser })

    // テストユーザー: 鈴木 舞（看護師）
    const suzukiUser = await prisma.user.upsert({
        where: { employeeId: 'user002' },
        update: {},
        create: {
            employeeId: 'user002',
            password,
            name: '鈴木 舞',
            facility: 'Headquarters',
            department: '看護部',
            role: 'USER',
            email: 'mai.suzuki@example.com',
            profession: '看護師',
        },
    })
    console.log({ suzukiUser })

    // 職種マスタデータ
    const professionNames = [
        { name: '理学療法士', description: '運動機能の回復・維持を担当' },
        { name: '作業療法士', description: '日常生活動作の回復を担当' },
        { name: '言語聴覚士', description: '言語・嚥下機能の回復を担当' },
        { name: '看護師', description: '患者の看護ケアを担当' },
        { name: '介護職', description: '介護サービスの提供を担当' },
        { name: '事務職', description: '事務・管理業務を担当' },
        { name: 'その他', description: 'その他の職種' },
    ]

    for (const prof of professionNames) {
        await prisma.profession.upsert({
            where: { name: prof.name },
            update: {},
            create: prof,
        })
    }
    console.log('職種マスタデータを投入しました')
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

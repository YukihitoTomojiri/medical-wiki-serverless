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

    // マスターデータ (施設と部署)
    const facilitiesData = [
        {
            name: '本部病院',
            departments: ['理学療法課', '看護部', '事務局'],
        },
        {
            name: '本部病院介護医療院',
            departments: ['介護課', '看護部'],
        },
        {
            name: '後光病院',
            departments: ['リハビリテーション科', '薬剤科'],
        },
        {
            name: '玉診療所',
            departments: ['外来', '事務'],
        },
    ];

    for (const facData of facilitiesData) {
        const facility = await prisma.facility.upsert({
            where: { name: facData.name },
            update: {},
            create: { name: facData.name },
        });

        for (const depName of facData.departments) {
            // Unique constraint is typically on ID, so we need to find first or use an alternative if we don't know the ID
            const existingDept = await prisma.department.findFirst({
                where: {
                    name: depName,
                    facilityId: facility.id,
                }
            });

            if (existingDept) {
                await prisma.department.update({
                    where: { id: existingDept.id },
                    data: {
                        name: depName,
                        facilityId: facility.id,
                    },
                });
            } else {
                await prisma.department.create({
                    data: {
                        name: depName,
                        facilityId: facility.id,
                    },
                });
            }
        }
    }
    console.log('施設・部署マスタデータを投入しました');

    // Developer User
    const devUser = await prisma.user.upsert({
        where: { employeeId: 'dev001' },
        update: {
            facility: '本部病院',
            department: '事務局',
        },
        create: {
            employeeId: 'dev001',
            password,
            name: 'Developer User',
            facility: '本部病院',
            department: '事務局',
            role: 'DEVELOPER',
            email: 'dev@example.com',
        },
    })
    console.log({ devUser })

    // Admin User
    const adminUser = await prisma.user.upsert({
        where: { employeeId: 'admin001' },
        update: {
            facility: '本部病院',
            department: '理学療法課',
        },
        create: {
            employeeId: 'admin001',
            password,
            name: 'Admin User',
            facility: '本部病院',
            department: '理学療法課',
            role: 'ADMIN',
            email: 'admin@example.com',
        },
    })
    console.log({ adminUser })

    // テストユーザー: 佐藤 健太（理学療法士）
    const satoUser = await prisma.user.upsert({
        where: { employeeId: 'user001' },
        update: {
            facility: '本部病院',
            department: '理学療法課',
        },
        create: {
            employeeId: 'user001',
            password,
            name: '佐藤 健太',
            facility: '本部病院',
            department: '理学療法課',
            role: 'USER',
            email: 'kenta.sato@example.com',
            profession: '理学療法士',
        },
    })
    console.log({ satoUser })

    // テストユーザー: 鈴木 舞（看護師）
    const suzukiUser = await prisma.user.upsert({
        where: { employeeId: 'user002' },
        update: {
            facility: '本部病院',
            department: '看護部',
        },
        create: {
            employeeId: 'user002',
            password,
            name: '鈴木 舞',
            facility: '本部病院',
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

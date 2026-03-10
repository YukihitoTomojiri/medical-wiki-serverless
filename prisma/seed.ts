import { PrismaClient } from '@prisma/client'

import * as dotenv from 'dotenv'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function hashPassword(plain: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function main() {
    const password = await hashPassword('password123')

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

    const facilityMap = new Map<string, number>();
    const departmentMap = new Map<string, number>();

    for (const facData of facilitiesData) {
        const facility = await prisma.facility.upsert({
            where: { name: facData.name },
            update: {},
            create: { name: facData.name },
        });
        facilityMap.set(facData.name, facility.id);

        for (const depName of facData.departments) {
            const existingDept = await prisma.department.findFirst({
                where: {
                    name: depName,
                    facilityId: facility.id,
                }
            });

            if (existingDept) {
                const updated = await prisma.department.update({
                    where: { id: existingDept.id },
                    data: {
                        name: depName,
                        facilityId: facility.id,
                    },
                });
                departmentMap.set(`${facData.name}_${depName}`, updated.id);
            } else {
                const created = await prisma.department.create({
                    data: {
                        name: depName,
                        facilityId: facility.id,
                    },
                });
                departmentMap.set(`${facData.name}_${depName}`, created.id);
            }
        }
    }
    console.log('施設・部署マスタデータを投入しました');

    // Developer User
    const devUser = await prisma.user.upsert({
        where: { employeeId: 'dev001' },
        update: {
            facilityId: facilityMap.get('本部病院')!,
            departmentId: departmentMap.get('本部病院_事務局')!,
        },
        create: {
            employeeId: 'dev001',
            password,
            name: 'Developer User',
            facilityId: facilityMap.get('本部病院')!,
            departmentId: departmentMap.get('本部病院_事務局')!,
            role: 'DEVELOPER',
            email: 'dev@example.com',
        },
    })
    console.log({ devUser })

    // Admin User
    const adminUser = await prisma.user.upsert({
        where: { employeeId: 'admin001' },
        update: {
            facilityId: facilityMap.get('本部病院')!,
            departmentId: departmentMap.get('本部病院_理学療法課')!,
        },
        create: {
            employeeId: 'admin001',
            password,
            name: 'Admin User',
            facilityId: facilityMap.get('本部病院')!,
            departmentId: departmentMap.get('本部病院_理学療法課')!,
            role: 'ADMIN',
            email: 'admin@example.com',
        },
    })
    console.log({ adminUser })

    // テストユーザー: 佐藤 健太（理学療法士）
    const satoUser = await prisma.user.upsert({
        where: { employeeId: 'user001' },
        update: {
            facilityId: facilityMap.get('本部病院')!,
            departmentId: departmentMap.get('本部病院_理学療法課')!,
        },
        create: {
            employeeId: 'user001',
            password,
            name: '佐藤 健太',
            facilityId: facilityMap.get('本部病院')!,
            departmentId: departmentMap.get('本部病院_理学療法課')!,
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
            facilityId: facilityMap.get('本部病院')!,
            departmentId: departmentMap.get('本部病院_看護部')!,
        },
        create: {
            employeeId: 'user002',
            password,
            name: '鈴木 舞',
            facilityId: facilityMap.get('本部病院')!,
            departmentId: departmentMap.get('本部病院_看護部')!,
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
        { name: '医師', description: '診察・治療を担当' },
    ]

    for (const prof of professionNames) {
        await prisma.profession.upsert({
            where: { name: prof.name },
            update: {},
            create: prof,
        })
    }
    console.log('職種マスタデータを投入しました')

    // 運用データ：お知らせ
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await prisma.announcement.upsert({
        where: { id: 1 }, // 仮で固定ID、存在しなければ作成
        update: {
            title: '全職員対象：今月の感染対策強化について',
            content: 'インフルエンザの流行シーズンに伴い、全施設において標準的な感染対策を再度徹底してください。\n1. 手指衛生の実践\n2. 適切なマスク着用\n3. 備品の消毒',
            priority: 'HIGH',
            displayUntil: nextMonth,
        },
        create: {
            id: 1,
            createdBy: devUser.id,
            title: '全職員対象：今月の感染対策強化について',
            content: 'インフルエンザの流行シーズンに伴い、全施設において標準的な感染対策を再度徹底してください。\n1. 手指衛生の実践\n2. 適切なマスク着用\n3. 備品の消毒',
            priority: 'HIGH',
            displayUntil: nextMonth,
        }
    })
    console.log('お知らせの運用データを投入しました');

    // 運用データ：研修
    const eventStartTime = new Date();
    eventStartTime.setDate(eventStartTime.getDate() + 7); // 7日後
    const eventEndTime = new Date(eventStartTime);
    eventEndTime.setHours(eventEndTime.getHours() + 2); // 2時間の研修

    await prisma.trainingEvent.upsert({
        where: { id: 1 }, // 仮で固定ID、存在しなければ作成
        update: {
            title: '2024年度 第1回 医療安全講習会',
            description: '医療安全に関する最新のガイドラインと、当院でのヒヤリハット事例に基づく予防策についての講習会です。全職員の受講が必須となります。',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // サンプルURL
            startTime: eventStartTime,
            endTime: eventEndTime,
        },
        create: {
            id: 1,
            title: '2024年度 第1回 医療安全講習会',
            description: '医療安全に関する最新のガイドラインと、当院でのヒヤリハット事例に基づく予防策についての講習会です。全職員の受講が必須となります。',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            startTime: eventStartTime,
            endTime: eventEndTime,
        }
    })
    console.log('研修の運用データを投入しました');
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

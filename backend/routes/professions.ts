import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'
import { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

// 職種一覧取得
app.get('/', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const professions = await prisma.profession.findMany({
        orderBy: { id: 'asc' }
    })
    return c.json(professions)
})

// 職種新規作成
app.post('/', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const { name, description } = await c.req.json()
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return c.json({ error: '職種名は必須です' }, 400)
    }
    try {
        const profession = await prisma.profession.create({
            data: { name: name.trim(), description: description || null }
        })
        return c.json(profession)
    } catch (e: any) {
        if (e.code === 'P2002') {
            return c.json({ error: 'この職種名は既に登録されています' }, 409)
        }
        throw e
    }
})

// 職種編集
app.put('/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    const { name, description } = await c.req.json()
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return c.json({ error: '職種名は必須です' }, 400)
    }
    try {
        const profession = await prisma.profession.update({
            where: { id },
            data: { name: name.trim(), description: description || null }
        })
        return c.json(profession)
    } catch (e: any) {
        if (e.code === 'P2002') {
            return c.json({ error: 'この職種名は既に登録されています' }, 409)
        }
        throw e
    }
})

// 職種削除
app.delete('/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    await prisma.profession.delete({ where: { id } })
    return c.json({ success: true })
})

export default app

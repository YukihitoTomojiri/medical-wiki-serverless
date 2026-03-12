import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'
import { getSupabase } from '../lib/supabase'
import { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const category = c.req.query('category')

    const where: any = {}
    if (category) {
        where.category = category
    }

    const manuals = await prisma.manual.findMany({
        where,
        orderBy: { updatedAt: 'desc' }
    })
    return c.json(manuals)
})

// Categories
app.get('/categories', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const manuals = await prisma.manual.findMany({ select: { category: true }, distinct: ['category'] })
    return c.json(manuals.map(m => m.category))
})

app.get('/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    const manual = await prisma.manual.findUnique({
        where: { id }
    })
    if (!manual) return c.json({ error: 'Not found' }, 404)
    return c.json(manual)
})

export default app

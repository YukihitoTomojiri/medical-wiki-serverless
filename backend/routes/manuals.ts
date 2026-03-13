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

// Create Manual
app.post('/', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    // Normally we'd get authorName from the user context/session
    const userId = Number(c.req.header('X-User-Id'))
    const data = await c.req.json()

    if (!data.title || !data.content || !data.category) {
        return c.json({ error: 'Title, content, and category are required' }, 400)
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        
        const manual = await prisma.manual.create({
            data: {
                title: data.title,
                content: data.content,
                category: data.category,
                authorName: user?.name || 'Unknown',
                facilityId: data.facilityId ? Number(data.facilityId) : null,
                departmentId: data.departmentId ? Number(data.departmentId) : null,
            }
        })
        return c.json(manual, 201)
    } catch (error: any) {
        console.error('Failed to create manual:', error)
        return c.json({ error: 'Failed to create manual', details: error.message }, 500)
    }
})

export default app

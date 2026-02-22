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

app.get('/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    const manual = await prisma.manual.findUnique({
        where: { id }
    })
    if (!manual) return c.json({ error: 'Not found' }, 404)
    return c.json(manual)
})

app.post('/', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const userId = c.req.header('X-User-Id')
    const { title, content, category } = await c.req.json()

    // Fetch user name for authorName
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } })

    const manual = await prisma.manual.create({
        data: {
            title,
            content,
            category,
            authorName: user?.name || 'Unknown'
        }
    })
    return c.json(manual)
})

app.put('/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    const { title, content, category } = await c.req.json()

    const manual = await prisma.manual.update({
        where: { id },
        data: { title, content, category }
    })
    return c.json(manual)
})

// Specific upload route for manual PDF
app.post('/:id/pdf', async (c) => {
    const id = Number(c.req.param('id'))
    const formData = await c.req.parseBody()
    const file = formData['file'] as File

    if (!file) return c.json({ error: 'No file' }, 400)

    const sb = getSupabase(c.env.SUPABASE_URL as string, c.env.SUPABASE_ANON_KEY as string)
    const path = `manuals/${id}/${Date.now()}-${file.name}`

    const { error } = await sb.storage
        .from('wiki-assets')
        .upload(path, file)

    if (error) return c.json({ error: error.message }, 500)

    const { data: { publicUrl } } = sb.storage
        .from('wiki-assets')
        .getPublicUrl(path)

    const prisma = getPrisma(c.env.DATABASE_URL as string)
    await prisma.manual.update({
        where: { id },
        data: { pdfUrl: publicUrl }
    })

    return c.text(publicUrl) // api.ts expects text
})

// Categories
app.get('/categories', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const manuals = await prisma.manual.findMany({ select: { category: true }, distinct: ['category'] })
    return c.json(manuals.map(m => m.category))
})

export default app

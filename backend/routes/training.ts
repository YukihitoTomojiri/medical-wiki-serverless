import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'
import { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

// /api/training/events/admin
app.get('/events/admin', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const events = await prisma.trainingEvent.findMany({
        orderBy: { startTime: 'desc' }
    })
    return c.json(events)
})

// /api/training/events
app.get('/events', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const events = await prisma.trainingEvent.findMany({
        orderBy: { startTime: 'desc' },
        include: {
            responses: {
                select: { userId: true }
            }
        }
    })
    return c.json(events)
})

app.post('/events', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const data = await c.req.json()

    const event = await prisma.trainingEvent.create({
        data: {
            title: data.title,
            description: data.description,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            videoUrl: data.videoUrl,
            materialsUrl: data.materialsUrl,
        }
    })
    return c.json(event)
})

// /api/training/events/:id
app.get('/events/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    const event = await prisma.trainingEvent.findUnique({
        where: { id },
        include: {
            responses: {
                include: { user: { select: { name: true, facility: true, department: true } } }
            }
        }
    })

    if (!event) {
        return c.json({ error: 'Not found' }, 404)
    }
    return c.json(event)
})

app.put('/events/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    const data = await c.req.json()

    const event = await prisma.trainingEvent.update({
        where: { id },
        data: {
            title: data.title,
            description: data.description,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            videoUrl: data.videoUrl,
            materialsUrl: data.materialsUrl,
        }
    })
    return c.json(event)
})

app.delete('/events/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    await prisma.trainingEvent.delete({ where: { id } })
    return c.json({ success: true })
})

export default app

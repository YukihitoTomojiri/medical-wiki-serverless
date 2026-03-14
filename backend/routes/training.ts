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
    const userId = Number(c.req.header('X-User-Id'))

    const user = await prisma.user.findUnique({ where: { id: userId } })
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'DEVELOPER'

    const where: any = {}
    if (!isAdmin) {
        where.status = 'PUBLISHED'
        where.OR = [
            { targetProfessions: { isEmpty: true } },
            { targetProfessions: { has: user?.profession } }
        ]
    }

    const events = await prisma.trainingEvent.findMany({
        where,
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

    try {
        const userId = Number(c.req.header('X-User-Id'))
        const user = await prisma.user.findUnique({ where: { id: userId } })

        // Security check: Only ADMIN or DEVELOPER can create training events
        const isAdmin = user?.role === 'ADMIN' || user?.role === 'DEVELOPER'
        if (!isAdmin) {
            return c.json({ error: 'Only administrators can create training events' }, 403)
        }

        // Determine status based on role
        let finalStatus = data.status || 'DRAFT'

        const event = await prisma.trainingEvent.create({
            data: {
                title: data.title,
                description: data.description,
                startTime: new Date(data.startTime),
                endTime: new Date(data.endTime),
                location: data.location,
                videoUrl: data.videoUrl,
                status: finalStatus,
                authorId: userId,
                targetProfessions: data.targetProfessions || [],
                materialsUrl: data.materialsUrl,
                facilityId: data.facilityId ? Number(data.facilityId) : null,
                departmentId: data.departmentId ? Number(data.departmentId) : null,
            }
        })
        return c.json(event, 201)
    } catch (error: any) {
        console.error('Failed to create training event:', error)
        return c.json({ error: 'Failed to create training event', details: error.message }, 500)
    }
})

// /api/training/events/:id
app.get('/events/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    const event = await prisma.trainingEvent.findUnique({
        where: { id },
        include: {
            responses: {
                include: { user: { include: { facility: true, department: true } } }
            }
        }
    })

    if (!event) {
        return c.json({ error: 'Not found' }, 404)
    }

    const mappedEvent = {
        ...event,
        responses: event.responses.map(r => ({
            ...r,
            user: {
                ...r.user,
                facility: r.user.facility.name,
                department: r.user.department.name
            }
        }))
    }
    return c.json(mappedEvent)
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
            location: data.location,
            videoUrl: data.videoUrl,
            status: data.status,
            targetProfessions: data.targetProfessions || [],
            materialsUrl: data.materialsUrl,
            facilityId: data.facilityId ? Number(data.facilityId) : null,
            departmentId: data.departmentId ? Number(data.departmentId) : null,
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

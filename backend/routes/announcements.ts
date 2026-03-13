import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'
import { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

// Get Announcements (User view)
app.get('/', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const userId = Number(c.req.header('X-User-Id'))

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return c.json([]) // Should probably 401

    const facilityId = user.facilityId;

    const now = new Date()

    const announcements = await prisma.announcement.findMany({
        where: {
            displayUntil: { gte: now },
            OR: [
                { facilityId: null }, // Global
                { facilityId: facilityId || -1 } // Facility specific
            ]
        },
        orderBy: { createdAt: 'desc' } // Changed from priority to createdAt for consistency with admin
    })
    return c.json(announcements)
})

// Create Announcement
app.post('/', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const userId = Number(c.req.header('X-User-Id'))
    const data = await c.req.json()

    if (!data.title || !data.content) {
        return c.json({ error: 'Title and content are required' }, 400)
    }

    try {
        const announcement = await prisma.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                priority: data.priority || 'NORMAL',
                displayUntil: data.displayUntil ? new Date(data.displayUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
                facilityId: data.facilityId ? Number(data.facilityId) : null,
                departmentId: data.departmentId ? Number(data.departmentId) : null,
                createdBy: userId,
            }
        })
        return c.json(announcement, 201)
    } catch (error: any) {
        console.error('Failed to create announcement:', error)
        return c.json({ error: 'Failed to create announcement', details: error.message }, 500)
    }
})

export default app

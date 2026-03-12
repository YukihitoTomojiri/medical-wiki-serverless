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

export default app

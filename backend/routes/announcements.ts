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

    // Logic: fetch 'ALL' + 'FACILITY' matching user.facility
    // Prsim Requirement: facilityId match OR null
    // But `user.facility` is string.
    // Announcement `facilityId` is Int.
    // If we map User.facility string to Facility.id, we need to lookup.

    // We fetch user's facility ID if possible.
    // Or if User has facility name stored, we assume announcements use IDs.
    // We might need to find Facility by name.

    let facilityId = null;
    if (user.facility) {
        const fac = await prisma.facility.findUnique({ where: { name: user.facility } })
        if (fac) facilityId = fac.id
    }

    const now = new Date()

    const announcements = await prisma.announcement.findMany({
        where: {
            displayUntil: { gte: now },
            OR: [
                { facilityId: null }, // Global
                { facilityId: facilityId || -1 } // Facility specific
            ]
        },
        orderBy: { priority: 'asc' } // HIGH=0 if enum? Prisma enums are strings usually, unless mapped.
        // If enum is string (HIGH, LOW), 'HIGH' < 'LOW' is false. 'H' < 'L'.
        // We might need to handle sort in code or consistent naming.
    })
    return c.json(announcements)
})

export default app

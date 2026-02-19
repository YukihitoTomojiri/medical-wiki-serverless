import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'

const app = new Hono()

// Announcement Management
app.get('/announcements', async (c) => {
    // api.ts calls /admin/announcements
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const announcements = await prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
        include: { creator: { select: { name: true } } }
    })
    return c.json(announcements)
})

app.post('/announcements', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const userId = Number(c.req.header('X-User-Id'))
    const data = await c.req.json()

    const announcement = await prisma.announcement.create({
        data: {
            title: data.title,
            content: data.content,
            priority: data.priority,
            displayUntil: new Date(data.displayUntil),
            facilityId: data.facilityId ? Number(data.facilityId) : null,
            createdBy: userId,
            relatedType: data.relatedType,
            relatedWikiId: data.relatedWikiId ? Number(data.relatedWikiId) : null,
            relatedEventId: data.relatedEventId ? Number(data.relatedEventId) : null
        }
    })
    return c.json(announcement)
})

app.delete('/announcements/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    await prisma.announcement.delete({ where: { id } })
    return c.json({ success: true })
})

// Paid Leave Management
app.get('/paid-leaves', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const leaves = await prisma.paidLeave.findMany({
        where: { type: 'PAID_LEAVE' },
        include: { user: true },
        orderBy: { startDate: 'desc' }
    })
    return c.json(leaves)
})

app.put('/paid-leaves/:id/approve', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    const leave = await prisma.paidLeave.update({
        where: { id },
        data: { status: 'APPROVED' }
    })
    return c.json(leave)
})

app.put('/paid-leaves/:id/reject', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    const leave = await prisma.paidLeave.update({
        where: { id },
        data: { status: 'REJECTED' }
    })
    return c.json(leave)
})

// System Diagnostics (Mock)
app.get('/system/diagnostics', (c) => {
    return c.json({
        uptime: 1000, // Mock for Workers
        memoryTotal: 1024 * 1024 * 1024,
        memoryFree: 512 * 1024 * 1024,
        memoryUsed: 512 * 1024 * 1024,
        dbPing: 10
    })
})

app.get('/system-resources', (c) => {
    return c.json({
        cpuUsage: 15,
        memoryUsage: 45,
        diskUsage: 30
    })
})

app.get('/logs', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const logs = await prisma.systemLog.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' }
    })
    return c.json(logs)
})

app.get('/audit-logs', async (c) => {
    // Mock audit logs or fetch from SystemLog
    return c.json([])
})

app.get('/security/alerts', (c) => {
    return c.json([])
})

app.get('/security/alerts/stats', (c) => {
    return c.json({ totalOpen: 0, criticalOpen: 0, alerts24h: 0 })
})

export default app

import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'
import { Prisma } from '@prisma/client'

const app = new Hono()

// Apply Paid Leave
app.post('/apply', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const userId = Number(c.req.header('X-User-Id'))
    const { startDate, endDate, reason, leaveType } = await c.req.json()

    // Calculate days
    // Logic for validation etc. omitted for brevity but should be here.

    const leave = await prisma.paidLeave.create({
        data: {
            userId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            durationType: leaveType === 'HALF_AM' ? 'HALF_DAY_AM' : leaveType === 'HALF_PM' ? 'HALF_DAY_PM' : 'FULL_DAY',
            type: 'PAID_LEAVE',
            status: 'PENDING'
        }
    })
    return c.json(leave)
})

// Apply Bulk Paid Leave
app.post('/apply-bulk', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const userId = Number(c.req.header('X-User-Id'))
    const requests = await c.req.json()

    const results = []
    for (const req of requests) {
        const leave = await prisma.paidLeave.create({
            data: {
                userId,
                startDate: new Date(req.startDate),
                endDate: new Date(req.endDate),
                reason: req.reason,
                durationType: req.leaveType === 'HALF_AM' ? 'HALF_DAY_AM' : req.leaveType === 'HALF_PM' ? 'HALF_DAY_PM' : 'FULL_DAY',
                type: 'PAID_LEAVE',
                status: 'PENDING'
            }
        })
        results.push(leave)
    }
    return c.json(results)
})

// Get My Paid Leaves
app.get('/history', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const userId = Number(c.req.header('X-User-Id'))

    // api.ts calls /leaves/history
    const leaves = await prisma.paidLeave.findMany({
        where: {
            userId,
            type: 'PAID_LEAVE'
        },
        orderBy: { startDate: 'desc' }
    })
    return c.json(leaves)
})

export default app

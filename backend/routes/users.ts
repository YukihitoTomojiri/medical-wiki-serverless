import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'
import { Prisma } from '@prisma/client'

const app = new Hono()

app.get('/', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const facility = c.req.query('facility')

    const where: Prisma.UserWhereInput = {}
    if (facility && facility !== 'all') {
        where.facility = facility
    }

    const users = await prisma.user.findMany({
        where,
        orderBy: { employeeId: 'asc' }
    })

    const safeUsers = users.map(u => {
        const { password, ...rest } = u
        return rest
    })

    return c.json(safeUsers)
})

app.get('/facilities', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    // Get distinct facilities from Users table (if that's how legacy worked)
    // Or use Facility table?
    // Frontend `api.ts` calling `/api/users/facilities`.
    // Let's use User table distinct for now to match exactly, or Facility table if preferred.
    // Given we have Facility table, maybe better to use that?
    // But `getDistinctFacilities` name implies aggregation.

    const users = await prisma.user.findMany({
        select: { facility: true },
        distinct: ['facility']
    })
    return c.json(users.map(u => u.facility).filter(Boolean))
})

export default app

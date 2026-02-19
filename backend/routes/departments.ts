import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'

const app = new Hono()

app.get('/', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const departments = await prisma.department.findMany({
        include: { facility: true },
        orderBy: { id: 'asc' }
    })
    // Legacy API might expect flat structure or nested
    // Frontend `api.ts` seems to expect array.
    // `OrganizationManagement` uses `facilityId` and `facilityName`.
    return c.json(departments.map(d => ({
        ...d,
        facilityName: d.facility.name
    })))
})

app.get('/by-facility/:facilityId', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const facilityId = Number(c.req.param('facilityId'))
    const departments = await prisma.department.findMany({
        where: { facilityId },
        orderBy: { id: 'asc' }
    })
    return c.json(departments)
})

app.post('/', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const { name, facilityId } = await c.req.json()
    const department = await prisma.department.create({
        data: { name, facilityId: Number(facilityId) },
        include: { facility: true }
    })
    return c.json({ ...department, facilityName: department.facility.name })
})

app.put('/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    const { name } = await c.req.json()
    const department = await prisma.department.update({
        where: { id },
        data: { name },
        include: { facility: true }
    })
    return c.json({ ...department, facilityName: department.facility.name })
})

app.delete('/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    await prisma.department.update({
        where: { id },
        data: { deletedAt: new Date() }
    })
    return c.json({ success: true })
})

export default app

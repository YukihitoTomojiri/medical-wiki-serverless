import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'

const app = new Hono()

app.get('/', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const facilities = await prisma.facility.findMany({
        orderBy: { id: 'asc' }
    })
    return c.json(facilities)
})

app.post('/', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const { name } = await c.req.json()
    const facility = await prisma.facility.create({
        data: { name }
    })
    return c.json(facility)
})

app.put('/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    const { name } = await c.req.json()
    const facility = await prisma.facility.update({
        where: { id },
        data: { name }
    })
    return c.json(facility)
})

app.delete('/:id', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const id = Number(c.req.param('id'))
    await prisma.facility.update({
        where: { id },
        data: { deletedAt: new Date() } // Soft delete
    })
    return c.json({ success: true })
})

export default app

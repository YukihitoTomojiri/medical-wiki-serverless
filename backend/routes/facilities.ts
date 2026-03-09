import { Hono } from 'hono'
import { OrgService } from '../services/orgService'
import { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
    const facilities = await OrgService.getFacilities(c.env.DATABASE_URL as string)
    return c.json(facilities)
})

app.post('/', async (c) => {
    const { name } = await c.req.json()
    const facility = await OrgService.createFacility(c.env.DATABASE_URL as string, name)
    return c.json(facility)
})

app.put('/:id', async (c) => {
    const id = Number(c.req.param('id'))
    const { name } = await c.req.json()
    const facility = await OrgService.updateFacility(c.env.DATABASE_URL as string, id, name)
    return c.json(facility)
})

app.delete('/:id', async (c) => {
    const id = Number(c.req.param('id'))
    await OrgService.deleteFacility(c.env.DATABASE_URL as string, id)
    return c.json({ success: true })
})

export default app

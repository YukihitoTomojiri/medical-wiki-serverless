import { Hono } from 'hono'
import { OrgService } from '../services/orgService'
import { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
    const departments = await OrgService.getDepartments(c.env.DATABASE_URL as string)
    return c.json(departments.map(d => ({
        ...d,
        facilityName: d.facility.name
    })))
})

app.get('/by-facility/:facilityId', async (c) => {
    const facilityId = Number(c.req.param('facilityId'))
    const departments = await OrgService.getDepartmentsByFacility(c.env.DATABASE_URL as string, facilityId)
    return c.json(departments)
})

app.post('/', async (c) => {
    const { name, facilityId } = await c.req.json()
    const department = await OrgService.createDepartment(c.env.DATABASE_URL as string, name, Number(facilityId))
    return c.json({ ...department, facilityName: department.facility.name })
})

app.put('/:id', async (c) => {
    const id = Number(c.req.param('id'))
    const { name } = await c.req.json()
    const department = await OrgService.updateDepartment(c.env.DATABASE_URL as string, id, name)
    return c.json({ ...department, facilityName: department.facility.name })
})

app.delete('/:id', async (c) => {
    const id = Number(c.req.param('id'))
    await OrgService.deleteDepartment(c.env.DATABASE_URL as string, id)
    return c.json({ success: true })
})

export default app

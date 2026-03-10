import { Hono } from 'hono'
import { UserService } from '../services/userService'
import { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
    const facility = c.req.query('facility')
    // Note: 'facility' param comes as a string, often ID now due to the frontend changes we will make.
    // However, if the frontend currently sends `name`, we might need to look it up or filter manually.
    // For now assuming we filter by facilityId if numeric, or we'll update frontend to send facilityId.
    let facilityId: number | undefined;
    if (facility && facility !== 'all' && !isNaN(Number(facility))) {
        facilityId = Number(facility);
    }

    const users = await UserService.getUsers(c.env.DATABASE_URL as string, facilityId)

    const safeUsers = users.map(u => {
        const { password, ...rest } = u
        return {
            ...rest,
            facility: u.facility.name,
            department: u.department.name
        }
    })

    return c.json(safeUsers)
})

app.get('/facilities', async (c) => {
    // This is used to populate facility filters for users.
    // Since we formalized facilities, we just return the full list of distinct facility names, or objects.
    // Frontend expects array of strings or objects? If array of strings: `users.map(u => u.facility)`
    const facilities = await UserService.getDistinctFacilities(c.env.DATABASE_URL as string)
    // Map to names to maintain backward compatibility with old `facilities` endpoint which returned array of strings.
    return c.json(facilities.map(f => f.name).filter(Boolean))
})

export default app

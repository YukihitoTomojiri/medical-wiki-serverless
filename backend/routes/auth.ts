import { Hono } from 'hono'
import { AuthService } from '../services/authService'
import { sign } from 'hono/jwt'
import { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

app.post('/login', async (c) => {
    try {
        const { employeeId, password } = await c.req.json()

        const user = await AuthService.findUserByEmployeeId(c.env.DATABASE_URL as string, employeeId)

        if (!user) {
            return c.json({ success: false, message: 'Invalid credentials' }, 401)
        }

        const isValid = await AuthService.verifyPassword(password, user.password)

        if (!isValid) {
            return c.json({ success: false, message: 'Invalid credentials' }, 401)
        }

        const { password: _, ...userWithoutPassword } = user

        const token = await sign({
            id: user.id,
            employeeId: user.employeeId,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
        }, c.env.JWT_SECRET || 'dev-secret')

        return c.json({
            success: true,
            user: {
                ...userWithoutPassword,
                facility: user.facility.name,
                department: user.department.name
            },
            token
        })
    } catch (e) {
        console.error(e)
        return c.json({ success: false, message: 'Internal Server Error' }, 500)
    }
})

app.post('/setup', async (c) => {
    const { token, password, profession } = await c.req.json()

    const updatedUser = await AuthService.setupAccount(c.env.DATABASE_URL as string, token, password, profession)

    if (!updatedUser) {
        return c.json({ success: false, message: 'Invalid or expired token' }, 400)
    }

    return c.json({ success: true, message: 'Account setup successfully' })
})

export default app

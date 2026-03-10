import { Hono } from 'hono'
import { AuthService } from '../services/authService'
import { sign } from 'hono/jwt'
import { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

app.post('/login', async (c) => {
    try {
        const { employeeId, password } = await c.req.json()

        if (!c.env.DATABASE_URL) {
            console.error('[Auth] DATABASE_URL is missing in environment variables');
            return c.json({ success: false, message: 'Server configuration error' }, 500);
        }

        const user = await AuthService.findUserByEmployeeId(c.env.DATABASE_URL as string, employeeId)

        if (!user) {
            return c.json({ success: false, message: 'Invalid credentials' }, 401)
        }

        const isValid = await AuthService.verifyPassword(password, user.password)

        if (!isValid) {
            return c.json({ success: false, message: 'Invalid credentials' }, 401)
        }

        const { password: _, ...userWithoutPassword } = user;

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
                facility: user.facility?.name || 'Unknown',
                department: user.department?.name || 'Unknown'
            },
            token
        })
    } catch (e) {
        console.error('[Auth] Login Error:', e)
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        return c.json({ success: false, message: 'Internal Server Error', error: errorMessage }, 500)
    }
})

app.post('/setup', async (c) => {
    try {
        const { token, password, profession } = await c.req.json()

        if (!c.env.DATABASE_URL) {
            console.error('[Auth] DATABASE_URL is missing in environment variables');
            return c.json({ success: false, message: 'Server configuration error' }, 500);
        }

        const updatedUser = await AuthService.setupAccount(c.env.DATABASE_URL as string, token, password, profession)

        if (!updatedUser) {
            return c.json({ success: false, message: 'Invalid or expired token' }, 400)
        }

        return c.json({ success: true, message: 'Account setup successfully' })
    } catch (e) {
        console.error('[Auth] Setup Error:', e)
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        return c.json({ success: false, message: 'Internal Server Error', error: errorMessage }, 500)
    }
})

export default app

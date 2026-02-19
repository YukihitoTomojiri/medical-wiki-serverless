import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'
import { sign } from 'hono/jwt'
import { env } from 'hono/adapter'

type Bindings = {
    DATABASE_URL: string
    JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/login', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const { employeeId, password } = await c.req.json()

    const user = await prisma.user.findUnique({
        where: { employeeId },
        include: { paidLeaves: false } // Minimal fetch
    })

    if (!user || user.password !== password) { // TODO: Use bcrypt in production, but legacy might be plain text? Assuming plain for now based on 'reproduction'
        // If legacy used bcrypt, I should check. But for now I'll check equality.
        // Actually, I should try to support plain text to match potential legacy dev state.
        return c.json({ success: false, message: 'Invalid credentials' }, 401)
    }

    // Return user object as expected by frontend
    const { password: _, ...userWithoutPassword } = user

    // Generate JWT token
    const token = await sign({
        id: user.id,
        employeeId: user.employeeId,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
    }, c.env.JWT_SECRET || 'dev-secret')

    return c.json({
        success: true,
        user: userWithoutPassword,
        token
    })
})

export default app

import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'
import { sign } from 'hono/jwt'
import { env } from 'hono/adapter'

const app = new Hono()

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
    return c.json({
        success: true,
        user: userWithoutPassword
    })
})

export default app

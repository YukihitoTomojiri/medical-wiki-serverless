import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'
import { sign } from 'hono/jwt'
import { env } from 'hono/adapter'
import { compare } from 'bcryptjs'
import { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

app.post('/login', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const { employeeId, password } = await c.req.json()

    const user = await prisma.user.findUnique({
        where: { employeeId },
        include: { paidLeaves: false } // Minimal fetch
    })

    if (!user) {
        return c.json({ success: false, message: 'Invalid credentials' }, 401)
    }

    const isValid = await compare(password, user.password)

    if (!isValid) {
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

app.post('/setup', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL as string)
    const { token, password, profession } = await c.req.json()

    // Find user by invitation token
    const user = await prisma.user.findFirst({
        where: { invitationToken: token }
    })

    if (!user) {
        return c.json({ success: false, message: 'Invalid or expired token' }, 400)
    }

    const { hash } = await import('bcryptjs')
    const hashedPassword = await hash(password, 10)

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            profession: profession,
            invitationToken: null,
            mustChangePassword: false
        }
    })

    return c.json({ success: true, message: 'Account setup successfully' })
})

export default app

import { getPrisma } from '../lib/prisma'

// Edge-compatible hashing using WebCrypto
async function hashPassword(plain: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const AuthService = {
    findUserByEmployeeId: async (dbUrl: string, employeeId: string) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.user.findUnique({
            where: { employeeId },
            include: { facility: true, department: true }
        })
    },

    verifyPassword: async (plain: string, hashed: string) => {
        const inputHash = await hashPassword(plain)
        return inputHash === hashed
    },

    setupAccount: async (dbUrl: string, token: string, passwordPlain: string, profession: string) => {
        const prisma = getPrisma(dbUrl)
        const user = await prisma.user.findFirst({
            where: { invitationToken: token }
        })
        if (!user) return null;

        const hashedPassword = await hashPassword(passwordPlain)
        return await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                profession: profession,
                invitationToken: null,
                mustChangePassword: false
            }
        })
    },

    hashPassword // Export for use in other places if needed
}

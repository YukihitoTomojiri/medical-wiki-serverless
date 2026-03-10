import { getPrisma } from '../lib/prisma'
import { Prisma } from '@prisma/client'

export const UserService = {
    getUsers: async (dbUrl: string, facilityId?: number) => {
        const prisma = getPrisma(dbUrl)
        const where: Prisma.UserWhereInput = {}
        if (facilityId) {
            where.facilityId = facilityId
        }
        return await prisma.user.findMany({
            where,
            orderBy: { employeeId: 'asc' },
            include: { facility: true, department: true }
        })
    },
    getDistinctFacilities: async (dbUrl: string) => {
        const prisma = getPrisma(dbUrl)
        // Since facilities are now a separate model, we can just return all facilities that have users
        // But simply returning all facilities is probably better / cleaner
        return await prisma.facility.findMany({
            orderBy: { name: 'asc' }
        })
    }
}

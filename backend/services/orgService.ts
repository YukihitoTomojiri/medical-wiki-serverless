import { getPrisma } from '../lib/prisma'

export const OrgService = {
    // Facilities
    getFacilities: async (dbUrl: string) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.facility.findMany({
            where: { deletedAt: null },
            orderBy: { id: 'asc' }
        })
    },
    createFacility: async (dbUrl: string, name: string) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.facility.create({
            data: { name }
        })
    },
    updateFacility: async (dbUrl: string, id: number, name: string) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.facility.update({
            where: { id },
            data: { name }
        })
    },
    deleteFacility: async (dbUrl: string, id: number) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.facility.update({
            where: { id },
            data: { deletedAt: new Date() }
        })
    },

    // Departments
    getDepartments: async (dbUrl: string) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.department.findMany({
            where: { deletedAt: null },
            include: { facility: true },
            orderBy: { id: 'asc' }
        })
    },
    getDepartmentsByFacility: async (dbUrl: string, facilityId: number) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.department.findMany({
            where: { facilityId, deletedAt: null },
            orderBy: { id: 'asc' }
        })
    },
    createDepartment: async (dbUrl: string, name: string, facilityId: number) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.department.create({
            data: { name, facilityId },
            include: { facility: true }
        })
    },
    updateDepartment: async (dbUrl: string, id: number, name: string) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.department.update({
            where: { id },
            data: { name },
            include: { facility: true }
        })
    },
    deleteDepartment: async (dbUrl: string, id: number) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.department.update({
            where: { id },
            data: { deletedAt: new Date() }
        })
    },

    // Professions
    getProfessions: async (dbUrl: string) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.profession.findMany({
            orderBy: { id: 'asc' }
        })
    },
    createProfession: async (dbUrl: string, name: string, description?: string) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.profession.create({
            data: { name, description }
        })
    },
    updateProfession: async (dbUrl: string, id: number, name: string, description?: string) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.profession.update({
            where: { id },
            data: { name, description }
        })
    },
    deleteProfession: async (dbUrl: string, id: number) => {
        const prisma = getPrisma(dbUrl)
        return await prisma.profession.delete({
            where: { id }
        })
    }
}

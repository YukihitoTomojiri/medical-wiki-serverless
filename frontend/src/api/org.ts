import { API_BASE, getHeaders } from './helpers';

export const orgApi = {
    getFacilities: async (userId: number): Promise<any[]> => {
        const res = await fetch(`${API_BASE}/facilities`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    createFacility: async (name: string, userId: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/facilities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getHeaders(userId) },
            body: JSON.stringify({ name }),
        });
        return res.json();
    },

    updateFacility: async (id: number, name: string, userId: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/facilities/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getHeaders(userId) },
            body: JSON.stringify({ name }),
        });
        return res.json();
    },

    deleteFacility: async (id: number, userId: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/facilities/${id}`, {
            method: 'DELETE',
            headers: getHeaders(userId),
        });
        return res.json();
    },

    getDepartments: async (userId: number): Promise<any[]> => {
        const res = await fetch(`${API_BASE}/departments`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    getDepartmentsByFacility: async (facilityId: number, userId: number): Promise<any[]> => {
        const res = await fetch(`${API_BASE}/departments/by-facility/${facilityId}`, {
            headers: getHeaders(userId),
        });
        if (!res.ok) return [];
        return res.json();
    },

    createDepartment: async (name: string, facilityId: number, userId: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/departments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getHeaders(userId) },
            body: JSON.stringify({ name, facilityId }),
        });
        return res.json();
    },

    updateDepartment: async (id: number, name: string, userId: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/departments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getHeaders(userId) },
            body: JSON.stringify({ name }),
        });
        return res.json();
    },

    deleteDepartment: async (id: number, userId: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/departments/${id}`, {
            method: 'DELETE',
            headers: getHeaders(userId),
        });
        return res.json();
    },

    getProfessions: async (): Promise<any[]> => {
        const res = await fetch(`${API_BASE}/professions`);
        if (!res.ok) return [];
        return res.json();
    },

    createProfession: async (userId: number, name: string, description?: string): Promise<any> => {
        const res = await fetch(`${API_BASE}/professions`, {
            method: 'POST',
            headers: getHeaders(userId),
            body: JSON.stringify({ name, description }),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || '職種の作成に失敗しました');
        }
        return res.json();
    },

    deleteProfession: async (userId: number, id: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/professions/${id}`, {
            method: 'DELETE',
            headers: getHeaders(userId),
        });
        return res.json();
    },

    updateProfession: async (userId: number, id: number, name: string, description?: string): Promise<any> => {
        const res = await fetch(`${API_BASE}/professions/${id}`, {
            method: 'PUT',
            headers: getHeaders(userId),
            body: JSON.stringify({ name, description }),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || '職種の更新に失敗しました');
        }
        return res.json();
    },
};

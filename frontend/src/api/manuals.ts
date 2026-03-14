import { Manual, Progress, UserProgress } from '../types';
import { API_BASE, getHeaders } from './helpers';

export const manualsApi = {
    getManuals: async (userId: number, options?: { category?: string; isMine?: boolean }): Promise<Manual[]> => {
        const params = new URLSearchParams();
        if (options?.category) params.append('category', options.category);
        if (options?.isMine) params.append('isMine', 'true');
        
        const queryString = params.toString();
        const url = queryString ? `${API_BASE}/manuals?${queryString}` : `${API_BASE}/manuals`;
        const res = await fetch(url, { headers: getHeaders(userId) });
        return res.json();
    },

    getManual: async (userId: number, id: number): Promise<Manual> => {
        const res = await fetch(`${API_BASE}/manuals/${id}`, { headers: getHeaders(userId) });
        return res.json();
    },

    getCategories: async (): Promise<string[]> => {
        const res = await fetch(`${API_BASE}/manuals/categories`);
        return res.json();
    },

    createManual: async (userId: number, data: { title: string; content: string; category: string; targetProfessions?: string[]; status?: string }): Promise<Manual> => {
        const res = await fetch(`${API_BASE}/manuals`, {
            method: 'POST',
            headers: getHeaders(userId),
            body: JSON.stringify(data),
        });
        return res.json();
    },

    updateManual: async (userId: number, id: number, data: { title: string; content: string; category: string; targetProfessions?: string[]; status?: string }): Promise<Manual> => {
        const res = await fetch(`${API_BASE}/manuals/${id}`, {
            method: 'PUT',
            headers: getHeaders(userId),
            body: JSON.stringify(data),
        });
        return res.json();
    },

    uploadPdf: async (userId: number, id: number, file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE}/manuals/${id}/pdf`, {
            method: 'POST',
            headers: { 'X-User-Id': userId.toString() },
            body: formData,
        });
        return res.text();
    },

    // Progress
    markAsRead: async (userId: number, manualId: number): Promise<Progress> => {
        const res = await fetch(`${API_BASE}/progress/${manualId}`, {
            method: 'POST',
            headers: getHeaders(userId),
        });
        return res.json();
    },

    getMyProgress: async (userId: number): Promise<Progress[]> => {
        const res = await fetch(`${API_BASE}/progress/my`, { headers: getHeaders(userId) });
        return res.json();
    },

    getAllUsersProgress: async (): Promise<UserProgress[]> => {
        const res = await fetch(`${API_BASE}/progress/admin/all`);
        return res.json();
    },
};

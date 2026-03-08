import { API_BASE, getHeaders } from './helpers';

export interface Announcement {
    id: number;
    title: string;
    content: string;
    priority: 'HIGH' | 'NORMAL' | 'LOW';
    displayUntil: string;
    facilityId?: number;
    createdAt: string;
    relatedWikiId?: number;
    relatedWikiTitle?: string;
    relatedEventId?: number;
    relatedEventTitle?: string;
    relatedType?: 'WIKI' | 'TRAINING_EVENT';
}

export const announcementsApi = {
    getAnnouncements: async (userId: number): Promise<Announcement[]> => {
        const res = await fetch(`${API_BASE}/announcements`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    getAdminAnnouncements: async (userId: number): Promise<Announcement[]> => {
        const res = await fetch(`${API_BASE}/admin/announcements`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    createAnnouncement: async (userId: number, data: {
        title: string;
        content: string;
        priority: string;
        displayUntil: string;
        facilityId?: number | null;
        relatedWikiId?: number | null;
        relatedEventId?: number | null;
        relatedType?: 'WIKI' | 'TRAINING_EVENT' | null;
    }): Promise<Announcement> => {
        const res = await fetch(`${API_BASE}/admin/announcements`, {
            method: 'POST',
            headers: getHeaders(userId),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create announcement');
        return res.json();
    },

    updateAnnouncement: async (userId: number, id: number, data: {
        title: string;
        content: string;
        priority: string;
        displayUntil: string;
        relatedWikiId?: number | null;
        relatedEventId?: number | null;
        relatedType?: 'WIKI' | 'TRAINING_EVENT' | null;
    }): Promise<Announcement> => {
        const res = await fetch(`${API_BASE}/admin/announcements/${id}`, {
            method: 'PUT',
            headers: getHeaders(userId),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update announcement');
        return res.json();
    },

    deleteAnnouncement: async (userId: number, id: number): Promise<void> => {
        const res = await fetch(`${API_BASE}/admin/announcements/${id}`, {
            method: 'DELETE',
            headers: getHeaders(userId),
        });
        if (!res.ok) throw new Error('Failed to delete announcement');
    },
};

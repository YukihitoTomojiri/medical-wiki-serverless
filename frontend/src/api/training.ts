import { API_BASE, getHeaders } from './helpers';

export interface TrainingEvent {
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    videoUrl?: string;
    videoUrl2?: string;
    videoUrl3?: string;
    materialsUrl?: string;
    facilityId?: number | null;
    departmentId?: number | null;
    status?: string;
    targetProfessions?: string[];
    targetCommitteeId?: number;
    targetJobType?: string;
    qrCodeToken?: string;
    authorId?: number | null;
    createdAt: string;
}

export interface TrainingResponse {
    id: number;
    eventId: number;
    userId: number;
    attendeeName: string;
    answersJson: string;
    attendedAt: string;
}

export interface Committee {
    id: number;
    name: string;
    description: string;
}

export const trainingApi = {
    getTrainingEvents: async (userId: number): Promise<TrainingEvent[]> => {
        const res = await fetch(`${API_BASE}/training/events`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    getTrainingEvent: async (userId: number, id: number): Promise<TrainingEvent> => {
        const res = await fetch(`${API_BASE}/training/events/${id}`, { headers: getHeaders(userId) });
        if (!res.ok) throw new Error('Training event not found');
        return res.json();
    },

    getAdminTrainingEvents: async (userId: number): Promise<TrainingEvent[]> => {
        const res = await fetch(`${API_BASE}/training/events/admin`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    createTrainingEvent: async (userId: number, data: any): Promise<TrainingEvent> => {
        const res = await fetch(`${API_BASE}/training/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getHeaders(userId) },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error || 'Failed to create event');
        }
        return res.json();
    },

    updateTrainingEvent: async (userId: number, id: number, data: any): Promise<TrainingEvent> => {
        const res = await fetch(`${API_BASE}/training/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getHeaders(userId) },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error || 'Failed to update event');
        }
        return res.json();
    },

    deleteTrainingEvent: async (userId: number, id: number): Promise<void> => {
        const res = await fetch(`${API_BASE}/training/events/${id}`, {
            method: 'DELETE',
            headers: getHeaders(userId),
        });
        if (!res.ok) throw new Error('Failed to delete event');
    },

    getTrainingQrCode: async (userId: number, id: number): Promise<string> => {
        const res = await fetch(`${API_BASE}/training/events/${id}/qrcode`, { headers: getHeaders(userId) });
        if (!res.ok) throw new Error('Failed to get QR code');
        const data = await res.json();
        return data.url;
    },

    getCommittees: async (userId: number): Promise<Committee[]> => {
        const res = await fetch(`${API_BASE}/committees`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    createCommittee: async (userId: number, name: string, description: string): Promise<Committee> => {
        const res = await fetch(`${API_BASE}/committees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getHeaders(userId) },
            body: JSON.stringify({ name, description }),
        });
        if (!res.ok) throw new Error('Failed to create committee');
        return res.json();
    },

    getMyTrainingResponses: async (userId: number): Promise<TrainingResponse[]> => {
        const res = await fetch(`${API_BASE}/training/responses/me`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    submitTrainingResponse: async (userId: number, eventId: number, answersJson: string): Promise<TrainingResponse> => {
        const res = await fetch(`${API_BASE}/training/responses/${eventId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getHeaders(userId) },
            body: JSON.stringify({ answersJson }),
        });
        if (!res.ok) throw new Error('Failed to submit response');
        return res.json();
    },

    getTrainingResponses: async (userId: number, eventId: number): Promise<TrainingResponse[]> => {
        const res = await fetch(`${API_BASE}/training/responses/${eventId}`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    exportTrainingResponses: async (eventId: number): Promise<string> => {
        const res = await fetch(`${API_BASE}/training/responses/${eventId}/export`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return res.text();
    },

    // Training Records (研修完了記録)
    completeTraining: async (userId: number, announcementId: number): Promise<{ message: string; alreadyCompleted: boolean }> => {
        const res = await fetch(`${API_BASE}/training-records`, {
            method: 'POST',
            headers: getHeaders(userId),
            body: JSON.stringify({ announcementId }),
        });
        if (!res.ok) throw new Error('Failed to complete training');
        return res.json();
    },

    checkTrainingCompletion: async (userId: number, announcementId: number): Promise<{ completed: boolean }> => {
        const res = await fetch(`${API_BASE}/training-records/check?announcementId=${announcementId}`, {
            headers: getHeaders(userId),
        });
        if (!res.ok) return { completed: false };
        return res.json();
    },

    getTrainingStats: async (userId: number, announcementId?: number): Promise<any> => {
        const url = announcementId
            ? `${API_BASE}/admin/training-records/stats?announcementId=${announcementId}`
            : `${API_BASE}/admin/training-records/stats`;
        const res = await fetch(url, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },
};

import { API_BASE, getHeaders } from './helpers';

export const leavesApi = {
    // Attendance Requests
    submitAttendanceRequest: async (
        userId: number, type: string, durationType: string | null,
        startDate: string, endDate: string, startTime: string, endTime: string, reason: string
    ): Promise<any> => {
        const response = await fetch(`${API_BASE}/attendance/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': userId.toString() },
            body: JSON.stringify({ type, durationType, startDate, endDate, startTime, endTime, reason })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || '勤怠申請の送信に失敗しました');
        }
        return response.json();
    },

    getMyAttendanceRequests: async (userId: number): Promise<any[]> => {
        const response = await fetch(`${API_BASE}/attendance/requests/my`, {
            headers: { 'X-User-Id': userId.toString() }
        });
        if (!response.ok) throw new Error('Failed to fetch attendance requests');
        return response.json();
    },

    getMyPaidLeaves: async (userId: number): Promise<any[]> => {
        const response = await fetch(`${API_BASE}/leaves/history`, {
            headers: { 'X-User-Id': userId.toString() }
        });
        if (!response.ok) throw new Error('Failed to fetch paid leave history');
        return response.json();
    },

    submitPaidLeave: async (userId: number, startDate: string, endDate: string, reason: string, leaveType: string): Promise<any> => {
        const response = await fetch(`${API_BASE}/leaves/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': userId.toString() },
            body: JSON.stringify({ startDate, endDate, reason, leaveType })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || '有給申請の送信に失敗しました');
        }
        return response.json();
    },

    submitBulkPaidLeave: async (
        userId: number,
        requests: Array<{ startDate: string; endDate: string; reason: string; leaveType: string }>
    ): Promise<any[]> => {
        const response = await fetch(`${API_BASE}/leaves/apply-bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-Id': userId.toString() },
            body: JSON.stringify(requests)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || '一括申請の送信に失敗しました');
        }
        return response.json();
    },

    getAllAttendanceRequests: async (userId: number): Promise<any[]> => {
        const res = await fetch(`${API_BASE}/admin/attendance/requests`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    getAllPaidLeaves: async (userId: number): Promise<any[]> => {
        const res = await fetch(`${API_BASE}/admin/paid-leaves`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    approvePaidLeave: async (userId: number, id: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/paid-leaves/${id}/approve`, {
            method: 'PUT', headers: getHeaders(userId),
        });
        return res.json();
    },

    rejectPaidLeave: async (userId: number, id: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/paid-leaves/${id}/reject`, {
            method: 'PUT', headers: getHeaders(userId),
        });
        return res.json();
    },

    approveAttendanceRequest: async (userId: number, id: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/attendance/requests/${id}/approve`, {
            method: 'PUT', headers: getHeaders(userId),
        });
        return res.json();
    },

    rejectAttendanceRequest: async (userId: number, id: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/attendance/requests/${id}/reject`, {
            method: 'PUT', headers: getHeaders(userId),
        });
        return res.json();
    },

    bulkApprovePaidLeaves: async (userId: number, ids: number[]): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/paid-leaves/bulk-approve`, {
            method: 'POST',
            headers: { ...getHeaders(userId), 'Content-Type': 'application/json' },
            body: JSON.stringify(ids),
        });
        return res.status === 200;
    },

    bulkApproveAttendanceRequests: async (userId: number, ids: number[]): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/attendance/requests/bulk-approve`, {
            method: 'POST',
            headers: { ...getHeaders(userId), 'Content-Type': 'application/json' },
            body: JSON.stringify(ids),
        });
        return res.status === 200;
    },
};

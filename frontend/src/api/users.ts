import { User, UserUpdateRequest, UserCreateRequest } from '../types';
import { API_BASE, getHeaders } from './helpers';

export const usersApi = {
    getUsers: async (userId: number, facility?: string): Promise<User[]> => {
        const url = facility && facility !== 'all'
            ? `${API_BASE}/users?facility=${encodeURIComponent(facility)}`
            : `${API_BASE}/users`;
        const res = await fetch(url, { headers: getHeaders(userId) });
        return res.json();
    },

    updateUser: async (userId: number, id: number, data: UserUpdateRequest): Promise<User> => {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            method: 'PUT',
            headers: getHeaders(userId),
            body: JSON.stringify(data),
        });
        return res.json();
    },

    getDistinctFacilities: async (): Promise<string[]> => {
        const res = await fetch(`${API_BASE}/users/facilities`);
        if (!res.ok) return [];
        return res.json();
    },

    registerUser: async (userId: number, data: UserCreateRequest): Promise<any> => {
        const res = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: getHeaders(userId),
            body: JSON.stringify(data),
        });
        return res.json();
    },

    bulkDeleteUsers: async (userId: number, ids: number[]): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/users/bulk-delete`, {
            method: 'POST',
            headers: getHeaders(userId),
            body: JSON.stringify(ids),
        });
        return res.json();
    },

    bulkResetProgress: async (userId: number, ids: number[]): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/users/bulk-reset-progress`, {
            method: 'POST',
            headers: getHeaders(userId),
            body: JSON.stringify(ids),
        });
        return res.json();
    },

    bulkRegisterUsers: async (userId: number, data: UserCreateRequest[]): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/users/bulk-register`, {
            method: 'POST',
            headers: getHeaders(userId),
            body: JSON.stringify(data),
        });
        return res.json();
    },

    bulkRegisterUsersV2: async (userId: number, data: { users: UserCreateRequest[], restoreIds: string[] }): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/users/bulk-register-v2`, {
            method: 'POST',
            headers: getHeaders(userId),
            body: JSON.stringify(data),
        });
        return res.json();
    },

    validateBulkCsv: async (userId: number, data: UserCreateRequest[]): Promise<{
        isValid: boolean;
        errors: string[];
        restorableUsers: any[];
        validNewUsers: any[];
    }> => {
        const res = await fetch(`${API_BASE}/admin/users/validate-csv`, {
            method: 'POST',
            headers: getHeaders(userId),
            body: JSON.stringify(data),
        });
        return res.json();
    },

    restoreUser: async (userId: number, targetId: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/users/${targetId}/restore`, {
            method: 'POST',
            headers: getHeaders(userId),
        });
        return res.json();
    },

    issueTempPassword: async (userId: number, targetUserId: number): Promise<{ tempPassword: string }> => {
        const res = await fetch(`${API_BASE}/users/${targetUserId}/temp-password`, {
            method: 'POST',
            headers: getHeaders(userId),
        });
        return res.json();
    },

    getAllUsersIncludingDeleted: async (userId: number, facility?: string): Promise<any> => {
        const url = facility && facility !== 'all'
            ? `${API_BASE}/admin/users/all-including-deleted?facility=${encodeURIComponent(facility)}`
            : `${API_BASE}/admin/users/all-including-deleted`;
        const res = await fetch(url, { method: 'GET', headers: getHeaders(userId) });
        return res.json();
    },

    getMyDashboard: async (userId: number): Promise<any> => {
        const response = await fetch(`${API_BASE}/my/summary`, {
            headers: { 'X-User-Id': userId.toString() }
        });
        if (!response.ok) throw new Error('Failed to fetch dashboard');
        return response.json();
    },

    getMyHistory: async (userId: number, startDate?: string): Promise<any[]> => {
        const query = startDate ? `?startDate=${startDate}` : '';
        const response = await fetch(`${API_BASE}/users/me/history${query}`, {
            headers: getHeaders(userId)
        });
        if (!response.ok) throw new Error('Failed to fetch history');
        return response.json();
    },

    getPersonalDashboard: async (userId: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/my/dashboard`, { headers: getHeaders(userId) });
        return res.json();
    },

    updateUserLeaveSettings: async (userId: number, id: number, settings: { paidLeaveDays: number, joinedDate: string }): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/users/${id}/leave-settings`, {
            method: 'PATCH',
            headers: getHeaders(userId),
            body: JSON.stringify(settings)
        });
        return res.json();
    },

    getLeaveStatus: async (userId: number): Promise<{
        remainingDays: number;
        nextGrantDate: string;
        nextGrantDays: number;
        obligatoryDaysTaken?: number;
        obligatoryTarget?: number;
        isObligationMet?: boolean;
        isWarning?: boolean;
        daysRemainingToObligation?: number;
        obligatoryDeadline?: string;
    }> => {
        const response = await fetch(`${API_BASE}/users/me/leave-status`, {
            headers: getHeaders(userId)
        });
        if (!response.ok) throw new Error('Failed to fetch leave status');
        return response.json();
    },
};

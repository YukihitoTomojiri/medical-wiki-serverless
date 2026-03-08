import { LoginRequest, LoginResponse } from '../types';
import { API_BASE, getHeaders } from './helpers';

export const authApi = {
    login: async (request: LoginRequest): Promise<LoginResponse> => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(request),
        });
        return res.json();
    },

    changePassword: async (userId: number, currentPassword: string, newPassword: string): Promise<any> => {
        const res = await fetch(`${API_BASE}/auth/change-password`, {
            method: 'POST',
            headers: getHeaders(userId),
            body: JSON.stringify({ userId, currentPassword, newPassword }),
        });
        return res.json();
    },

    setupAccount: async (token: string, password: string, profession: string): Promise<any> => {
        const res = await fetch(`${API_BASE}/auth/setup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password, profession }),
        });
        return res.json();
    },

    forgotPassword: async (email: string): Promise<any> => {
        const res = await fetch(`${API_BASE}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return res.json();
    },

    resetPassword: async (token: string, password: string): Promise<any> => {
        const res = await fetch(`${API_BASE}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password }),
        });
        return res.json();
    },
};

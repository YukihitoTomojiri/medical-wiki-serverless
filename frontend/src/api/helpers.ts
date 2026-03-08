export const API_BASE = '/api';

export const getHeaders = (userId?: number): Record<string, string> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (userId) {
        headers['X-User-Id'] = userId.toString();
    }
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

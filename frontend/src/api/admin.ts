import { API_BASE, getHeaders } from './helpers';

export interface AdminLeaveMonitoring {
    userId: number;
    userName: string;
    employeeId: string;
    facilityName: string;
    joinedDate: string;
    currentPaidLeaveDays: number;
    obligatoryDaysTaken: number;
    obligatoryTarget: number;
    isObligationMet: boolean;
    needsAttention: boolean;
    daysRemainingToObligation: number;
    currentCycleStart: string;
    currentCycleEnd: string;
    baseDate: string;
    targetEndDate: string;
    isViolation: boolean;
}

export const adminApi = {
    getDiagnostics: async (userId: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/system/diagnostics`, { headers: getHeaders(userId) });
        if (!res.ok) return { uptime: 0, memoryTotal: 0, memoryFree: 0, memoryUsed: 0, dbPing: 0 };
        return res.json();
    },

    getLogs: async (userId: number): Promise<any[]> => {
        const res = await fetch(`${API_BASE}/admin/logs`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    },

    getSystemResources: async (userId: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/system-resources`, { headers: getHeaders(userId) });
        if (!res.ok) return null;
        return res.json();
    },

    getAuditLogs: async (userId: number): Promise<any[]> => {
        const res = await fetch(`${API_BASE}/admin/audit-logs`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    getNodeStatuses: async (): Promise<any[]> => {
        const res = await fetch(`${API_BASE}/nodes/status`);
        if (!res.ok) return [];
        return res.json();
    },

    // Compliance Export
    getComplianceFacilities: async (userId: number): Promise<string[]> => {
        const res = await fetch(`${API_BASE}/admin/compliance/facilities`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    exportComplianceCsv: async (userId: number, facility?: string, start?: string, end?: string): Promise<Blob> => {
        const params = new URLSearchParams();
        if (facility && facility !== 'all') params.append('facility', facility);
        if (start) params.append('startDate', start);
        if (end) params.append('endDate', end);
        const url = `${API_BASE}/admin/export/compliance${params.toString() ? '?' + params.toString() : ''}`;
        const res = await fetch(url, { headers: getHeaders(userId) });
        return res.blob();
    },

    exportCompliancePdf: async (userId: number, facility?: string, start?: string, end?: string): Promise<Blob> => {
        const params = new URLSearchParams();
        if (facility && facility !== 'all') params.append('facility', facility);
        if (start) params.append('start', start);
        if (end) params.append('end', end);
        const url = `${API_BASE}/admin/compliance/export/pdf${params.toString() ? '?' + params.toString() : ''}`;
        const res = await fetch(url, { headers: getHeaders(userId) });
        return res.blob();
    },

    remindUser: async (userId: number, targetUserId: number): Promise<void> => {
        await fetch(`${API_BASE}/admin/notifications/remind/${targetUserId}`, {
            method: 'POST',
            headers: getHeaders(userId),
        });
    },

    getLaggingManuals: async (userId: number): Promise<any[]> => {
        const res = await fetch(`${API_BASE}/admin/manuals/lagging`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    // Security Alerts
    getSecurityAlerts: async (userId: number, openOnly: boolean = false): Promise<any[]> => {
        const url = `${API_BASE}/admin/security/alerts${openOnly ? '?openOnly=true' : ''}`;
        const res = await fetch(url, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },

    getSecurityAlertStats: async (userId: number): Promise<{ totalOpen: number; criticalOpen: number; alerts24h: number }> => {
        const res = await fetch(`${API_BASE}/admin/security/alerts/stats`, { headers: getHeaders(userId) });
        if (!res.ok) return { totalOpen: 0, criticalOpen: 0, alerts24h: 0 };
        return res.json();
    },

    acknowledgeSecurityAlert: async (userId: number, alertId: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/security/alerts/${alertId}/acknowledge`, {
            method: 'POST', headers: getHeaders(userId),
        });
        return res.json();
    },

    resolveSecurityAlert: async (userId: number, alertId: number): Promise<any> => {
        const res = await fetch(`${API_BASE}/admin/security/alerts/${alertId}/resolve`, {
            method: 'POST', headers: getHeaders(userId),
        });
        return res.json();
    },

    grantPaidLeave: async (adminUserId: number, targetUserId: number, daysToGrant: number, reason: string): Promise<void> => {
        const res = await fetch(`${API_BASE}/admin/users/${targetUserId}/grant-leave`, {
            method: 'POST',
            headers: getHeaders(adminUserId),
            body: JSON.stringify({ daysToGrant, reason })
        });
        if (!res.ok) throw new Error('有給付与に失敗しました');
    },

    getAccrualHistory: async (adminUserId: number, targetUserId: number): Promise<any[]> => {
        const res = await fetch(`${API_BASE}/admin/users/${targetUserId}/accrual-history`, {
            headers: getHeaders(adminUserId),
        });
        if (!res.ok) return [];
        return res.json();
    },

    getAdminLeaveMonitoring: async (userId: number): Promise<AdminLeaveMonitoring[]> => {
        const res = await fetch(`${API_BASE}/admin/leave-monitoring`, { headers: getHeaders(userId) });
        if (!res.ok) return [];
        return res.json();
    },
};

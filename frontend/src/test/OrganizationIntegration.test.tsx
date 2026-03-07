// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrganizationManagement from '../pages/OrganizationManagement';
import { api } from '../api';

// Mock the API and AuthContext
vi.mock('../api', () => ({
    api: {
        getFacilities: vi.fn(),
        getDepartments: vi.fn(),
    }
}));

vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: { id: 1, role: 'ADMIN', name: 'Test Admin' },
        isAdmin: true,
        isDeveloper: false,
    })
}));

describe('OrganizationManagement Integration', () => {
    beforeEach(() => {
        vi.resetAllMocks();

        // Setup mock user in localStorage because OrganizationManagement reads from it currently
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: vi.fn((key) => {
                    if (key === 'user') return JSON.stringify({ id: 1, role: 'ADMIN', name: 'Test Admin' });
                    return null;
                }),
                setItem: vi.fn(),
                removeItem: vi.fn(),
            },
            writable: true
        });

        vi.mocked(api.getFacilities).mockResolvedValue([
            { id: 1, name: '本部病院' },
            { id: 2, name: '本部病院介護医療院' },
            { id: 3, name: '後光病院' },
            { id: 4, name: '玉診療所' },
        ]);

        vi.mocked(api.getDepartments).mockResolvedValue([
            { id: 1, name: '理学療法課', facilityId: 1, facilityName: '本部病院' },
            { id: 2, name: '看護部', facilityId: 1, facilityName: '本部病院' },
            { id: 3, name: '介護課', facilityId: 2, facilityName: '本部病院介護医療院' },
            { id: 4, name: '外来', facilityId: 4, facilityName: '玉診療所' },
        ]);
    });

    it('renders exactly 4 facilities on load', async () => {
        render(<OrganizationManagement />);

        // Wait for facilities to load
        await waitFor(() => {
            expect(screen.getByText('本部病院')).toBeInTheDocument();
        });

        expect(screen.getByText('本部病院介護医療院')).toBeInTheDocument();
        expect(screen.getByText('後光病院')).toBeInTheDocument();
        expect(screen.getByText('玉診療所')).toBeInTheDocument();
    });

    it('expands a facility to show its departments', async () => {
        const user = userEvent.setup();
        render(<OrganizationManagement />);

        // Wait for facilities to load
        await waitFor(() => {
            expect(screen.getByText('本部病院')).toBeInTheDocument();
        });

        // Departments should not be visible initially (assuming they are hidden inside accordion)
        // Actually, in the current implementation, they mount conditionally when expandedFacility === facility.id
        expect(screen.queryByText('理学療法課')).not.toBeInTheDocument();

        // Click on the facility to expand
        await user.click(screen.getByText('本部病院'));

        // Wait for departments to appear
        await waitFor(() => {
            expect(screen.getByText('理学療法課')).toBeInTheDocument();
            expect(screen.getByText('看護部')).toBeInTheDocument();
        });

        // Click another facility
        await user.click(screen.getByText('玉診療所'));

        // Wait for its departments to appear
        await waitFor(() => {
            expect(screen.getByText('外来')).toBeInTheDocument();
        });
    });
});

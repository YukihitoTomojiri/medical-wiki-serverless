import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (userData: User, token?: string) => void;
    logout: () => void;
    isAdmin: boolean;
    isDeveloper: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login'; // Force redirect using window location for safety
    }, []);

    const checkTokenExpiration = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                console.log('Token expired, logging out...');
                logout();
                return false;
            }
            return true;
        } catch (e) {
            console.error('Invalid token', e);
            logout();
            return false;
        }
    }, [logout]);

    useEffect(() => {
        // Load user from localStorage on mount
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (savedUser && token) {
            // Check token validity immediately
            if (checkTokenExpiration()) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    console.error('Failed to parse user from localStorage', e);
                    localStorage.removeItem('user');
                }
            }
        } else {
            // If data is inconsistent (user but no token, or vice versa), clear it
            if (savedUser || token) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);

        // Optional: Set up an interval to check token every minute
        const interval = setInterval(() => {
            if (localStorage.getItem('token')) {
                checkTokenExpiration();
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [checkTokenExpiration]);

    const login = (userData: User, token?: string) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('token', token);
        }
    };

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'DEVELOPER';
    const isDeveloper = user?.role === 'DEVELOPER';

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, isDeveloper, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

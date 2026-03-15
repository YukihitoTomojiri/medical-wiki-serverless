import {
    BookOpen, LayoutDashboard, Database, ClipboardList, FileText
} from 'lucide-react';
import { useMemo } from 'react';
import { NavigationDrawer } from './ui/NavigationDrawer';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
    const { user, isAdmin, isDeveloper } = useAuth();

    // Fallback if user is null (shouldn't happen in protected routes)
    if (!user) return null;

    const mainItems = useMemo(() => [
        { path: '/my-dashboard', label: 'Myダッシュボード', icon: LayoutDashboard },
        { path: '/manuals', label: 'マニュアル', icon: BookOpen },
        { path: '/training', label: '研修・アンケート', icon: BookOpen },
        { path: '/my-posts', label: '自分の投稿', icon: FileText },
    ], []);

    const adminItems = useMemo(() => [
        { path: '/admin', label: '管理者ダッシュボード', icon: LayoutDashboard, roles: ['ADMIN', 'DEVELOPER'], end: true },
        { path: '/admin/master', label: 'マスタ管理', icon: Database, roles: ['ADMIN', 'DEVELOPER'] },
        { path: '/admin/operations', label: '運用管理', icon: ClipboardList, roles: ['ADMIN', 'DEVELOPER'] },
    ], []);

    const devItems = useMemo(() => [
        { path: '/developer', label: '開発者ダッシュボード', icon: Database, roles: ['DEVELOPER'] },
    ], []);

    return (
        <div className="flex flex-col h-full bg-m3-surface-container-low border-r border-m3-outline-variant/20 font-sans">
            {/* Branding Area for Mobile/Drawer */}
            {/* Branding Area removed for Modern Header integration */}
            <div className="h-4" />

            <nav className="flex-1 overflow-y-auto px-2 pb-32 flex flex-col">
                <div className="space-y-6">
                    <div>
                        <div className="px-6 mb-2 text-xs font-bold text-m3-outline uppercase tracking-wider">Main</div>
                        <NavigationDrawer items={mainItems} user={user} onItemClick={onClose} />
                    </div>

                    {(isAdmin || isDeveloper) && (
                        <div>
                            <div className="px-6 mb-2 text-xs font-bold text-m3-outline uppercase tracking-wider">Admin</div>
                            <NavigationDrawer items={adminItems} user={user} onItemClick={onClose} />
                        </div>
                    )}
                </div>

                {/* Dynamic Spacer to push Developer Menu towards the bottom (approx 1/4 of viewport) */}
                <div className="flex-1 min-h-[100px]" />

                {isDeveloper && (
                    <div className="mt-auto">
                        <div className="px-6 mb-2 text-xs font-bold text-m3-outline uppercase tracking-wider">System</div>
                        <NavigationDrawer items={devItems} user={user} onItemClick={onClose} />
                    </div>
                )}
            </nav>
        </div>
    );
}

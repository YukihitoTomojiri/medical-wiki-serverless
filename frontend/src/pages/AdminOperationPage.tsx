import { useState } from 'react';
import { Users, Bell, BookOpen } from 'lucide-react';
import AdminPageLayout from '../components/layout/AdminPageLayout';
import AdminUserManagement from './AdminUserManagement';
import AdminAnnouncementManagement from './AdminAnnouncementManagement';
import TrainingAdmin from './TrainingAdmin';
import { useAuth } from '../context/AuthContext';

const tabs = [
    { id: 'users', label: 'ユーザー管理', icon: Users },
    { id: 'announcements', label: 'お知らせ管理', icon: Bell },
    { id: 'training', label: '研修管理', icon: BookOpen },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function AdminOperationPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabId>('users');

    if (!user) return null;

    return (
        <AdminPageLayout
            title="運用管理"
            subtitle="ユーザー、お知らせ、研修など日常運用に関する管理を行います"
            tabs={tabs as unknown as { id: string; label: string; icon: typeof Users }[]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as TabId)}
        >
            {activeTab === 'users' && <AdminUserManagement user={user} />}
            {activeTab === 'announcements' && <AdminAnnouncementManagement user={user} />}
            {activeTab === 'training' && <TrainingAdmin />}
        </AdminPageLayout>
    );
}

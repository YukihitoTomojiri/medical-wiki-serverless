import { useState } from 'react';
import { ClipboardList, Users, Bell, BookOpen } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
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
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="運用管理"
                subtitle="ユーザー、お知らせ、研修など日常運用に関する管理を行います"
                icon={ClipboardList}
            />

            {/* Tab Navigation */}
            <div className="bg-white rounded-[28px] border border-stone-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-stone-200" role="tablist">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all duration-200 border-b-2 -mb-px ${isActive
                                        ? 'border-orange-500 text-orange-700 bg-orange-50/40'
                                        : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-0">
                    {activeTab === 'users' && <AdminUserManagement user={user} />}
                    {activeTab === 'announcements' && <AdminAnnouncementManagement user={user} />}
                    {activeTab === 'training' && <TrainingAdmin />}
                </div>
            </div>
        </div>
    );
}

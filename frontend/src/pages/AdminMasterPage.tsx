import { useState } from 'react';
import { Database, Building2, Briefcase } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import OrganizationManagement from './OrganizationManagement';
import AdminProfessionManagement from './AdminProfessionManagement';

const tabs = [
    { id: 'organization', label: '組織管理', icon: Building2 },
    { id: 'professions', label: '職種管理', icon: Briefcase },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function AdminMasterPage() {
    const [activeTab, setActiveTab] = useState<TabId>('organization');

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="マスタ管理"
                subtitle="組織構成や職種など、システムの基盤データを管理します"
                icon={Database}
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
                    {activeTab === 'organization' && <OrganizationManagement />}
                    {activeTab === 'professions' && <AdminProfessionManagement />}
                </div>
            </div>
        </div>
    );
}

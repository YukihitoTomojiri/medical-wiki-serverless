import { useState } from 'react';
import { Building2, Briefcase } from 'lucide-react';
import AdminPageLayout from '../components/layout/AdminPageLayout';
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
        <AdminPageLayout
            title="マスタ管理"
            subtitle="組織構成や職種など、システムの基盤データを管理します"
            tabs={tabs as unknown as { id: string; label: string; icon: typeof Building2 }[]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as TabId)}
        >
            {activeTab === 'organization' && <OrganizationManagement />}
            {activeTab === 'professions' && <AdminProfessionManagement />}
        </AdminPageLayout>
    );
}

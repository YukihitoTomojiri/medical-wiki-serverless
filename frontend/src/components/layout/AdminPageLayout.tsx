import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import PageHeader from './PageHeader';

export interface AdminTab {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface AdminPageLayoutProps {
    title: string;
    subtitle: string;
    icon?: LucideIcon;
    tabs: readonly AdminTab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    children: ReactNode;
}

/**
 * 管理ページ共通レイアウト
 * - コンパクトなヘッダー（装飾なし）
 * - Material 3 Secondary Tabs 風のフラットなタブ
 * - タブ切替時にヘッダーが動かない固定レイアウト
 */
export default function AdminPageLayout({
    title,
    subtitle,
    icon: Icon,
    tabs,
    activeTab,
    onTabChange,
    children,
}: AdminPageLayoutProps) {
    return (
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-3 md:py-6 animate-in fade-in duration-300">
            {/* 共通ページヘッダー (PCではリッチ、モバイルではコンパクト1行) */}
            <PageHeader
                title={title}
                subtitle={subtitle}
                icon={Icon}
            />

            {/* タブ + コンテンツ */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                {/* タブナビゲーション — M3 Secondary Tabs風 */}
                <div
                    className="flex border-b border-stone-150 bg-stone-50/60"
                    role="tablist"
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => onTabChange(tab.id)}
                                className={`
                                    relative flex items-center gap-2 px-5 py-3 text-[13px] font-semibold
                                    transition-colors duration-150 -mb-px
                                    ${isActive
                                        ? 'text-stone-800'
                                        : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100/50'
                                    }
                                `}
                            >
                                <Icon size={16} />
                                {tab.label}
                                {/* アクティブインジケーター */}
                                {isActive && (
                                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-stone-700 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* タブコンテンツ */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

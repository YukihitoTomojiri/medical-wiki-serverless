import { useState, useMemo, useEffect } from 'react';
import { User, Manual } from '../types';
import ComplianceDashboard from '../components/ComplianceDashboard';
import OrganizationStatsDashboard from '../components/OrganizationStatsDashboard';
import FeedbackDashboard from '../components/FeedbackDashboard';
import { LayoutDashboard, BarChart3, MessageSquareHeart, AlertCircle, BookOpen, Calendar } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { api } from '../api';
import { TrainingEvent } from '../api/training';
import ContentCard from '../components/common/ContentCard';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [user] = useState<User>(() => JSON.parse(localStorage.getItem('user') || '{}'));

    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();
    const [manuals, setManuals] = useState<Manual[]>([]);
    const [trainings, setTrainings] = useState<TrainingEvent[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    const tabs = useMemo(() => {
        const commonTabs = [
            { id: 'dashboard', label: '学習進捗', icon: LayoutDashboard, color: 'indigo' },
            { id: 'pending_reviews', label: '承認待ち', icon: AlertCircle, color: 'amber' },
            { id: 'organization_stats', label: '組織統計', icon: BarChart3, color: 'teal' },
            { id: 'feedback', label: '現場の声', icon: MessageSquareHeart, color: 'rose' },
        ];
        return commonTabs;
    }, []);

    useEffect(() => {
        if (activeTab === 'pending_reviews') {
            const loadPending = async () => {
                setLoadingReviews(true);
                try {
                    const [manualsData, trainingsData] = await Promise.all([
                        api.getManuals(user.id),
                        api.getTrainingEvents(user.id)
                    ]);
                    
                    setManuals((manualsData as any[]).filter(m => m.status === 'REVIEW'));
                    setTrainings((trainingsData as any[]).filter(t => t.status === 'REVIEW'));
                } catch (error) {
                    console.error('Failed to load pending reviews:', error);
                } finally {
                    setLoadingReviews(false);
                }
            };
            loadPending();
        }
    }, [activeTab, user.id]);

    const activeColor = tabs.find(t => t.id === activeTab)?.color ?? 'indigo';

    const tabColors: Record<string, { activeBg: string; activeText: string; activeAccent: string; hoverIcon: string; contentBg: string }> = {
        indigo: { activeBg: 'bg-indigo-100', activeText: 'text-indigo-900', activeAccent: 'bg-indigo-400/30', hoverIcon: 'group-hover:text-indigo-400', contentBg: 'bg-indigo-100' },
        teal: { activeBg: 'bg-teal-100', activeText: 'text-teal-900', activeAccent: 'bg-teal-400/30', hoverIcon: 'group-hover:text-teal-400', contentBg: 'bg-teal-100' },
        amber: { activeBg: 'bg-amber-100', activeText: 'text-amber-900', activeAccent: 'bg-amber-400/30', hoverIcon: 'group-hover:text-amber-400', contentBg: 'bg-amber-100' },
        rose: { activeBg: 'bg-rose-100', activeText: 'text-rose-900', activeAccent: 'bg-rose-400/30', hoverIcon: 'group-hover:text-rose-400', contentBg: 'bg-rose-50/50' },
    };

    return (
        <div className="space-y-0">
            <PageHeader
                title="管理者ダッシュボード"
                subtitle="施設全体の管理および労務承認を行います"
                icon={LayoutDashboard}
            />

            {/* Folder-style Tab Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 -mb-2 relative z-10 px-4 md:px-6 mt-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const colors = tabColors[tab.color];
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative overflow-hidden rounded-t-2xl p-5 text-left transition-all duration-300 group ${isActive
                                ? `${colors.activeBg} ${colors.activeText} shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 pb-8`
                                : 'bg-transparent text-gray-500 hover:bg-gray-50 z-0 border-b border-gray-200 pb-5'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-black uppercase tracking-wider ${isActive ? colors.activeText : 'text-gray-400'}`}>{tab.label}</span>
                                <Icon className={isActive ? colors.activeText : `text-gray-300 ${colors.hoverIcon}`} size={20} />
                            </div>
                            {isActive && (
                                <div className={`absolute top-0 left-0 w-full h-1 ${colors.activeAccent}`} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Dynamic Content Area */}
            <div className={`rounded-3xl p-6 transition-colors duration-300 shadow-sm relative z-0 ${tabColors[activeColor]?.contentBg ?? 'bg-indigo-100'}`}>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {activeTab === 'dashboard' && <ComplianceDashboard />}
                    {activeTab === 'organization_stats' && <OrganizationStatsDashboard />}
                    {activeTab === 'feedback' && <FeedbackDashboard />}
                    {activeTab === 'pending_reviews' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="text-amber-600" size={24} />
                                <h2 className="text-xl font-black text-amber-900">承認待ちの投稿 ({manuals.length + trainings.length})</h2>
                            </div>

                            {loadingReviews ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : manuals.length + trainings.length === 0 ? (
                                <div className="bg-white/50 border-2 border-dashed border-amber-200 rounded-3xl p-12 text-center">
                                    <p className="text-amber-800/60 font-bold text-lg">
                                        現在、承認待ちの投稿はありません。
                                    </p>
                                    <p className="text-amber-800/40 text-sm mt-1">
                                        スタッフからの投稿が完了すると、ここに表示されます。
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {/* Manuals */}
                                    {manuals.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-sm font-black text-amber-800/40 uppercase tracking-widest pl-1">
                                                <BookOpen size={16} />
                                                マニュアル ({manuals.length})
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {manuals.map(m => (
                                                    <ContentCard
                                                        key={m.id}
                                                        title={m.title}
                                                        rawHtmlContent={m.content}
                                                        date={new Date(m.createdAt).toLocaleDateString('ja-JP')}
                                                        status={m.status as any}
                                                        onClick={() => navigate(`/admin/create?type=manual&id=${m.id}`)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Trainings */}
                                    {trainings.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-sm font-black text-amber-800/40 uppercase tracking-widest pl-1">
                                                <Calendar size={16} />
                                                研修会 ({trainings.length})
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {trainings.map(t => (
                                                    <ContentCard
                                                        key={t.id}
                                                        title={t.title}
                                                        rawHtmlContent={t.description || ''}
                                                        date={new Date(t.startTime).toLocaleDateString('ja-JP')}
                                                        status={(t as any).status}
                                                        onClick={() => navigate(`/admin/create?type=training&id=${t.id}`)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


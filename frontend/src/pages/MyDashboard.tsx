import { useState, useEffect } from 'react';
import { api } from '../api';
import PageHeader from '../components/layout/PageHeader';
import { User, Progress } from '../types';
import {
    BookOpen,
    CheckCircle2,
    LayoutDashboard,
    AlertCircle
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import DashboardAnnouncements from '../components/DashboardAnnouncements';

interface MyDashboardProps {
    user: User;
}

export default function MyDashboard({ user }: MyDashboardProps) {
    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');

    const [progress, setProgress] = useState<Progress[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'STUDY' | 'NOTICE'>(() => {
        if (tabParam === 'notice') return 'NOTICE';
        return 'STUDY';
    });
    const [trainingEvents, setTrainingEvents] = useState<any[]>([]);
    const [trainingResponses, setTrainingResponses] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [readAnnouncementIds, setReadAnnouncementIds] = useState<number[]>([]);

    const [historyStartDate] = useState(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 1);
        return d.toISOString().split('T')[0];
    });

    useEffect(() => {
        loadData();
    }, [user.id, historyStartDate]);

    const loadData = async () => {
        try {
            const [, progressData, , , eventsData, responsesData, announcementData] = await Promise.all([
                api.getMyDashboard(user.id),
                api.getMyProgress(user.id),
                api.getMyHistory(user.id, historyStartDate),
                api.getLeaveStatus(user.id),
                api.getTrainingEvents(user.id),
                api.getMyTrainingResponses(user.id),
                api.getAnnouncements(user.id)
            ]);
            setProgress(progressData);
            setTrainingEvents(eventsData);
            setTrainingResponses(responsesData);
            setAnnouncements(announcementData);

            // Load read IDs from localStorage
            const storedReadIds = localStorage.getItem(`readAnnouncements_${user.id}`);
            if (storedReadIds) {
                setReadAnnouncementIds(JSON.parse(storedReadIds));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    if (loading) return <div className="p-12 text-center text-gray-400">Loading Dashboard...</div>;

    const uncompletedCount = trainingEvents.filter(e => !trainingResponses.some(r => r.eventId === e.id)).length;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header Area */}
            <PageHeader
                title="Myダッシュボード"
                subtitle={`ようこそ、${user.name}さん。今日のタスクを確認しましょう。`}
                icon={LayoutDashboard}
            />

            {/* Summary Cards (Tabs) */}
            {/* Summary Cards (Tabs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 -mb-2 relative z-10 px-4 md:px-6">
                {/* Card 1: Study */}
                <button
                    onClick={() => setActiveTab('STUDY')}
                    className={`relative overflow-hidden rounded-t-2xl p-5 text-left transition-all duration-300 group ${activeTab === 'STUDY'
                        ? 'bg-orange-100 text-orange-900 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 pb-8'
                        : 'bg-transparent text-gray-500 hover:bg-gray-50 z-0 border-b border-gray-200 pb-5'
                        }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-black uppercase tracking-wider ${activeTab === 'STUDY' ? 'text-orange-900' : 'text-gray-400'}`}>研修・学習状況</span>
                        <BookOpen className={activeTab === 'STUDY' ? 'text-orange-700' : 'text-gray-300 group-hover:text-orange-400'} size={20} />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-black ${activeTab === 'STUDY' ? 'text-orange-950' : 'text-gray-400'}`}>{uncompletedCount}</span>
                        <span className={`text-xs font-bold ${activeTab === 'STUDY' ? 'text-orange-800/70' : 'text-gray-300'}`}>件の未完了</span>
                    </div>
                    {activeTab === 'STUDY' && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-orange-400/30" />
                    )}
                </button>


                {/* Card 3: Notices */}
                <button
                    onClick={() => setActiveTab('NOTICE')}
                    className={`relative overflow-hidden rounded-t-2xl p-5 text-left transition-all duration-300 group ${activeTab === 'NOTICE'
                        ? 'bg-blue-100 text-blue-900 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 pb-8'
                        : 'bg-transparent text-gray-500 hover:bg-gray-50 z-0 border-b border-gray-200 pb-5'
                        }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-black uppercase tracking-wider ${activeTab === 'NOTICE' ? 'text-blue-900' : 'text-gray-400'}`}>お知らせ</span>
                        <div className="relative">
                            <AlertCircle className={activeTab === 'NOTICE' ? 'text-blue-700' : 'text-gray-300 group-hover:text-blue-400'} size={20} />
                            {announcements.some(a => !readAnnouncementIds.includes(a.id)) && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-2">
                            {announcements.some(a => !readAnnouncementIds.includes(a.id)) ? (
                                <span className={`text-sm font-bold ${activeTab === 'NOTICE' ? 'text-blue-950' : 'text-gray-600'}`}>未読 {announcements.filter(a => !readAnnouncementIds.includes(a.id)).length} 件</span>
                            ) : (
                                <span className={`text-sm font-bold ${activeTab === 'NOTICE' ? 'text-blue-950' : 'text-gray-600'}`}>最新情報を確認</span>
                            )}
                        </div>
                        {announcements.length > 0 && (
                            <div className={`text-[10px] truncate mt-1 ${activeTab === 'NOTICE' ? 'text-blue-800/70' : 'text-gray-400'}`}>
                                {announcements[0].title}
                            </div>
                        )}
                    </div>
                    {activeTab === 'NOTICE' && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-400/30" />
                    )}
                </button>
            </div>

            {/* Dynamic Content Area */}
            {/* Dynamic Content Area */}
            <div className={`rounded-3xl p-6 transition-colors duration-300 shadow-sm relative z-0 ${activeTab === 'STUDY' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {activeTab === 'STUDY' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Uncompleted List */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <AlertCircle className="text-orange-500" size={18} />
                                    未完了の研修
                                </h3>
                                <div className="space-y-3">
                                    {trainingEvents.filter(e => !trainingResponses.some(r => r.eventId === e.id)).map(event => (
                                        <div key={event.id} className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex justify-between items-center group hover:shadow-sm transition-shadow">
                                            <div>
                                                <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mb-1 inline-block">必須</span>
                                                <h4 className="font-bold text-gray-800">{event.title}</h4>
                                                <p className="text-xs text-gray-500">期限: {new Date(event.endTime).toLocaleDateString('ja-JP')}</p>
                                            </div>
                                            <Link to={`/training/${event.id}`} className="px-4 py-2 bg-white text-orange-600 text-xs font-bold rounded-lg border border-orange-200 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                                受講する
                                            </Link>
                                        </div>
                                    ))}
                                    {uncompletedCount === 0 && (
                                        <div className="text-center py-8 text-gray-400">
                                            <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-300" />
                                            <p>未完了の研修はありません</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent History */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-500" size={18} />
                                    直近の学習履歴
                                </h3>
                                <div className="space-y-4">
                                    {progress.slice(0, 5).map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 font-bold text-xs">
                                                完了
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-gray-800 truncate">{item.manualTitle}</p>
                                                <p className="text-xs text-gray-400">{new Date(item.readAt).toLocaleDateString('ja-JP')} に修了</p>
                                            </div>
                                            <Link to={`/manuals/${item.manualId}`} className="text-xs font-bold text-gray-400 hover:text-gray-600">
                                                再確認
                                            </Link>
                                        </div>
                                    ))}
                                    {progress.length === 0 && <p className="text-sm text-gray-400 text-center py-4">履歴はありません</p>}
                                </div>
                            </div>
                        </div>
                    )}



                    {activeTab === 'NOTICE' && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                            <h2 className="text-sm font-black text-blue-900/40 uppercase tracking-widest mb-6 flex items-center gap-2 px-2">
                                <AlertCircle size={16} />
                                お知らせ一覧
                            </h2>
                            <DashboardAnnouncements
                                userId={user.id}
                                readAnnouncementIds={readAnnouncementIds}
                                onMarkAsRead={(id) => {
                                    if (!readAnnouncementIds.includes(id)) {
                                        const newIds = [...readAnnouncementIds, id];
                                        setReadAnnouncementIds(newIds);
                                        localStorage.setItem(`readAnnouncements_${user.id}`, JSON.stringify(newIds));
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { api, TrainingEvent, Committee } from '../api';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import ContentCard from '../components/common/ContentCard';

export default function TrainingList() {
    const { user } = useAuth();
    const [events, setEvents] = useState<TrainingEvent[]>([]);
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [selectedProfession, setSelectedProfession] = useState<string>('ALL');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const professionOptions = [
        { value: 'ALL', label: 'すべて' },
        { value: 'REHAB', label: 'リハビリ' },
        { value: 'NURSE', label: '看護師' },
        { value: 'CARE', label: '介護職' },
        { value: 'OTHER', label: 'その他' },
    ];

    useEffect(() => {
        if (!user) return;

        Promise.all([
            api.getTrainingEvents(user.id),
            api.getCommittees(user.id)
        ])
            .then(([eventsData, committeesData]) => {
                setEvents(eventsData);
                setCommittees(committeesData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    const getTargetLabel = (event: TrainingEvent) => {
        if (!event.targetCommitteeId && (!event.targetProfessions || event.targetProfessions.length === 0)) return "全職員対象";

        const parts = [];
        if (event.targetCommitteeId) {
            const committee = committees.find(c => c.id === event.targetCommitteeId);
            if (committee) parts.push(committee.name);
        }
        if (event.targetProfessions && event.targetProfessions.length > 0) {
            parts.push(event.targetProfessions.join(', '));
        }
        return parts.join(' / ');
    };

    const filteredEvents = events.filter(event => {
        if (selectedProfession === 'ALL') return true;
        if (!event.targetProfessions || event.targetProfessions.length === 0) return true;
        return event.targetProfessions.includes(selectedProfession);
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6 pb-12">
            <PageHeader
                title="研修会一覧"
                subtitle="社内研修や講習会の予定を確認・管理できます"
                icon={BookOpen}
            />

            {/* Profession Filter Pills */}
            <div className="space-y-2">
                <div className="text-[10px] font-black text-m3-on-surface-variant uppercase tracking-widest pl-1">職種別に絞り込む</div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {professionOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setSelectedProfession(opt.value)}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border-2 ${
                                selectedProfession === opt.value
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                                : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map(event => (
                    <ContentCard
                        key={event.id}
                        title={event.title}
                        rawHtmlContent={event.description || ''}
                        date={new Date(event.startTime).toLocaleDateString('ja-JP')}
                        badgeText={getTargetLabel(event)}
                        status={event.status as any}
                        onClick={() => navigate(`/training/${event.id}`)}
                    />
                ))}
            </div>

            {events.length === 0 && (
                <div className="text-center text-m3-on-surface-variant py-10">
                    現在、参加可能な研修会はありません。
                </div>
            )}
        </div>
    );
}

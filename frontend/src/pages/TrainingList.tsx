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
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        if (!event.targetCommitteeId && !event.targetJobType) return "全職員対象";

        const parts = [];
        if (event.targetCommitteeId) {
            const committee = committees.find(c => c.id === event.targetCommitteeId);
            if (committee) parts.push(committee.name);
        }
        if (event.targetJobType) {
            parts.push(event.targetJobType);
        }
        return parts.join(' / ');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <PageHeader
                title="研修会一覧"
                subtitle="社内研修や講習会の予定を確認・管理できます"
                icon={BookOpen}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(event => (
                    <ContentCard
                        key={event.id}
                        title={event.title}
                        rawHtmlContent={event.description || ''}
                        date={new Date(event.startTime).toLocaleDateString('ja-JP')}
                        badgeText={getTargetLabel(event)}
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

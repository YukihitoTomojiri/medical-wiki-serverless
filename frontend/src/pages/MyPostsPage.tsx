import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Manual, User } from '../types';
import { FileEdit, Search, Plus } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import ContentCard from '../components/common/ContentCard';

interface MyPostsPageProps {
    user: User;
}

export default function MyPostsPage({ user }: MyPostsPageProps) {
    const navigate = useNavigate();
    const [manuals, setManuals] = useState<Manual[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const manualsData = await api.getManuals(user.id, { isMine: true });
            setManuals(manualsData);
        } catch (error) {
            console.error('Failed to load my posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredManuals = manuals.filter((manual) => {
        if (!searchQuery) return true;
        return (
            manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            manual.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // ステータス別の集計
    const draftCount = manuals.filter(m => m.status === 'DRAFT').length;
    const reviewCount = manuals.filter(m => m.status === 'REVIEW').length;
    const publishedCount = manuals.filter(m => m.status === 'PUBLISHED').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-m3-primary/30 border-t-m3-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <PageHeader
                title="自分の投稿（ワークスペース）"
                subtitle="あなたが作成・編集した投稿を管理します"
                icon={FileEdit}
            >
                <button
                    onClick={() => navigate('/posts/create?type=manual')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-m3-primary text-white rounded-full font-bold text-sm hover:bg-m3-primary/90 transition-all shadow-md"
                >
                    <Plus size={18} />
                    新規作成
                </button>
            </PageHeader>

            {/* ステータスサマリー */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                    <div className="text-2xl font-black text-gray-700">{draftCount}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">下書き</div>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100">
                    <div className="text-2xl font-black text-amber-700">{reviewCount}</div>
                    <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mt-1">承認待ち</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
                    <div className="text-2xl font-black text-emerald-700">{publishedCount}</div>
                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1">公開中</div>
                </div>
            </div>

            {/* 検索 */}
            <div className="max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant" size={20} />
                    <input
                        type="text"
                        placeholder="キーワードで検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-m3-surface-container-highest rounded-full border-none focus:ring-2 focus:ring-m3-primary text-m3-on-surface placeholder-m3-outline transition-shadow"
                    />
                </div>
            </div>

            {/* 投稿一覧 */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredManuals.map((manual) => (
                    <ContentCard
                        key={manual.id}
                        title={manual.title}
                        rawHtmlContent={manual.content}
                        date={new Date(manual.createdAt).toLocaleDateString('ja-JP')}
                        badgeText={manual.category}
                        status={manual.status as any}
                        onClick={() => navigate(`/manuals/${manual.id}`)}
                    />
                ))}
            </div>

            {filteredManuals.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-m3-surface-variant rounded-full flex items-center justify-center mb-6">
                        <FileEdit className="text-m3-outline" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-m3-on-surface">投稿がありません</h3>
                    <p className="text-m3-on-surface-variant mt-2">
                        新規作成ボタンからマニュアルを作成しましょう
                    </p>
                </div>
            )}
        </div>
    );
}

import { useState } from 'react';
import { MessageSquareHeart, Clock, CheckCircle2, AlertCircle, Filter, ChevronDown } from 'lucide-react';

// Define feedback types and statuses
type FeedbackCategory = 'manual' | 'system' | 'other';
type FeedbackStatus = 'unread' | 'in_progress' | 'resolved';

interface FeedbackItem {
    id: string;
    date: string;
    userName: string;
    department: string;
    category: FeedbackCategory;
    content: string;
    status: FeedbackStatus;
}

// Initial mock data
const initialMockData: FeedbackItem[] = [
    {
        id: 'FB-001',
        date: '2024-05-15T09:30:00Z',
        userName: '鈴木 花子',
        department: '内科',
        category: 'manual',
        content: '感染症対応マニュアルの第3章ですが、新しいガイドラインに沿った改訂が必要かと思います。',
        status: 'unread'
    },
    {
        id: 'FB-002',
        date: '2024-05-14T14:15:00Z',
        userName: '佐藤 次郎',
        department: 'システム管理部',
        category: 'system',
        content: 'スマートフォンからアクセスした際、動画研修の読み込みが遅い時があります。キャッシュの確認をお願いできますか。',
        status: 'in_progress'
    },
    {
        id: 'FB-003',
        date: '2024-05-10T11:00:00Z',
        userName: '山田 太郎',
        department: '外科',
        category: 'other',
        content: '新しい新人研修のカリキュラム、非常にわかりやすくて好評でした！ありがとうございます。',
        status: 'resolved'
    }
];

// Helper dictionaries for display rendering
const categoryConfig: Record<FeedbackCategory, { label: string; bg: string; text: string; border: string }> = {
    manual: { label: 'マニュアル改善', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
    system: { label: 'システム要望', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
    other: { label: 'その他 / 感想', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
};

const statusConfig: Record<FeedbackStatus, { label: string; icon: any; color: string; bg: string }> = {
    unread: { label: '未確認', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    in_progress: { label: '対応中', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    resolved: { label: '完了', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
};

export default function FeedbackDashboard() {
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialMockData);
    const [filterStatus, setFilterStatus] = useState<FeedbackStatus | 'all'>('all');

    const handleStatusChange = (id: string, newStatus: FeedbackStatus) => {
        setFeedbacks(prev => prev.map(fb => fb.id === id ? { ...fb, status: newStatus } : fb));
    };

    const filteredFeedbacks = feedbacks.filter(fb => filterStatus === 'all' || fb.status === filterStatus);

    // Calculate metrics
    const totalCount = feedbacks.length;
    const unreadCount = feedbacks.filter(f => f.status === 'unread').length;

    return (
        <div className="space-y-6">
            {/* Header / Summary */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                        <MessageSquareHeart size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-800">ご意見箱</h2>
                        <p className="text-sm text-gray-500 font-medium">現場からの改善要望やシステムのフィードバック</p>
                    </div>
                </div>
                {/* Stats short */}
                <div className="flex gap-4">
                    <div className="text-center px-4 py-2 bg-white rounded-xl border border-rose-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-500 mb-0.5">総件数</p>
                        <p className="text-xl font-black text-gray-800">{totalCount}</p>
                    </div>
                    <div className="text-center px-4 py-2 bg-rose-50 rounded-xl border border-rose-200 shadow-sm">
                        <p className="text-xs font-bold text-rose-600 mb-0.5">未確認</p>
                        <p className="text-xl font-black text-rose-600">{unreadCount}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden flex flex-col">
                {/* Filters */}
                <div className="p-4 border-b border-rose-50 flex items-center justify-between bg-rose-50/30">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                        <Filter size={16} />
                        ステータス絞り込み:
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            すべて
                        </button>
                        <button
                            onClick={() => setFilterStatus('unread')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${filterStatus === 'unread' ? 'bg-rose-100 text-rose-700 border-transparent' : 'bg-white border border-gray-200 text-gray-500 hover:bg-rose-50'}`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 未確認
                        </button>
                        <button
                            onClick={() => setFilterStatus('in_progress')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${filterStatus === 'in_progress' ? 'bg-amber-100 text-amber-700 border-transparent' : 'bg-white border border-gray-200 text-gray-500 hover:bg-amber-50'}`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 対応中
                        </button>
                    </div>
                </div>

                {/* Feedback List */}
                <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                    {filteredFeedbacks.length > 0 ? filteredFeedbacks.map(fb => {
                        const cat = categoryConfig[fb.category];
                        const stat = statusConfig[fb.status];
                        const initial = fb.userName.charAt(0);
                        const StatusIcon = stat.icon;

                        return (
                            <div key={fb.id} className={`p-5 transition-colors hover:bg-gray-50/50 ${fb.status === 'unread' ? 'bg-rose-50/10' : ''}`}>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Left: User Avatar & Info */}
                                    <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-3 sm:w-40 border-b sm:border-b-0 border-gray-100 pb-3 sm:pb-0">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200 flex items-center justify-center font-black text-rose-700">
                                            {initial}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{fb.userName}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{fb.department}</p>
                                        </div>
                                    </div>

                                    {/* Middle: Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                                                {new Date(fb.date).toLocaleDateString('ja-JP')}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cat.bg} ${cat.text} ${cat.border}`}>
                                                {cat.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                                            {fb.content}
                                        </p>
                                    </div>

                                    {/* Right: Actions / Status */}
                                    <div className="shrink-0 flex items-center sm:items-start sm:w-40">
                                        <div className="relative group w-full">
                                            <div className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors border ${fb.status === 'unread' ? 'border-rose-200 bg-rose-50 text-rose-700 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'}`}>
                                                <div className="flex items-center gap-1.5">
                                                    <StatusIcon size={14} className={stat.color} />
                                                    {stat.label}
                                                </div>
                                                <ChevronDown size={14} className="text-gray-400 opacity-50" />
                                            </div>

                                            {/* Dropdown Menu on Hover */}
                                            <div className="absolute top-full right-0 mt-1 w-full sm:w-36 bg-white border border-gray-100 shadow-xl rounded-xl p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 origin-top-right scale-95 group-hover:scale-100">
                                                <button
                                                    onClick={() => handleStatusChange(fb.id, 'unread')}
                                                    className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
                                                >
                                                    <AlertCircle size={14} /> 未確認にする
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(fb.id, 'in_progress')}
                                                    className="w-full text-left px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-1.5"
                                                >
                                                    <Clock size={14} /> 対応中にする
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(fb.id, 'resolved')}
                                                    className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1.5"
                                                >
                                                    <CheckCircle2 size={14} /> 完了にする
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="p-12 text-center flex flex-col items-center">
                            <MessageSquareHeart size={48} className="text-rose-100 mb-3" />
                            <p className="text-gray-500 font-bold">該当するご意見はありません</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

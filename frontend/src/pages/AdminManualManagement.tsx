import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, BookOpen, Clock, FileText } from 'lucide-react';
import { api } from '../api';
import { Manual, User } from '../types';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface Props {
    user: User;
}

export default function AdminManualManagement({ user }: Props) {
    const navigate = useNavigate();
    const [manuals, setManuals] = useState<Manual[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadManuals();
    }, [user.id]);

    const loadManuals = async () => {
        try {
            setLoading(true);
            const data = await api.getManuals(user.id);
            setManuals(data);
        } catch (err) {
            console.error('Failed to load manuals:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('このマニュアルを削除してもよろしいですか？')) return;
        try {
            // Note: api.deleteManual should be implemented or verified in Step 4
            // For now, we simulate success if the API hasn't been updated yet
            // If the API exists, it will be called.
            if ((api as any).deleteManual) {
                await (api as any).deleteManual(user.id, id);
            } else {
                console.warn('api.deleteManual is not implemented yet.');
                alert('削除機能はバックエンド連携後に有効になります');
                return;
            }
            loadManuals();
        } catch (err) {
            alert('削除に失敗しました');
        }
    };

    const filteredManuals = manuals.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-12 text-center text-gray-500">読み込み中...</div>;

    return (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-300">
            {/* Header / Actions */}
            <div className="flex flex-row items-center justify-between px-1 md:px-2">
                <div className="flex items-center gap-4">
                    <h3 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                        <BookOpen className="text-orange-500 w-4 h-4 md:w-5 md:h-5 shrink-0" />
                        マニュアル管理
                    </h3>
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="マニュアルを検索..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-1.5 bg-stone-100 border-none rounded-full text-sm focus:ring-2 focus:ring-orange-200 outline-none w-64 transition-all"
                        />
                    </div>
                </div>
                <Button
                    variant="filled"
                    onClick={() => navigate('/admin/create?type=manual')}
                    className="flex items-center gap-2 shrink-0"
                >
                    <Plus size={16} className="md:w-4 md:h-4" />
                    <span className="hidden sm:inline">新規追加</span>
                    <span className="sm:hidden">追加</span>
                </Button>
            </div>

            {/* Mobile Search */}
            <div className="sm:hidden px-1">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="マニュアルを検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-stone-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-xl ring-1 ring-stone-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500">タイトル</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500">カテゴリ</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500">作成者</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500">作成日</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredManuals.map((m) => (
                                <tr key={m.id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                                <FileText size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{m.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold">
                                            {m.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600 font-medium">{m.authorName}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-gray-400" />
                                            {new Date(m.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => navigate(`/admin/manuals/edit/${m.id}`)}
                                            className="text-gray-400 hover:text-orange-600 mr-3 p-1 hover:bg-orange-50 rounded transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(m.id)}
                                            className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredManuals.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                                        マニュアルが見つかりません
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

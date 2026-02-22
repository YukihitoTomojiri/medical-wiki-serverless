import { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/layout/PageHeader';
import { Briefcase, Plus, Trash2, AlertCircle } from 'lucide-react';

interface Profession {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
}

export default function AdminProfessionManagement() {
    const { user } = useAuth();
    const [professions, setProfessions] = useState<Profession[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);

    const loadProfessions = async () => {
        try {
            const data = await api.getProfessions();
            setProfessions(data);
        } catch {
            setError('職種一覧の取得に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfessions();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || !user) return;
        setAdding(true);
        setError(null);
        try {
            await api.createProfession(user.id, newName.trim(), newDesc.trim() || undefined);
            setNewName('');
            setNewDesc('');
            await loadProfessions();
        } catch (err: any) {
            setError(err.message || '追加に失敗しました');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!user) return;
        if (!confirm(`「${name}」を削除してもよろしいですか？`)) return;
        try {
            await api.deleteProfession(user.id, id);
            await loadProfessions();
        } catch {
            setError('削除に失敗しました');
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-400">読み込み中...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <PageHeader
                title="職種マスタ管理"
                subtitle="システムで使用する職種の一覧を管理します"
                icon={Briefcase}
            />

            {error && (
                <div className="mx-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-bold flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                    <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">&times;</button>
                </div>
            )}

            {/* 新規追加フォーム */}
            <div className="mx-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Plus size={18} className="text-orange-500" />
                    職種を追加
                </h3>
                <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="職種名（例: 理学療法士）"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                        required
                    />
                    <input
                        type="text"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="説明（任意）"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                    />
                    <button
                        type="submit"
                        disabled={adding || !newName.trim()}
                        className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                    >
                        <Plus size={16} />
                        {adding ? '追加中...' : '追加'}
                    </button>
                </form>
            </div>

            {/* 職種一覧 */}
            <div className="mx-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Briefcase size={18} className="text-gray-500" />
                        登録済みの職種
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-2">{professions.length}件</span>
                    </h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {professions.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <Briefcase size={48} className="mx-auto mb-3 text-gray-200" />
                            <p className="font-bold">職種が登録されていません</p>
                        </div>
                    ) : (
                        professions.map((prof) => (
                            <div key={prof.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                                <div>
                                    <p className="font-bold text-gray-800">{prof.name}</p>
                                    {prof.description && (
                                        <p className="text-xs text-gray-400 mt-0.5">{prof.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(prof.id, prof.name)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="削除"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

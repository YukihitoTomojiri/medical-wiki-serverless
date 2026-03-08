import { useEffect, useState, useCallback } from 'react';
import { api, TrainingEvent, Committee } from '../api';
import { useAuth } from '../context/AuthContext';
import { Plus, QrCode as QrIcon, Users, FileText, Edit2, Trash2, Youtube, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function TrainingAdmin() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState<TrainingEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<TrainingEvent | null>(null);

    // Create Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [videoUrl2, setVideoUrl2] = useState('');
    const [videoUrl3, setVideoUrl3] = useState('');
    const [materialsUrl, setMaterialsUrl] = useState('');
    const [targetCommitteeId, setTargetCommitteeId] = useState<number | null>(null);
    const [targetJobType, setTargetJobType] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [committees, setCommittees] = useState<Committee[]>([]);

    useEffect(() => {
        if (!user) return;
        loadData();
    }, [user]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [eventsRes, committeesRes] = await Promise.all([
                api.getAdminTrainingEvents(user!.id),
                api.getCommittees(user!.id)
            ]);
            setEvents(eventsRes);
            setCommittees(committeesRes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setVideoUrl('');
        setVideoUrl2('');
        setVideoUrl3('');
        setMaterialsUrl('');
        setTargetCommitteeId(null);
        setTargetJobType('');
        setStartTime('');
        setEndTime('');
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                title, description, videoUrl, videoUrl2, videoUrl3, materialsUrl,
                targetCommitteeId, targetJobType: targetJobType || null,
                startTime, endTime
            };

            if (editingEvent) {
                await api.updateTrainingEvent(user!.id, editingEvent.id, data);
            } else {
                await api.createTrainingEvent(user!.id, data);
            }
            setShowCreateModal(false);
            setEditingEvent(null);
            resetForm();
            loadData();
        } catch (error: any) {
            console.error(error);
            const action = editingEvent ? '更新' : '作成';
            alert(`${action}に失敗しました: ${error.message}`);
        }
    };

    const handleEdit = (event: TrainingEvent) => {
        setEditingEvent(event);
        setTitle(event.title);
        setDescription(event.description || '');
        setVideoUrl(event.videoUrl || '');
        setVideoUrl2(event.videoUrl2 || '');
        setVideoUrl3(event.videoUrl3 || '');
        setMaterialsUrl(event.materialsUrl || '');
        setTargetCommitteeId(event.targetCommitteeId || null);
        setTargetJobType(event.targetJobType || '');
        setStartTime(new Date(event.startTime).toISOString().slice(0, 10));
        setEndTime(new Date(event.endTime).toISOString().slice(0, 10));
        setShowCreateModal(true);
    };

    const handleDeleteClick = async (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm('本当に削除しますか？')) return;

        try {
            await api.deleteTrainingEvent(user!.id, id);
            setEvents(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            console.error(error);
            alert('削除に失敗しました');
        }
    };

    const openQr = async (eventId: number) => {
        try {
            const url = await api.getTrainingQrCode(user!.id, eventId);
            const win = window.open('', '_blank');
            if (win) {
                win.document.write(`
                    <html>
                        <head><title>Quest Check-in QR</title></head>
                        <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
                            <h1>QRコードをスキャンして受講</h1>
                            <div id="qrcode"></div>
                            <p>${url}</p>
                            <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
                            <script>
                                new QRCode(document.getElementById("qrcode"), {
                                    text: "${url}",
                                    width: 300,
                                    height: 300
                                });
                            </script>
                        </body>
                    </html>
                `);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-400 text-sm">データを読み込み中...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Actions */}
            <div className="flex justify-end">
                <Button variant="filled" onClick={() => {
                    setEditingEvent(null);
                    resetForm();
                    setShowCreateModal(true);
                }} className="flex items-center gap-2">
                    <Plus size={18} /> 新規作成
                </Button>
            </div>

            {/* Data Table — stone-* 統一デザイン */}
            <div className="overflow-hidden rounded-xl ring-1 ring-stone-200">
                <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500">タイトル</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500">対象委員会/職種</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500">期間</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500">アクション</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">
                                    研修会はまだ登録されていません
                                </td>
                            </tr>
                        ) : (
                            events.map(event => (
                                <tr key={event.id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-sm text-gray-800">{event.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {event.targetCommitteeId ? committees.find(c => c.id === event.targetCommitteeId)?.name : '全対象'}
                                        {event.targetJobType && ` / ${event.targetJobType}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(event.startTime).toLocaleDateString('ja-JP')} 〜 {new Date(event.endTime).toLocaleDateString('ja-JP')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            <button onClick={() => openQr(event.id)} title="QRコード" className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors">
                                                <QrIcon size={16} />
                                            </button>
                                            <button onClick={() => navigate(`/admin/training/responses/${event.id}`)} title="回答確認" className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors">
                                                <Users size={16} />
                                            </button>
                                            <button onClick={() => navigate(`/training/${event.id}`)} title="プレビュー" className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors">
                                                <FileText size={16} />
                                            </button>
                                            <button onClick={() => handleEdit(event)} title="編集" className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={(e) => handleDeleteClick(e, event.id!)} title="削除" className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Modal — 統一デザイン */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[28px] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                            <h2 className="text-lg font-bold text-gray-800">{editingEvent ? '研修会の編集' : '新規研修会作成'}</h2>
                            <button onClick={() => { setShowCreateModal(false); setEditingEvent(null); resetForm(); }} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <FileText size={16} className="text-orange-500" /> 基本情報
                                </h3>
                                <input
                                    placeholder="タイトル"
                                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all bg-stone-50/30 text-sm"
                                    value={title} onChange={e => setTitle(e.target.value)} required
                                />
                                <textarea
                                    placeholder="説明"
                                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none resize-none bg-stone-50/30 h-24 text-sm"
                                    value={description} onChange={e => setDescription(e.target.value)} required
                                />
                            </div>

                            <div className="h-px bg-stone-100" />

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <Youtube size={16} className="text-red-500" /> 動画学習設定
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1">
                                            <Youtube size={14} className="text-red-500" /> 動画1 (メイン)
                                        </label>
                                        <input
                                            placeholder="YouTube URLを入力 (例: https://www.youtube.com/watch?v=...)"
                                            className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none text-sm bg-stone-50/30"
                                            value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5 ml-1">
                                            <Youtube size={14} className="text-gray-400" /> 動画2 (任意)
                                        </label>
                                        <input
                                            placeholder="YouTube URLを入力 (任意)"
                                            className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none text-sm bg-stone-50/30"
                                            value={videoUrl2} onChange={e => setVideoUrl2(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5 ml-1">
                                            <Youtube size={14} className="text-gray-400" /> 動画3 (任意)
                                        </label>
                                        <input
                                            placeholder="YouTube URLを入力 (任意)"
                                            className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none text-sm bg-stone-50/30"
                                            value={videoUrl3} onChange={e => setVideoUrl3(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-stone-100" />

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <FileText size={16} className="text-blue-500" /> 配布資料設定
                                </h3>
                                <input
                                    placeholder="資料URL (PDFなど)"
                                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none text-sm bg-stone-50/30"
                                    value={materialsUrl} onChange={e => setMaterialsUrl(e.target.value)}
                                />
                            </div>

                            <div className="h-px bg-stone-100" />

                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    className="px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50/30 outline-none focus:ring-2 focus:ring-orange-300"
                                    value={targetCommitteeId || ''}
                                    onChange={e => setTargetCommitteeId(e.target.value ? Number(e.target.value) : null)}
                                >
                                    <option value="">全委員会対象</option>
                                    {committees.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <input
                                    placeholder="職種 (任意)"
                                    className="px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50/30 outline-none focus:ring-2 focus:ring-orange-300"
                                    value={targetJobType} onChange={e => setTargetJobType(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-500 ml-1">開始日時</label>
                                    <input
                                        type="date"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none text-sm bg-stone-50/30"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-500 ml-1">終了日時</label>
                                    <input
                                        type="date"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none text-sm bg-stone-50/30"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2 pb-2">
                                <Button variant="text" type="button" onClick={() => {
                                    setShowCreateModal(false);
                                    setEditingEvent(null);
                                    resetForm();
                                }}>キャンセル</Button>
                                <Button variant="filled" type="submit">{editingEvent ? '保存' : '作成'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

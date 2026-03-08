import { TrainingEvent, Committee } from '../../api';
import { Plus, QrCode as QrIcon, Users, FileText, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface TrainingEventTableProps {
    events: TrainingEvent[];
    committees: Committee[];
    onEdit: (event: TrainingEvent) => void;
    onDelete: (e: React.MouseEvent, id: number) => void;
    onQr: (eventId: number) => void;
    onViewResponses: (eventId: number) => void;
    onPreview: (eventId: number) => void;
    onCreateNew: () => void;
}

export default function TrainingEventTable({
    events, committees, onEdit, onDelete, onQr, onViewResponses, onPreview, onCreateNew,
}: TrainingEventTableProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-end">
                <Button variant="filled" onClick={onCreateNew} className="flex items-center gap-2">
                    <Plus size={18} /> 新規作成
                </Button>
            </div>

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
                            <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">研修会はまだ登録されていません</td></tr>
                        ) : events.map(event => (
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
                                        <button onClick={() => onQr(event.id)} title="QRコード" className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"><QrIcon size={16} /></button>
                                        <button onClick={() => onViewResponses(event.id)} title="回答確認" className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"><Users size={16} /></button>
                                        <button onClick={() => onPreview(event.id)} title="プレビュー" className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"><FileText size={16} /></button>
                                        <button onClick={() => onEdit(event)} title="編集" className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"><Edit2 size={16} /></button>
                                        <button onClick={(e) => onDelete(e, event.id!)} title="削除" className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

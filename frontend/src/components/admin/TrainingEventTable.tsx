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

            <div className="overflow-hidden bg-transparent sm:bg-white rounded-xl ring-0 sm:ring-1 sm:ring-stone-200">
                <table className="w-full text-left bg-transparent">
                    <thead className="hidden sm:table-header-group bg-stone-50 border-b border-stone-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500">タイトル</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500">対象委員会/職種</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500">期間</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500">アクション</th>
                        </tr>
                    </thead>
                    <tbody className="flex flex-col sm:table-row-group gap-4 sm:gap-0">
                        {events.length === 0 ? (
                            <tr className="block sm:table-row bg-white rounded-xl border border-stone-200 sm:border-0 p-6 sm:p-0"><td colSpan={4} className="sm:px-6 sm:py-12 text-center text-gray-400 text-sm">研修会はまだ登録されていません</td></tr>
                        ) : events.map(event => (
                            <tr key={event.id} className="group hover:bg-stone-50/50 transition-colors bg-white rounded-xl border border-stone-200 sm:border-b sm:border-stone-100 sm:rounded-none flex flex-col sm:table-row p-4 sm:p-0">
                                <td className="sm:px-6 sm:py-4 mb-2 sm:mb-0 block sm:table-cell">
                                    <div className="font-bold text-gray-800 text-base sm:text-sm">{event.title}</div>
                                </td>
                                <td className="sm:px-6 sm:py-4 mb-2 sm:mb-0 block sm:table-cell text-sm text-gray-600">
                                    <span className="text-xs font-bold text-gray-400 sm:hidden mr-2">対象:</span>
                                    {event.targetCommitteeId ? committees.find(c => c.id === event.targetCommitteeId)?.name : '全対象'}
                                    {event.targetJobType && ` / ${event.targetJobType}`}
                                </td>
                                <td className="sm:px-6 sm:py-4 mb-4 sm:mb-0 block sm:table-cell text-sm text-gray-500">
                                    <span className="text-xs font-bold text-gray-400 sm:hidden mr-2">期間:</span>
                                    {new Date(event.startTime).toLocaleDateString('ja-JP')} 〜 {new Date(event.endTime).toLocaleDateString('ja-JP')}
                                </td>
                                <td className="sm:px-6 sm:py-4 block sm:table-cell">
                                    <div className="flex flex-wrap gap-2 sm:gap-1 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-stone-100 sm:border-0">
                                        <button onClick={() => onQr(event.id)} title="QRコード" className="flex-1 sm:flex-none p-2 sm:p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors flex justify-center items-center"><QrIcon size={18} className="sm:size-4" /></button>
                                        <button onClick={() => onViewResponses(event.id)} title="回答確認" className="flex-1 sm:flex-none p-2 sm:p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors flex justify-center items-center"><Users size={18} className="sm:size-4" /></button>
                                        <button onClick={() => onPreview(event.id)} title="プレビュー" className="flex-1 sm:flex-none p-2 sm:p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors flex justify-center items-center"><FileText size={18} className="sm:size-4" /></button>
                                        <button onClick={() => onEdit(event)} title="編集" className="flex-1 sm:flex-none p-2 sm:p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors flex justify-center items-center"><Edit2 size={18} className="sm:size-4" /></button>
                                        <button onClick={(e) => onDelete(e, event.id!)} title="削除" className="flex-1 sm:flex-none p-2 sm:p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex justify-center items-center"><Trash2 size={18} className="sm:size-4" /></button>
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

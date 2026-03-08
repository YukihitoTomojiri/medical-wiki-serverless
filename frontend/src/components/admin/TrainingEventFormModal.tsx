import React from 'react';
import { Committee } from '../../api';
import { TrainingFormState } from '../../hooks/useTrainingManagement';
import { FileText, Youtube, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface TrainingEventFormModalProps {
    formState: TrainingFormState;
    onFieldChange: <K extends keyof TrainingFormState>(field: K, value: TrainingFormState[K]) => void;
    committees: Committee[];
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    isEditing: boolean;
}

const inputClass = "w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all bg-stone-50/30 text-sm";

export default function TrainingEventFormModal({
    formState, onFieldChange, committees, onSubmit, onClose, isEditing,
}: TrainingEventFormModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[28px] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h2 className="text-lg font-bold text-gray-800">{isEditing ? '研修会の編集' : '新規研修会作成'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 p-2 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 flex items-center gap-2"><FileText size={16} className="text-orange-500" /> 基本情報</h3>
                        <input placeholder="タイトル" className={inputClass} value={formState.title} onChange={e => onFieldChange('title', e.target.value)} required />
                        <textarea placeholder="説明" className={`${inputClass} resize-none h-24`} value={formState.description} onChange={e => onFieldChange('description', e.target.value)} required />
                    </div>

                    <div className="h-px bg-stone-100" />

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 flex items-center gap-2"><Youtube size={16} className="text-red-500" /> 動画学習設定</h3>
                        {[
                            { label: '動画1 (メイン)', field: 'videoUrl' as const, color: 'text-red-500' },
                            { label: '動画2 (任意)', field: 'videoUrl2' as const, color: 'text-gray-400' },
                            { label: '動画3 (任意)', field: 'videoUrl3' as const, color: 'text-gray-400' },
                        ].map(v => (
                            <div key={v.field} className="space-y-1">
                                <label className={`text-xs font-bold ${v.color} flex items-center gap-1.5 ml-1`}><Youtube size={14} className={v.color} /> {v.label}</label>
                                <input placeholder="YouTube URLを入力" className={inputClass} value={formState[v.field]} onChange={e => onFieldChange(v.field, e.target.value)} />
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-stone-100" />

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 flex items-center gap-2"><FileText size={16} className="text-blue-500" /> 配布資料設定</h3>
                        <input placeholder="資料URL (PDFなど)" className={inputClass} value={formState.materialsUrl} onChange={e => onFieldChange('materialsUrl', e.target.value)} />
                    </div>

                    <div className="h-px bg-stone-100" />

                    <div className="grid grid-cols-2 gap-4">
                        <select className="px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50/30 outline-none focus:ring-2 focus:ring-orange-300"
                            value={formState.targetCommitteeId || ''} onChange={e => onFieldChange('targetCommitteeId', e.target.value ? Number(e.target.value) : null)}>
                            <option value="">全委員会対象</option>
                            {committees.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <input placeholder="職種 (任意)" className="px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50/30 outline-none focus:ring-2 focus:ring-orange-300"
                            value={formState.targetJobType} onChange={e => onFieldChange('targetJobType', e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-500 ml-1">開始日時</label>
                            <input type="date" value={formState.startTime} onChange={e => onFieldChange('startTime', e.target.value)} className={inputClass} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-500 ml-1">終了日時</label>
                            <input type="date" value={formState.endTime} onChange={e => onFieldChange('endTime', e.target.value)} className={inputClass} required />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 pb-2">
                        <Button variant="text" type="button" onClick={onClose}>キャンセル</Button>
                        <Button variant="filled" type="submit">{isEditing ? '保存' : '作成'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

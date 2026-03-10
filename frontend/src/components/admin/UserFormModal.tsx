import React from 'react';
import { UserCreateRequest } from '../../types';
import { X, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface UserFormModalProps {
    mode: 'add' | 'edit';
    formData: UserCreateRequest;
    onFormChange: (data: UserCreateRequest) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    onDelete?: () => void;
    allFacilities: { id: number; name: string }[];
    allDepartments: { id: number; name: string; facilityId: number }[];
    currentUserRole: string;
    submitting: boolean;
    error: string | null;
}

export default function UserFormModal({
    mode, formData, onFormChange, onSubmit, onClose, onDelete,
    allFacilities, allDepartments, currentUserRole, submitting, error,
}: UserFormModalProps) {
    const title = mode === 'add' ? '新規ユーザー登録' : 'ユーザー編集';
    const update = (field: string, value: any) => onFormChange({ ...formData, [field]: value });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-m3-surface-container-high rounded-[28px] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-m3-outline-variant/20 flex justify-between items-center sticky top-0 bg-m3-surface-container-high z-10">
                    <h2 className="text-xl font-medium text-m3-on-surface">{title}</h2>
                    <Button variant="text" size="sm" onClick={onClose} className="rounded-full h-10 w-10 px-0"><X size={20} /></Button>
                </div>
                <div className="p-6">
                    <form onSubmit={onSubmit} className="space-y-4">
                        {mode === 'add' && (
                            <Input label="職員番号" required value={formData.employeeId} onChange={e => update('employeeId', e.target.value)} placeholder="例: 1001" />
                        )}
                        <Input label="氏名" required value={formData.name} onChange={e => update('name', e.target.value)} placeholder="例: 山田 太郎" />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-m3-on-surface-variant mb-1.5 ml-1">施設</label>
                                <select required className="w-full px-4 py-3 bg-m3-surface border border-m3-outline rounded-lg focus:ring-1 focus:ring-m3-primary focus:border-m3-primary outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500 text-sm"
                                    value={formData.facilityId} onChange={e => update('facilityId', Number(e.target.value))} disabled={currentUserRole === 'ADMIN'}>
                                    <option value={0} disabled>選択してください</option>
                                    {allFacilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-m3-on-surface-variant mb-1.5 ml-1">部署</label>
                                <select required className="w-full px-4 py-3 bg-m3-surface border border-m3-outline rounded-lg focus:ring-1 focus:ring-m3-primary focus:border-m3-primary outline-none transition-all text-sm"
                                    value={formData.departmentId} onChange={e => update('departmentId', Number(e.target.value))}>
                                    <option value={0} disabled>選択してください</option>
                                    {allDepartments.filter(d => d.facilityId === formData.facilityId).map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-m3-on-surface-variant mb-1.5 ml-1">権限</label>
                            <select required className="w-full px-4 py-3 bg-m3-surface border border-m3-outline rounded-lg focus:ring-1 focus:ring-m3-primary focus:border-m3-primary outline-none transition-all text-sm"
                                value={formData.role} onChange={e => update('role', e.target.value)}>
                                <option value="USER">一般 (USER)</option>
                                <option value="ADMIN">管理者 (ADMIN)</option>
                                {currentUserRole === 'DEVELOPER' && <option value="DEVELOPER">開発者 (DEVELOPER)</option>}
                            </select>
                        </div>

                        <Input type="email" label={mode === 'add' ? 'メールアドレス（任意）' : 'メールアドレス'}
                            value={formData.email} onChange={e => update('email', e.target.value)} placeholder="taro@example.com" />

                        <div className="grid grid-cols-2 gap-4">
                            <Input type="date" label="入職日" required value={formData.joinedDate} onChange={e => update('joinedDate', e.target.value)} />
                            <Input type="number" label="有給付与日数" step="0.5" min="0" value={formData.paidLeaveDays} onChange={e => update('paidLeaveDays', parseFloat(e.target.value))} />
                        </div>

                        {mode === 'add' && (
                            <Input type="password" label="初期パスワード（任意）" value={formData.password}
                                onChange={e => update('password', e.target.value)} placeholder="未入力の場合は自動生成されます" autoComplete="new-password" />
                        )}

                        {error && (
                            <div className="p-3 bg-m3-error-container text-m3-on-error-container rounded-xl text-sm font-bold animate-pulse">{error}</div>
                        )}

                        <div className={`flex gap-3 pt-4 ${mode === 'edit' ? 'justify-between' : ''}`}>
                            {mode === 'edit' && onDelete && (
                                <Button type="button" variant="text" onClick={onDelete} disabled={submitting}
                                    className="text-m3-error hover:text-red-700" icon={<Trash2 size={18} />}>削除</Button>
                            )}
                            <Button type="submit" variant="filled" disabled={submitting} className={mode === 'edit' ? 'w-1/2' : 'flex-1 w-full'}>
                                {submitting ? <span className="flex items-center justify-center gap-2"><RefreshCw className="animate-spin" size={18} />処理中...</span>
                                    : mode === 'add' ? '登録する' : '更新する'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

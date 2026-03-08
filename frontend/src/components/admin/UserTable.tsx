import { User } from '../../types';
import { Search, Edit2, RefreshCw, UserPlus, UserCircle, Building2, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface UserTableProps {
    users: User[];
    loading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    facilities: string[];
    selectedFacility: string;
    onFacilityChange: (facility: string) => void;
    currentUserRole: string;
    onRefresh: () => void;
    onAdd: () => void;
    onEdit: (user: User) => void;
}

export default function UserTable({
    users, loading, searchTerm, onSearchChange,
    facilities, selectedFacility, onFacilityChange,
    currentUserRole, onRefresh, onAdd, onEdit,
}: UserTableProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filters & Actions */}
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[250px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="氏名または職員番号で検索..."
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm transition-all"
                        value={searchTerm}
                        onChange={e => onSearchChange(e.target.value)}
                    />
                </div>
                {currentUserRole === 'DEVELOPER' && (
                    <select
                        className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full focus:ring-2 focus:ring-orange-200 text-sm text-gray-700"
                        value={selectedFacility}
                        onChange={e => onFacilityChange(e.target.value)}
                    >
                        <option value="">全施設</option>
                        {facilities.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                )}
                <Button variant="outlined" onClick={onRefresh} size="md" className="rounded-full px-3">
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </Button>
                <Button variant="filled" onClick={onAdd} icon={<UserPlus size={18} />}>新規登録</Button>
            </div>

            {/* Users Table */}
            <Card variant="outlined" className="overflow-hidden bg-white border-0 !shadow-none ring-1 ring-stone-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500">職員</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500">所属</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500">権限</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 hidden md:table-cell">入職日</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <RefreshCw className="animate-spin text-orange-500" size={32} />
                                        <span className="text-sm">データを読み込み中...</span>
                                    </div>
                                </td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <UserCircle size={48} className="opacity-20" />
                                        <span className="text-sm">ユーザーが見つかりませんでした</span>
                                    </div>
                                </td></tr>
                            ) : users.map(u => (
                                <tr key={u.id} className="group hover:bg-orange-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800">{u.name}</div>
                                                <div className="text-xs text-gray-400 font-mono">{u.employeeId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                            <Building2 size={14} className="text-gray-400" />{u.facility}
                                        </div>
                                        <div className="text-xs text-gray-400 pl-5">{u.department}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={u.role === 'ADMIN' ? 'error' : u.role === 'DEVELOPER' ? 'warning' : 'success'}>{u.role}</Badge>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar size={14} />{u.joinedDate || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="text" size="sm" onClick={() => onEdit(u)} className="text-gray-400 hover:text-orange-600" icon={<Edit2 size={18} />} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

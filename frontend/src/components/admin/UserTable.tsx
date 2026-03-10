import { User } from '../../types';
import { Search, Edit2, RefreshCw, UserPlus, UserCircle, Building2, Calendar, Users } from 'lucide-react';
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
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-300">
            {/* Header & Main Actions */}
            <div className="flex flex-row items-center justify-between px-1 md:px-2">
                <h3 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Users className="text-blue-500 w-4 h-4 md:w-5 md:h-5 shrink-0" />
                    ユーザー管理
                </h3>
                <div className="flex items-center gap-2">
                    <Button variant="outlined" onClick={onRefresh} size="md" className="rounded-full px-3 md:px-4">
                        <RefreshCw size={16} className={`md:w-4 md:h-4 ${loading ? "animate-spin" : ""}`} />
                        <span className="hidden sm:inline ml-1 font-bold text-xs">更新</span>
                    </Button>
                    <Button variant="filled" onClick={onAdd} className="flex items-center gap-2 shrink-0">
                        <UserPlus size={16} className="md:w-4 md:h-4" />
                        <span className="hidden sm:inline">新規登録</span>
                        <span className="sm:hidden">登録</span>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center px-1 md:px-2">
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
                        className="w-full sm:w-auto px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full focus:ring-2 focus:ring-orange-200 text-sm text-gray-700 appearance-none"
                        value={selectedFacility}
                        onChange={e => onFacilityChange(e.target.value)}
                    >
                        <option value="">全施設</option>
                        {facilities.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                )}
                {/* Users Table / Mobile Cards */}
                <Card variant="outlined" className="overflow-hidden bg-white border-0 bg-transparent sm:bg-white !shadow-none sm:ring-1 sm:ring-stone-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="hidden sm:table-header-group bg-stone-50 border-b border-stone-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500">職員</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500">所属</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500">権限</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 hidden md:table-cell">入職日</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="flex flex-col sm:table-row-group gap-4 sm:gap-0">
                                {loading ? (
                                    <tr className="block sm:table-row bg-white rounded-xl border border-stone-200 sm:border-0"><td colSpan={5} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <RefreshCw className="animate-spin text-orange-500" size={32} />
                                            <span className="text-sm">データを読み込み中...</span>
                                        </div>
                                    </td></tr>
                                ) : users.length === 0 ? (
                                    <tr className="block sm:table-row bg-white rounded-xl border border-stone-200 sm:border-0"><td colSpan={5} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <UserCircle size={48} className="opacity-20" />
                                            <span className="text-sm">ユーザーが見つかりませんでした</span>
                                        </div>
                                    </td></tr>
                                ) : users.map(u => (
                                    <tr key={u.id} className="group hover:bg-orange-50/50 transition-colors bg-white rounded-xl border border-stone-200 sm:border-b sm:border-stone-100 sm:rounded-none flex flex-col sm:table-row p-4 sm:p-0">
                                        <td className="sm:px-6 sm:py-4 mb-3 sm:mb-0 block sm:table-cell">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm shrink-0">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-gray-800 text-base sm:text-sm truncate">{u.name}</div>
                                                    <div className="text-xs text-gray-500 font-mono mt-0.5">{u.employeeId}</div>
                                                </div>
                                                {/* Action button inline on mobile */}
                                                <div className="sm:hidden -mr-2">
                                                    <Button variant="text" size="sm" onClick={() => onEdit(u)} className="text-gray-400 hover:text-orange-600 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full" icon={<Edit2 size={18} />} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="sm:px-6 sm:py-4 mb-3 sm:mb-0 block sm:table-cell">
                                            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                                                <Building2 size={14} className="text-gray-400 shrink-0" />
                                                <span className="truncate">{u.facility}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 pl-5">{u.department}</div>
                                        </td>
                                        <td className="sm:px-6 sm:py-4 block sm:table-cell">
                                            <div className="flex items-center justify-between sm:justify-start">
                                                <span className="text-xs font-bold text-gray-400 sm:hidden">権限:</span>
                                                <Badge variant={u.role === 'ADMIN' ? 'error' : u.role === 'DEVELOPER' ? 'warning' : 'success'}>{u.role}</Badge>
                                            </div>
                                        </td>
                                        <td className="sm:px-6 sm:py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar size={14} />{u.joinedDate || '-'}</div>
                                        </td>
                                        <td className="sm:px-6 sm:py-4 text-right hidden sm:table-cell">
                                            <Button variant="text" size="sm" onClick={() => onEdit(u)} className="text-gray-400 hover:text-orange-600" icon={<Edit2 size={18} />} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}

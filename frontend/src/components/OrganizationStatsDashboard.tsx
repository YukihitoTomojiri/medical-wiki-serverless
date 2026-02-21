import { AlertCircle, BarChart3, Users, Building2, CheckCircle2, TrendingUp, BookOpen, ChevronRight, Activity } from 'lucide-react';
import { useState } from 'react';

// Mock data for department statistics
const mockDepartmentStats = [
    { id: 1, departmentName: '内科', employeeCount: 45, wikiReadRate: 92, trainingCompletionRate: 88, activeUsers: 42 },
    { id: 2, departmentName: '外科', employeeCount: 38, wikiReadRate: 85, trainingCompletionRate: 79, activeUsers: 34 },
    { id: 3, departmentName: '小児科', employeeCount: 22, wikiReadRate: 98, trainingCompletionRate: 95, activeUsers: 22 },
    { id: 4, departmentName: '放射線科', employeeCount: 15, wikiReadRate: 76, trainingCompletionRate: 82, activeUsers: 13 },
    { id: 5, departmentName: 'リハビリテーション科', employeeCount: 28, wikiReadRate: 89, trainingCompletionRate: 91, activeUsers: 27 },
];

export default function OrganizationStatsDashboard() {
    const [sortKey, setSortKey] = useState<'wikiReadRate' | 'trainingCompletionRate'>('wikiReadRate');

    const sortedStats = [...mockDepartmentStats].sort((a, b) => b[sortKey] - a[sortKey]);

    const systemWideAverages = {
        wikiReadRate: Math.round(mockDepartmentStats.reduce((sum, dept) => sum + dept.wikiReadRate, 0) / mockDepartmentStats.length),
        trainingCompletionRate: Math.round(mockDepartmentStats.reduce((sum, dept) => sum + dept.trainingCompletionRate, 0) / mockDepartmentStats.length)
    };

    return (
        <div className="space-y-6">
            {/* Header / Summary */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
                    <BarChart3 size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-gray-800">組織コンディション統計</h2>
                    <p className="text-sm text-gray-500 font-bold">各部署ごとのシステム利用状況および学習進捗のサマリー</p>
                </div>
            </div>

            {/* Overall Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-2">
                            <BookOpen size={14} className="text-teal-500" />
                            全組織の平均 Wiki閲覧率
                        </p>
                        <p className="text-3xl font-black text-gray-800">{systemWideAverages.wikiReadRate}<span className="text-sm font-bold text-gray-400 ml-1">%</span></p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-teal-100 flex items-center justify-center">
                        <Activity size={24} className="text-teal-500" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-2">
                            <TrendingUp size={14} className="text-amber-500" />
                            全組織の平均 研修達成率
                        </p>
                        <p className="text-3xl font-black text-gray-800">{systemWideAverages.trainingCompletionRate}<span className="text-sm font-bold text-gray-400 ml-1">%</span></p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-amber-100 flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-amber-500" />
                    </div>
                </div>
            </div>

            {/* Department Comparison Widget */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Building2 size={18} className="text-gray-400" />
                        部署別パフォーマンス比較
                    </h3>
                    <div className="flex gap-2 text-xs font-bold">
                        <button
                            onClick={() => setSortKey('wikiReadRate')}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${sortKey === 'wikiReadRate' ? 'bg-teal-100 text-teal-700' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            閲覧率順
                        </button>
                        <button
                            onClick={() => setSortKey('trainingCompletionRate')}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${sortKey === 'trainingCompletionRate' ? 'bg-amber-100 text-amber-700' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            達成率順
                        </button>
                    </div>
                </div>
                <div className="p-5 space-y-6">
                    {sortedStats.map((dept, index) => (
                        <div key={dept.id} className="group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-black ${index < 3 ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {index + 1}
                                    </span>
                                    <span className="font-bold text-gray-800">{dept.departmentName}</span>
                                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
                                        <Users size={10} /> {dept.employeeCount}名
                                    </span>
                                </div>
                                <button className="text-gray-300 hover:text-teal-600 transition-colors opacity-0 group-hover:opacity-100">
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            <div className="space-y-3 pl-9">
                                {/* Wiki Read Rate Bar */}
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold mb-1">
                                        <span className="text-teal-600">Wiki閲覧率</span>
                                        <span className="text-teal-700">{dept.wikiReadRate}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-teal-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-teal-400 rounded-full transition-all duration-1000"
                                            style={{ width: `${dept.wikiReadRate}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Training Completion Rate Bar */}
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold mb-1">
                                        <span className="text-amber-600">研修達成率</span>
                                        <span className="text-amber-700">{dept.trainingCompletionRate}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-amber-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-400 rounded-full transition-all duration-1000"
                                            style={{ width: `${dept.trainingCompletionRate}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cautionary Note */}
            <div className="flex items-start gap-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800/70 font-medium leading-relaxed">
                    本データは各ユーザーの最新のアクセスログと学習履歴に基づいて集計されています。閲覧率や達成率が著しく低い部署に対しては、「部署管理者へ通知」機能を利用して利用促進を促すことができます。
                </p>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Facility, Department, Profession } from '../types';
import { Trash2, Edit2, Plus, AlertCircle } from 'lucide-react';

export default function MasterManagement() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'facilities' | 'departments' | 'professions'>('facilities');

    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [professions, setProfessions] = useState<Profession[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [editMode, setEditMode] = useState<number | null>(null);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (user) {
            loadData(activeTab);
        }
    }, [user, activeTab]);

    const loadData = async (tab: string) => {
        setLoading(true);
        setError('');
        try {
            if (tab === 'facilities') {
                const data = await api.getFacilities(user!.id);
                setFacilities(data);
            } else if (tab === 'departments') {
                const data = await api.getDepartments(user!.id);
                setDepartments(data);
                // Also fetch facilities for the dropdown
                const facData = await api.getFacilities(user!.id);
                setFacilities(facData);
            } else if (tab === 'professions') {
                const data = await api.getProfessions();
                setProfessions(data);
            }
        } catch (err: any) {
            setError(err.message || 'データの取得に失敗しました');
        } finally {
            setLoading(false);
            setEditMode(null);
            setFormData({});
        }
    };

    const handleSave = async (id?: number) => {
        setError('');
        try {
            if (activeTab === 'facilities') {
                if (id) {
                    await api.updateFacility(id, formData.name, user!.id);
                } else {
                    await api.createFacility(formData.name, user!.id);
                }
            } else if (activeTab === 'departments') {
                if (id) {
                    await api.updateDepartment(id, formData.name, user!.id);
                } else {
                    await api.createDepartment(formData.name, formData.facilityId, user!.id);
                }
            } else if (activeTab === 'professions') {
                if (id) {
                    await api.updateProfession(user!.id, id, formData.name, formData.description);
                } else {
                    await api.createProfession(user!.id, formData.name, formData.description);
                }
            }
            await loadData(activeTab);
        } catch (err: any) {
            setError(err.message || '保存に失敗しました');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('本当に削除しますか？')) return;
        try {
            if (activeTab === 'facilities') {
                await api.deleteFacility(id, user!.id);
            } else if (activeTab === 'departments') {
                await api.deleteDepartment(id, user!.id);
            } else if (activeTab === 'professions') {
                await api.deleteProfession(user!.id, id);
            }
            await loadData(activeTab);
        } catch (err: any) {
            setError(err.message || '削除に失敗しました');
        }
    };

    const renderFacilities = () => (
        <div className="bg-white rounded-lg shadow-sm border border-m3-outline-variant/30 overflow-hidden">
            <table className="min-w-full divide-y divide-m3-outline-variant/30">
                <thead className="bg-m3-surface-container-low">
                    <tr>
                        <th className="px-6 py-3 text-left leading-4 font-semibold text-m3-on-surface-variant tracking-wider">施設名</th>
                        <th className="px-6 py-3 text-right">アクション</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-m3-outline-variant/30">
                    {editMode === 0 && (
                        <tr>
                            <td className="px-6 py-4">
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded focus:outline-primary"
                                    placeholder="新しい施設名"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleSave()} className="text-white bg-m3-primary px-3 py-1 rounded shadow-sm mr-2 text-sm font-medium hover:bg-m3-primary/90">保存</button>
                                <button onClick={() => setEditMode(null)} className="text-m3-on-surface-variant bg-m3-surface-container px-3 py-1 rounded text-sm font-medium hover:bg-m3-surface-container-high">キャンセル</button>
                            </td>
                        </tr>
                    )}
                    {facilities.map((f) => (
                        <tr key={f.id} className="hover:bg-m3-surface-container-lowest transition-colors">
                            <td className="px-6 py-4">
                                {editMode === f.id ? (
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded focus:outline-primary"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                ) : (
                                    f.name
                                )}
                            </td>
                            <td className="px-6 py-4 text-right text-sm">
                                {editMode === f.id ? (
                                    <>
                                        <button onClick={() => handleSave(f.id)} className="text-white bg-m3-primary px-3 py-1 rounded shadow-sm mr-2 text-sm font-medium hover:bg-m3-primary/90">保存</button>
                                        <button onClick={() => setEditMode(null)} className="text-m3-on-surface-variant bg-m3-surface-container px-3 py-1 rounded text-sm font-medium hover:bg-m3-surface-container-high">キャンセル</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => { setEditMode(f.id); setFormData(f); }} className="text-m3-primary hover:text-m3-primary/80 mr-4 font-medium"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-700 font-medium"><Trash2 size={18} /></button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderDepartments = () => (
        <div className="bg-white rounded-lg shadow-sm border border-m3-outline-variant/30 overflow-hidden">
            <table className="min-w-full divide-y divide-m3-outline-variant/30">
                <thead className="bg-m3-surface-container-low">
                    <tr>
                        <th className="px-6 py-3 text-left leading-4 font-semibold text-m3-on-surface-variant tracking-wider">所属施設</th>
                        <th className="px-6 py-3 text-left leading-4 font-semibold text-m3-on-surface-variant tracking-wider">部署名</th>
                        <th className="px-6 py-3 text-right">アクション</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-m3-outline-variant/30">
                    {editMode === 0 && (
                        <tr>
                            <td className="px-6 py-4">
                                <select
                                    className="w-full border p-2 rounded focus:outline-primary"
                                    value={formData.facilityId || ''}
                                    onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
                                >
                                    <option value="">施設を選択</option>
                                    {facilities.map(fac => <option key={fac.id} value={fac.id}>{fac.name}</option>)}
                                </select>
                            </td>
                            <td className="px-6 py-4">
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded focus:outline-primary"
                                    placeholder="新しい部署名"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleSave()} disabled={!formData.facilityId} className="text-white bg-m3-primary px-3 py-1 rounded shadow-sm mr-2 text-sm font-medium hover:bg-m3-primary/90 disabled:opacity-50">保存</button>
                                <button onClick={() => setEditMode(null)} className="text-m3-on-surface-variant bg-m3-surface-container px-3 py-1 rounded text-sm font-medium hover:bg-m3-surface-container-high">キャンセル</button>
                            </td>
                        </tr>
                    )}
                    {departments.map((d) => (
                        <tr key={d.id} className="hover:bg-m3-surface-container-lowest transition-colors">
                            <td className="px-6 py-4">
                                {d.facilityName}
                            </td>
                            <td className="px-6 py-4">
                                {editMode === d.id ? (
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded focus:outline-primary"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                ) : (
                                    d.name
                                )}
                            </td>
                            <td className="px-6 py-4 text-right text-sm">
                                {editMode === d.id ? (
                                    <>
                                        <button onClick={() => handleSave(d.id)} className="text-white bg-m3-primary px-3 py-1 rounded shadow-sm mr-2 text-sm font-medium hover:bg-m3-primary/90">保存</button>
                                        <button onClick={() => setEditMode(null)} className="text-m3-on-surface-variant bg-m3-surface-container px-3 py-1 rounded text-sm font-medium hover:bg-m3-surface-container-high">キャンセル</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => { setEditMode(d.id); setFormData(d); }} className="text-m3-primary hover:text-m3-primary/80 mr-4 font-medium"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(d.id)} className="text-red-500 hover:text-red-700 font-medium"><Trash2 size={18} /></button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderProfessions = () => (
        <div className="bg-white rounded-lg shadow-sm border border-m3-outline-variant/30 overflow-hidden">
            <table className="min-w-full divide-y divide-m3-outline-variant/30">
                <thead className="bg-m3-surface-container-low">
                    <tr>
                        <th className="px-6 py-3 text-left leading-4 font-semibold text-m3-on-surface-variant tracking-wider">職種名</th>
                        <th className="px-6 py-3 text-left leading-4 font-semibold text-m3-on-surface-variant tracking-wider">説明</th>
                        <th className="px-6 py-3 text-right">アクション</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-m3-outline-variant/30">
                    {editMode === 0 && (
                        <tr>
                            <td className="px-6 py-4">
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded focus:outline-primary"
                                    placeholder="職種名"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded focus:outline-primary"
                                    placeholder="説明 (任意)"
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleSave()} className="text-white bg-m3-primary px-3 py-1 rounded shadow-sm mr-2 text-sm font-medium hover:bg-m3-primary/90">保存</button>
                                <button onClick={() => setEditMode(null)} className="text-m3-on-surface-variant bg-m3-surface-container px-3 py-1 rounded text-sm font-medium hover:bg-m3-surface-container-high">キャンセル</button>
                            </td>
                        </tr>
                    )}
                    {professions.map((p) => (
                        <tr key={p.id} className="hover:bg-m3-surface-container-lowest transition-colors">
                            <td className="px-6 py-4">
                                {editMode === p.id ? (
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded focus:outline-primary"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                ) : (
                                    p.name
                                )}
                            </td>
                            <td className="px-6 py-4 text-m3-on-surface-variant">
                                {editMode === p.id ? (
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded focus:outline-primary"
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                ) : (
                                    p.description || '-'
                                )}
                            </td>
                            <td className="px-6 py-4 text-right text-sm">
                                {editMode === p.id ? (
                                    <>
                                        <button onClick={() => handleSave(p.id)} className="text-white bg-m3-primary px-3 py-1 rounded shadow-sm mr-2 text-sm font-medium hover:bg-m3-primary/90">保存</button>
                                        <button onClick={() => setEditMode(null)} className="text-m3-on-surface-variant bg-m3-surface-container px-3 py-1 rounded text-sm font-medium hover:bg-m3-surface-container-high">キャンセル</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => { setEditMode(p.id); setFormData(p); }} className="text-m3-primary hover:text-m3-primary/80 mr-4 font-medium"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 font-medium"><Trash2 size={18} /></button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-m3-on-surface flex items-center gap-3">
                    マスター管理
                </h1>
                <p className="mt-2 text-m3-on-surface-variant">システム内で使用される施設、部署、職種などの共通データを管理します。</p>
            </header>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-200">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <div className="flex gap-4 border-b border-m3-outline-variant/30 pb-2">
                <button
                    onClick={() => setActiveTab('facilities')}
                    className={`font-medium py-2 px-4 rounded-t-lg transition-colors ${activeTab === 'facilities' ? 'text-m3-primary border-b-2 border-m3-primary' : 'text-m3-on-surface-variant hover:text-m3-primary'}`}
                >
                    施設管理
                </button>
                <button
                    onClick={() => setActiveTab('departments')}
                    className={`font-medium py-2 px-4 rounded-t-lg transition-colors ${activeTab === 'departments' ? 'text-m3-primary border-b-2 border-m3-primary' : 'text-m3-on-surface-variant hover:text-m3-primary'}`}
                >
                    部署管理
                </button>
                <button
                    onClick={() => setActiveTab('professions')}
                    className={`font-medium py-2 px-4 rounded-t-lg transition-colors ${activeTab === 'professions' ? 'text-m3-primary border-b-2 border-m3-primary' : 'text-m3-on-surface-variant hover:text-m3-primary'}`}
                >
                    職種管理
                </button>
                <div className="ml-auto flex shrink-0">
                    <button
                        onClick={() => { setEditMode(0); setFormData({}); }}
                        className="flex items-center gap-2 px-4 py-2 bg-m3-primary text-white rounded-lg shadow-sm font-medium hover:bg-m3-primary/90 transition-all font-sans"
                        disabled={loading || editMode !== null}
                    >
                        <Plus size={20} />
                        新規追加
                    </button>
                </div>
            </div>

            {loading && !editMode && <p className="text-m3-on-surface-variant">読み込み中...</p>}

            {!loading && activeTab === 'facilities' && renderFacilities()}
            {!loading && activeTab === 'departments' && renderDepartments()}
            {!loading && activeTab === 'professions' && renderProfessions()}
        </div>
    );
}

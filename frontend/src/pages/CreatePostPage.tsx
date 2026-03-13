import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { 
    PenLine, 
    FileText, 
    Bell, 
    Calendar, 
    ArrowLeft, 
    Save, 
    MapPin, 
    Clock, 
    Tag,
    ChevronDown,
    Building2,
    Users
} from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import RichTextEditor from '../components/common/RichTextEditor';

type PostType = 'manual' | 'notice' | 'training';

interface Facility {
    id: number;
    name: string;
}

interface Department {
    id: number;
    name: string;
    facilityId: number;
}

const CreatePostPage: React.FC = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const typeParam = searchParams.get('type') as PostType | null;

    // Form State
    const [postType, setPostType] = useState<PostType>(typeParam || 'manual');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    
    // Target Selection State
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
    
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            loadFacilities();
        }
    }, [user]);

    useEffect(() => {
        if (selectedFacilityId && user) {
            loadDepartments(parseInt(selectedFacilityId));
        } else {
            setDepartments([]);
            setSelectedDepartmentId('');
        }
    }, [selectedFacilityId, user]);

    useEffect(() => {
        if (typeParam && ['manual', 'notice', 'training'].includes(typeParam)) {
            setPostType(typeParam);
        }
    }, [typeParam]);

    useEffect(() => {
        if (postType === 'manual') {
            loadCategories();
        }
    }, [postType]);

    const loadCategories = async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const loadFacilities = async () => {
        if (!user) return;
        try {
            const data = await api.getFacilities(user.id);
            setFacilities(data);
        } catch (error) {
            console.error('Failed to load facilities:', error);
        }
    };

    const loadDepartments = async (facilityId: number) => {
        if (!user) return;
        try {
            const data = await api.getDepartmentsByFacility(facilityId, user.id);
            setDepartments(data);
        } catch (error) {
            console.error('Failed to load departments:', error);
        }
    };

    const handleTypeChange = (newType: PostType) => {
        setPostType(newType);
        setSearchParams({ type: newType });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (!title.trim() || !content.trim()) {
            alert('タイトルと本文を入力してください。');
            return;
        }

        setSaving(true);
        try {
            let result;
            if (postType === 'manual') {
                if (!category.trim()) {
                    alert('カテゴリを入力してください。');
                    setSaving(false);
                    return;
                }
                result = await api.createManual(user.id, {
                    title,
                    content,
                    category,
                    facilityId: selectedFacilityId ? parseInt(selectedFacilityId) : undefined,
                    departmentId: selectedDepartmentId ? parseInt(selectedDepartmentId) : undefined,
                } as any);
            } else if (postType === 'notice') {
                result = await api.createAnnouncement(user.id, {
                    title,
                    content,
                    priority: 'NORMAL',
                    displayUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    facilityId: selectedFacilityId ? parseInt(selectedFacilityId) : undefined,
                    departmentId: selectedDepartmentId ? parseInt(selectedDepartmentId) : undefined,
                } as any);
            } else if (postType === 'training') {
                if (!startTime || !location.trim()) {
                    alert('開催日時と場所を入力してください。');
                    setSaving(false);
                    return;
                }
                result = await api.createTrainingEvent(user.id, {
                    title,
                    description: content,
                    startTime: new Date(startTime).toISOString(),
                    endTime: endTime ? new Date(endTime).toISOString() : new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString(),
                    location,
                    facilityId: selectedFacilityId ? parseInt(selectedFacilityId) : undefined,
                    departmentId: selectedDepartmentId ? parseInt(selectedDepartmentId) : undefined,
                });
            }

            console.log('Post created:', result);
            alert('投稿が正常に保存されました。');
            
            // リダイレクト（管理画面へ）
            navigate('/admin/operations');
        } catch (error: any) {
            console.error('Failed to save post:', error);
            alert(`保存に失敗しました: ${error.message || '不明なエラー'}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
            <PageHeader 
                title="新規投稿"
                description="マニュアル、お知らせ、研修会の新規投稿を作成します。"
                icon={PenLine}
                iconColor="text-orange-600"
                iconBgColor="bg-orange-100"
                actions={
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-m3-outline-variant hover:bg-m3-surface-container-low text-m3-on-surface rounded-xl transition-all text-sm font-bold shadow-sm"
                    >
                        <ArrowLeft size={18} />
                        戻る
                    </button>
                }
            />
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* 投稿種別選択 */}
                <div className="bg-white rounded-[32px] shadow-sm border border-m3-outline-variant p-8 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-6 bg-orange-500 rounded-full" />
                        <h2 className="text-lg font-black text-m3-on-surface">投稿種別を選択</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button
                            type="button"
                            onClick={() => handleTypeChange('manual')}
                            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                                postType === 'manual' 
                                ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' 
                                : 'border-m3-outline-variant hover:border-orange-200 hover:bg-orange-50/30 text-m3-on-surface-variant'
                            }`}
                        >
                            <div className={`p-4 rounded-2xl ${postType === 'manual' ? 'bg-orange-500 text-white' : 'bg-m3-surface-container-high'}`}>
                                <FileText size={24} />
                            </div>
                            <span className="font-bold underline decoration-orange-500/30 decoration-2 underline-offset-4">マニュアル</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleTypeChange('notice')}
                            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                                postType === 'notice' 
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' 
                                : 'border-m3-outline-variant hover:border-emerald-200 hover:bg-emerald-50/30 text-m3-on-surface-variant'
                            }`}
                        >
                            <div className={`p-4 rounded-2xl ${postType === 'notice' ? 'bg-emerald-500 text-white' : 'bg-m3-surface-container-high'}`}>
                                <Bell size={24} />
                            </div>
                            <span className="font-bold underline decoration-emerald-500/30 decoration-2 underline-offset-4">お知らせ</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleTypeChange('training')}
                            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                                postType === 'training' 
                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                                : 'border-m3-outline-variant hover:border-blue-200 hover:bg-blue-50/30 text-m3-on-surface-variant'
                            }`}
                        >
                            <div className={`p-4 rounded-2xl ${postType === 'training' ? 'bg-blue-500 text-white' : 'bg-m3-surface-container-high'}`}>
                                <Calendar size={24} />
                            </div>
                            <span className="font-bold underline decoration-blue-500/30 decoration-2 underline-offset-4">研修会</span>
                        </button>
                    </div>
                </div>

                {/* 入力フォーム */}
                <div className="bg-white rounded-[32px] shadow-sm border border-m3-outline-variant p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-6 bg-orange-500 rounded-full" />
                        <h2 className="text-lg font-black text-m3-on-surface">詳細内容を入力</h2>
                    </div>

                    <div className="space-y-6">
                        {/* 共通: タイトル */}
                        <div className="space-y-2">
                            <label className="text-sm font-black text-m3-on-surface-variant ml-1 flex items-center gap-2">
                                <span className="bg-m3-surface-container-highest p-1 rounded-md"><PenLine size={14}/></span>
                                タイトル
                                <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-[10px] font-bold">必須</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl border border-m3-outline-variant focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-m3-on-surface placeholder:text-m3-on-surface-variant/40"
                                placeholder="投稿のタイトルを入力してください"
                                required
                            />
                        </div>

                        {/* マニュアル特有: カテゴリ */}
                        {postType === 'manual' && (
                            <div className="space-y-2 animate-in slide-in-from-left-2 duration-300">
                                <label className="text-sm font-black text-m3-on-surface-variant ml-1 flex items-center gap-2">
                                    <span className="bg-m3-surface-container-highest p-1 rounded-md"><Tag size={14}/></span>
                                    カテゴリ
                                    <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-[10px] font-bold">必須</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        list="manual-categories"
                                        className="w-full px-5 py-4 rounded-2xl border border-m3-outline-variant focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-m3-on-surface placeholder:text-m3-on-surface-variant/40 pr-12"
                                        placeholder="カテゴリを入力または選択"
                                        required
                                    />
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/40" size={20} />
                                    <datalist id="manual-categories">
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>
                        )}

                        {/* 研修会特有: 日時・場所 */}
                        {postType === 'training' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-left-2 duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-m3-on-surface-variant ml-1 flex items-center gap-2">
                                        <span className="bg-m3-surface-container-highest p-1 rounded-md"><Clock size={14}/></span>
                                        開始日時
                                        <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-[10px] font-bold">必須</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl border border-m3-outline-variant focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-m3-on-surface"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-m3-on-surface-variant ml-1 flex items-center gap-2">
                                        <span className="bg-m3-surface-container-highest p-1 rounded-md"><Clock size={14}/></span>
                                        終了日時
                                        <span className="text-m3-on-surface-variant/40 bg-m3-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold">任意</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl border border-m3-outline-variant focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-m3-on-surface"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-m3-on-surface-variant ml-1 flex items-center gap-2">
                                        <span className="bg-m3-surface-container-highest p-1 rounded-md"><MapPin size={14}/></span>
                                        開催場所
                                        <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-[10px] font-bold">必須</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl border border-m3-outline-variant focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-m3-on-surface placeholder:text-m3-on-surface-variant/40"
                                        placeholder="研修の開催場所を入力"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* 共通: 対象施設/部署 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-m3-surface-container-lowest rounded-[24px] border border-m3-outline-variant/50">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-m3-on-surface-variant ml-1 flex items-center gap-2">
                                    <span className="bg-white p-1 rounded-md border border-m3-outline-variant/30"><Building2 size={14}/></span>
                                    対象施設
                                    <span className="text-m3-on-surface-variant/40 bg-m3-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold">任意</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedFacilityId}
                                        onChange={(e) => setSelectedFacilityId(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-xl border border-m3-outline-variant bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-m3-on-surface appearance-none"
                                    >
                                        <option value="">全施設（共通）</option>
                                        {facilities.map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/40 pointer-events-none" size={18} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-m3-on-surface-variant ml-1 flex items-center gap-2">
                                    <span className="bg-white p-1 rounded-md border border-m3-outline-variant/30"><Users size={14}/></span>
                                    対象部署
                                    <span className="text-m3-on-surface-variant/40 bg-m3-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold">任意</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedDepartmentId}
                                        onChange={(e) => setSelectedDepartmentId(e.target.value)}
                                        disabled={!selectedFacilityId}
                                        className="w-full px-5 py-3.5 rounded-xl border border-m3-outline-variant bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-m3-on-surface appearance-none disabled:bg-m3-surface-container-low disabled:text-m3-on-surface-variant/30"
                                    >
                                        <option value="">全ての部署</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/40 pointer-events-none" size={18} />
                                </div>
                            </div>
                        </div>

                        {/* 共通: 本文 */}
                        <div className="space-y-2">
                            <label className="text-sm font-black text-m3-on-surface-variant ml-1 flex items-center gap-2">
                                <span className="bg-m3-surface-container-highest p-1 rounded-md"><FileText size={14}/></span>
                                本文
                                <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-[10px] font-bold">必須</span>
                            </label>
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                placeholder="投稿の詳細内容を入力してください"
                            />
                        </div>
                    </div>

                    {/* 固定アクションバー */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-m3-outline-variant p-4 flex items-center justify-center z-50">
                        <div className="w-full max-w-5xl flex justify-end gap-4 px-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-8 py-3.5 text-m3-on-surface-variant font-black hover:bg-m3-surface-container-low rounded-2xl transition-all"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-10 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-500/25 active:scale-95"
                            >
                                {saving ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save size={20} />
                                        投稿する
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePostPage;

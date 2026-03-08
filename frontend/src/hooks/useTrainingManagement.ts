import { useState, useEffect, useCallback } from 'react';
import { api, TrainingEvent, Committee } from '../api';
import { useAuth } from '../context/AuthContext';

export interface TrainingFormState {
    title: string;
    description: string;
    videoUrl: string;
    videoUrl2: string;
    videoUrl3: string;
    materialsUrl: string;
    targetCommitteeId: number | null;
    targetJobType: string;
    startTime: string;
    endTime: string;
}

const initialFormState: TrainingFormState = {
    title: '', description: '', videoUrl: '', videoUrl2: '', videoUrl3: '',
    materialsUrl: '', targetCommitteeId: null, targetJobType: '',
    startTime: '', endTime: '',
};

export function useTrainingManagement() {
    const { user } = useAuth();
    const [events, setEvents] = useState<TrainingEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<TrainingEvent | null>(null);
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [formState, setFormState] = useState<TrainingFormState>(initialFormState);

    const loadData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [eventsRes, committeesRes] = await Promise.all([
                api.getAdminTrainingEvents(user.id),
                api.getCommittees(user.id)
            ]);
            setEvents(eventsRes);
            setCommittees(committeesRes);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    }, [user]);

    useEffect(() => { if (user) loadData(); }, [user, loadData]);

    const resetForm = useCallback(() => setFormState(initialFormState), []);

    const updateFormField = useCallback(<K extends keyof TrainingFormState>(
        field: K, value: TrainingFormState[K]
    ) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleCreate = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            const data = {
                title: formState.title, description: formState.description,
                videoUrl: formState.videoUrl, videoUrl2: formState.videoUrl2,
                videoUrl3: formState.videoUrl3, materialsUrl: formState.materialsUrl,
                targetCommitteeId: formState.targetCommitteeId,
                targetJobType: formState.targetJobType || null,
                startTime: formState.startTime, endTime: formState.endTime,
            };
            if (editingEvent) {
                await api.updateTrainingEvent(user.id, editingEvent.id, data);
            } else {
                await api.createTrainingEvent(user.id, data);
            }
            setShowCreateModal(false);
            setEditingEvent(null);
            resetForm();
            loadData();
        } catch (error: any) {
            const action = editingEvent ? '更新' : '作成';
            alert(`${action}に失敗しました: ${error.message}`);
        }
    }, [user, formState, editingEvent, resetForm, loadData]);

    const handleEdit = useCallback((event: TrainingEvent) => {
        setEditingEvent(event);
        setFormState({
            title: event.title, description: event.description || '',
            videoUrl: event.videoUrl || '', videoUrl2: event.videoUrl2 || '',
            videoUrl3: event.videoUrl3 || '', materialsUrl: event.materialsUrl || '',
            targetCommitteeId: event.targetCommitteeId || null,
            targetJobType: event.targetJobType || '',
            startTime: new Date(event.startTime).toISOString().slice(0, 10),
            endTime: new Date(event.endTime).toISOString().slice(0, 10),
        });
        setShowCreateModal(true);
    }, []);

    const handleDeleteEvent = useCallback(async (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user || !window.confirm('本当に削除しますか？')) return;
        try {
            await api.deleteTrainingEvent(user.id, id);
            setEvents(prev => prev.filter(ev => ev.id !== id));
        } catch { alert('削除に失敗しました'); }
    }, [user]);

    const openQr = useCallback(async (eventId: number) => {
        if (!user) return;
        try {
            const url = await api.getTrainingQrCode(user.id, eventId);
            const win = window.open('', '_blank');
            if (win) {
                win.document.write(`
                    <html>
                        <head><title>Quest Check-in QR</title></head>
                        <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
                            <h1>QRコードをスキャンして受講</h1>
                            <div id="qrcode"></div>
                            <p>${url}</p>
                            <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
                            <script>
                                new QRCode(document.getElementById("qrcode"), {
                                    text: "${url}",
                                    width: 300,
                                    height: 300
                                });
                            <\/script>
                        </body>
                    </html>
                `);
            }
        } catch (error) { console.error(error); }
    }, [user]);

    const openCreateModal = useCallback(() => {
        setEditingEvent(null);
        resetForm();
        setShowCreateModal(true);
    }, [resetForm]);

    const closeModal = useCallback(() => {
        setShowCreateModal(false);
        setEditingEvent(null);
        resetForm();
    }, [resetForm]);

    return {
        events, committees, loading,
        showCreateModal, editingEvent,
        formState, updateFormField,
        handleCreate, handleEdit, handleDeleteEvent,
        openQr, openCreateModal, closeModal,
    };
}

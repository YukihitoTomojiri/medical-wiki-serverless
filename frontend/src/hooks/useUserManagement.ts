import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { User, UserCreateRequest, UserUpdateRequest } from '../types';

export function useUserManagement(currentUser: User) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [facilities, setFacilities] = useState<string[]>([]);
    const [selectedFacility, setSelectedFacility] = useState(
        currentUser.role === 'ADMIN' ? currentUser.facility : ''
    );

    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [formData, setFormData] = useState<UserCreateRequest>({
        employeeId: '', name: '',
        facility: currentUser.role === 'ADMIN' ? currentUser.facility : '本館',
        department: '', role: 'USER', email: '',
        paidLeaveDays: 0, joinedDate: '', password: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getUsers(currentUser.id, selectedFacility);
            setUsers(data.filter(u => !u.deletedAt));
        } catch {
            setError('ユーザー一覧の取得に失敗しました。');
        } finally {
            setLoading(false);
        }
    }, [currentUser.id, selectedFacility]);

    useEffect(() => {
        (async () => {
            const fetchedFacilities = await api.getDistinctFacilities();
            setFacilities(fetchedFacilities);
            await fetchUsers();
        })();
    }, []);

    useEffect(() => { fetchUsers(); }, [selectedFacility]);

    const handleAddClick = useCallback(() => {
        setFormData({
            employeeId: '', name: '',
            facility: currentUser.role === 'ADMIN' ? currentUser.facility : '本館',
            department: '', role: 'USER', email: '',
            paidLeaveDays: 0, joinedDate: new Date().toISOString().split('T')[0], password: ''
        });
        setError(null);
        setShowAddModal(true);
    }, [currentUser]);

    const handleEditClick = useCallback((targetUser: User) => {
        setSelectedUser(targetUser);
        setFormData({
            employeeId: targetUser.employeeId, name: targetUser.name,
            facility: targetUser.facility, department: targetUser.department,
            role: targetUser.role, email: targetUser.email || '',
            paidLeaveDays: targetUser.paidLeaveDays || 0,
            joinedDate: targetUser.joinedDate || '', password: ''
        });
        setError(null);
        setShowEditModal(true);
    }, []);

    const handleDelete = useCallback(async () => {
        if (!selectedUser || !confirm(`${selectedUser.name} を削除してもよろしいですか？\nこの操作は取り消せません（論理削除されます）。`)) return;
        try {
            setSubmitting(true);
            await api.bulkDeleteUsers(currentUser.id, [selectedUser.id]);
            setSuccessMessage('ユーザーを削除しました。');
            setShowEditModal(false);
            fetchUsers();
        } catch { setError('削除に失敗しました。'); }
        finally { setSubmitting(false); }
    }, [selectedUser, currentUser.id, fetchUsers]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            if (showAddModal) {
                await api.registerUser(currentUser.id, formData);
                setSuccessMessage('ユーザーを登録しました。');
                setShowAddModal(false);
            } else if (showEditModal && selectedUser) {
                const updateData: UserUpdateRequest = {
                    role: formData.role, facility: formData.facility,
                    department: formData.department, email: formData.email,
                    paidLeaveDays: formData.paidLeaveDays, joinedDate: formData.joinedDate
                };
                await api.updateUser(currentUser.id, selectedUser.id, updateData);
                setSuccessMessage('ユーザー情報を更新しました。');
                setShowEditModal(false);
            }
            fetchUsers();
        } catch (err: any) {
            setError(err.message || '操作に失敗しました。入力内容を確認してください。');
        } finally { setSubmitting(false); }
    }, [showAddModal, showEditModal, selectedUser, currentUser.id, formData, fetchUsers]);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.employeeId.includes(searchTerm)
    );

    return {
        users: filteredUsers, loading, error, successMessage, setSuccessMessage,
        searchTerm, setSearchTerm,
        facilities, selectedFacility, setSelectedFacility,
        showAddModal, setShowAddModal, showEditModal, setShowEditModal,
        selectedUser, submitting,
        formData, setFormData,
        fetchUsers, handleAddClick, handleEditClick, handleDelete, handleSubmit,
    };
}

import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

interface Facility {
    id: number;
    name: string;
}

interface Department {
    id: number;
    name: string;
    facilityId: number;
    facilityName: string;
}

export function useOrganization() {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [expandedFacility, setExpandedFacility] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // 施設 Add/Edit
    const [showAddFacility, setShowAddFacility] = useState(false);
    const [newFacilityName, setNewFacilityName] = useState('');
    const [editingFacilityId, setEditingFacilityId] = useState<number | null>(null);
    const [editFacilityName, setEditFacilityName] = useState('');

    // 部署 Add/Edit
    const [showAddDepartment, setShowAddDepartment] = useState<number | null>(null);
    const [newDeptName, setNewDeptName] = useState('');
    const [editingDeptId, setEditingDeptId] = useState<number | null>(null);
    const [editDeptName, setEditDeptName] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserId(user.id);
            loadData(user.id);
        }
    }, []);

    const loadData = useCallback(async (uid?: number) => {
        const targetUserId = uid || userId;
        if (!targetUserId) return;

        setLoading(true);
        try {
            const [facs, depts] = await Promise.all([
                api.getFacilities(targetUserId).catch(() => []),
                api.getDepartments(targetUserId).catch(() => []),
            ]);
            setFacilities(facs);
            setDepartments(depts);
        } catch (e: any) {
            setError('データの取得に失敗しました: ' + e.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const handleAddFacility = useCallback(async () => {
        if (!newFacilityName.trim() || !userId) return;
        setError(null);
        await api.createFacility(newFacilityName.trim(), userId);
        setNewFacilityName('');
        setShowAddFacility(false);
        loadData();
    }, [newFacilityName, userId, loadData]);

    const handleUpdateFacility = useCallback(async (id: number) => {
        if (!editFacilityName.trim() || !userId) return;
        setError(null);
        await api.updateFacility(id, editFacilityName.trim(), userId);
        setEditingFacilityId(null);
        loadData();
    }, [editFacilityName, userId, loadData]);

    const handleDeleteFacility = useCallback(async (id: number) => {
        if (!window.confirm('施設を削除しますか？\n紐づく部署も削除されます。')) return;
        if (!userId) return;
        await api.deleteFacility(id, userId);
        loadData();
    }, [userId, loadData]);

    const handleAddDepartment = useCallback(async (facilityId: number) => {
        if (!newDeptName.trim() || !userId) return;
        setError(null);
        await api.createDepartment(newDeptName.trim(), facilityId, userId);
        setNewDeptName('');
        setShowAddDepartment(null);
        loadData();
    }, [newDeptName, userId, loadData]);

    const handleUpdateDepartment = useCallback(async (id: number) => {
        if (!editDeptName.trim() || !userId) return;
        setError(null);
        await api.updateDepartment(id, editDeptName.trim(), userId);
        setEditingDeptId(null);
        loadData();
    }, [editDeptName, userId, loadData]);

    const handleDeleteDepartment = useCallback(async (id: number) => {
        if (!window.confirm('部署を削除しますか？')) return;
        if (!userId) return;
        await api.deleteDepartment(id, userId);
        loadData();
    }, [userId, loadData]);

    const getDepartmentsForFacility = useCallback(
        (facilityId: number) => departments.filter(d => d.facilityId === facilityId),
        [departments]
    );

    return {
        // Data
        facilities, departments, loading, error,
        // Expanded state
        expandedFacility, setExpandedFacility,
        getDepartmentsForFacility,
        // Facility CRUD
        showAddFacility, setShowAddFacility,
        newFacilityName, setNewFacilityName,
        editingFacilityId, setEditingFacilityId,
        editFacilityName, setEditFacilityName,
        handleAddFacility, handleUpdateFacility, handleDeleteFacility,
        // Department CRUD
        showAddDepartment, setShowAddDepartment,
        newDeptName, setNewDeptName,
        editingDeptId, setEditingDeptId,
        editDeptName, setEditDeptName,
        handleAddDepartment, handleUpdateDepartment, handleDeleteDepartment,
    };
}

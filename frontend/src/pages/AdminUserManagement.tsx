import { useAuth } from '../context/AuthContext';
import { useUserManagement } from '../hooks/useUserManagement';
import UserTable from '../components/admin/UserTable';
import UserFormModal from '../components/admin/UserFormModal';

/**
 * ユーザー管理 – 運用管理ページのタブコンテンツ
 * ロジック: useUserManagement Hook
 * 表示: UserTable + UserFormModal コンポーネント
 */
const AdminUserManagement = () => {
    const { user } = useAuth();
    if (!user) return null;

    const mgmt = useUserManagement(user);

    return (
        <div>
            {/* 成功メッセージ */}
            {mgmt.successMessage && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm animate-in fade-in">
                    {mgmt.successMessage}
                    <button className="ml-2 underline text-green-800" onClick={() => mgmt.setSuccessMessage(null)}>閉じる</button>
                </div>
            )}

            <UserTable
                users={mgmt.users}
                loading={mgmt.loading}
                searchTerm={mgmt.searchTerm}
                onSearchChange={mgmt.setSearchTerm}
                facilities={mgmt.facilities}
                selectedFacility={mgmt.selectedFacility}
                onFacilityChange={mgmt.setSelectedFacility}
                currentUserRole={user.role}
                onRefresh={mgmt.fetchUsers}
                onAdd={mgmt.handleAddClick}
                onEdit={mgmt.handleEditClick}
            />

            {/* Modals */}
            {mgmt.showAddModal && (
                <UserFormModal
                    mode="add"
                    formData={mgmt.formData}
                    onFormChange={mgmt.setFormData}
                    onSubmit={mgmt.handleSubmit}
                    onClose={() => mgmt.setShowAddModal(false)}
                    facilities={mgmt.facilities}
                    currentUserRole={user.role}
                    submitting={mgmt.submitting}
                    error={mgmt.error}
                />
            )}
            {mgmt.showEditModal && (
                <UserFormModal
                    mode="edit"
                    formData={mgmt.formData}
                    onFormChange={mgmt.setFormData}
                    onSubmit={mgmt.handleSubmit}
                    onClose={() => mgmt.setShowEditModal(false)}
                    onDelete={mgmt.handleDelete}
                    facilities={mgmt.facilities}
                    currentUserRole={user.role}
                    submitting={mgmt.submitting}
                    error={mgmt.error}
                />
            )}
        </div>
    );
};

export default AdminUserManagement;

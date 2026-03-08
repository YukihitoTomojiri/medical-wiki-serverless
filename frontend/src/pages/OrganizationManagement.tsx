import { Plus, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useOrganization } from '../hooks/useOrganization';
import FacilityList from '../components/admin/FacilityList';

/**
 * 組織管理 – マスタ管理ページのタブコンテンツ
 * ロジック: useOrganization Hook
 * 表示: FacilityList コンポーネント
 */
const OrganizationManagement = () => {
    const org = useOrganization();

    if (org.loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-m3-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            {/* Actions (右寄せ) */}
            <div className="flex justify-end">
                {org.showAddFacility ? (
                    <div className="flex items-center gap-2">
                        <Input variant="outlined" value={org.newFacilityName} onChange={e => org.setNewFacilityName(e.target.value)}
                            placeholder="施設名" autoFocus />
                        <Button variant="filled" onClick={org.handleAddFacility} icon={<Save size={16} />}>保存</Button>
                        <Button variant="text" onClick={() => org.setShowAddFacility(false)}>キャンセル</Button>
                    </div>
                ) : (
                    <Button variant="filled" onClick={() => org.setShowAddFacility(true)} icon={<Plus size={18} />}>施設を追加</Button>
                )}
            </div>

            {org.error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{org.error}</div>
            )}

            {/* Facility List */}
            <Card variant="outlined" className="overflow-hidden">
                <FacilityList
                    facilities={org.facilities}
                    expandedFacility={org.expandedFacility}
                    onExpandToggle={org.setExpandedFacility}
                    getDepartmentsForFacility={org.getDepartmentsForFacility}
                    editingFacilityId={org.editingFacilityId}
                    editFacilityName={org.editFacilityName}
                    onEditFacilityStart={(id, name) => { org.setEditingFacilityId(id); org.setEditFacilityName(name); }}
                    onEditFacilityCancel={() => org.setEditingFacilityId(null)}
                    onEditFacilityNameChange={org.setEditFacilityName}
                    onEditFacilitySave={org.handleUpdateFacility}
                    onDeleteFacility={org.handleDeleteFacility}
                    editingDeptId={org.editingDeptId}
                    editDeptName={org.editDeptName}
                    onEditDeptStart={(id, name) => { org.setEditingDeptId(id); org.setEditDeptName(name); }}
                    onEditDeptCancel={() => org.setEditingDeptId(null)}
                    onEditDeptNameChange={org.setEditDeptName}
                    onEditDeptSave={org.handleUpdateDepartment}
                    onDeleteDept={org.handleDeleteDepartment}
                    showAddDepartment={org.showAddDepartment}
                    newDeptName={org.newDeptName}
                    onShowAddDept={(facilityId) => org.setShowAddDepartment(facilityId)}
                    onCancelAddDept={() => org.setShowAddDepartment(null)}
                    onNewDeptNameChange={org.setNewDeptName}
                    onAddDept={org.handleAddDepartment}
                />
            </Card>
        </div>
    );
};

export default OrganizationManagement;

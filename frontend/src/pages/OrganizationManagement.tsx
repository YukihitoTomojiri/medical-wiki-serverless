import { Plus, Save, Building2, X } from 'lucide-react';
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
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-300">
            {/* Header / Actions */}
            <div className="flex flex-row flex-wrap sm:flex-nowrap items-center justify-between px-1 md:px-2 gap-y-3 gap-x-2">
                <h3 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Building2 className="text-blue-500 w-4 h-4 md:w-5 md:h-5 shrink-0" />
                    組織・施設管理
                </h3>
                {org.showAddFacility ? (
                    <div className="flex flex-1 sm:flex-none items-center gap-2">
                        <Input variant="outlined" value={org.newFacilityName} onChange={e => org.setNewFacilityName(e.target.value)}
                            placeholder="施設名" autoFocus className="flex-1 min-w-[120px]" />
                        <Button variant="filled" onClick={org.handleAddFacility} className="shrink-0 flex items-center gap-1.5 px-3">
                            <Save size={16} /> <span className="hidden sm:inline">保存</span>
                        </Button>
                        <Button variant="text" onClick={() => org.setShowAddFacility(false)} className="shrink-0 text-gray-500 px-2" title="キャンセル">
                            <X size={20} className="sm:hidden" />
                            <span className="hidden sm:inline">キャンセル</span>
                        </Button>
                    </div>
                ) : (
                    <Button variant="filled" onClick={() => org.setShowAddFacility(true)} className="flex items-center gap-2 shrink-0">
                        <Plus size={16} />
                        <span className="hidden sm:inline">施設を追加</span>
                        <span className="sm:hidden">追加</span>
                    </Button>
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

import { Building2, Plus, Edit2, Trash2, ChevronDown, ChevronRight, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface Facility { id: number; name: string; }
interface Department { id: number; name: string; facilityId: number; facilityName: string; }

interface FacilityListProps {
    facilities: Facility[];
    expandedFacility: number | null;
    onExpandToggle: (id: number | null) => void;
    getDepartmentsForFacility: (facilityId: number) => Department[];
    // Facility edit
    editingFacilityId: number | null;
    editFacilityName: string;
    onEditFacilityStart: (id: number, name: string) => void;
    onEditFacilityCancel: () => void;
    onEditFacilityNameChange: (name: string) => void;
    onEditFacilitySave: (id: number) => void;
    onDeleteFacility: (id: number) => void;
    // Department edit
    editingDeptId: number | null;
    editDeptName: string;
    onEditDeptStart: (id: number, name: string) => void;
    onEditDeptCancel: () => void;
    onEditDeptNameChange: (name: string) => void;
    onEditDeptSave: (id: number) => void;
    onDeleteDept: (id: number) => void;
    // Department add
    showAddDepartment: number | null;
    newDeptName: string;
    onShowAddDept: (facilityId: number) => void;
    onCancelAddDept: () => void;
    onNewDeptNameChange: (name: string) => void;
    onAddDept: (facilityId: number) => void;
}

export default function FacilityList(props: FacilityListProps) {
    const { facilities, expandedFacility, onExpandToggle, getDepartmentsForFacility } = props;

    if (facilities.length === 0) {
        return (
            <div className="p-12 text-center text-m3-outline-variant">
                <Building2 size={48} className="mx-auto mb-4 opacity-50" />
                <p>登録されている施設はありません</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-m3-outline-variant/20">
            {facilities.map((facility) => {
                const depts = getDepartmentsForFacility(facility.id);
                const isExpanded = expandedFacility === facility.id;

                return (
                    <div key={facility.id} className="transition-colors hover:bg-m3-surface-container-low group">
                        {/* Facility Row */}
                        <div
                            className="flex items-center gap-4 p-4 cursor-pointer"
                            onClick={() => onExpandToggle(isExpanded ? null : facility.id)}
                        >
                            <div className="p-1 text-m3-outline transition-transform duration-200">
                                {isExpanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-m3-tertiary-container text-m3-on-tertiary-container flex items-center justify-center shrink-0">
                                <Building2 size={20} />
                            </div>

                            {props.editingFacilityId === facility.id ? (
                                <div className="flex-1 flex items-center gap-2 animate-in fade-in" onClick={(e) => e.stopPropagation()}>
                                    <Input variant="outlined" value={props.editFacilityName} onChange={(e) => props.onEditFacilityNameChange(e.target.value)} autoFocus className="flex-1" />
                                    <Button variant="filled" size="sm" onClick={(e) => { e.stopPropagation(); props.onEditFacilitySave(facility.id); }}><Check size={16} /></Button>
                                    <Button variant="tonal" size="sm" onClick={(e) => { e.stopPropagation(); props.onEditFacilityCancel(); }}><X size={16} /></Button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-m3-on-surface truncate">{facility.name}</h3>
                                        <p className="text-xs text-m3-on-surface-variant font-medium mt-0.5">{depts.length} 部署</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="text" size="sm" onClick={(e) => { e.stopPropagation(); props.onEditFacilityStart(facility.id, facility.name); }} className="text-m3-outline hover:text-m3-primary"><Edit2 size={18} /></Button>
                                        <Button variant="text" size="sm" onClick={(e) => { e.stopPropagation(); props.onDeleteFacility(facility.id); }} className="text-m3-outline hover:text-m3-error"><Trash2 size={18} /></Button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Departments (Nested) */}
                        {isExpanded && (
                            <div className="bg-m3-surface-container-lowest border-t border-m3-outline-variant/20 animate-in slide-in-from-top-1 duration-200">
                                <div className="pl-16 sm:pl-20 pr-4 py-3 space-y-1">
                                    {depts.map((dept) => (
                                        <div key={dept.id} className="group/dept flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-m3-surface-variant/50 transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-m3-outline-variant"></div>
                                            {props.editingDeptId === dept.id ? (
                                                <div className="flex-1 flex items-center gap-2 animate-in fade-in">
                                                    <Input variant="outlined" value={props.editDeptName} onChange={(e) => props.onEditDeptNameChange(e.target.value)} autoFocus className="py-1 text-sm" />
                                                    <Button variant="filled" size="sm" className="h-8 w-8 px-0" onClick={() => props.onEditDeptSave(dept.id)}><Check size={14} /></Button>
                                                    <Button variant="tonal" size="sm" className="h-8 w-8 px-0" onClick={() => props.onEditDeptCancel()}><X size={14} /></Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="flex-1 text-sm font-medium text-m3-on-surface-variant">{dept.name}</span>
                                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover/dept:opacity-100 transition-opacity">
                                                        <button onClick={() => props.onEditDeptStart(dept.id, dept.name)} className="p-1 text-m3-outline hover:text-m3-primary rounded transition-colors"><Edit2 size={14} /></button>
                                                        <button onClick={() => props.onDeleteDept(dept.id)} className="p-1 text-m3-outline hover:text-m3-error rounded transition-colors"><Trash2 size={14} /></button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}

                                    {/* Add Department Input */}
                                    <div className="pl-3 mt-2">
                                        {props.showAddDepartment === facility.id ? (
                                            <div className="flex items-center gap-2 py-1 animate-in fade-in">
                                                <Input variant="outlined" value={props.newDeptName} onChange={(e) => props.onNewDeptNameChange(e.target.value)} placeholder="部署名を追加..." autoFocus className="py-1 text-sm" />
                                                <Button variant="filled" size="sm" onClick={() => props.onAddDept(facility.id)}><Check size={16} /></Button>
                                                <Button variant="tonal" size="sm" onClick={() => props.onCancelAddDept()}><X size={16} /></Button>
                                            </div>
                                        ) : (
                                            <button onClick={() => props.onShowAddDept(facility.id)} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-m3-primary hover:bg-m3-primary-container/30 rounded-lg transition-colors w-full text-left">
                                                <Plus size={16} /><span>部署を追加</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

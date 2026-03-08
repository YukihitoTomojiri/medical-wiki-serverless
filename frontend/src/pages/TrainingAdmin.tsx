import { useNavigate } from 'react-router-dom';
import { useTrainingManagement } from '../hooks/useTrainingManagement';
import TrainingEventTable from '../components/admin/TrainingEventTable';
import TrainingEventFormModal from '../components/admin/TrainingEventFormModal';

/**
 * 研修管理 – 運用管理ページのタブコンテンツ
 * ロジック: useTrainingManagement Hook
 * 表示: TrainingEventTable + TrainingEventFormModal コンポーネント
 */
const TrainingAdmin = () => {
    const navigate = useNavigate();
    const training = useTrainingManagement();

    if (training.loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
            </div>
        );
    }

    return (
        <div>
            <TrainingEventTable
                events={training.events}
                committees={training.committees}
                onEdit={training.handleEdit}
                onDelete={training.handleDeleteEvent}
                onQr={training.openQr}
                onViewResponses={(id) => navigate(`/training/${id}/responses`)}
                onPreview={(id) => navigate(`/training/${id}`)}
                onCreateNew={training.openCreateModal}
            />

            {training.showCreateModal && (
                <TrainingEventFormModal
                    formState={training.formState}
                    onFieldChange={training.updateFormField}
                    committees={training.committees}
                    onSubmit={training.handleCreate}
                    onClose={training.closeModal}
                    isEditing={!!training.editingEvent}
                />
            )}
        </div>
    );
};

export default TrainingAdmin;

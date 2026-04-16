import React, { useState } from 'react';
import AddBuildingSiteFormComponent from './AddBuilingSiteFormComponent';
import UploadFilesComponent from './UploadFilesComponent';

interface AddRecordComponentProps {
    tableName: string;
    buildingSiteId?: number;
    onSuccess: () => void;
    selectedDate?: string;
    handleEditFile?: (fileAlreadyExists: boolean) => void;
    onCollaboraFileCreated?: (fileId: number, fileName: string) => void;
}

const AddRecordComponent: React.FC<AddRecordComponentProps> = ({ tableName, buildingSiteId, onSuccess, selectedDate, handleEditFile, onCollaboraFileCreated }: AddRecordComponentProps) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
        onSuccess();
    };

    return (
        <>
            {/* Pulsante Floating centrato e stiloso */}
            <button
                className="btn btn-primary rounded-circle position-fixed shadow-lg d-flex align-items-center justify-content-center fw-bold"
                style={{
                bottom: window.innerWidth < 576 ? '80px' : '30px',
                right: '30px',
                width: '60px',
                height: '60px',
                zIndex: 1050,
                fontSize: '28px',
                marginBottom: 'calc(env(safe-area-inset-bottom) + 0px)', 
                }}
                onClick={togglePopup}
            >
                +
            </button>

            {isPopupOpen && (
                <div 
                className="modal d-block"
                tabIndex={-1}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
                onClick={togglePopup}
                >
                <div 
                    className="modal-dialog modal-dialog-centered modal-lg" 
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-content border-0 shadow-lg rounded-4">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold text-primary">Nuovo Inserimento</h5>
                        <button type="button" className="btn-close" onClick={togglePopup}></button>
                    </div>
                    <div className="modal-body p-4">
                        {tableName === 'building_sites' && (
                        <AddBuildingSiteFormComponent onClose={togglePopup} />
                        )}
                        {(tableName === 'files' && buildingSiteId) && (
                        <UploadFilesComponent
                            buildingSiteId={buildingSiteId}
                            selectedDate={selectedDate}
                            // handleEditFile passa false che indica che il file che si cerca di editare non esiste ancora (deve essere creato)
                            handleEditFile={handleEditFile ? () => handleEditFile(false) : undefined}
                            onCollaboraFileCreated={onCollaboraFileCreated ? (fileId, fileName) => {
                                setIsPopupOpen(false);
                                onCollaboraFileCreated(fileId, fileName);
                            } : undefined}
                        />
                        )}
                    </div>
                    </div>
                </div>
                </div>
            )}
            </>
    );
};

export default AddRecordComponent;

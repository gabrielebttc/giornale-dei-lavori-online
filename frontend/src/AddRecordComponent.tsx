import React, { useState } from 'react';
import AddBuildingSiteFormComponent from './AddBuilingSiteFormComponent';

interface AddRecordComponentProps {
    tableName: string;
}

const AddRecordComponent: React.FC<AddRecordComponentProps> = ({ tableName }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        <>
            {/* Pulsante Floating centrato e stiloso */}
            <button
                className="btn btn-primary rounded-circle position-fixed shadow-lg d-flex align-items-center justify-content-center fw-bold"
                style={{
                bottom: '30px',
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
                        <AddBuildingSiteFormComponent onClose={() => setIsPopupOpen(false)} />
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

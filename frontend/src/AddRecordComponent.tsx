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
            <button
                className="btn btn-primary rounded-circle position-fixed"
                style={{
                    bottom: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    marginBottom: 'calc(env(safe-area-inset-bottom) + 70px)', // Add margin for safe area
                }}
                onClick={togglePopup}
            >
                +
            </button>
            <style>
                {`
                @media (min-width: 992px) {
                    .btn-primary {
                        margin-bottom: 0 !important;
                    }
                }
                `}
            </style>
            {isPopupOpen && (
                <div
                    className="modal d-flex justify-content-center align-items-center"
                    style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onClick={togglePopup}
                >
                    <div
                        className="modal-dialog"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nuovo</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={togglePopup}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {tableName === 'building_sites' && <AddBuildingSiteFormComponent />}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={togglePopup}
                                >
                                    Chiudi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddRecordComponent;

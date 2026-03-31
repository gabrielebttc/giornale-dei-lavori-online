import React, { useState, useEffect, useCallback } from 'react';
import AddCompanyComponent from './AddCompanyComponent';
import AddUserTypeComponent from './AddUserTypeComponent';
import AddExistingWorkerComponent from './AddExistingWorkerComponent';
import DeleteRecordComponent from './DeleteRecordComponent'; // Importa il componente di eliminazione

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface Company {
  id: number;
  name: string;
}

interface UserType {
  id: number;
  name: string;
}

interface Props {
  onClose: () => void;
  onWorkerAdded: () => void;
  buildingSiteId: number | null;
}

type FormMode = 'new' | 'existing';

const AddWorkerComponent: React.FC<Props> = ({ onClose, onWorkerAdded, buildingSiteId }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    cellulare: '',
    companyIds: [] as number[],
    userTypeIds: [] as number[],
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showAddUserTypeModal, setShowAddUserTypeModal] = useState(false);
  
  const [mode, setMode] = useState<FormMode>('new'); // Nuovo stato per la modalità

  // Stati per la gestione del modale di eliminazione
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; tableName: string; name: string } | null>(null);


  const fetchCompanies = useCallback(async () => {
    try {
      const companiesResponse = await fetch(`${apiUrl}/api/db/companies`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!companiesResponse.ok) {
        throw new Error('Failed to fetch companies');
      }
      const companiesData = await companiesResponse.json();
      setCompanies(companiesData);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Impossibile caricare le aziende.");
    }
  }, []);

  const fetchUserTypes = useCallback(async () => {
    try {
      const userTypesResponse = await fetch(`${apiUrl}/api/db/user_type`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!userTypesResponse.ok) {
        throw new Error('Failed to fetch user types');
      }
      const userTypesData = await userTypesResponse.json();
      setUserTypes(userTypesData);
    } catch (err) {
      console.error("Error fetching user types:", err);
      setError("Impossibile caricare le mansioni.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (mode === 'new') {
        try {
          await Promise.all([fetchCompanies(), fetchUserTypes()]);
        } catch (err) {
          console.error("Error fetching data for form:", err);
          setError("Impossibile caricare i dati iniziali. Riprova più tardi.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [fetchCompanies, fetchUserTypes, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'userTypeIds' || name === 'companyIds') {
      const selectedOptions = Array.from(
        (e.target as HTMLSelectElement).selectedOptions,
        (option) => Number(option.value)
      );
      setFormData({ ...formData, [name]: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleSelection = (key: 'companyIds' | 'userTypeIds', id: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter((item) => item !== id)
        : [...prev[key], id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${apiUrl}/api/add-worker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          firstName: formData.nome,
          lastName: formData.cognome,
          email: formData.email || null,
          phone: formData.cellulare || null,
          companyIds: formData.companyIds,
          userTypeIds: formData.userTypeIds,
          buildingSiteId: buildingSiteId || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add worker');
      }

      setSuccess('Lavoratore aggiunto con successo!');
      setTimeout(() => {
        onWorkerAdded();
        onClose();
      }, 500);
    } catch (err) {
      console.error('Error adding worker:', err);
      setError("Errore durante l'aggiunta del lavoratore. Controlla i dati e riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanyAdded = () => {
    fetchCompanies();
    setShowAddCompanyModal(false);
  };

  const handleUserTypeAdded = () => {
    fetchUserTypes();
    setShowAddUserTypeModal(false);
  };

  // Funzioni per la gestione dell'eliminazione di azienda/mansione
  const handleDeleteItemClick = (id: number, tableName: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Impedisce la propagazione dell'evento di click
    setItemToDelete({ id, tableName, name });
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleSuccessDelete = () => {
    if (itemToDelete?.tableName === 'companies') {
      fetchCompanies(); // Ricarica le aziende
      // Rimuovi l'azienda eliminata da companyIds se selezionata
      setFormData(prev => ({
        ...prev,
        companyIds: prev.companyIds.filter(id => id !== itemToDelete.id)
      }));
    } else if (itemToDelete?.tableName === 'user_type') {
      fetchUserTypes(); // Ricarica le mansioni
      // Rimuovi la mansione eliminata da userTypeIds se selezionata
      setFormData(prev => ({
        ...prev,
        userTypeIds: prev.userTypeIds.filter(id => id !== itemToDelete.id)
      }));
    }
    handleCloseDeleteModal();
  };


  if (showAddCompanyModal) {
    return <AddCompanyComponent onClose={() => setShowAddCompanyModal(false)} onCompanyAdded={handleCompanyAdded} />;
  }

  if (showAddUserTypeModal) {
    return <AddUserTypeComponent onClose={() => setShowAddUserTypeModal(false)} onUserTypeAdded={handleUserTypeAdded} />;
  }

  // Visualizza il componente per aggiungere un lavoratore esistente
  if (mode === 'existing' && buildingSiteId !== null) {
    return (
      <AddExistingWorkerComponent
        onClose={onClose}
        onWorkerAdded={onWorkerAdded}
        buildingSiteId={buildingSiteId}
      />
    );
  }

  return (
    <div className="modal show d-block px-3" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(24, 28, 33, 0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow-lg rounded-4">
          
          {/* Header pulito */}
          <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h4 className="fw-bold text-dark mb-0">Nuovo Lavoratore</h4>
            <button type="button" className="btn-close shadow-none" onClick={onClose} aria-label="Close"></button>
          </div>

          <div className="modal-body p-4">
            {/* Switch Mode Sezione */}
            <div className="bg-light rounded-3 p-3 mb-4 text-center border">
              <button 
                className={`btn btn-sm text-decoration-none fw-bold ${buildingSiteId ? 'text-primary' : 'text-muted'}`} 
                onClick={() => setMode('existing')} 
                disabled={!buildingSiteId}
              >
                <i className="bi bi-person-plus me-2"></i>
                Seleziona da lavoratori esistenti
              </button>
              {!buildingSiteId && (
                <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>
                  <i className="bi bi-info-circle me-1"></i> Opzione disponibile solo dentro un cantiere
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Caricamento opzioni...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Nome e Cognome sulla stessa riga su desktop */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-uppercase text-muted">Nome *</label>
                    <input type="text" className="form-control border-2 bg-light shadow-none" name="nome" value={formData.nome} onChange={handleChange} required disabled={isSubmitting}/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-uppercase text-muted">Cognome *</label>
                    <input type="text" className="form-control border-2 bg-light shadow-none" name="cognome" value={formData.cognome} onChange={handleChange} required disabled={isSubmitting}/>
                  </div>

                  <div className="col-12 mt-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">Contatti</label>
                    <div className="input-group mb-2">
                      <span className="input-group-text bg-white border-2 border-end-0"><i className="bi bi-envelope text-muted"></i></span>
                      <input type="email" className="form-control border-2 border-start-0 bg-light shadow-none" placeholder="Email" name="email" value={formData.email} onChange={handleChange} disabled={isSubmitting}/>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-2 border-end-0"><i className="bi bi-telephone text-muted"></i></span>
                      <input type="text" className="form-control border-2 border-start-0 bg-light shadow-none" placeholder="Cellulare" name="cellulare" value={formData.cellulare} onChange={handleChange} disabled={isSubmitting}/>
                    </div>
                  </div>

                  {/* Sezione Aziende */}
                  <div className="col-12 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label small fw-bold text-uppercase text-muted mb-0">Aziende *</label>
                      <button type="button" className="btn btn-sm btn-link p-0 text-decoration-none" onClick={() => setShowAddCompanyModal(true)}>+ Nuova</button>
                    </div>
                    <div className="d-flex flex-wrap gap-2 p-2 rounded-3 border bg-light min-vh-10">
                      {companies.map((company) => (
                        <div key={company.id} className="badge-pill-container d-flex align-items-center shadow-sm">
                          <span 
                            onClick={() => toggleSelection('companyIds', company.id)}
                            className={`badge-pill-main ${formData.companyIds.includes(company.id) ? 'active' : ''}`}
                          >
                            {company.name}
                          </span>
                          <button type="button" className="badge-pill-del" onClick={(e) => handleDeleteItemClick(company.id, 'companies', company.name, e)}>
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sezione Mansioni */}
                  <div className="col-12 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label small fw-bold text-uppercase text-muted mb-0">Mansioni *</label>
                      <button type="button" className="btn btn-sm btn-link p-0 text-decoration-none" onClick={() => setShowAddUserTypeModal(true)}>+ Nuova</button>
                    </div>
                    <div className="d-flex flex-wrap gap-2 p-2 rounded-3 border bg-light">
                      {userTypes.filter(ut => ut.id !== 17).map((userType) => (
                        <div key={userType.id} className="badge-pill-container d-flex align-items-center shadow-sm">
                          <span 
                            onClick={() => toggleSelection('userTypeIds', userType.id)}
                            className={`badge-pill-main-alt ${formData.userTypeIds.includes(userType.id) ? 'active-alt' : ''}`}
                          >
                            {userType.name}
                          </span>
                          <button type="button" className="badge-pill-del-alt" onClick={(e) => handleDeleteItemClick(userType.id, 'user_type', userType.name, e)}>
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Messaggi di Alert */}
                {(error || success) && (
                  <div className={`alert ${error ? 'alert-danger' : 'alert-success'} mt-4 border-0 rounded-3`} role="alert">
                    <i className={`bi ${error ? 'bi-exclamation-circle' : 'bi-check-circle'} me-2`}></i>
                    {error || success}
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="d-flex gap-2 justify-content-end mt-5">
                  <button type="button" className="btn btn-light px-4 fw-bold text-muted border" onClick={onClose} disabled={isSubmitting}>Annulla</button>
                  <button type="submit" className="btn btn-primary px-4 fw-bold shadow" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Invio...</>
                    ) : 'Crea Lavoratore'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .badge-pill-container { background: white; border-radius: 8px; overflow: hidden; border: 1px solid #dee2e6; transition: 0.2s; }
        
        .badge-pill-main { padding: 6px 12px; cursor: pointer; font-size: 0.85rem; font-weight: 500; color: #0d6efd; flex-grow: 1; }
        .badge-pill-main.active { background: #0d6efd; color: white; }
        .badge-pill-del { border: none; background: #fff1f1; color: #dc3545; padding: 6px 8px; transition: 0.2s; border-left: 1px solid #dee2e6; }
        .badge-pill-del:hover { background: #dc3545; color: white; }

        .badge-pill-main-alt { padding: 6px 12px; cursor: pointer; font-size: 0.85rem; font-weight: 500; color: #198754; flex-grow: 1; }
        .badge-pill-main-alt.active-alt { background: #198754; color: white; }
        .badge-pill-del-alt { border: none; background: #f1fbf1; color: #dc3545; padding: 6px 8px; transition: 0.2s; border-left: 1px solid #dee2e6; }
        .badge-pill-del-alt:hover { background: #dc3545; color: white; }

        .input-group-text { border: 2px solid #dee2e6; }
        .form-control:focus { border-color: #0d6efd; background: white; }
      `}</style>

      {/* Componente Eliminazione */}
      {showDeleteModal && itemToDelete && (
        <DeleteRecordComponent
          tableName={itemToDelete.tableName}
          recordId={itemToDelete.id}
          onClose={handleCloseDeleteModal}
          onSuccess={handleSuccessDelete}
        />
      )}
    </div>
  );
};

export default AddWorkerComponent;
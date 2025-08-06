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
      }, 1500);
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
    <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between align-items-center">
            <h5 className="modal-title">Aggiungi Lavoratore</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="text-center mb-3">
              <button className="btn btn-link p-0" onClick={() => setMode('existing')} disabled={buildingSiteId === null}>
                Aggiungi lavoratore esistente
              </button>
              {buildingSiteId === null && (
                <small className="d-block text-muted">Devi essere in un cantiere per usare questa opzione</small>
              )}
            </div>

            {loading ? (
              <p>Caricamento opzioni...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="nome">Nome *</label>
                  <input type="text" className="form-control" id="nome" name="nome" value={formData.nome} onChange={handleChange} required disabled={isSubmitting}/>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="cognome">Cognome *</label>
                  <input type="text" className="form-control" id="cognome" name="cognome" value={formData.cognome} onChange={handleChange} required disabled={isSubmitting}/>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="email">Email</label>
                  <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} disabled={isSubmitting}/>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="cellulare">Cellulare</label>
                  <input type="text" className="form-control mb-3" id="cellulare" name="cellulare" value={formData.cellulare} onChange={handleChange} disabled={isSubmitting}/>
                </div>
                
                <div className="form-group mb-3">
                  <label>Azienda/e *</label>
                  <div className="mb-2 d-flex flex-wrap gap-2">
                    {companies.map((company) => {
                      const isSelected = formData.companyIds.includes(company.id);
                      return (
                        <div key={company.id} className="d-flex align-items-center me-2 mb-1">
                          <button
                            type="button"
                            className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => toggleSelection('companyIds', company.id)}
                            disabled={isSubmitting}
                          >
                            {company.name}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger ms-1"
                            onClick={(e) => handleDeleteItemClick(company.id, 'companies', company.name, e)}
                            disabled={isSubmitting}
                            title={`Elimina ${company.name}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      type="button"
                      onClick={() => setShowAddCompanyModal(true)}
                      disabled={isSubmitting}
                    >
                      + Nuova
                    </button>
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label>Mansione/e *</label>
                  <div className="mb-2 d-flex flex-wrap gap-2">
                    {userTypes.map((userType) => {
                      const isSelected = formData.userTypeIds.includes(userType.id);
                      return (
                        <div key={userType.id} className="d-flex align-items-center me-2 mb-1">
                          {userType.id != 17 && (<><button
                            type="button"
                            className={`btn btn-sm ${isSelected ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => toggleSelection('userTypeIds', userType.id)}
                            disabled={isSubmitting}
                          >
                            {userType.name}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger ms-1"
                            onClick={(e) => handleDeleteItemClick(userType.id, 'user_type', userType.name, e)}
                            disabled={isSubmitting}
                            title={`Elimina ${userType.name}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                          </button></>)}
                        </div>
                      );
                    })}
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      type="button"
                      onClick={() => setShowAddUserTypeModal(true)}
                      disabled={isSubmitting}
                    >
                      + Nuova
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}
                <div className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={onClose} disabled={isSubmitting}>
                    Annulla
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Aggiungendo...' : 'Aggiungi Lavoratore'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modale di conferma eliminazione */}
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
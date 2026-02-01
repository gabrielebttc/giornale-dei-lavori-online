import React, { useEffect, useState, useCallback } from 'react';
import AddWorkerComponent from './AddWorkerComponent';
import ModifyUserComponent from './ModifyUserComponent';
import DeleteRecordComponent from './DeleteRecordComponent';
import UnlinkWorkerFromBuildingSite from './UnlinkWorkerFromBuildingSite'; // Importa il nuovo componente

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface Worker {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes?: string;
  company_names: string[];
  building_site_names?: string[];
  user_types: string[];
}

interface Company {
  id: number;
  name: string;
}

interface UserType {
  id: number;
  name: string;
}

interface Props {
  buildingSiteId: number | null;
}

const AllWorkersComponent: React.FC<Props> = ({ buildingSiteId }) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddWorkerPopup, setShowAddWorkerPopup] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModifyUserPopup, setShowModifyUserPopup] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Worker | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);

  // Stati per la gestione del modale di eliminazione
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);

  // Stati per la gestione del modale di disassociazione
  const [showUnlinkModal, setShowUnlinkModal] = useState<boolean>(false);
  const [workerToUnlink, setWorkerToUnlink] = useState<Worker | null>(null);

  const fetchCompanies = useCallback(async () => {
    try {
      const companiesRes = await fetch(`${apiUrl}/api/db/companies`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const companiesData = await companiesRes.json();
      setCompanies(companiesData);
    } catch (error) {
      console.error('Errore nel caricamento delle aziende:', error);
    }
  }, []);

  const fetchUserTypes = useCallback(async () => {
    try {
      const userTypesRes = await fetch(`${apiUrl}/api/db/user_type`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const userTypesData = await userTypesRes.json();
      setUserTypes(userTypesData);
    } catch (error) {
      console.error('Errore nel caricamento delle mansioni:', error);
    }
  }, []);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = buildingSiteId
        ? `${apiUrl}/api/get-all-workers?buildingSiteId=${buildingSiteId}`
        : `${apiUrl}/api/get-all-workers`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch workers');
      const data = await response.json();
      setWorkers(data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  }, [buildingSiteId]);

  useEffect(() => {
    fetchWorkers();
    fetchCompanies();
    fetchUserTypes();
  }, [fetchWorkers, fetchCompanies, fetchUserTypes]);

  const handleModifyUser = (user: Worker) => {
    setSelectedUser(user);
    setShowModifyUserPopup(true);
  };

  const handleUserModified = () => {
    fetchWorkers();
    fetchCompanies();
    fetchUserTypes();
    setShowModifyUserPopup(false);
  };
  
  // Funzioni per la gestione dell'eliminazione
  const handleDeleteWorker = (worker: Worker, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkerToDelete(worker);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setWorkerToDelete(null);
  };

  const handleSuccessDelete = () => {
    fetchWorkers();
    handleCloseDeleteModal();
  };

  // Funzioni per la gestione della disassociazione
  const handleUnlinkWorker = (worker: Worker, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkerToUnlink(worker);
    setShowUnlinkModal(true);
  };

  const handleCloseUnlinkModal = () => {
    setShowUnlinkModal(false);
    setWorkerToUnlink(null);
  };

  const handleSuccessUnlink = () => {
    fetchWorkers();
    handleCloseUnlinkModal();
  };

  const filteredWorkers = workers.filter((worker) => {
    const term = searchTerm.toLowerCase();
    return (
      worker.first_name.toLowerCase().includes(term) ||
      worker.last_name.toLowerCase().includes(term) ||
      worker.company_names.join(', ').toLowerCase().includes(term) ||
      worker.user_types.join(', ').toLowerCase().includes(term) ||
      (worker.building_site_names && worker.building_site_names.join(', ').toLowerCase().includes(term))
    );
  });

  if (showAddWorkerPopup) {
    return (
      <AddWorkerComponent
        onClose={() => setShowAddWorkerPopup(false)}
        onWorkerAdded={fetchWorkers}
        buildingSiteId={buildingSiteId}
      />
    );
  }

  if (showModifyUserPopup && selectedUser) {
    return (
      <ModifyUserComponent
        onClose={() => setShowModifyUserPopup(false)}
        onUserModified={handleUserModified}
        companies={companies}
        userTypes={userTypes}
        fetchCompanies={fetchCompanies}
        fetchUserTypes={fetchUserTypes}
        user={{
          user_id: selectedUser.user_id,
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          email: selectedUser.email,
          phone: selectedUser.phone,
          notes: selectedUser.notes,
          companyIds: companies
            .filter((c) => (selectedUser.company_names || []).includes(c.name))
            .map((c) => c.id),
          userTypeIds: userTypes
            .filter((u) => (selectedUser.user_types || []).includes(u.name))
            .map((u) => u.id),
        }}
      />
    );
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="container">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark mb-3 mb-md-0">
            <i className="bi bi-people-fill me-2 text-primary"></i>
            Lista Lavoratori
          </h2>
          <div className="position-relative w-100 style={{ maxWidth: '400px' }}">
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="text"
              className="form-control ps-5 border-0 shadow-sm rounded-pill"
              placeholder="Cerca nome, azienda, mansione..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="d-flex flex-column align-items-center mt-5">
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <span className="text-muted fw-semibold">Caricamento lavoratori...</span>
          </div>
        ) : (
          <div className="table-responsive shadow-sm rounded-4 bg-white border">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0 text-secondary small text-uppercase">Lavoratore</th>
                  <th className="py-3 border-0 text-secondary small text-uppercase">Azienda</th>
                  <th className="py-3 border-0 text-secondary small text-uppercase">Mansione</th>
                  {!buildingSiteId && <th className="py-3 border-0 text-secondary small text-uppercase">Cantieri</th>}
                  <th className="py-3 border-0 text-secondary small text-uppercase text-end px-4">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.map((worker) => (
                  <tr key={worker.user_id} onClick={() => handleModifyUser(worker)} style={{ cursor: 'pointer' }}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '40px', height: '40px' }}>
                          {worker.first_name[0]}{worker.last_name[0]}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{worker.first_name} {worker.last_name}</div>
                          <small className="text-muted">ID: #{worker.user_id}</small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="badge bg-light text-dark border fw-normal px-2 py-1">
                        {worker.company_names?.join(', ') || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="small text-dark fw-medium">
                        {worker.user_types?.join(', ') || '-'}
                      </div>
                    </td>
                    {!buildingSiteId && (
                      <td className="py-3">
                        <small className="text-muted lh-sm d-block" style={{ maxWidth: '200px' }}>
                          {worker.building_site_names?.join(', ') || 'Nessuno'}
                        </small>
                      </td>
                    )}
                    <td className="py-3 px-4 text-end" onClick={(e) => e.stopPropagation()}>
                      <div className="btn-group shadow-sm rounded-3 overflow-hidden">
                        {buildingSiteId && (
                          <button
                            className="btn btn-white border-end py-2 px-3 hover-warning"
                            onClick={(e) => handleUnlinkWorker(worker, e)}
                            title="Scollega dal cantiere"
                          >
                            <i className="bi bi-link-45deg text-warning fs-5"></i>
                          </button>
                        )}
                        <button
                          className="btn btn-white py-2 px-3 hover-danger"
                          onClick={(e) => handleDeleteWorker(worker, e)}
                          title="Elimina definitivamente"
                        >
                          <i className="bi bi-trash3 text-danger fs-5"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Floating Action Buttons */}
        <div 
          className="position-fixed d-flex flex-column gap-3" 
          style={{ 
            bottom: window.innerWidth <= 768 ? '30px' : '40px', 
            right: '30px', 
            zIndex: 1050 
          }}
        >
          <button
            className="btn btn-white shadow-lg border rounded-circle d-flex align-items-center justify-content-center transition-all"
            onClick={fetchWorkers}
            disabled={loading}
            style={{ width: '56px', height: '56px' }}
          >
            <i className={`bi bi-arrow-clockwise fs-4 ${loading ? 'spin' : ''}`}></i>
          </button>
          
          <button
            className="btn btn-primary shadow-lg rounded-circle d-flex align-items-center justify-content-center transition-all"
            onClick={() => setShowAddWorkerPopup(true)}
            style={{ width: '64px', height: '64px' }}
          >
            <i className="bi bi-plus-lg fs-2 text-white"></i>
          </button>
        </div>
      </div>

      {/* Modali (invariati come logica) */}
      {showDeleteModal && workerToDelete && (
        <DeleteRecordComponent
          tableName="users"
          recordId={workerToDelete.user_id}
          onClose={handleCloseDeleteModal}
          onSuccess={handleSuccessDelete}
        />
      )}

      {showUnlinkModal && workerToUnlink && buildingSiteId && (
        <UnlinkWorkerFromBuildingSite
          workerId={workerToUnlink.user_id}
          buildingSiteId={buildingSiteId}
          onClose={handleCloseUnlinkModal}
          onSuccess={handleSuccessUnlink}
        />
      )}

      {/* Style Inline per pulizia */}
      <style>{`
        .hover-shadow-sm:hover { box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important; }
        .btn-white { background: white; border: 1px solid #dee2e6; }
        .btn-white:hover { background: #f8f9fa; }
        .hover-danger:hover { background-color: #fff5f5!important; }
        .hover-warning:hover { background-color: #fff9db!important; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .transition-all:hover { transform: scale(1.05); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AllWorkersComponent;
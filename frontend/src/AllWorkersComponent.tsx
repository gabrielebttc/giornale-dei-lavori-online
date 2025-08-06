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
    <div className="container-fluid">
      <h1 className="text-center my-4">Lista Lavoratori</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Cerca per nome, cognome, azienda..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary mb-2"
        onClick={fetchWorkers}
        disabled={loading}
        style={{
          position: 'fixed',
          bottom: window.innerWidth <= 768 ? '80px' : '20px',
          right: '90px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          opacity: 0.8,
          fontSize: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        &#x21bb;
      </button>
      <button
        className="btn btn-success mb-2"
        onClick={() => setShowAddWorkerPopup(true)}
        style={{
          position: 'fixed',
          bottom: window.innerWidth <= 768 ? '80px' : '20px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          opacity: 0.8,
        }}
      >
        +
      </button>
      {loading ? (
        <div className="text-center">
          <span>Caricamento...</span>
        </div>
      ) : (
        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Azienda</th>
              <th>Mansione</th>
              {!buildingSiteId && <th>Cantieri</th>}
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkers.map((worker) => (
              <tr key={worker.user_id} onClick={() => handleModifyUser(worker)} style={{ cursor: 'pointer' }}>
                <td>{worker.first_name}</td>
                <td>{worker.last_name}</td>
                <td>{worker.company_names && worker.company_names.join(', ')}</td>
                <td>{worker.user_types && worker.user_types.join(', ')}</td>
                {!buildingSiteId && <td>{worker.building_site_names?.join(', ') || 'N/A'}</td>}
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="d-flex justify-content-around">
                    {/* Pulsante di disassociazione, visibile solo se buildingSiteId esiste */}
                    {buildingSiteId && (
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={(e) => handleUnlinkWorker(worker, e)}
                        title="Scollega da questo cantiere"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-slash" viewBox="0 0 16 16">
                          <path d="m6.146 9.146-4.353 4.353a.5.5 0 0 1-.708-.708L5.439 8.439l-.382-.382A.5.5 0 0 1 5.5 7.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.36.48l-.357-.357zM9.146 6.146l4.353 4.353a.5.5 0 0 1-.708.708L8.439 6.439l-.382-.382A.5.5 0 0 1 8.5 5.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.36.48l-.357-.357z"/>
                          <path d="M12.984 8H13c0 .768-.184 1.497-.514 2.155l-.658-.658A6 6 0 0 0 12 8a6 6 0 0 0-4.146-5.656l-.658-.658A7 7 0 0 1 13 8h-.016zm-5.419 4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V8a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5zm-.935-4.5c0-.98.396-1.896 1.054-2.553l-.658-.658A7.001 7.001 0 0 0 2 8c0 1.933.914 3.655 2.373 4.887l.658-.658A6 6 0 0 1 3 8c0-1.657.894-3.111 2.23-3.965l-.357-.357a.5.5 0 0 1-.48-.36zM3.5 7.5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5zm9.5-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5z"/>
                        </svg>
                      </button>
                    )}
                    {/* Pulsante di eliminazione */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => handleDeleteWorker(worker, e)}
                      title="Elimina lavoratore"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modale di conferma eliminazione */}
      {showDeleteModal && workerToDelete && (
        <DeleteRecordComponent
          tableName="users"
          recordId={workerToDelete.user_id}
          onClose={handleCloseDeleteModal}
          onSuccess={handleSuccessDelete}
        />
      )}

      {/* Modale di conferma disassociazione */}
      {showUnlinkModal && workerToUnlink && buildingSiteId && (
        <UnlinkWorkerFromBuildingSite
          workerId={workerToUnlink.user_id}
          buildingSiteId={buildingSiteId}
          onClose={handleCloseUnlinkModal}
          onSuccess={handleSuccessUnlink}
        />
      )}
    </div>
  );
};

export default AllWorkersComponent;
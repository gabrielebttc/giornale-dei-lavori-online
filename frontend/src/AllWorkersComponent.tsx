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

  const avatar = (w: Worker) => (
    <div
      style={{ width: 42, height: 42, borderRadius: '50%', background: '#e7f1ff', color: '#0d6efd', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}
      className="d-flex align-items-center justify-content-center"
    >
      {w.first_name[0]}{w.last_name[0]}
    </div>
  );

  const actionButtons = (worker: Worker) => (
    <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
      {buildingSiteId && (
        <button
          className="aw-btn-icon aw-btn-warning"
          onClick={(e) => handleUnlinkWorker(worker, e)}
          title="Scollega dal cantiere"
        >
          <i className="bi bi-link-45deg" />
        </button>
      )}
      <button
        className="aw-btn-icon aw-btn-danger"
        onClick={(e) => handleDeleteWorker(worker, e)}
        title="Elimina definitivamente"
      >
        <i className="bi bi-trash3" />
      </button>
    </div>
  );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="container">

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <h2 className="fw-bold text-dark mb-0" style={{ fontSize: '1.4rem' }}>
            <i className="bi bi-people-fill me-2 text-primary" />
            Lista Lavoratori
          </h2>
          <div className="position-relative" style={{ width: '100%', maxWidth: 380 }}>
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ pointerEvents: 'none' }} />
            <input
              type="text"
              className="form-control ps-5 border-0 shadow-sm rounded-pill"
              placeholder="Cerca nome, azienda, mansione..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="d-flex flex-column align-items-center mt-5 gap-2">
            <div className="spinner-border text-primary" role="status" />
            <span className="text-muted fw-semibold">Caricamento lavoratori...</span>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-people fs-1 d-block mb-2 opacity-25" />
            Nessun lavoratore trovato.
          </div>
        ) : (
          <>
            {/* ── DESKTOP: tabella (nascosta su mobile) ── */}
            <div className="d-none d-md-block shadow-sm rounded-4 bg-white border overflow-hidden">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ background: '#f8f9fc' }}>
                  <tr>
                    <th className="px-4 py-3 border-0 text-secondary small text-uppercase fw-semibold">Lavoratore</th>
                    <th className="py-3 border-0 text-secondary small text-uppercase fw-semibold">Azienda</th>
                    <th className="py-3 border-0 text-secondary small text-uppercase fw-semibold">Mansione</th>
                    {!buildingSiteId && <th className="py-3 border-0 text-secondary small text-uppercase fw-semibold">Cantieri</th>}
                    <th className="py-3 pe-4 border-0 text-secondary small text-uppercase fw-semibold text-end">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.map((worker) => (
                    <tr key={worker.user_id} onClick={() => handleModifyUser(worker)} style={{ cursor: 'pointer' }}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          {avatar(worker)}
                          <div>
                            <div className="fw-semibold text-dark lh-sm">{worker.first_name} {worker.last_name}</div>
                            <small className="text-muted">#{worker.user_id}</small>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="badge bg-light text-dark border fw-normal px-2 py-1">
                          {worker.company_names?.join(', ') || '—'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="small text-dark">{worker.user_types?.join(', ') || '—'}</span>
                      </td>
                      {!buildingSiteId && (
                        <td className="py-3">
                          <small className="text-muted" style={{ maxWidth: 200, display: 'block' }}>
                            {worker.building_site_names?.join(', ') || 'Nessuno'}
                          </small>
                        </td>
                      )}
                      <td className="py-3 pe-4 text-end">
                        {actionButtons(worker)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── MOBILE: card list (nascosta su desktop) ── */}
            <div className="d-flex d-md-none flex-column gap-3">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker.user_id}
                  className="bg-white rounded-4 shadow-sm border"
                  style={{ overflow: 'hidden' }}
                  onClick={() => handleModifyUser(worker)}
                >
                  {/* Riga principale: avatar + nome + azioni */}
                  <div className="d-flex align-items-center gap-3 px-3 pt-3 pb-2">
                    {avatar(worker)}
                    <div className="flex-grow-1 min-width-0">
                      <div className="fw-semibold text-dark lh-sm">{worker.first_name} {worker.last_name}</div>
                      <small className="text-muted">#{worker.user_id}</small>
                    </div>
                    {actionButtons(worker)}
                  </div>

                  {/* Dettagli: azienda, mansione, cantieri */}
                  <div className="d-flex flex-wrap gap-2 px-3 pb-3" style={{ borderTop: '1px solid #f0f0f0', paddingTop: 10, marginTop: 4 }}>
                    {worker.company_names?.length > 0 && (
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-building text-muted" style={{ fontSize: '0.75rem' }} />
                        <span className="badge bg-light text-dark border fw-normal" style={{ fontSize: '0.75rem' }}>
                          {worker.company_names.join(', ')}
                        </span>
                      </div>
                    )}
                    {worker.user_types?.length > 0 && (
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-wrench text-muted" style={{ fontSize: '0.75rem' }} />
                        <span className="badge bg-primary bg-opacity-10 text-primary border-0 fw-normal" style={{ fontSize: '0.75rem' }}>
                          {worker.user_types.join(', ')}
                        </span>
                      </div>
                    )}
                    {!buildingSiteId && worker.building_site_names?.length > 0 && (
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-geo-alt text-muted" style={{ fontSize: '0.75rem' }} />
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {worker.building_site_names.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Floating Action Buttons */}
        <div className="position-fixed d-flex flex-column gap-3" style={{ bottom: 32, right: 24, zIndex: 1050 }}>
          <button
            className="btn btn-white shadow border rounded-circle d-flex align-items-center justify-content-center"
            onClick={fetchWorkers}
            disabled={loading}
            style={{ width: 52, height: 52 }}
            title="Aggiorna"
          >
            <i className={`bi bi-arrow-clockwise fs-5 ${loading ? 'aw-spin' : ''}`} />
          </button>
          <button
            className="btn btn-primary shadow rounded-circle d-flex align-items-center justify-content-center"
            onClick={() => setShowAddWorkerPopup(true)}
            style={{ width: 60, height: 60 }}
            title="Aggiungi lavoratore"
          >
            <i className="bi bi-plus-lg fs-3 text-white" />
          </button>
        </div>
      </div>

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

      <style>{`
        .btn-white { background: #fff; }
        .btn-white:hover { background: #f8f9fa; }
        .aw-btn-icon {
          width: 34px; height: 34px; border-radius: 8px; border: none;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 1rem; cursor: pointer; flex-shrink: 0;
          transition: background 0.15s;
        }
        .aw-btn-warning { background: #fff9db; color: #d97706; }
        .aw-btn-warning:hover { background: #fde68a; }
        .aw-btn-danger  { background: #fff0f0; color: #dc3545; }
        .aw-btn-danger:hover  { background: #ffd5d5; }
        .aw-spin { animation: awSpin 1s linear infinite; display: inline-block; }
        @keyframes awSpin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AllWorkersComponent;
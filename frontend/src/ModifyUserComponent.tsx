import React, { useState } from 'react';
import AddCompanyComponent from './AddCompanyComponent';
import AddUserTypeComponent from './AddUserTypeComponent';
import { apiFetch } from '../utils/apiFetch';

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
  onUserModified: () => void;
  user: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    notes?: string;
    companyIds: number[];
    userTypeIds: number[];
  };
  companies: Company[];
  userTypes: UserType[];
  fetchCompanies: () => void;
  fetchUserTypes: () => void;
}

const ModifyUserComponent: React.FC<Props> = ({ onClose, onUserModified, user, companies, userTypes, fetchCompanies, fetchUserTypes }) => {
  const [formData, setFormData] = useState({
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    notes: user.notes || '',
    companyIds: user.companyIds || [],
    userTypeIds: user.userTypeIds || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showAddUserTypeModal, setShowAddUserTypeModal] = useState(false);

  const handleCompanyAdded = () => {
    fetchCompanies();
    setShowAddCompanyModal(false);
  };

  const handleUserTypeAdded = () => {
    fetchUserTypes();
    setShowAddUserTypeModal(false);
  };

  if (showAddCompanyModal) {
    return <AddCompanyComponent onClose={() => setShowAddCompanyModal(false)} onCompanyAdded={handleCompanyAdded} />;
  }

  if (showAddUserTypeModal) {
    return <AddUserTypeComponent onClose={() => setShowAddUserTypeModal(false)} onUserTypeAdded={handleUserTypeAdded} />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

    try {
      const response = await apiFetch(`${apiUrl}/api/modify-worker/${user.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes || null,
          companyIds: formData.companyIds,
          userTypeIds: formData.userTypeIds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Impossibile modificare l'utente.");
      }

      onUserModified();
    } catch (err) {
      console.error("Errore durante la modifica dell'utente:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block px-3" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(24, 28, 33, 0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow-lg rounded-4">

          <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h4 className="fw-bold text-dark mb-0">Modifica Lavoratore</h4>
            <button type="button" className="btn-close shadow-none" onClick={onClose} aria-label="Close" disabled={isSubmitting}></button>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-muted">Nome</label>
                  <input
                    type="text"
                    className="form-control border-2 bg-light shadow-none"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-muted">Cognome</label>
                  <input
                    type="text"
                    className="form-control border-2 bg-light shadow-none"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="col-12 mt-3">
                  <label className="form-label small fw-bold text-uppercase text-muted">Contatti</label>
                  <div className="input-group mb-2">
                    <span className="input-group-text bg-white border-2 border-end-0"><i className="bi bi-envelope text-muted"></i></span>
                    <input
                      type="email"
                      className="form-control border-2 border-start-0 bg-light shadow-none"
                      placeholder="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-2 border-end-0"><i className="bi bi-telephone text-muted"></i></span>
                    <input
                      type="text"
                      className="form-control border-2 border-start-0 bg-light shadow-none"
                      placeholder="Cellulare"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="col-12 mt-3">
                  <label className="form-label small fw-bold text-uppercase text-muted">Note</label>
                  <textarea
                    className="form-control border-2 bg-light shadow-none"
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                {/* Sezione Aziende */}
                <div className="col-12 mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-0">Aziende</label>
                    <button type="button" className="btn btn-sm btn-link p-0 text-decoration-none" onClick={() => setShowAddCompanyModal(true)}>+ Nuova</button>
                  </div>
                  <div className="d-flex flex-wrap gap-2 p-2 rounded-3 border bg-light">
                    {companies.map((company) => (
                      <div key={company.id} className="muc-badge-pill-container d-flex align-items-center shadow-sm">
                        <span
                          onClick={() => toggleSelection('companyIds', company.id)}
                          className={`muc-badge-pill-main ${formData.companyIds.includes(company.id) ? 'active' : ''}`}
                        >
                          {company.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sezione Mansioni */}
                <div className="col-12 mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-0">Mansioni</label>
                    <button type="button" className="btn btn-sm btn-link p-0 text-decoration-none" onClick={() => setShowAddUserTypeModal(true)}>+ Nuova</button>
                  </div>
                  <div className="d-flex flex-wrap gap-2 p-2 rounded-3 border bg-light">
                    {userTypes.filter(ut => ut.id !== 17).map((userType) => (
                      <div key={userType.id} className="muc-badge-pill-container d-flex align-items-center shadow-sm">
                        <span
                          onClick={() => toggleSelection('userTypeIds', userType.id)}
                          className={`muc-badge-pill-main-alt ${formData.userTypeIds.includes(userType.id) ? 'active-alt' : ''}`}
                        >
                          {userType.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger border-0 rounded-3 mt-4" role="alert">
                  <i className="bi bi-exclamation-circle me-2"></i>{error}
                </div>
              )}

              <div className="d-flex gap-2 justify-content-end mt-5">
                <button type="button" className="btn btn-light px-4 fw-bold text-muted border" onClick={onClose} disabled={isSubmitting}>Annulla</button>
                <button type="submit" className="btn btn-primary px-4 fw-bold shadow" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Salvataggio...</>
                  ) : 'Salva Modifiche'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .muc-badge-pill-container { background: white; border-radius: 8px; overflow: hidden; border: 1px solid #dee2e6; transition: 0.2s; }

        .muc-badge-pill-main { padding: 6px 12px; cursor: pointer; font-size: 0.85rem; font-weight: 500; color: #0d6efd; }
        .muc-badge-pill-main.active { background: #0d6efd; color: white; }

        .muc-badge-pill-main-alt { padding: 6px 12px; cursor: pointer; font-size: 0.85rem; font-weight: 500; color: #198754; }
        .muc-badge-pill-main-alt.active-alt { background: #198754; color: white; }

        .input-group-text { border: 2px solid #dee2e6; }
        .form-control:focus { border-color: #0d6efd; background: white; }
        textarea.form-control:focus { border-color: #0d6efd; background: white; }
      `}</style>
    </div>
  );
};

export default ModifyUserComponent;

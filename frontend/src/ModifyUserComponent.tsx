import React, { useState } from 'react';
import AddCompanyComponent from './AddCompanyComponent';
import AddUserTypeComponent from './AddUserTypeComponent';

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
    firstName: user.first_name || '', // Corretto per evitare null
    lastName: user.last_name || '',   // Corretto per evitare null
    email: user.email || '',         // Corretto per evitare null
    phone: user.phone || '',         // Corretto per evitare null
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
      const response = await fetch(`${apiUrl}/api/modify-worker/${user.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modifica Utente</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" disabled={isSubmitting}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Cognome</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Cellulare</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="notes" className="form-label">Note</label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Aziende</label>
                <div className="d-flex flex-wrap gap-2">
                  {companies.map((company) => {
                    const isSelected = formData.companyIds.includes(company.id);
                    return (
                      <button
                        type="button"
                        key={company.id}
                        className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => toggleSelection('companyIds', company.id)}
                        disabled={isSubmitting}
                      >
                        {company.name}
                      </button>
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
              <div className="mb-3">
                <label className="form-label">Mansioni</label>
                <div className="d-flex flex-wrap gap-2">
                  {userTypes.map((type) => {
                    const isSelected = formData.userTypeIds.includes(type.id);
                    return (
                      <button
                        type="button"
                        key={type.id}
                        className={`btn btn-sm ${isSelected ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => toggleSelection('userTypeIds', type.id)}
                        disabled={isSubmitting}
                      >
                        {type.name}
                      </button>
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
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose} disabled={isSubmitting}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvataggio...' : 'Salva Modifiche'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyUserComponent;
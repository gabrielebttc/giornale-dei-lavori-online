import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const LoginComponent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      console.log(apiUrl);
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setAlert({ message: 'Accesso effettuato con successo!', type: 'success' });
        localStorage.setItem("token", data.token);
        navigate('/building-sites');
      } else {
        const errorData = await response.json();
        setAlert({ message: errorData.message || 'Errore durante l\'accesso. Controlla le credenziali.', type: 'danger' });
      }
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
      setAlert({ message: 'Errore durante l\'accesso.', type: 'danger' });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {/* Larghezza ottimizzata: 100% su mobile, 5 colonne su desktop */}
        <div className="col-12 col-md-6 col-lg-4 shadow-lg p-4 mb-5 bg-white rounded-4 border">
          
          <h2 className="text-center fw-bold mb-4 text-primary">Accesso</h2>
          <hr className="mb-4 opacity-25" />

          {alert && (
            <div className={`alert alert-${alert.type} alert-dismissible fade show rounded-3`} role="alert">
              {alert.message}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg rounded-3"
                id="email"
                placeholder="nome@esempio.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg rounded-3"
                id="password"
                placeholder="La tua password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3">
              Accedi
            </button>
            
            <div className="text-center mt-3">
              <small className="text-muted">Non hai un account? <a href="/register" className="text-decoration-none">Registrati</a></small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
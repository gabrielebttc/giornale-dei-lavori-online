import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/RegisterComponent.css';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const RegisterComponent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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
    setAlert(null);

    if (formData.password !== formData.confirmPassword) {
      setAlert({ message: 'Le password non coincidono.', type: 'danger' });
      return;
    }

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setAlert({ message: 'Registrazione completata con successo!', type: 'success' });
        setTimeout(() => {
          navigate('/login'); // Reindirizza al login dopo un breve ritardo
        }, 2000);
      } else {
        const errorData = await response.json();
        setAlert({ message: errorData.message || 'Errore durante la registrazione.', type: 'danger' });
      }
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
      setAlert({ message: 'Errore durante la registrazione. Riprova più tardi.', type: 'danger' });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {/* Limitiamo la larghezza su MD e LG con col-md-6 o col-lg-5 */}
        <div className="col-12 col-md-6 col-lg-5 shadow-lg p-4 mb-5 bg-white rounded-4 border">
          
          <h2 className="text-center fw-bold mb-4 text-primary">Registrazione</h2>
          <hr className="mb-4 opacity-25" />

          {alert && (
            <div className={`alert alert-${alert.type} alert-dismissible fade show rounded-3`} role="alert">
              {alert.message}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="first_name" className="form-label fw-semibold">Nome</label>
              <input
                type="text"
                className="form-control form-control-lg rounded-3"
                id="first_name"
                placeholder="Nome"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
            </div>

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

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-4">
                <label htmlFor="confirmPassword" className="form-label fw-semibold">Conferma</label>
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="confirmPassword"
                  placeholder="Conferma"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3">
              Crea account
            </button>

            {/* NON NECESSARIO ATTUALMENTE
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Inserisci il tuo username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            */}

            {/* ATTUALMENTE NON NECESSARIO
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Numero di cellulare</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                placeholder="Inserisci il tuo numero di cellulare"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
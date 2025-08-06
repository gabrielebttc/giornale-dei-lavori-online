import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Rimosso l'importazione del CSS non più necessaria

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
      <h2 className="text-center mb-4">Registrazione</h2>
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            placeholder="Inserisci il tuo nome"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">Cognome</label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            placeholder="Inserisci il tuo cognome"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Inserisci il tuo username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Inserisci la tua email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
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
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Inserisci la tua password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Conferma Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="Conferma la tua password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Registrati</button>
      </form>
    </div>
  );
};

export default RegisterComponent;
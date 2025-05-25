import React, { useEffect, useState } from 'react';
import './RegisterComponent.css';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const RegisterComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    instagram: '',
    youtube: '',
    facebook: '',
    tiktok: '',
    password: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [userTypes, setUserTypes] = useState<{ id: number; name: string }[]>([]);
  const [selectedUserTypes, setSelectedUserTypes] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/user-types`);
        const data = await response.json();
        setUserTypes(data);
      } catch (error) {
        console.error('Errore durante il recupero dei tipi di utente:', error);
      }
    };

    fetchUserTypes();
  }, []);

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selectedType = userTypes.find((type) => type.id === selectedId);

    if (selectedType && !selectedUserTypes.some((type) => type.id === selectedId)) {
      setSelectedUserTypes((prevTypes) => [...prevTypes, selectedType]);
    }
  };

  const handleRemoveUserType = (id: number) => {
    setSelectedUserTypes((prevTypes) => prevTypes.filter((type) => type.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Le password non coincidono.');
      return;
    }

    let profileImageBase64 = null;

    // Converti l'immagine in base64 se presente
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        profileImageBase64 = reader.result;
      };
      reader.readAsDataURL(profileImage);

      // Aspetta che il FileReader completi la conversione
      await new Promise((resolve) => {
        reader.onloadend = () => {
          profileImageBase64 = reader.result;
          resolve(null);
        };
      });
    }

    // Prepara i dati da inviare
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      instagram: formData.instagram,
      youtube: formData.youtube,
      facebook: formData.facebook,
      tiktok: formData.tiktok,
      password: formData.password,
      profileImage: profileImageBase64, // Immagine in formato base64
      userTypes: selectedUserTypes.map((type) => type.id), // IDs dei tipi di utente selezionati
    };

    try {
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Registrazione completata con successo!');
      } else {
        alert('Errore durante la registrazione.');
      }
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
      alert('Errore durante la registrazione.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Registrazione</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
            <label htmlFor="profileImage" className="form-label d-block">Immagine di profilo</label>
            <input
              type="file"
              className="form-control d-none"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="profile-image-wrapper">
              <label htmlFor="profileImage" className="profile-image-label">
                <div className="profile-image-circle">
                  <span className="text-muted">Carica</span>
                </div>
              </label>
            </div>
            <small className="form-text text-muted">Max 2 MB</small>
          </div>

          <div className="col-12 col-md-8">
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                placeholder="Inserisci il tuo nome"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Cognome</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder="Inserisci il tuo cognome"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="userType" className="form-label">Tipo di Utente</label>
          <select
            id="userType"
            className="form-control"
            value=""
            onChange={handleUserTypeChange}
          >
            <option value="" disabled>Seleziona il tipo di utente</option>
            {userTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <div className="mt-2">
            {selectedUserTypes.map((type) => (
              <span key={type.id} className="badge bg-primary me-2">
                {type.name}
                <button
                  type="button"
                  className="btn-close btn-close-white ms-2"
                  aria-label="Remove"
                  onClick={() => handleRemoveUserType(type.id)}
                ></button>
              </span>
            ))}
          </div>
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
          <label htmlFor="instagram" className="form-label">Profilo Instagram</label>
          <input
            type="url"
            className="form-control"
            id="instagram"
            placeholder="Inserisci il link al tuo profilo Instagram"
            value={formData.instagram}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="youtube" className="form-label">Canale YouTube</label>
          <input
            type="url"
            className="form-control"
            id="youtube"
            placeholder="Inserisci il link al tuo canale YouTube"
            value={formData.youtube}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="facebook" className="form-label">Profilo/Pagina Facebook</label>
          <input
            type="url"
            className="form-control"
            id="facebook"
            placeholder="Inserisci il link al tuo profilo o pagina Facebook"
            value={formData.facebook}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tiktok" className="form-label">Profilo TikTok</label>
          <input
            type="url"
            className="form-control"
            id="tiktok"
            placeholder="Inserisci il link al tuo profilo TikTok"
            value={formData.tiktok}
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
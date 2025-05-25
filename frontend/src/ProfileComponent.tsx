import React, { useEffect, useState } from 'react';
import './RegisterComponent.css';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Define a type for formData
type FormDataType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  instagram: string;
  youtube: string;
  facebook: string;
  tiktok: string;
  userTypes: { id: number; name: string }[];
};

const ProfileComponent: React.FC<{ userId: number }> = ({ userId }) => {
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    instagram: string;
    youtube: string;
    facebook: string;
    tiktok: string;
    profileImage: string | null;
    userTypes: { id: number; name: string }[];
  } | null>(null);
  const [isEditable, setIsEditable] = useState(false); // Stato per abilitare/disabilitare la modifica
  const [formData, setFormData] = useState<FormDataType>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    instagram: "",
    youtube: "",
    facebook: "",
    tiktok: "",
    userTypes: [],
  }); // Stato per i dati modificabili
  const [availableUserTypes, setAvailableUserTypes] = useState<{ id: number; name: string }[]>([]); // Stato per i tipi di utente disponibili

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Verifica se l'utente autenticato corrisponde allo userId
        const token = localStorage.getItem("token");
        const profileResponse = await fetch(`${apiUrl}/api/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.id === userId) {
            setIsEditable(true); // Abilita la modifica se l'utente corrisponde
          }
        }

        // Recupera i dati dell'utente
        const response = await fetch(`${apiUrl}/api/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserData({
            firstName: data.first_name,
            lastName: data.last_name,
            username: data.username,
            email: data.email,
            phone: data.phone,
            instagram: data.instagram_link,
            youtube: data.youtube_link,
            facebook: data.facebook_link,
            tiktok: data.tiktok_link,
            profileImage: data.profile_img_path,
            userTypes: data.userTypes,
          });
          setFormData({
            firstName: data.first_name,
            lastName: data.last_name,
            username: data.username,
            email: data.email,
            phone: data.phone,
            instagram: data.instagram_link,
            youtube: data.youtube_link,
            facebook: data.facebook_link,
            tiktok: data.tiktok_link,
            userTypes: data.userTypes,
          });
        } else {
          console.error('Errore durante il recupero dei dati utente.');
        }
      } catch (error) {
        console.error('Errore durante la richiesta:', error);
      }
    };

    const fetchUserTypes = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/user-types`);
        if (response.ok) {
          const data = await response.json();
          setAvailableUserTypes(data);
        } else {
          console.error("Errore durante il recupero dei tipi di utente.");
        }
      } catch (error) {
        console.error("Errore durante la richiesta:", error);
      }
    };

    fetchUserData();
    fetchUserTypes();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData: FormDataType) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Informazioni aggiornate con successo!");
        const updatedData = await response.json();
        setUserData(updatedData);
      } else {
        alert("Errore durante l'aggiornamento delle informazioni.");
      }
    } catch (error) {
      console.error("Errore durante la richiesta:", error);
      alert("Errore durante l'aggiornamento delle informazioni.");
    }
  };

  if (!userData) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Profilo Utente</h2>
      <div className="row">
        <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
          <div className="profile-image-wrapper">
            {userData.profileImage ? (
              <img
                src={userData.profileImage}
                alt="Immagine di profilo"
                className="profile-image-circle"
              />
            ) : (
              <div className="profile-image-circle text-muted">Nessuna immagine</div>
            )}
          </div>
        </div>
        <div className="col-12 col-md-8">
          <div className="mb-3">
            <strong>Nome:</strong>{" "}
            {isEditable ? (
              <input
                type="text"
                id="firstName"
                value={formData.firstName || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              userData.firstName || <span className="text-muted">Non specificato</span>
            )}
          </div>
          <div className="mb-3">
            <strong>Cognome:</strong>{" "}
            {isEditable ? (
              <input
                type="text"
                id="lastName"
                value={formData.lastName || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              userData.lastName || <span className="text-muted">Non specificato</span>
            )}
          </div>
          <div className="mb-3">
            <strong>Username:</strong>{" "}
            {isEditable ? (
              <input
                type="text"
                id="username"
                value={formData.username || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              userData.username || <span className="text-muted">Non specificato</span>
            )}
          </div>
          <div className="mb-3">
            <strong>Email:</strong>{" "}
            {isEditable ? (
              <input
                type="email"
                id="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              userData.email || <span className="text-muted">Non specificato</span>
            )}
          </div>
          <div className="mb-3">
            <strong>Telefono:</strong>{" "}
            {isEditable ? (
              <input
                type="text"
                id="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              userData.phone || <span className="text-muted">Non specificato</span>
            )}
          </div>
          <div className="mb-3">
            <strong>Instagram:</strong>{" "}
            {isEditable ? (
              <input
                type="text"
                id="instagram"
                value={formData.instagram || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              userData.instagram || <span className="text-muted">Non specificato</span>
            )}
          </div>
          <div className="mb-3">
            <strong>Youtube:</strong>{" "}
            {isEditable ? (
              <input
                type="text"
                id="youtube"
                value={formData.youtube || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              userData.youtube || <span className="text-muted">Non specificato</span>
            )}
          </div>
          <div className="mb-3">
            <strong>Facebook:</strong>{" "}
            {isEditable ? (
              <input
                type="text"
                id="facebook"
                value={formData.facebook || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              userData.facebook || <span className="text-muted">Non specificato</span>
            )}
          </div>
          <div className="mb-3">
            <strong>TikTok:</strong>{" "}
            {isEditable ? (
              <input
                type="text"
                id="tiktok"
                value={formData.tiktok || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              userData.tiktok || <span className="text-muted">Non specificato</span>
            )}
          </div>
          <div className="mb-3">
            <strong>Tipo di Utente:</strong>{" "}
            {isEditable ? (
              <>
                <select
                  id="userType"
                  className="form-control"
                  value=""
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    const selectedType = availableUserTypes.find((type) => type.id === selectedId);
                    if (selectedType && !formData.userTypes.some((type) => type.id === selectedId)) {
                      setFormData((prevData) => ({
                        ...prevData,
                        userTypes: [...prevData.userTypes, selectedType],
                      }));
                    }
                  }}
                >
                  <option value="" disabled>Seleziona il tipo di utente</option>
                  {availableUserTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  {formData.userTypes.map((type) => (
                    <span key={type.id} className="badge bg-primary me-2">
                      {type.name}
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        aria-label="Remove"
                        onClick={() =>
                          setFormData((prevData) => ({
                            ...prevData,
                            userTypes: prevData.userTypes.filter((t) => t.id !== type.id),
                          }))
                        }
                      ></button>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              userData.userTypes.map((type) => (
                <span key={type.id} className="badge bg-secondary me-2">
                  {type.name}
                </span>
              )) || <span className="text-muted">Non specificato</span>
            )}
          </div>
          {isEditable && (
            <button className="btn btn-primary mt-3" onClick={handleSave}>
              Salva
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
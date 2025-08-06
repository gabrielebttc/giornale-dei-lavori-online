import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Assicurati di aver corretto l'import

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface UserProfile {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    phone?: string;
    notes?: string;
}

// Nuova interfaccia per il payload del token JWT
interface DecodedToken {
    id: number;
    // Puoi aggiungere altre proprietà del payload se necessarie, ad esempio:
    // exp: number;
    // iat: number;
}

const ProfileComponent: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // ... (il resto della logica fetchProfile non cambia)
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Non sei autenticato. Effettua il login per visualizzare il tuo profilo.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setFormData(userData);
                } else if (response.status === 401 || response.status === 403) {
                    setError('Sessione scaduta o non valida. Effettua nuovamente l\'accesso.');
                    localStorage.removeItem('token');
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Impossibile recuperare il profilo utente.');
                }
            } catch (err) {
                console.error('Errore durante il recupero del profilo:', err);
                setError('Errore di connessione. Riprova più tardi.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        if (formData) {
            setFormData(prevData => ({
                ...prevData!,
                [id]: value,
            }));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const token = localStorage.getItem('token');
        if (!token || !formData) {
            setError('Dati mancanti o token non valido.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setFormData(updatedUser);
                setSuccessMessage('Profilo aggiornato con successo!');
                setIsEditing(false);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Errore durante l\'aggiornamento del profilo.');
            }
        } catch (err) {
            console.error('Errore durante l\'aggiornamento del profilo:', err);
            setError('Errore di connessione. Riprova più tardi.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Sei sicuro di voler eliminare definitivamente il tuo account? Questa azione è irreversibile.");
        if (!confirmDelete) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Non sei autenticato.');
            return;
        }

        try {
            // Usa la nuova interfaccia per la decodifica
            const decodedToken: DecodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            const response = await fetch(`${apiUrl}/api/delete-record/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                localStorage.removeItem('token');
                navigate('/');
                alert('Account eliminato con successo.');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Errore durante l\'eliminazione dell\'account.');
            }
        } catch (err) {
            console.error('Errore durante l\'eliminazione dell\'account:', err);
            setError('Errore di connessione o token non valido.');
        }
    };
    
    // ... (il resto del componente render non cambia)
    if (loading) {
        return (
            <div className="container mt-5">
                <div className="alert alert-info text-center">Caricamento del profilo...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">
                    Nessun dato utente disponibile.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title">Il tuo profilo</h5>
                        {!isEditing && (
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Modifica</button>
                        )}
                    </div>
                    <form onSubmit={handleSave}>
                        <div className="mb-3">
                            <label htmlFor="first_name" className="form-label">Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                id="first_name"
                                value={formData?.first_name || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="last_name" className="form-label">Cognome</label>
                            <input
                                type="text"
                                className="form-control"
                                id="last_name"
                                value={formData?.last_name || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={formData?.username || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={formData?.email || ''}
                                onChange={handleInputChange}
                                disabled={true}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Telefono</label>
                            <input
                                type="text"
                                className="form-control"
                                id="phone"
                                value={formData?.phone || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="notes" className="form-label">Note</label>
                            <textarea
                                className="form-control"
                                id="notes"
                                value={formData?.notes || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            ></textarea>
                        </div>
                        {isEditing && (
                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-secondary me-2" onClick={() => { setIsEditing(false); setFormData(user); }}>Annulla</button>
                                <button type="submit" className="btn btn-success">Salva</button>
                            </div>
                        )}
                    </form>
                    <hr className="my-4" />
                    <div className="d-grid gap-2">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleDeleteAccount}
                        >
                            Elimina Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileComponent;
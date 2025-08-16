import React, { useState, useEffect } from 'react';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface BuildingSite {
  id: number;
  name: string;
  notes: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string | null;
}

interface GeoData {
    comune: string;
    lat: string;
    lng: string;
    istat: string;
}

interface Props {
  buildingSiteId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const ModifyBuildingSiteComponent: React.FC<Props> = ({ buildingSiteId, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [geoData, setGeoData] = useState<GeoData[]>([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState<string | null>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                
                const buildingSiteResponse = await fetch(`${apiUrl}/api/building-sites/${buildingSiteId}`, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                  });
                if (!buildingSiteResponse.ok) throw new Error('Failed to fetch building site data.');
                const siteData: BuildingSite = await buildingSiteResponse.json();

                setName(siteData.name);
                setNotes(siteData.notes);
                setSelectedCity(siteData.city);
                setAddress(siteData.address);
                setLat(siteData.latitude);
                setLng(siteData.longitude);
                
                setStartDate(siteData.start_date || '');
                setEndDate(siteData.end_date || null);

                // Modifica qui: usa il percorso relativo alla radice del server
                const geoResponse = await fetch(`/italy_geo.json`);
                if (!geoResponse.ok) throw new Error('Failed to load geo data.');
                const geoJson = await geoResponse.json();
                setGeoData(geoJson);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Impossibile caricare i dati. Riprova più tardi.');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [buildingSiteId]);

    const handleCitySelect = (comune: string, lat: string, lng: string) => {
        setSelectedCity(comune);
        setLat(parseFloat(lat));
        setLng(parseFloat(lng));
        setDropdownVisible(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        if (!name || !selectedCity || !startDate) {
            setError('Il nome, la città e la data di inizio sono campi obbligatori.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/building-sites/${buildingSiteId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ 
                  name,
                  notes,
                  city: selectedCity,
                  address,
                  latitude: lat,
                  longitude: lng,
                  start_date: startDate,
                  end_date: endDate,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Errore durante l\'aggiornamento del cantiere.');
            }

            setSuccess('Cantiere aggiornato con successo!');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);

        } catch (err) {
            console.error('Error:', err);
            setError(err instanceof Error ? err.message : 'Errore sconosciuto.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const sortedGeoData = geoData
        .filter((item) => item && item.comune && item.comune.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.comune.toLowerCase().localeCompare(b.comune.toLowerCase()));

    if (loading) {
        return <div className="modal-backdrop-custom">
            <div className="modal-content-custom text-center p-4">Caricamento dati...</div>
        </div>;
    }

    return (
        <div className="modal-backdrop-custom">
            <div className="modal-content-custom">
                <div className="modal-header">
                    <h5 className="modal-title">Modifica Cantiere</h5>
                    <button type="button" className="close" onClick={onClose}>
                        <span>&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="notes" className="form-label">Note</label>
                            <textarea
                                className="form-control"
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="city" className="form-label">Città</label>
                            <div className="dropdown">
                                <button
                                    type="button"
                                    className="btn btn-secondary dropdown-toggle"
                                    style={{ width: '100%' }}
                                    onClick={() => setDropdownVisible(!dropdownVisible)}
                                >
                                    {selectedCity || 'Seleziona una città'}
                                </button>
                                {dropdownVisible && (
                                    <div className="dropdown-menu show" style={{ display: 'block', maxHeight: '200px', overflowY: 'auto' }}>
                                        <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                placeholder="Cerca una città"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        {sortedGeoData.map((item) => (
                                            <button
                                                key={item.istat}
                                                className="dropdown-item"
                                                type="button"
                                                onClick={() => handleCitySelect(item.comune, item.lat, item.lng)}
                                            >
                                                {item.comune}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Indirizzo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="startDate" className="form-label">Data di Inizio</label>
                            <input
                                type="date"
                                className="form-control"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="endDate" className="form-label">Data di Fine</label>
                            <input
                                type="date"
                                className="form-control"
                                id="endDate"
                                value={endDate || ''}
                                onChange={(e) => setEndDate(e.target.value || null)}
                            />
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
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
    );
};

export default ModifyBuildingSiteComponent;
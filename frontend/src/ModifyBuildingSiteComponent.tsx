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

        if (!name || !startDate) {
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
        <div className="container py-5">
            {/* Header della Pagina */}
            <div className="d-flex align-items-center justify-content-between mb-5">
                <div>
                <h2 className="fw-bold text-dark mb-0">Modifica Cantiere</h2>
                <p className="text-muted">Gestisci i dettagli, la posizione e le tempistiche del progetto.</p>
                </div>
                <div className="d-none d-md-block">
                    <button type="submit" form="mainCantiereForm" className="btn btn-primary px-5 py-2 fw-bold rounded-3 shadow-sm" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvataggio...' : 'Salva Modifiche'}
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                <form onSubmit={handleSubmit} id="mainCantiereForm" className="bg-white p-4 p-md-5 rounded-4 shadow-sm border">
                    
                    {/* Sezione: Informazioni Generali */}
                    <section className="mb-5">
                    <h5 className="fw-bold mb-4 pb-2 border-bottom">Informazioni Generali</h5>
                    <div className="mb-4">
                        <label htmlFor="name" className="form-label small fw-bold">NOME CANTIERE</label>
                        <input
                        type="text"
                        className="form-control form-control-lg bg-light border-0 shadow-none"
                        id="name"
                        placeholder="Inserisci il nome..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        />
                    </div>
                    <div className="mb-0">
                        <label htmlFor="notes" className="form-label small fw-bold">NOTE E DESCRIZIONE</label>
                        <textarea
                        className="form-control bg-light border-0 shadow-none"
                        id="notes"
                        rows={4}
                        placeholder="Aggiungi dettagli extra..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        ></textarea>
                    </div>
                    </section>

                    {/* Sezione: Posizione */}
                    <section className="mb-5">
                    <h5 className="fw-bold mb-4 pb-2 border-bottom">Localizzazione</h5>
                    <div className="row g-3">
                        <div className="col-md-6 position-relative">
                        <label className="form-label small fw-bold">CITTÀ</label>
                        <button
                            type="button"
                            className="btn btn-light w-100 text-start border d-flex justify-content-between align-items-center"
                            onClick={() => setDropdownVisible(!dropdownVisible)}
                        >
                            {selectedCity || 'Seleziona città'}
                            <i className="bi bi-search small opacity-50"></i>
                        </button>
                        
                        {dropdownVisible && (
                            <div className="card shadow-lg border-0 mt-1 position-absolute w-100" style={{ zIndex: 10, maxHeight: '250px', overflowY: 'auto' }}>
                            <div className="p-2 sticky-top bg-white">
                                <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Cerca..."
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {sortedGeoData.map((item) => (
                                <button
                                key={item.istat}
                                type="button"
                                className="btn btn-light btn-sm w-100 text-start border-0 rounded-0 p-2 px-3"
                                onClick={() => handleCitySelect(item.comune, item.lat, item.lng)}
                                >
                                {item.comune}
                                </button>
                            ))}
                            </div>
                        )}
                        </div>
                        <div className="col-md-6">
                        <label htmlFor="address" className="form-label small fw-bold">INDIRIZZO</label>
                        <input
                            type="text"
                            className="form-control bg-light border-0 shadow-none"
                            id="address"
                            placeholder="Via, Piazza..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        </div>
                    </div>
                    </section>

                    {/* Sezione: Durata */}
                    <section className="mb-4">
                    <h5 className="fw-bold mb-4 pb-2 border-bottom">Programmazione</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                        <label htmlFor="startDate" className="form-label small fw-bold">DATA INIZIO</label>
                        <input
                            type="date"
                            className="form-control bg-light border-0 shadow-none"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                        </div>
                        <div className="col-md-6">
                        <label htmlFor="endDate" className="form-label small fw-bold">DATA FINE PREVISTA</label>
                        <input
                            type="date"
                            className="form-control bg-light border-0 shadow-none"
                            id="endDate"
                            value={endDate || ''}
                            onChange={(e) => setEndDate(e.target.value || null)}
                        />
                        </div>
                    </div>
                    </section>

                    {/* Feedback Messages */}
                    {error && <div className="alert alert-danger border-0 mt-4">{error}</div>}
                    {success && <div className="alert alert-success border-0 mt-4">{success}</div>}

                    {/* Action Button Mobile */}
                    <div className="d-md-none mt-5">
                        <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvataggio...' : 'Salva Modifiche'}
                        </button>
                    </div>
                </form>
                </div>

                {/* Barra Laterale Informativa (Opzionale) */}
                <div className="col-lg-4 d-none d-lg-block">
                <div className="card border-0 bg-primary bg-opacity-10 rounded-4 p-4 sticky-top" style={{ top: '2rem' }}>
                    <h6 className="fw-bold text-primary mb-3">Consigli</h6>
                    <p className="small text-dark opacity-75">
                    Assicurati che le date siano coerenti con la pianificazione degli ordini.
                    </p>
                    <hr className="text-primary opacity-25" />
                    <div className="d-flex align-items-center text-primary">
                    <i className="bi bi-info-circle fs-4 me-2"></i>
                    <span className="small fw-bold">Tutti i campi obbligatori sono contrassegnati.</span>
                    </div>
                </div>
                </div>
            </div>

            <style>{`
                body { background-color: #f8f9fa; }
                .form-control:focus {
                    background-color: #fff !important;
                    border: 1px solid #0d6efd !important;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
                }
                section h5 { color: #495057; font-size: 1rem; letter-spacing: 0.5px; }
            `}</style>
        </div>
    );
};

export default ModifyBuildingSiteComponent;
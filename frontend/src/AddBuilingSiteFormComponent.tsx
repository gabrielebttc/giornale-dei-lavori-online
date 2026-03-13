import React, { useState, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

type Props = {
    onClose: () => void;
}

const AddBuildingSiteFormComponent: React.FC<Props> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [geoData, setGeoData] = useState<{ comune: string; lat: string; lng: string; istat: string }[]>([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [startDate, setStartDate] = useState(''); // Nuovo stato per la data di inizio
    const [endDate, setEndDate] = useState('');   // Nuovo stato per la data di fine

    useEffect(() => {
        console.log(city);//perchè mi da errore mai usato
    }, [city]);

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                const response = await fetch(`/italy_geo.json`);
                if (!response.ok) {
                    throw new Error(`Errore HTTP: ${response.status}`);
                }
                const data = await response.json();
                setGeoData(data);
            } catch (error) {
                console.error('Errore durante il caricamento dei dati geografici:', error);
                setError('Impossibile caricare i dati geografici. Controlla il file JSON.');
            }
        };
        fetchGeoData();
    }, []);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleCitySelect = (comune: string, lat: string, lng: string) => {
        setSelectedCity(comune);
        setLat(lat);
        setLng(lng);
        setDropdownVisible(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name) {
            setError('Il campo "name" è obbligatorio.');
            return;
        }

        if (!startDate) {
          setError('La "start_date" è obbligatoria.');
          return;
      }

        const token = localStorage.getItem('token'); 

        if (!token) {
          console.error("Token di autenticazione non trovato. Esegui il login.");
          return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/building-sites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, notes, city: selectedCity, address, lat, lng, startDate, endDate: endDate || null }),
            });

            if (!response.ok) {
                throw new Error('Errore durante l\'inserimento del building site.');
            }

            const data = await response.json();
            setSuccess(`Building site aggiunto con successo: ${data.name}`);
            setName('');
            setNotes('');
            setCity('');
            setAddress('');
            setSelectedCity('');
            setLat('');
            setLng('');
            setStartDate(''); // Reset della data di inizio
            setEndDate('');   // Reset della data di fine
        } catch (error) {
            setError('Errore durante l\'inserimento del building site.');
            console.error('Error:', error);
        }
    };

    const sortedGeoData = geoData
        .filter((item) => item && item.comune && item.comune.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const aIndex = a.comune.toLowerCase().indexOf(searchTerm.toLowerCase());
            const bIndex = b.comune.toLowerCase().indexOf(searchTerm.toLowerCase());
            return aIndex - bIndex;
        });

    return (
        <div className="add-site-form">
            <h2 className="h4 fw-bold mb-3">Dati Cantiere</h2>
            <hr className="mb-4 opacity-25" />

            {error && <div className="alert alert-danger rounded-3">{error}</div>}
            {success && <div className="alert alert-success rounded-3">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">Nome Cantiere</label>
                <input
                    type="text"
                    className="form-control rounded-3"
                    id="name"
                    placeholder="Es: Ristrutturazione Villa Rossi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                </div>

                <div className="mb-3">
                <label htmlFor="notes" className="form-label fw-semibold">Note</label>
                <textarea
                    className="form-control rounded-3"
                    id="notes"
                    rows={2}
                    placeholder="Dettagli aggiuntivi..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                ></textarea>
                </div>

                <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <label htmlFor="city" className="form-label fw-semibold">Città</label>
                    <div className="dropdown">
                    <button
                        type="button"
                        className="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center rounded-3"
                        onClick={toggleDropdown}
                    >
                        {selectedCity || 'Seleziona...'}
                    </button>
                    {dropdownVisible && (
                        <div className="dropdown-menu show shadow w-100 p-2 rounded-3 border-0" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1100 }}>
                        <div className="sticky-top bg-white pb-2">
                            <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Filtra..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                            />
                        </div>
                        {sortedGeoData.map((item) => (
                            <button
                            key={item.istat}
                            className="dropdown-item rounded-2"
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
                <div className="col-md-6">
                    <label htmlFor="address" className="form-label fw-semibold">Indirizzo</label>
                    <input
                    type="text"
                    className="form-control rounded-3"
                    id="address"
                    placeholder="Via/Piazza..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                </div>

                <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <label htmlFor="start-date" className="form-label fw-semibold">Data Inizio</label>
                    <input type="date" className="form-control rounded-3" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div className="col-md-6">
                    <label htmlFor="end-date" className="form-label fw-semibold text-muted">Data Fine (opz.)</label>
                    <input type="date" className="form-control rounded-3" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                </div>

                <div className="d-flex gap-2">
                <button type="button" className="btn btn-light btn-lg flex-grow-1 fw-bold rounded-3" onClick={onClose}>
                    Annulla
                </button>
                <button type="submit" className="btn btn-primary btn-lg flex-grow-2 fw-bold shadow-sm rounded-3 px-5">
                    Salva Cantiere
                </button>
                </div>
            </form>
        </div>
    );
};

export default AddBuildingSiteFormComponent;
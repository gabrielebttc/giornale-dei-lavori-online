import React, { useState, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const AddBuildingSiteFormComponent: React.FC = () => {
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
        <div className="container mt-4">
            <h2>Aggiungi Building Site</h2>
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
                            onClick={toggleDropdown}
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
                    <label htmlFor="start-date" className="form-label">Data di inizio</label>
                    <input
                        type="date"
                        className="form-control"
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="end-date" className="form-label">Data di fine (opzionale)</label>
                    <input
                        type="date"
                        className="form-control"
                        id="end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Aggiungi</button>
            </form>
        </div>
    );
};

export default AddBuildingSiteFormComponent;
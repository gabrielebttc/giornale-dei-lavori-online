import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapComponent.css';

// Importa il componente di eliminazione
import DeleteRecordComponent from './DeleteRecordComponent'; 

// Declare bootstrap as a global variable
declare const bootstrap: {
  Popover: new (element: HTMLElement, options?: { [key: string]: unknown }) => void;
};

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const INITIAL_CENTER: [number, number] = [14.0863, 37.4460];
const INITIAL_ZOOM = 7.05;

const MapComponent = () => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
  const [buildingSites, setBuildingSites] = useState<
    { id: number; name: string; notes: string; city: string; address: string; latitude: number; longitude: number }[]
  >([]);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Nuovo stato per la ricerca
  const [loading, setLoading] = useState<boolean>(true); // Nuovo stato per il caricamento
  const markerRefs = useRef<mapboxgl.Marker[]>([]); // Per tenere traccia dei marker

  // Stati per la gestione del modale di eliminazione
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<{ id: number; name: string } | null>(null);


  const handleRecordClick = (site: { latitude: number; longitude: number; id: number }) => {
    if (mapRef.current && site.latitude && site.longitude) {
      mapRef.current.flyTo({ center: [site.longitude, site.latitude] });
      setHighlightedId(site.id);
    }
  };

  const handleMarkerClick = (site: { id: number }) => {
    setHighlightedId(site.id);
    setBuildingSites((prevSites) => {
      const clickedSite = prevSites.find((s) => s.id === site.id);
      const otherSites = prevSites.filter((s) => s.id !== site.id);
      return clickedSite ? [clickedSite, ...otherSites] : prevSites;
    });
  };

  const onRecordDeleted = (deletedId: number) => {
    setBuildingSites(prevSites => prevSites.filter(site => site.id !== deletedId));
  };

  const handleDeleteClick = (site: { id: number; name: string }, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita che il click si propaghi all'handler della card
    setSiteToDelete(site);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSiteToDelete(null);
  };

  const handleSuccessDelete = (deletedId: number) => {
    onRecordDeleted(deletedId);
    handleCloseDeleteModal();
  };
  
  // Funzione per rimuovere tutti i marker esistenti
  const clearMarkers = () => {
    markerRefs.current.forEach(marker => marker.remove());
    markerRefs.current = [];
  };

  const fetchBuildingSites = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Recupera il token
      const response = await fetch(`${apiUrl}/api/building-sites`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Aggiungi l'header Authorization
        }
      });
      if (!response.ok) {
        throw new Error('Errore durante il recupero dei building sites');
      }
      const sites = await response.json();
      setBuildingSites(sites);

      if (mapRef.current) {
        clearMarkers(); // Pulisce i marker prima di aggiungerne di nuovi
        sites.forEach((site: { id: number; latitude: number; longitude: number; name: string; notes: string, city: string }) => {
          if (site.latitude && site.longitude) {
            const markerElement = document.createElement('div');
            markerElement.style.width = '30px';
            markerElement.style.height = '30px';
            markerElement.style.backgroundColor = 'blue';
            markerElement.style.borderRadius = '50%';
            markerElement.style.border = '2px solid white';
            markerElement.style.cursor = 'pointer';

            markerElement.setAttribute('data-bs-toggle', 'popover');
            markerElement.setAttribute('data-bs-title', site.name);
            markerElement.setAttribute('data-bs-content', site.notes ? `${site.city} - ${site.notes}` : `${site.city} - nessuna nota`);

            new bootstrap.Popover(markerElement);

            const newMarker = new mapboxgl.Marker({ element: markerElement })
              .setLngLat([site.longitude, site.latitude])
              .addTo(mapRef.current!);
            
            markerRefs.current.push(newMarker); // Salva il riferimento al marker
            
            newMarker.getElement()
              .addEventListener('click', () => handleMarkerClick(site));
          }
        });
      }
    } catch (error) {
      console.error('Errore durante il recupero dei building sites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = mapboxToken;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      style: 'mapbox://styles/mapbox/streets-v11',
      attributionControl: false,
    });

    mapRef.current.on('move', () => {
      if (!mapRef.current) return;

      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();

      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    fetchBuildingSites();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Logica di ricerca dei cantieri
  const filteredBuildingSites = buildingSites.filter(site => {
    const term = searchTerm.toLowerCase();
    return (
      site.name.toLowerCase().includes(term) ||
      site.city.toLowerCase().includes(term) ||
      (site.notes && site.notes.toLowerCase().includes(term))
    );
  });

  return (
    <>
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ width: '100%', height: '400px' }}
      ></div>
      <div className="records-container">
        {/* Campo di input per la ricerca e pulsanti */}
        <div className="d-flex mb-3 align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Cerca cantiere per nome, città o note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={fetchBuildingSites}
            disabled={loading}
            style={{
              width: '40px',
              height: '40px',
              fontSize: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0',
            }}
            title="Aggiorna lista cantieri"
          >
            &#x21bb; {/* Icona di aggiornamento */}
          </button>
        </div>
        {filteredBuildingSites.map((site) => (
          <div
            key={site.id}
            className="card d-flex flex-row align-items-center"
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: highlightedId === site.id ? '#f0f8ff' : '#fff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
            }}
            onClick={() => handleRecordClick(site)}
          >
            <div style={{ flex: '90%' }}>
              <div>{site.city}</div>
              <div className="card-body">
                <h5 className="card-title">{site.name}</h5>
              </div>
              {site.notes && <p className="card-text"><strong>Note:</strong> {site.notes}</p>}
            </div>
            <div
              style={{
                flex: '10%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '30px',
              }}
            >
              {/* Pulsante di eliminazione a sinistra */}
              <button
                className="btn btn-sm"
                onClick={(e) => handleDeleteClick(site, e)}
                title="Elimina cantiere"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0',
                  cursor: 'pointer',
                  marginRight: '10px',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash text-danger" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
              </button>

              {/* Freccia di reindirizzamento */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/building-site-actions/${site.id}`;
                }}
                style={{ cursor: 'pointer' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-arrow-bar-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Modale di conferma eliminazione */}
      {showDeleteModal && siteToDelete && (
        <DeleteRecordComponent
          tableName="building_sites"
          recordId={siteToDelete.id}
          onClose={handleCloseDeleteModal}
          onSuccess={() => handleSuccessDelete(siteToDelete.id)}
        />
      )}
    </>
  );
};

export default MapComponent;
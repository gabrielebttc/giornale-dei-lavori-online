import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/MapComponent.css';

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
      {/* Contenitore Mappa con bordo arrotondato */}
      <div
        id="map-container"
        ref={mapContainerRef}
        className="rounded-3 shadow-sm border mb-4"
        style={{ width: '100%', height: '380px' }}
      ></div>

      <div className="records-container container-fluid px-0">
        {/* Barra di ricerca e refresh */}
        <div className="d-flex mb-4 gap-2">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0 shadow-none"
              placeholder="Cerca cantiere per nome, città o note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-outline-primary shadow-sm d-flex align-items-center justify-content-center"
            onClick={fetchBuildingSites}
            disabled={loading}
            title="Aggiorna lista cantieri"
            style={{ width: '45px' }}
          >
            <span className={loading ? 'spinner-border spinner-border-sm' : ''}>
              {!loading && '↻'}
            </span>
          </button>
        </div>

        {/* Lista Cantieri */}
        <div className="row g-3">
          {filteredBuildingSites.map((site) => (
            <div key={site.id} className="col-12">
              <div
                className={`card border-0 shadow-sm rounded-3 transition-all ${highlightedId === site.id ? 'border-start border-primary border-4 bg-light' : 'bg-white'}`}
                style={{ cursor: 'pointer', transition: '0.2s' }}
                onClick={() => handleRecordClick(site)}
              >
                <div className="card-body d-flex align-items-center py-3">
                  {/* Info Cantiere */}
                  <div className="flex-grow-1">
                    <div className="text-uppercase text-muted small fw-bold mb-1">{site.city}</div>
                    <h5 className="card-title mb-1 fw-bold text-dark">{site.name}</h5>
                    {site.notes && (
                      <p className="card-text text-secondary small mb-0">
                        <span className="fw-semibold">Note:</span> {site.notes}
                      </p>
                    )}
                  </div>

                  {/* Azioni */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-link text-danger p-2 text-decoration-none"
                      onClick={(e) => handleDeleteClick(site, e)}
                      title="Elimina cantiere"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>
                    </button>

                    <button
                      className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: '40px', height: '40px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/building-site-actions/${site.id}`;
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-short" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
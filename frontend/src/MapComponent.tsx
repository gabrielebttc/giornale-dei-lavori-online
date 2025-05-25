import { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapComponent.css';

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

  const handleRecordClick = (site: { latitude: number; longitude: number; id: number }) => {
    if (mapRef.current && site.latitude && site.longitude) {
      mapRef.current.flyTo({ center: [site.longitude, site.latitude] }); // Remove zoom level
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

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = mapboxToken;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      style: 'mapbox://styles/mapbox/streets-v11',
      attributionControl: false, // Rimuove la scritta "Mapbox"
    });

    mapRef.current.on('move', () => {
      if (!mapRef.current) return;

      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();

      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    const fetchBuildingSites = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/building-sites`);
        if (!response.ok) {
          throw new Error('Errore durante il recupero dei building sites');
        }
        const sites = await response.json();
        setBuildingSites(sites);

        if (mapRef.current) {
          sites.forEach((site: { id: number; latitude: number; longitude: number; name: string; notes: string, city: string }) => {
            if (site.latitude && site.longitude) {
              // Crea un elemento HTML per il marker
              const markerElement = document.createElement('div');
              markerElement.style.width = '30px';
              markerElement.style.height = '30px';
              markerElement.style.backgroundColor = 'blue';
              markerElement.style.borderRadius = '50%';
              markerElement.style.border = '2px solid white';
              markerElement.style.cursor = 'pointer';

              // Aggiungi attributi Bootstrap per il popover
              markerElement.setAttribute('data-bs-toggle', 'popover');
              markerElement.setAttribute('data-bs-title', site.name);
              markerElement.setAttribute('data-bs-content', site.notes ? `${site.city} - ${site.notes}` : `${site.city} - nessuna nota`);

              // Inizializza il popover di Bootstrap
              new bootstrap.Popover(markerElement);

              // Aggiungi il marker alla mappa
              new mapboxgl.Marker({ element: markerElement })
                .setLngLat([site.longitude, site.latitude])
                .addTo(mapRef.current!)
                .getElement()
                .addEventListener('click', () => handleMarkerClick(site)); // Handle marker click
            }
          });
        }
      } catch (error) {
        console.error('Errore durante il recupero dei building sites:', error);
      }
    };

    fetchBuildingSites();
  }, []);

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
        {buildingSites.map((site) => (
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
            onClick={() => handleRecordClick(site)} // Handle record click
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
              onClick={() => (window.location.href = `/building-site-actions/${site.id}`)} // Redirect to the link
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-arrow-bar-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MapComponent;
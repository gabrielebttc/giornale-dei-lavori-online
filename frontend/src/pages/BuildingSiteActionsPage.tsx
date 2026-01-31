import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarComponent from '../CalendarComponent';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// --- INTERFACCIA DATI CANTIERE ---
interface SiteInfo {
  id: number;
  name: string;
  notes: string | null;
  city: string | null;
  adress: string | null;
}

// --- INTERFACCIA PROPS CARD ---
interface ActionCardProps {
  siteId: number;
  actionName: string;
  descriptionSection: string;
  selectedDate: Date;
  link: string;
}

// --- COMPONENTE CARD (Separato per pulizia) ---
const BuildingSiteActionComponent: React.FC<ActionCardProps> = ({ 
  siteId, actionName, descriptionSection, selectedDate, link 
}) => {
  function formatDate(date: Date){
    return date.toISOString().split('T')[0];
  }

  useEffect(() => {
    var formattedDate = formatDate(selectedDate);
    setDateWithDashes(formattedDate);
  }, [selectedDate])
  const [dateWithDashes, setDateWithDashes] = useState<string>(formatDate(selectedDate));
  
  const navigate = useNavigate();

  const getIcon = (name: string) => {
    const map: Record<string, string> = {
      'Appello': 'bi-people',
      'Giornale dei lavori': 'bi-journal-text',
      'Lavoratori': 'bi-person-badge',
      'Annotazioni Speciali': 'bi-exclamation-triangle',
      'Osservazioni DL': 'bi-eye',
      'Genera Report': 'bi-file-earmark-excel',
      'Modifica Info': 'bi-gear'
    };
    return map[name] || 'bi-pencil';
  };

  const handleClick = () => {
    navigate(`/${link}/${siteId}/${dateWithDashes}`);
  };

  return (
    <div 
      className="card h-100 border-0 shadow-sm rounded-4 transition-all hover-shadow" 
      style={{ cursor: 'pointer', transition: '0.3s' }}
      onClick={handleClick}
    >
      <div className="card-body d-flex align-items-center p-3">
        <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3 text-primary d-flex align-items-center justify-content-center" 
             style={{ width: '60px', height: '60px', minWidth: '60px' }}>
          <i className={`bi ${getIcon(actionName)} fs-3`}></i>
        </div>
        <div className="flex-grow-1">
          <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.1rem' }}>{actionName}</h5>
          <p className="text-secondary small mb-0 lh-sm">{descriptionSection}</p>
        </div>
        <div className="text-primary opacity-25 ms-2">
          <i className="bi bi-chevron-right fs-4"></i>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PAGINA PRINCIPALE ---
const BuildingSiteActionsPage: React.FC = () => {
  const { site_id: siteId } = useParams<{ site_id: string }>();
  const [buildingSiteInfo, setBuildingSiteInfo] = useState<SiteInfo | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (siteId) fetchBuildingSiteInfo();
  }, [siteId]);

  const fetchBuildingSiteInfo = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/building-sites/${siteId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Errore nel caricamento');
      const data = await response.json();
      setBuildingSiteInfo(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!siteId) return <div className="container mt-5 text-center"><h1>Cantiere non trovato</h1></div>;
  if (loading) return <div className="container mt-5 text-center px-5"><div className="spinner-border text-primary"></div></div>;

  const actions = [
    { name: 'Appello', desc: 'Segna presenze e assenze', link: 'action-page/set-daily-presences' },
    { name: 'Giornale dei lavori', desc: 'Segna le attività giornaliere', link: 'action-page/daily-personal-notes' },
    { name: 'Lavoratori', desc: 'Gestisci i lavoratori assegnati', link: 'action-page/all-workers-from-site' },
    { name: 'Annotazioni Speciali', desc: 'Eventi straordinari e tempo impiegato', link: 'action-page/daily-notes' },
    { name: 'Osservazioni DL', desc: 'Direzione lavori e sicurezza', link: 'action-page/daily-other-notes' },
    { name: 'Genera Report', desc: 'Esporta file Excel (.xlsx)', link: 'action-page/generate-excel-file' },
    { name: 'Modifica Info', desc: 'Modifica dati anagrafici cantiere', link: 'action-page/modify-building-site' }
  ];

  return (
    <div className="container mt-4 pb-5">
      {/* Header */}
      <div className="row mb-4 align-items-center bg-white p-3 rounded-4 shadow-sm border mx-0">
        <div className='col-md-7'>
          <h2 className="fw-bold text-primary mb-0">{buildingSiteInfo?.name}</h2>
          <small className="text-muted text-uppercase fw-semibold">Gestione Cantiere</small>
        </div>
        <div className="col-md-5 mt-3 mt-md-0">
          <CalendarComponent onDateSelect={setSelectedDate} />
        </div>
      </div>

      {/* Griglia Azioni */}
      <div className="row g-3">
        {actions.map((action, idx) => (
          <div className="col-12 col-lg-6" key={idx}>
            <BuildingSiteActionComponent 
              siteId={Number(siteId)} 
              actionName={action.name} 
              descriptionSection={action.desc} 
              selectedDate={selectedDate} 
              link={action.link} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuildingSiteActionsPage;
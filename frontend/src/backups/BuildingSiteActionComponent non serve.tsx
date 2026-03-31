import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  siteId: number;
  actionName: string;
  descriptionSection: string;
  selectedDate: Date;
  link: string;
}

const BuildingSiteActionComponent: React.FC<Props> = ({ 
  siteId, 
  actionName, 
  descriptionSection, 
  selectedDate, 
  link 
}) => {
  const navigate = useNavigate();

  // 1. Sincronizziamo lo stato con la prop quando cambia
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const [dateWithDashes, setDateWithDashes] = useState<string>(formatDate(selectedDate));

  useEffect(() => {
    const formatted = formatDate(selectedDate);
    setDateWithDashes(formatted);
  }, [selectedDate]);

  // 2. Mappatura Icone
  const getIcon = (name: string): string => {
    const iconMap: Record<string, string> = {
      'Appello': 'bi-people',
      'Giornale dei lavori': 'bi-journal-text',
      'Lavoratori di questo cantiere': 'bi-person-badge',
      'ANNOTAZIONI SPECIALI E GENERALI': 'bi-exclamation-triangle',
      'OSSERVAZIONI E ISTRUZIONI': 'bi-eye',
      'Genera Giornale dei lavori': 'bi-file-earmark-excel',
      'Visualizza e Modifica INFO': 'bi-gear'
    };
    return iconMap[name] || 'bi-pencil';
  };

  const handleNavigation = () => {
    const cleanLink = link.startsWith('/') ? link.substring(1) : link;
    
    const targetLink = `/${cleanLink}/${siteId}/${dateWithDashes}`;
    
    navigate(targetLink);
  };

  return (
    <div 
      className="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all" 
      style={{ cursor: 'pointer', transition: '0.3s' }}
      onClick={handleNavigation}
    >
      LAAAAAAAAALFJALSDKJFIOEHFUIOEBIUCBESIUHBFUIH
      <div className="card-body d-flex align-items-center p-3">
        {/* Icona circolare */}
        <div 
          className="rounded-circle bg-primary bg-opacity-10 p-3 me-3 text-primary d-flex align-items-center justify-content-center" 
          style={{ width: '60px', height: '60px', minWidth: '60px' }}
        >
          <i className={`bi ${getIcon(actionName)} fs-3`}></i>
        </div>

        {/* Testo */}
        <div className="flex-grow-1">
          <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.1rem' }}>
            {actionName}
          </h5>
          <p className="text-secondary small mb-0 lh-sm">
            {descriptionSection}
          </p>
          <small className="text-muted mt-1 d-block">Data: {dateWithDashes}</small>
        </div>

        {/* Freccia */}
        <div className="text-primary opacity-25 ms-2">
          <i className="bi bi-chevron-right fs-4"></i>
        </div>
      </div>
    </div>
  );
};

export default BuildingSiteActionComponent;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AllWorkersComponent from '../AllWorkersComponent';
import SetDailyPresencesComponent from '../SetDailyPresencesComponent';
import DailyNotesComponent from '../DailyNotesComponent'; 
import ModifyBuildingSiteComponent from '../ModifyBuildingSiteComponent'; 
import GenerateExcelFileComponent from '../GenerateExcelFileComponent';

const ActionPage: React.FC = () => {
  const { link, siteId, date } = useParams<{ link: string; siteId?: string; date: string }>();
  const [isValidDate, setIsValidDate] = useState<boolean>(false);

  useEffect(() => {
    if (date) {
      const trimmedDate = date.trim();
      const isValid = /^\d{4}-\d{2}-\d{2}$/.test(trimmedDate);
      setIsValidDate(isValid);
    } else {
      setIsValidDate(false);
    }
  }, [date]);

  const buildingSiteId = siteId ? Number(siteId) : null;
  const buildingDate = isValidDate ? date : null;

  // Funzione di callback per la modifica, chiude il modale e torna indietro.
  const handleModifySuccess = () => {
    window.history.back();
  };

  // 🛠️ NUOVA FUNZIONE: Callback per il file Excel, non fa nulla per mantenere il modale aperto.
  const handleExcelSuccess = () => {
    // Non fa nulla qui. Il componente GenerateExcelFileComponent
    // gestirà il proprio stato (mostrando il pulsante di download)
  };

  const renderComponent = () => {
    if (buildingSiteId === null || buildingDate === undefined) {
      return <h1 className="text-center my-4">ID o Data del cantiere mancante.</h1>;
    }

    const noteLinks = {
      'daily-notes': 'notes',
      'daily-other-notes': 'other_notes',
      'daily-personal-notes': 'personal_notes',
    } as const;

    if (link && (Object.keys(noteLinks) as (keyof typeof noteLinks)[]).includes(link as keyof typeof noteLinks)) {
      if (buildingDate === null) {
        return <h1 className="text-center my-4">Data mancante.</h1>;
      }
      const noteType = noteLinks[link as keyof typeof noteLinks];
      return (
        <DailyNotesComponent
          buildingSiteId={buildingSiteId}
          date={buildingDate}
          noteType={noteType}
          onClose={() => window.history.back()}
        />
      );
    }

    switch (link) {
      case 'all-workers-from-site':
        return <AllWorkersComponent buildingSiteId={buildingSiteId} />;
      case 'set-daily-presences':
        if (buildingDate === null) {
          return <h1 className="text-center my-4">Data mancante.</h1>;
        }
        return <SetDailyPresencesComponent buildingSiteId={buildingSiteId} date={buildingDate} />;
      case 'modify-building-site':
        return (
          <ModifyBuildingSiteComponent 
            buildingSiteId={buildingSiteId}
            onClose={() => window.history.back()}
            onSuccess={handleModifySuccess}
          />
        );
      case 'generate-excel-file':
        return (
          <GenerateExcelFileComponent 
            buildingSiteId={buildingSiteId}
            onClose={() => window.history.back()}
            // 🛠️ MODIFICA: Utilizza la nuova funzione handleExcelSuccess
            onSuccess={handleExcelSuccess}
          />
        );
      default:
        return <h1 className="text-center my-4">Pagina non trovata</h1>;
    }
  };

  return (
    <div className="container">
      buildingSiteId: {buildingSiteId}, date: {buildingDate}
      {renderComponent()}
    </div>
  );
};

export default ActionPage;
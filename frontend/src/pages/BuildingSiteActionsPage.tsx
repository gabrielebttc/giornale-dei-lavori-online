import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BuildingSiteActionComponent from '../BuildingSiteActionComponent';
import CalendarComponent from '../CalendarComponent';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface SiteInfo {
  id: number;
  name: string;
  notes: string | null;
  city: string | null;
  adress: string | null;
  latitude: number | null;
  longitude: number | null;
}

const BuildingSiteActionsPage: React.FC = () => {
  const { site_id: siteId } = useParams<{ site_id: string }>(); // Extract the id from the URL
  const currentDate = new Date(); // Format the date in Italian format (dd/mm/yyyy)
  const [buildingSiteInfo, setBuildingSiteInfo] = useState<SiteInfo | null>(null);
  
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  useEffect (() => {
    fetchBuildingSiteInfo();
  }, []);

  const fetchBuildingSiteInfo = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/building-sites/${siteId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBuildingSiteInfo(data);
      return data;
    } catch (error) {
      console.error('Error fetching building site info:', error);
    }
  }

  const site = buildingSiteInfo;

  return siteId ? (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center">
          <div className='col-12 text-center'>
            <h2>{site && site.name}</h2>
          </div>
          <div className="col-6 col-lg-4 text-center">
            <CalendarComponent onDateSelect={handleDateChange} />
          </div>
        </div>
      </div>

      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <BuildingSiteActionComponent siteId={Number(siteId) } actionName='Appello' descriptionSection='Segna presenze e assenze' selectedDate={selectedDate} link='action-page/set-daily-presences'/>
          </div>
          <div className='col-12'>
            <BuildingSiteActionComponent siteId={Number(siteId)} actionName='Giornale dei lavori' descriptionSection='Segna le attività giornaliere' selectedDate={selectedDate} link='action-page/daily-personal-notes'/>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <BuildingSiteActionComponent siteId={Number(siteId)} actionName='Lavoratori di questo cantiere' descriptionSection={`Aggiungi o rimuovi dei lavoratori nel cantiere: ${site && site.name}`} selectedDate={selectedDate} link='action-page/all-workers-from-site'/>
          </div>
          <div className='col-12'>
            <BuildingSiteActionComponent siteId={Number(siteId)} actionName='ANNOTAZIONI SPECIALI E GENERALI' descriptionSection={`sull'andamento e modo di esecuzione dei lavori, sugli avvenimenti straordinari e sul tempo utilmente impiegato`} selectedDate={selectedDate} link='action-page/daily-notes'/>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <BuildingSiteActionComponent siteId={Number(siteId)} actionName='OSSERVAZIONI E ISTRUZIONI' descriptionSection={`della direzione lavori, del responsabile del procedimento, del coordinatore per l’esecuzione, del collaudatore`} selectedDate={selectedDate} link='action-page/daily-other-notes'/>
          </div>
          <div className='col-12'>
            <BuildingSiteActionComponent siteId={Number(siteId)} actionName='Genera Giornale dei lavori' descriptionSection={`Genera un file excel che mostra un resoconto generale delle informazioni sul cantiere (foglio di calcolo - file.xlsx)`} selectedDate={selectedDate} link='action-page/generate-excel-file'/>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <BuildingSiteActionComponent siteId={Number(siteId)} actionName='Visualizza e Modifica INFO' descriptionSection={`Visualizza e Modifica Nome, Città, Indirizzo e note di questo Cantiere`} selectedDate={selectedDate} link='action-page/modify-building-site'/>
          </div>
        </div>
      </div>
    </>
  ) : (
  <>
    <h1>Non hai selezionato alcun cantiere</h1>
  </>
  )
};

export default BuildingSiteActionsPage;

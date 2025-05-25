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

  useEffect (() => {
    fetchBuildingSiteInfo();
  }, []);

  const fetchBuildingSiteInfo = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/get-record/building_sites/${siteId}`, {
        method: 'GET',
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
            <CalendarComponent initialDate={currentDate.toISOString()} />
          </div>
        </div>
      </div>

      <div className='container'>
        <div className='row d-flex justify-content-even align-items-center'>
          <div className='col-md-6 col-lg-4 col-12'>
            <BuildingSiteActionComponent siteId={Number(siteId)} actionName='Appello' descriptionSection='Segna presenze e assenze' todayDate={currentDate} link='daily-presence'/>
          </div>
          <div className='col-md-6 col-lg-4 col-12'>
            <BuildingSiteActionComponent siteId={Number(siteId)} actionName='Giornale dei lavori' descriptionSection='Segna le attività giornaliere' todayDate={currentDate} link='daily-notes'/>
          </div>
        </div>

        <div className='row d-flex justify-content-even align-items-center'>
          <div className='col-md-6 col-lg-4 col-12'>
            <BuildingSiteActionComponent siteId={Number(siteId)} actionName='Lavoratori di questo cantiere' descriptionSection={`Aggiungi o rimuovi dei lavoratori nel cantiere: ${site && site.name}`} todayDate={currentDate} link='all-workers'/>
          </div>
          <div className='col-md-6 col-lg-4 col-12'>
            <BuildingSiteActionComponent siteId={Number(siteId)} actionName='ANNOTAZIONI SPECIALI E GENERALI' descriptionSection={`sull'andamento e modo di esecuzione dei lavori, sugli avvenimenti straordinari e sul tempo utilmente impiegato`} todayDate={currentDate} link='daily-notes'/>
          </div>
        </div>

        <div className='row d-flex justify-content-center align-items-center'>
          <div className='col-lg-6 col-12'>
            <BuildingSiteActionComponent siteId={Number(siteId)} actionName='OSSERVAZIONI E ISTRUZIONI' descriptionSection={`della direzione lavori, del responsabile del procedimento, del coordinatore per l’esecuzione, del collaudatore`} todayDate={currentDate} link='daily-other-notes'/>
          </div>
          <div className='col-lg-6 col-12'>
            <BuildingSiteActionComponent siteId={Number(siteId)} actionName='Genera Giornale dei lavori' descriptionSection={`Genera un file excel che mostra un resoconto generale delle informazioni sul cantiere (foglio di calcolo - file.xlsx)`} todayDate={currentDate} link='generate-excel-file'/>
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

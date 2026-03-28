import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import EditDocumentComponent from '../EditDocumentComponent';

const EditDocumentPage: React.FC = () => {
  const { siteId, date } = useParams<{ siteId?: string; date?: string }>();
  const [searchParams] = useSearchParams();

  const projectIdParam = searchParams.get('projectId');
  const projectId = projectIdParam && /^\d+$/.test(projectIdParam) ? Number(projectIdParam) : null;

  if (!siteId || !date) {
    return <h1 className="text-center my-4">ID o Data del cantiere mancante.</h1>;
  }

  return (
    <div className="container mt-3">
      <EditDocumentComponent
        projectId={projectId}
      />
    </div>
  );
};

export default EditDocumentPage;

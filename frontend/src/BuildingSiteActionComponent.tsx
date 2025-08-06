import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
    siteId: number;
    actionName: string;
    descriptionSection: string;
    selectedDate: Date;
    link: string;
}

const BuildingSiteActionComponent: React.FC<Props> = ({ siteId, actionName, descriptionSection, selectedDate, link }) => {
  //const date = todayDate.toLocaleDateString('it-IT');
  const firstDateWithDahes = selectedDate.toISOString().split('T')[0];
  const navigate = useNavigate();
  const renderToLink = () => navigate(`/${link}/${siteId}/${dateWithDashes}`);//dateWithDashes formatted in YYYY-MM-DD
  const [dateWithDashes, setDateWithDashes] = React.useState<string>(firstDateWithDahes);

  useEffect(() => {
    setDateWithDashes(selectedDate.toISOString().split('T')[0]); // Formatta la data in YYYY-MM-DD
  }, [selectedDate]);

    return (
            <div className="container mt-4">
              <div className="row">
                <div className="col-xl-6 col-md-12">
                  <div className="card overflow-hidden">
                    <div className="card-content">
                      <div className="card-body clearfix d-flex align-items-center">
                        <div className="media align-items-stretch" style={{ flex: '90%' }}>
                          <div className="align-self-center">
                            <i className="icon-pencil primary font-large-2 mr-2"></i>
                          </div>
                          <div className="media-body">
                            <h4>{actionName}</h4>
                            <span>
                              {descriptionSection}
                            </span>
                          </div>
                        </div>
                        <div
                          className="align-self-center"
                          style={{
                            flex: '10%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onClick={() => renderToLink()}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
                            fill="currentColor"
                            className="bi bi-arrow-bar-right"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    )
}

export default BuildingSiteActionComponent;
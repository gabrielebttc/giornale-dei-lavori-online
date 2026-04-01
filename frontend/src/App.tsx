import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Importa i componenti delle pagine
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import NavbarComponent from './NavbarComponent';
import BuildingSiteActionsPage from './pages/BuildingSiteActionsPage';
import ActionPage from './pages/ActionPage';
import EditDocumentPage from './pages/EditDocumentPage';
import TestPage from './test/TestPage';

const AuthLogoutListener = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handler = () => navigate('/login');
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [navigate]);
  return null;
};

const App = () => {
  return (
    <Router>
        <div className="flex flex-col min-h-screen pb-5">
          <AuthLogoutListener />
          <NavbarComponent />
          <main className="flex-grow mb-5">
            <div className="container-fluid">
              <div className="row justify-content-center">
                  <Routes>
                    <Route path="/building-sites" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<AboutPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/building-site-actions/:site_id" element={<BuildingSiteActionsPage />} />
                    <Route path="/action-page/:link/:siteId/:date" element={<ActionPage />} />
                    <Route path="/edit-document/:siteId/:date" element={<EditDocumentPage />} />
                    <Route path="/test-page" element={<TestPage />} />
                  </Routes>
              </div>
            </div>
          </main>
        </div>
    </Router>
  );
};

export default App;

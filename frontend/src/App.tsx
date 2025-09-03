import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa i componenti delle pagine
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import NavbarComponent from './NavbarComponent';
import BuildingSiteActionsPage from './pages/BuildingSiteActionsPage';
import ActionPage from './pages/ActionPage';

const App = () => {
  return (
    <Router>
        <div className="flex flex-col min-h-screen pb-5">
          <NavbarComponent />
          <main className="flex-grow mt-3 mb-5">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12">
                  <Routes>
                    <Route path="/building-sites" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<AboutPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/building-site-actions/:site_id" element={<BuildingSiteActionsPage />} />
                    <Route path="/action-page/:link/:siteId/:date" element={<ActionPage />} />
                  </Routes>
                </div>
              </div>
            </div>
          </main>
        </div>
    </Router>
  );
};

export default App;

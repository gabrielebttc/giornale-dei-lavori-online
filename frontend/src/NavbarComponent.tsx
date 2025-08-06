import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, LogIn, Info, User, LogOut } from 'lucide-react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const NavbarComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`data.id: ${data.id}`);
          console.log(`data: ${JSON.stringify(data)}`);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          console.log("NON SEI LOGGATO");
        }
      } catch (error) {
        console.error('Errore durante la verifica dello stato di login:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <>
      {/* Navbar per schermi grandi */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm border-bottom mb-3 d-none d-lg-block">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center text-primary font-weight-bold" to="/">
            <Home className="mr-2" size={24} />
            <span className="d-none d-sm-inline">Libretto del lavoro</span>
          </Link>
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-gray-600 hover:text-blue-600" to="/building-sites">
                      <Home className="d-block d-sm-none mr-2" size={20} />
                      <span className="d-none d-sm-inline">Cantieri</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-gray-600 hover:text-blue-600" to={`/profile`}>
                      <User className="d-block d-sm-none mr-2" size={20} />
                      <span className="d-none d-sm-inline">Profilo</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link text-gray-600 hover:text-blue-600 btn btn-link" onClick={handleLogout}>
                      <LogOut className="d-block d-sm-none mr-2" size={20} />
                      <span className="d-none d-sm-inline">Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-gray-600 hover:text-blue-600" to="/register">
                      <PlusCircle className="d-block d-sm-none mr-2" size={20} />
                      <span className="d-none d-sm-inline">Registrati</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-gray-600 hover:text-blue-600" to="/login">
                      <LogIn className="d-block d-sm-none mr-2" size={20} />
                      <span className="d-none d-sm-inline">Accedi</span>
                    </Link>
                  </li>
                </>
              )}
              <li className="nav-item">
                <Link className="nav-link text-gray-600 hover:text-blue-600" to="/about">
                  <Info className="d-block d-sm-none mr-2" size={20} />
                  <span className="d-none d-sm-inline">Chi Siamo</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Navbar per schermi piccoli */}
      <nav className="navbar navbar-light bg-white shadow-lg border-top fixed-bottom d-lg-none">
        <div className="container d-flex justify-content-around">
          {isLoggedIn && (
            <Link className="nav-link text-gray-600 hover:text-blue-600 text-center" to="/building-sites">
              <Home size={24} />
              <span className="d-block text-muted" style={{ fontSize: '12px' }}>Cantieri</span>
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <Link className="nav-link text-gray-600 hover:text-blue-600 text-center" to={`/profile`}>
                <User size={24} />
                <span className="d-block text-muted" style={{ fontSize: '12px' }}>Profilo</span>
              </Link>
              <button className="nav-link text-gray-600 hover:text-blue-600 text-center btn btn-link" onClick={handleLogout}>
                <LogOut size={24} />
                <span className="d-block text-muted" style={{ fontSize: '12px' }}>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link text-gray-600 hover:text-blue-600 text-center" to="/register">
                <PlusCircle size={24} />
                <span className="d-block text-muted" style={{ fontSize: '12px' }}>Registrati</span>
              </Link>
              <Link className="nav-link text-gray-600 hover:text-blue-600 text-center" to="/login">
                <LogIn size={24} />
                <span className="d-block text-muted" style={{ fontSize: '12px' }}>Accedi</span>
              </Link>
            </>
          )}
          <Link className="nav-link text-gray-600 hover:text-blue-600 text-center" to="/about">
            <Info size={24} />
            <span className="d-block text-muted" style={{ fontSize: '12px' }}>Chi siamo</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default NavbarComponent;
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Header = ({ isMobile, isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  return (
    <header className="header">
      <nav>
        <a href="/" className="logo">
          <img 
            src="public/Imagenes/logox.png" 
            alt="Ávila Hacking"
            className="logo-img"
          />
        </a>

        {isMobile && (
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menú"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        )}

        <div className="search-container">
          <input 
            type="search" 
            placeholder="Buscar..." 
            className="search-input" 
          />
          <button type="submit" className="search-btn">🔍</button>
        </div>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/foro" className="btn">Foro</Link></li>
          <li><Link to="/destinos" className="btn">Destinos</Link></li>
          
          {user ? (
            <>
              <li className="user-profile">
                <div className="user-image-container">
                  <img 
                    src={user.photoURL || '/Imagenes/usuario-default.png'} 
                    alt="Perfil de usuario" 
                    className="user-image"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = '/Imagenes/usuario-default.png';
                    }}
                  />
                  <span className="user-name">{user.displayName || 'Usuario'}</span>
                </div>
              </li>
              <li>
                <button onClick={logout} className="btn logout-btn">Cerrar sesión</button>
              </li>
            </>
          ) : (
            !['/login', '/registrar'].includes(location.pathname) && (
              <>
                <li>
                  <Link to="/registrar" className="btn register-btn">Registrarse</Link>
                </li>
                <li>
                  <Link to="/login" className="btn login-btn">Iniciar sesión</Link>
                </li>
              </>
            )
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
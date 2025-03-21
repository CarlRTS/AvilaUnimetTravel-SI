import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useEffect, useState } from 'react';

const Header = ({ isMobile, isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, loading, logout } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  // URLs constantes
  const LOGO_URL = 'https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila//Instagram_story_black_party_fiesta_negro_blanco_3_-removebg-preview.png';
  const DEFAULT_AVATAR = 'https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila/images-removebg-preview.png';

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setAuthChecked(true), 150);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <header className="header">
      <nav>
        <a href="/" className="logo">
          <img 
            src={LOGO_URL}
            alt="Ávila Hacking"
            className="logo-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_AVATAR;
            }}
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
          
          {authChecked && (
            currentUser ? (
              <>
                <li className="user-profile">
                  <div 
                    className="user-image-container"
                    onClick={() => navigate('/mi-perfil')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && navigate('/mi-perfil')}
                  >
                    <img 
                      src={currentUser.photoURL || DEFAULT_AVATAR} 
                      alt="Perfil" 
                      className="user-image"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                    <span className="user-name">
                      {currentUser.displayName || 'Usuario'}
                    </span>
                  </div>
                </li>
                <li>
                  <button 
                    onClick={logout} 
                    className="btn logout-btn"
                    aria-label="Cerrar sesión"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              location.pathname !== '/login' && (
                <li>
                  <Link 
                    to="/login" 
                    className="btn login-btn"
                    aria-label="Iniciar sesión"
                  >
                    Iniciar sesión
                  </Link>
                </li>
              )
            )
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
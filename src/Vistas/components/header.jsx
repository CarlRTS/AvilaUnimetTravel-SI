import React from 'react';

const Header = ({ isMobile, isMenuOpen, setIsMenuOpen }) => (
  <header className="header">
    <nav>
     
      <a href="/" className="logo">
        <img 
          src="public\Imagenes\logox.png" 
          alt="Ávila Hacking "
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
        <li><a href="/foro" className="btn">Foro</a></li>
        <li><a href="/destinos" className="btn">Destinos</a></li>
        <li><a href="/login" className="btn login-btn">Iniciar sesión</a></li>
      </ul>
    </nav>
  </header>
);

export default Header;
import React from 'react';

import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsMenuOpen(false); // Cierra el menú al cambiar a desktop
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <nav>
          <h1 className="logo">Ávila Hiking</h1>

          {/* Menú Hamburguesa (solo en móvil) */}
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

          {/* Buscador */}
          <div className="search-container">
            <input 
              type="search" 
              placeholder="Buscar..." 
              className="search-input" 
            />
            <button type="submit" className="search-btn">🔍</button>
          </div>

          {/* Botones de navegación */}
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#" className="btn">Foro</a></li>
            <li><a href="#" className="btn">Destinos</a></li>
            <li><a href="#" className="btn login-btn">Iniciar sesión</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="about-section">
          <div className="content-container">
            <h2>¿Quiénes somos?</h2>
            <p>Un grupo de alumnos de la UNIMET que busca incentivar el senderismo a nivel universitario</p>
          </div>
        </section>

        <section className="benefits-section">
          <div className="content-container">
            <div className="text-content">
              <h2>¿Por qué debería hacer senderismo?</h2>
              <p>
                Hacer senderismo permite a los estudiantes conectar con la naturaleza y escapar del estrés académico.
                Esta actividad promueve un estilo de vida activo y mejora en la salud física y mental. Además, fomenta
                la comunicación y el trabajo en equipo al participar en excursiones grupales.
              </p>
            </div>
            <div className="image-content">
              <img 
                src="http://cerroelavila.com/wp-content/uploads/2017/07/foto-5-1024x768.jpg" 
                alt="Senderismo en el Ávila"
                className="hiking-image" 
              />
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Ávila - UNIMET</p>
      </footer>
    </div>
  );
}

export default App;
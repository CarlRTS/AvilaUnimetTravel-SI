import React from 'react';

const Footer = () => (
  <footer>
    <div className="footer-content">
      <div className="social-logos">
        <a 
          href="https://www.instagram.com/unimet/"
          target="_blank" 
          rel="noopener noreferrer" 
          className="instagram-logo"
        >
          <img src="/Imagenes/instagram.png" alt="Instagram" />
        </a>
      </div>

      <div className="brand-logos">
        <a href="#" className="brand-logo">
          <img src="/Imagenes/inparques.png" alt="Inparques" />
        </a>
        <a href="#" className="brand-logo">
          <img src="/Imagenes/proyectoavila.png" alt="Logo colaborador 2" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
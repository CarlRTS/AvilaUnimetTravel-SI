import React from 'react';
import { Link } from "react-router-dom"; // Importa Link para la navegación

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
          <img src="/Imagenes/instagram.webp" alt="Instagram" />
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

      <div className="footer-button">
        {/* Botón para ir a Información */}
        <a href="/informacion" className="info-button">
          ¡Descubre más sobre nosotros!
        </a>

        {/* Botón sencillo para ir a Contactos */}
        <Link to="/contactos" className="contactanos-button">
          Contáctanos
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer
      </div>
    </div>
  </footer>
);

export default Footer;

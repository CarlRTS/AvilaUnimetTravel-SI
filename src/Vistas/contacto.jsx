import React from 'react'
import Footer from './components/Footer';
import Header from './components/header';
import { useAuth } from './AuthContext';



const Contactos = () => {
    const { currentUser } = useAuth(); // Obtén el usuario actual del contexto
  
    return (
      <div>
        {/* Header */}
        <Header />
  
        {/* Contenido de la vista de Contactos */}
        <div className="contactos-container">
          <h1 className="contactos-titulo">Contactos</h1>
          <div className="contactos-info">
            <p>
              Nos puedes contactar al:
              <br />
              <strong>0414-144-43-19</strong>
            </p>
            <p>
              Vía e-mail:
              <br />
              <strong>AvilaHiking@unimet.edu.ve</strong>
            </p>
            <p>
              Y en nuestras redes sociales:
              <br />
              <strong>@Avilahikingunimet</strong>
            </p>
          </div>
          <div className="contactos-unimet">
            <p>UNIMET</p>
            <p>Proyecto Ávila</p>
          </div>
        </div>
  
        {/* Footer */}
        <Footer />
      </div>
    );
  };
  
  export default Contactos;

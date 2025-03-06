import React from 'react';

const AboutSection = ({ isAboutOpen, setIsAboutOpen }) => {
  return (
    <section className="about-section">
      <div 
        className="about-image-container"
        style={{ backgroundImage: "url('/Imagenes/Landingpage.png')" }} 
      >
        <button 
          className="about-toggle-btn"
          onClick={() => setIsAboutOpen(!isAboutOpen)}
        >
          ¿Quiénes somos?
        </button>
      </div>

      <div className={`about-content ${isAboutOpen ? 'open' : ''}`}>
        <div className="content-container">
          <p>Un grupo de alumnos de la UNIMET que busca incentivar el senderismo a nivel universitario</p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
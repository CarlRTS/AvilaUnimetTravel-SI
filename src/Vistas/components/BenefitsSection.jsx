import React from 'react';

const BenefitsSection = () => (
  <section className="benefits-section">
    <div className="content-container">
      <div className="text-content">
        <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "1rem", color: "#2c3e50" }}>
          ¿Por qué debería hacer senderismo?
        </h2>
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
);

export default BenefitsSection;

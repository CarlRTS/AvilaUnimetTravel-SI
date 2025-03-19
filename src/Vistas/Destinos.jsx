import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/FireBase';
import { collection, getDocs } from 'firebase/firestore';
import Header from './components/header';
import Footer from './components/Footer';

export default function Destinos() {
  const [rutas, setRutas] = useState([]);
  const [selectedRuta, setSelectedRuta] = useState(null);

  useEffect(() => {
    const fetchRutas = async () => {
      const querySnapshot = await getDocs(collection(db, "Rutas"));
      const rutasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRutas(rutasData);
    };

    fetchRutas();
  }, []);

  return (
    <div>
      <Header />

      <div className="lagunazo-container">
        <header className="lagunazo-header-interno">
          <h1 className="lagunazo-titulo-principal">Destinos</h1>
        </header>

        <div className="lagunazo-grid-principal">
          <div className="lagunazo-grid-rutas">
            {rutas.map((ruta) => (
              <RutaCard
                key={ruta.id}
                id={ruta.id}
                nombre={ruta.nombre}
                imagen={ruta.imagen} // Pasamos la URL de la imagen desde el campo "imagen"
                onClick={() => setSelectedRuta(ruta)}
              />
            ))}
          </div>
        </div>

        {selectedRuta && (
          <div className="lagunazo-detalles-ruta">
            <h2>{selectedRuta.nombre}</h2>
            <p><strong>Descripción:</strong> {selectedRuta.descripcion}</p>
            <p><strong>Dificultad:</strong> {selectedRuta.dificultad}</p>
            <p><strong>Duración:</strong> {selectedRuta.duracion}</p>
            <p><strong>Puntos de Interés:</strong> {selectedRuta.puntosInteres.join(", ")}</p>
            {/* Eliminamos la línea que muestra la imagen en los detalles */}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

const RutaCard = ({ nombre, imagen, onClick }) => {
  return (
    <div className="ruta-card" onClick={onClick}>
      <h3 className="ruta-titulo">{nombre}</h3> {/* Subtítulo arriba */}
      <div className="imagen-container">
        <img src={imagen} alt={nombre} /> {/* Usamos la URL de la imagen desde el campo "imagen" */}
      </div>
    </div>
  );
};
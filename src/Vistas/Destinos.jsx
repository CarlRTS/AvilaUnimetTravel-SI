import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/FireBase';
import { collection, getDocs } from 'firebase/firestore';
import Header from './components/header';
import Footer from './components/Footer';

// Objeto que mapea cada id con su imagen correspondiente
const imagenesPorRuta = {
  "1": "/Imagenes/Julia.png",
  "2": "/Imagenes/Corta-fuegos.png",
  "3": "/Imagenes/Lagunazo.png",
  "4": "/Imagenes/PicoHumboldt.png"
};

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
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

const RutaCard = ({ id, nombre, onClick }) => {
  return (
    <div className="ruta-card" onClick={onClick}>
      <h3 className="ruta-titulo">{nombre}</h3> {/* Subtítulo arriba */}
      <div className="imagen-container">
        <img src={imagenesPorRuta[id]} alt={nombre} />
      </div>
    </div>
  );
};
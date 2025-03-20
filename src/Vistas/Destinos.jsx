import React, { useEffect, useState } from 'react';
import { db, auth } from '../Firebase/FireBase';
import { collection, getDocs } from 'firebase/firestore';
import Header from './components/header';
import Footer from './components/Footer';

export default function Destinos() {
  const [rutas, setRutas] = useState([]);
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [user, setUser] = useState(null);

  // Verificar estado de autenticación
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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

  const handleLoginRedirect = () => {
    // Aquí debes implementar tu lógica de redirección a login
    // Ejemplo con react-router: navigate('/login')
    // O abrir modal de login: document.getElementById('login-modal').showModal()
    console.log('Redirigir a login');
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Destinos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rutas.map((ruta) => (
            <RutaCard
              key={ruta.id}
              nombre={ruta.nombre}
              imagen={ruta.imagen}
              onClick={() => setSelectedRuta(ruta)}
            />
          ))}
        </div>

        {selectedRuta && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">{selectedRuta.nombre}</h2>
                  <div className="flex gap-4 mt-2 text-gray-500">
                    <span className="flex items-center">⏳ {selectedRuta.duracion}</span>
                    <span className="flex items-center">⚡ {selectedRuta.dificultad}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Columna izquierda */}
                  <div className="space-y-6">
                    <div className="prose max-w-none">
                      <p className="text-gray-600 leading-relaxed">
                        {selectedRuta.descripcion}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Puntos clave del recorrido
                      </h3>
                      <ul className="space-y-2">
                        {selectedRuta.puntosInteres.map((punto, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="text-gray-600">{punto}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Mapa */}
                    <div className="mt-4">
                      <button 
                        className="w-full hover:opacity-90 transition-opacity"
                        onClick={() => window.open(selectedRuta.direccion, '_blank')}
                      >
                        <img
                          src={selectedRuta.mapaImagen}
                          alt="Ubicación del recorrido"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </button>
                      <p className="mt-3 text-sm text-gray-600 text-center">
                        {selectedRuta.direccionTexto}
                      </p>
                    </div>
                  </div>

                  {/* Columna derecha */}
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-blue-800 mb-4">
                        🗓️ Agenda tu experiencia
                      </h3>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2 text-gray-700">
                          <span className="text-blue-500">▹</span>
                          Grupo mínimo: 4 personas
                        </li>
                        <li className="flex items-center gap-2 text-gray-700">
                          <span className="text-blue-500">▹</span>
                          Salidas: Miércoles y Sábados
                        </li>
                        <li className="flex items-center gap-2 text-gray-700">
                          <span className="text-blue-500">▹</span>
                          Punto de encuentro: Plaza Central
                        </li>
                      </ul>
                      
                      {user ? (
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                          Reservar ahora - ${selectedRuta.precio}
                        </button>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-gray-600">
                            Debes{' '}
                            <button
                              onClick={handleLoginRedirect}
                              className="text-blue-600 hover:underline"
                            >
                              iniciar sesión
                            </button>{' '}
                            para reservar
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="bg-orange-50 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-orange-800 mb-3">
                        🎒 Equipo necesario
                      </h3>
                      <ul className="space-y-2">
                        <li className="text-gray-600">• Calzado de trekking</li>
                        <li className="text-gray-600">• Mochila 20L</li>
                        <li className="text-gray-600">• Protector solar</li>
                        <li className="text-gray-600">• 2L de agua mínimo</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                <button 
                  onClick={() => setSelectedRuta(null)}
                  className="text-gray-500 hover:text-gray-700 float-right"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

const RutaCard = ({ nombre, imagen, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative h-48">
        <img 
          src={imagen} 
          alt={nombre}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{nombre}</h3>
        <p className="text-sm text-gray-500 mt-1">Haz clic para ver detalles</p>
      </div>
    </div>
  );
};
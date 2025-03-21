
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/FireBase';
import { useAuth } from './AuthContext';
import Header from './components/header';
import Footer from './components/Footer';

export function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // Añadir esto

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        // Obtener reservas
        const q = query(collection(db, 'reservas'), where('userId', '==', currentUser.uid));
        const reservasSnapshot = await getDocs(q);
        const reservasData = reservasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fecha: doc.data().fecha.toDate()
        }));

        // Obtener todas las rutas
        const rutasSnapshot = await getDocs(collection(db, "Rutas"));
        const rutasData = rutasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Combinar datos
        const reservasCompletas = reservasData.map(reserva => ({
          ...reserva,
          ruta: rutasData.find(r => r.id === reserva.rutaId) || {}
        }));

        setReservas(reservasCompletas);
      }
    };
    
    fetchData();
  }, [currentUser]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Mis Reservas</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservas.map(reserva => (
            <div key={reserva.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {reserva.ruta?.nombre || 'Ruta no disponible'}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  reserva.status === 'confirmada' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {reserva.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Fecha:</span> {reserva.fecha.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Personas:</span> {reserva.personas}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Duración:</span> {reserva.ruta?.duracion || 'N/A'}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Dificultad:</span> {reserva.ruta?.dificultad || 'N/A'}
                </p>
              </div>
              
              {reserva.ruta?.mapaImagen && (
                <img
                  src={reserva.ruta.mapaImagen}
                  alt="Mapa de la ruta"
                  className="mt-4 w-full h-32 object-cover rounded-lg"
                />
              )}
            </div>
          ))}
        </div>

        {reservas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No tienes reservas activas</p>
            <button
              onClick={() => navigate('/destinos')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explorar rutas disponibles
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
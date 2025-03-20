import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/FireBase';
import { collection, getDocs, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import Header from './components/header';
import Footer from './components/Footer';
import { useAuth } from './AuthContext';
import DonacionPayPal from '../Vistas/DonacionPayPal';

const DayButton = ({ day, status, onClick, isSelected }) => {
  const getColor = () => {
    switch(status) {
      case 'disponible': return 'bg-green-100 hover:bg-green-200';
      case 'parcial': return 'bg-yellow-100 hover:bg-yellow-200';
      case 'lleno': return 'bg-red-200 cursor-not-allowed';
      default: return 'bg-gray-100 cursor-not-allowed';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded text-center transition-colors ${
        isSelected ? 'bg-blue-500 text-white' : getColor()
      }`}
      disabled={status === 'lleno' || status === 'inactivo'}
    >
      {day}
    </button>
  );
};

export default function Destinos() {
  const [rutas, setRutas] = useState([]);
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [reservationConfirmed, setReservationConfirmed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [personas, setPersonas] = useState(4);
  const [cuposPorFecha, setCuposPorFecha] = useState({});
  const { currentUser } = useAuth();
  
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    const fetchRutas = async () => {
      const querySnapshot = await getDocs(collection(db, "Rutas"));
      const rutasData = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          grupoMinimo: doc.data().grupoMinimo || 4,
          cupoMaximo: doc.data().cupoMaximo || 10,
          diasSalida: doc.data().diasSalida || [3, 6], // Días de salida
          habilitada: doc.data().habilitada !== undefined ? doc.data().habilitada : true,
          ...doc.data(),
        }))
        .filter(ruta => ruta.habilitada); // Solo rutas habilitadas
      setRutas(rutasData);
    };
    fetchRutas();
  }, []);

  useEffect(() => {
    if (selectedRuta) {
      const q = query(collection(db, 'reservas'), where('rutaId', '==', selectedRuta.id));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reservasData = snapshot.docs.map(doc => doc.data());
        
        const nuevosCupos = reservasData.reduce((acc, reserva) => {
          const fechaKey = reserva.fecha.toDate().toISOString().split('T')[0];
          acc[fechaKey] = (acc[fechaKey] || 0) + reserva.personas;
          return acc;
        }, {});

        setCuposPorFecha(nuevosCupos);
      });
      return () => unsubscribe();
    }
  }, [selectedRuta]);

  const handleReservation = async () => {
    if (selectedDate && currentUser && selectedRuta) {
      try {
        const fechaKey = selectedDate.toISOString().split('T')[0];
        const totalPersonas = (cuposPorFecha[fechaKey] || 0) + personas;
        
        if (totalPersonas > selectedRuta.cupoMaximo) {
          alert('No hay suficiente cupo disponible');
          return;
        }

        await addDoc(collection(db, 'reservas'), {
          userId: currentUser.uid,
          rutaId: selectedRuta.id,
          fecha: selectedDate,
          personas: personas,
          timestamp: new Date(),
          status: 'confirmada'
        });
        setReservationConfirmed(true);
        setTimeout(() => {
          setReservationConfirmed(false);
          setShowCalendar(false);
        }, 3000);
      } catch (error) {
        console.error("Error reservando:", error);
      }
    }
  };

  const Calendar = () => {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay();

    const getDiaStatus = (date) => {
      const fechaKey = date.toISOString().split('T')[0];
      const totalPersonas = cuposPorFecha[fechaKey] || 0;
      
      if (totalPersonas >= selectedRuta.cupoMaximo) return 'lleno';
      if (totalPersonas >= selectedRuta.grupoMinimo) return 'lleno';
      if (totalPersonas > 0) return 'parcial';
      return 'disponible';
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, i) => (
            <div key={i} className="text-center font-semibold text-gray-600 p-2">{day}</div>
          ))}
          
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(currentYear, currentMonth, day);
            const isDiaSalida = selectedRuta.diasSalida.includes(date.getDay());
            const status = isDiaSalida ? getDiaStatus(date) : 'inactivo';

            return (
              <DayButton
                key={day}
                day={day}
                status={status}
                isSelected={selectedDate?.getDate() === day && 
                            selectedDate?.getMonth() === currentMonth}
                onClick={() => setSelectedDate(date)}
              />
            );
          })}
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentYear(currentYear - 1);
                setCurrentMonth(11);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            ← Mes anterior
          </button>
          
          <button
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentYear(currentYear + 1);
                setCurrentMonth(0);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Mes siguiente →
          </button>
        </div>

        {selectedDate && (
          <div className="text-center mt-6">
            <p className="mb-4">Fecha seleccionada: {selectedDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personas (Mínimo {selectedRuta.grupoMinimo})
              </label>
              <input
                type="number"
                min={selectedRuta.grupoMinimo}
                max={selectedRuta.cupoMaximo}
                value={personas}
                onChange={(e) => setPersonas(Math.max(selectedRuta.grupoMinimo, parseInt(e.target.value) || 0))}
                className="w-full p-2 border rounded max-w-[200px] mx-auto"
              />
            </div>
            <button
              onClick={handleReservation}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg"
            >
              Confirmar Reserva
            </button>
          </div>
        )}
        
        <button
          onClick={() => setShowCalendar(false)}
          className="mt-4 text-gray-600 hover:text-gray-800 underline"
        >
          ← Volver a los detalles
        </button>
      </div>
    );
  };

  return (
      <div className="min-h-screen">
        <Header />
    
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Destinos</h1>
    
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rutas.map((ruta) => (
              <div
                key={ruta.id}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg"
                onClick={() => setSelectedRuta(ruta)}
              >
                <div className="relative h-48">
                  <img 
                    src={ruta.imagen} 
                    alt={ruta.nombre}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{ruta.nombre}</h3>
                  <p className="text-sm text-gray-500 mt-1">Haz clic para ver detalles</p>
                </div>
              </div>
            ))}
          </div>
    
          {selectedRuta && !showCalendar && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{selectedRuta.nombre}</h2>
          <div className="flex gap-3 mt-1 text-sm text-gray-500">
            <span className="flex items-center">⏳ {selectedRuta.duracion}</span>
            <span className="flex items-center">⚡ {selectedRuta.dificultad}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Izquierda */}
          <div className="space-y-4">
            <div className="prose">
              <p className="text-gray-600 text-sm leading-relaxed">
                {selectedRuta.descripcion}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Puntos clave del recorrido
              </h3>
              <ul className="space-y-1.5">
                {selectedRuta.puntosInteres.map((punto, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-600">{punto}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3">
              <button 
                className="w-full hover:opacity-90 transition-opacity"
                onClick={() => window.open(selectedRuta.direccion, '_blank')}
              >
                <img
                  src={selectedRuta.mapaImagen}
                  alt="Ubicación del recorrido"
                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                />
              </button>
              <p className="mt-2 text-xs text-gray-600 text-center">
                {selectedRuta.direccionTexto || 'Loma del Viento • Cruz del Ávila • Hotel Humboldt'}
              </p>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-blue-800 mb-3">🗓️ Agenda tu experiencia</h3>
            <ul className="space-y-2 mb-4 text-sm">
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-blue-500">▹</span>
                Grupo mínimo: {selectedRuta.grupoMinimo} personas
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-blue-500">▹</span>
                Cupo máximo: {selectedRuta.cupoMaximo} personas
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-blue-500">▹</span>
                Salidas: {selectedRuta.diasSalida
                  .map(d => ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][d])
                  .join(', ')}
              </li>
            </ul>
            {currentUser ? ( // Solo muestra el botón si hay usuario logeado
    <button 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm"
      onClick={() => setShowCalendar(true)}
    >
      Reservar ahora - ${selectedRuta.precio}
    </button>
  ) : (
    <p className="text-center text-sm text-gray-600 mt-2">
      Debes <a href="/login" className="text-blue-500">iniciar sesión</a> para reservar
    </p>
  )}
</div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-orange-800 mb-2">🎒 Equipo necesario</h3>
              <ul className="space-y-1.5 text-sm">
                <li className="text-gray-600">• Calzado de trekking</li>
                <li className="text-gray-600">• Mochila 20L</li>
                <li className="text-gray-600">• Protector solar</li>
                <li className="text-gray-600">• 2L de agua mínimo</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-yellow-800 mb-2">❤️ Haz una donación</h3>
              <DonacionPayPal 
                clientId="AaVP_UBN1IsLQa0ya7iuY21IFpB8FtXbvsOy2j89ycbdCii-A-YNw3VDH5ioWcoB9-1wSz8BWRShhTRX"
                amount="10.00"
                description="Donación para mantenimiento de senderos"
                onSuccess={(details) => {
                  alert(`¡Gracias por tu donación de $${details.purchase_units[0].amount.value}!`);
                }}
              />
              <p className="text-xs text-gray-500 mt-2">
                100% de las donaciones se destinan a los guias
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
        <button 
          onClick={() => setSelectedRuta(null)}
          className="text-gray-600 hover:text-gray-800 text-sm float-right"
        >
          Cerrar ventana
        </button>
      </div>
    </div>
  </div>
)}
    
          {showCalendar && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
                <Calendar />
              </div>
            </div>
          )}
    
          {reservationConfirmed && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-green-600 mb-4">¡Reserva confirmada!</h3>
                <p>Recibirás un correo de confirmación con los detalles.</p>
              </div>
            </div>
          )}
        </div>
    
        <Footer />
      </div>
    );
  }


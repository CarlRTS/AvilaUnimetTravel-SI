import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/header';
import { useAuth } from './AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/FireBase';

export default function MiPerfil() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rutasAsignadas, setRutasAsignadas] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState({
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false,
    domingo: false,
  });
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultImage = 'https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila//images-removebg-preview.png';

  // Función para manejar la edición del perfil
  const handleEditProfile = () => {
    navigate('/editar-perfil');
  };

  // Función para obtener las rutas asignadas
  const fetchRutasAsignadas = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const rutaAsignadaId = userDoc.data().rutaAsignada;

      if (rutaAsignadaId) {
        const rutaDoc = await getDoc(doc(db, 'Rutas', rutaAsignadaId));
        if (rutaDoc.exists()) {
          setRutasAsignadas([{ id: rutaDoc.id, ...rutaDoc.data() }]);
        }
      }
    } catch (error) {
      console.error("Error obteniendo rutas asignadas:", error);
    }
  };

  // Función para actualizar la disponibilidad del guía
  const handleDisponibilidadChange = async (dia) => {
    const nuevaDisponibilidad = { ...disponibilidad, [dia]: !disponibilidad[dia] };
    setDisponibilidad(nuevaDisponibilidad);

    try {
      // Actualizar la disponibilidad del guía en Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), { disponibilidad: nuevaDisponibilidad });

      // Actualizar los días de salida en la ruta asignada
      if (rutasAsignadas.length > 0) {
        const rutaId = rutasAsignadas[0].id;
        const diasSalida = Object.keys(nuevaDisponibilidad).filter(d => nuevaDisponibilidad[d]);
        await updateDoc(doc(db, 'Rutas', rutaId), { diasSalida });
        console.log("Días de salida actualizados correctamente");
      }
    } catch (error) {
      console.error("Error actualizando disponibilidad o días de salida:", error);
    }
  };

  // Botones para usuario común
  const userButtons = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button 
        onClick={() => navigate('/mis-reservas')}
        className="bg-blue-200 text-blue-900 text-lg py-4 px-6 rounded-xl hover:bg-blue-300 transition-all duration-300"
      >
        Ver rutas agendadas
      </button>
      <button 
        onClick={handleEditProfile}
        className="bg-blue-200 text-blue-900 text-lg py-4 px-6 rounded-xl hover:bg-blue-300 transition-all duration-300"
      >
        Editar Perfil
      </button>
      <button 
        onClick={() => navigate('/foro')}
        className="bg-blue-200 text-blue-900 text-lg py-4 px-6 rounded-xl md:col-span-2 hover:bg-blue-300 transition-all duration-300"
      >
        Interactuar en el foro
      </button>
    </div>
  );

  // Botones para guía
  const guideButtons = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button 
        onClick={fetchRutasAsignadas}
        className="bg-green-200 text-green-900 text-lg py-4 px-6 rounded-xl hover:bg-green-300 transition-all duration-300"
      >
        Ver rutas asignadas
      </button>
      <button 
        onClick={handleEditProfile}
        className="bg-green-200 text-green-900 text-lg py-4 px-6 rounded-xl hover:bg-green-300 transition-all duration-300"
      >
        Editar Perfil
      </button>
    </div>
  );

  // Botones para admin
  const adminButtons = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button 
        onClick={() => navigate('/gestion-guias')}
        className="bg-red-200 text-red-900 text-lg py-4 px-6 rounded-xl hover:bg-red-300 transition-all duration-300"
      >
        Gestionar guías
      </button>
      <button 
        onClick={() => navigate('/gestion-rutas')}
        className="bg-red-200 text-red-900 text-lg py-4 px-6 rounded-xl hover:bg-red-300 transition-all duration-300"
      >
        Modificar rutas
      </button>
      <button 
        onClick={() => navigate('/mis-reservas')}
        className="bg-red-200 text-red-900 text-lg py-4 px-6 rounded-xl hover:bg-red-300 transition-all duration-300"
      >
        Ver rutas agendadas
      </button>
      <button 
        onClick={handleEditProfile}
        className="bg-red-200 text-red-900 text-lg py-4 px-6 rounded-xl md:col-span-2 hover:bg-red-300 transition-all duration-300"
      >
        Editar Perfil
      </button>
    </div>
  );

  // Determinar texto del título según rol
  const getRoleTitle = () => {
    switch(userRole) {
      case 'admin': return 'Panel Administrativo';
      case 'guide': return 'Panel de Guía';
      default: return 'Bienvenido';
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        isMobile={isMobile}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <div className="bg-[#feae4b] min-h-[90vh] pt-12 pb-24">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight">
                  {getRoleTitle()}, 
                  <span className="block mt-2">{currentUser?.displayName || 'Usuario'}</span>
                </h1>
                <p className="text-white text-xl lg:text-2xl mt-4">
                  {userRole === 'admin' 
                    ? 'Herramientas de gestión' 
                    : userRole === 'guide'
                    ? 'Gestión de rutas asignadas'
                    : '¿Qué acción deseas realizar?'}
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-2xl">
                {userRole === 'admin' 
                  ? adminButtons 
                  : userRole === 'guide'
                  ? guideButtons
                  : userButtons}
              </div>

              {/* Mostrar rutas asignadas */}
              {userRole === 'guide' && rutasAsignadas.length > 0 && (
                <div className="bg-white p-8 rounded-xl shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">Rutas Asignadas</h3>
                  <ul>
                    {rutasAsignadas.map(ruta => (
                      <li key={ruta.id} className="text-lg mb-2">
                        {ruta.nombre} ▹ Salidas: {ruta.diasSalida?.join(', ') || 'No definido'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mostrar y ajustar disponibilidad */}
              {userRole === 'guide' && (
                <div className="bg-white p-8 rounded-xl shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">Disponibilidad</h3>
                  <div className="space-y-4">
                    {Object.keys(disponibilidad).map((dia) => (
                      <label key={dia} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={disponibilidad[dia]} 
                          onChange={() => handleDisponibilidadChange(dia)} 
                          className="form-checkbox h-5 w-5 text-green-500"
                        />
                        <span className="text-lg capitalize">{dia}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="text-center space-y-8">
                <div className="relative">
                  <img 
                    src={currentUser?.photoURL || defaultImage}
                    alt="Perfil de usuario" 
                    className="rounded-full w-48 h-48 lg:w-64 lg:h-64 mx-auto border-6 border-white shadow-2xl object-cover"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = defaultImage;
                    }}
                  />
                  <p className="text-white text-2xl lg:text-3xl font-medium mt-6">
                    {currentUser?.displayName || 'Usuario'}
                    {userRole === 'admin' && (
                      <span className="block text-sm text-yellow-300 mt-2">
                        (Administrador)
                      </span>
                    )}
                    {userRole === 'guide' && (
                      <span className="block text-sm text-green-300 mt-2">
                        (Guía certificado)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

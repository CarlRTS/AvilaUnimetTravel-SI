import React, { useState, useEffect } from 'react';
import Header from './components/header';
import { useAuth } from './AuthContext'; // Importa el contexto de autenticación

export default function MiPerfil() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { currentUser } = useAuth(); // Obtiene el usuario actual

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // URL de imagen por defecto
  const defaultImage = 'https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila//images-removebg-preview.png';

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
                  Bienvenido, {currentUser?.displayName || 'Usuario'}
                </h1>
                <p className="text-white text-xl lg:text-2xl mt-4">
                  ¿Qué acción deseas realizar?
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button className="bg-blue-200 text-blue-900 text-lg py-4 px-6 rounded-xl hover:bg-blue-300 transition-all duration-300">
                    Editar foto de Perfil
                  </button>
                  <button className="bg-blue-200 text-blue-900 text-lg py-4 px-6 rounded-xl hover:bg-blue-300 transition-all duration-300">
                    Ver rutas agendadas
                  </button>
                  <button className="bg-blue-200 text-blue-900 text-lg py-4 px-6 rounded-xl md:col-span-2 hover:bg-blue-300 transition-all duration-300">
                    Interactuar en el foro
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="text-center space-y-8">
                <div className="relative">
                  <img 
                    src={currentUser?.photoURL || defaultImage}
                    alt="Perfil de usuario" 
                    className="rounded-full w-48 h-48 lg:w-64 lg:h-64 mx-auto border-6 border-white shadow-2xl"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = defaultImage;
                    }}
                  />
                  <p className="text-white text-2xl lg:text-3xl font-medium mt-6">
                    {currentUser?.displayName || 'Usuario'}
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
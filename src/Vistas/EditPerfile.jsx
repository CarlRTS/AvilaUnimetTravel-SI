import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/FireBase'; 
import Header from './components/header';

export default function EditarPerfil() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState(currentUser?.displayName || '');
  const [fotoURL, setFotoURL] = useState(currentUser?.photoURL || '');
  const [mensaje, setMensaje] = useState('');

  // Función para actualizar el perfil
  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    try {
      // Actualizar el perfil en Firebase Auth
      await updateProfile(currentUser, {
        displayName: nombre,
        photoURL: fotoURL,
      });

      // Actualizar el perfil en Firestore (si es necesario)
      const userDoc = doc(db, 'users', currentUser.uid);
      await updateDoc(userDoc, {
        displayName: nombre,
        photoURL: fotoURL,
      });

      setMensaje('Perfil actualizado correctamente.');
      setTimeout(() => navigate('/mi-perfil'), 2000); // Redirigir después de 2 segundos
    } catch (error) {
      setMensaje('Error al actualizar el perfil: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#feae4b]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-white text-4xl font-bold mb-8">Editar Perfil</h1>
        <form onSubmit={handleGuardarCambios} className="bg-white p-8 rounded-xl shadow-2xl">
          <div className="space-y-6">
            {/* Campo para el nombre */}
            <div>
              <label className="block text-gray-700 text-lg font-medium mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Ingresa tu nombre"
                required
              />
            </div>

            {/* Campo para la foto de perfil */}
            <div>
              <label className="block text-gray-700 text-lg font-medium mb-2">
                Foto de Perfil (URL)
              </label>
              <input
                type="url"
                value={fotoURL}
                onChange={(e) => setFotoURL(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Ingresa la URL de tu foto"
              />
              {fotoURL && (
                <div className="mt-4">
                  <img
                    src={fotoURL}
                    alt="Vista previa de la foto de perfil"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Mensaje de estado */}
            {mensaje && (
              <div className="mt-4 p-4 rounded-lg bg-blue-100 text-blue-700">
                {mensaje}
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/mi-perfil')}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
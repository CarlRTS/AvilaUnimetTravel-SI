import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/FireBase';
import { uploadImage } from "../Firebase/SupabaseClient";
import Header from './components/header';

export default function EditarPerfil() {
  const { currentUser, reloadUser } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [fotoURL, setFotoURL] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setNombre(currentUser.displayName || '');
    setFotoURL(currentUser.photoURL || '');
  }, [currentUser, navigate]);

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    if (isSubmitting || !currentUser) return;
    
    setIsSubmitting(true);

    try {
      let newFotoURL = fotoURL;

      if (file) {
        newFotoURL = await uploadImage(
          file,
          'profileimages',
          `users/${currentUser.uid}/perfil`
        );
      }

      // Obtener usuario actualizado después de reload
      const updatedUser = await reloadUser();
      
      // Usar el usuario actualizado para todas las operaciones
      await updatedUser.getIdToken(true);
      
      await updateProfile(updatedUser, {
        displayName: nombre,
        photoURL: newFotoURL,
      });

      const userDoc = doc(db, 'users', updatedUser.uid);
      await updateDoc(userDoc, {
        displayName: nombre,
        photoURL: newFotoURL,
      });

      // Forzar actualización del contexto
      await reloadUser();
      
      // Resetear estados
      setMensaje('¡Cambios guardados correctamente!');
      setFile(null);
      setTimeout(() => navigate('/mi-perfil'), 1500);
    } catch (error) {
      setMensaje(`Error: ${error.message}`);
      console.error('Error detallado:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMensaje('Solo se permiten archivos de imagen');
      return;
    }

    setFile(file);
    setFotoURL(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-[#feae4b]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-white text-4xl font-bold mb-8">Editar Perfil</h1>
        <form onSubmit={handleGuardarCambios} className="bg-white p-8 rounded-xl shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 text-lg font-medium mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-lg font-medium mb-2">
                Foto de Perfil
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                  <span>Seleccionar imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {fotoURL && (
                  <img
                    src={fotoURL}
                    alt="Vista previa"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">Formatos soportados: JPG, PNG, GIF</p>
            </div>

            {mensaje && (
              <div className={`p-4 rounded-lg ${mensaje.startsWith('¡') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {mensaje}
              </div>
            )}

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
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
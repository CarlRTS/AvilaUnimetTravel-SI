import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/FireBase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Header from './components/header';
import Footer from './components/Footer';
import { useAuth } from './AuthContext';

export default function GestionRutas() {
  const { userRole } = useAuth();
  const [rutas, setRutas] = useState([]);
  const [nuevaRuta, setNuevaRuta] = useState({
    nombre: '',
    descripcion: '',
    dificultad: 'media',
    direccion: '',
    duracion: '',
    imagen: '',
    mapaImagen: '',
    puntosInteres: [],
    grupoMinimo: 4,
    cupoMaximo: 10,
    diasSalida: [3, 6],
    precio: 0,
    habilitada: true // Nuevo campo para deshabilitar rutas
  });
  const [edicionRuta, setEdicionRuta] = useState(null);

  useEffect(() => {
    const cargarRutas = async () => {
      if (userRole === 'admin') {
        const querySnapshot = await getDocs(collection(db, 'Rutas'));
        const rutasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRutas(rutasData);
      }
    };
    cargarRutas();
  }, [userRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaRuta(prev => ({
      ...prev,
      [name]: name === 'puntosInteres' ? value.split(',').map(item => item.trim()) : value
    }));
  };

  const agregarRuta = async () => {
    if (userRole === 'admin') {
      try {
        const docRef = await addDoc(collection(db, 'Rutas'), nuevaRuta);
        setRutas([...rutas, { id: docRef.id, ...nuevaRuta }]);
        setNuevaRuta({
          nombre: '',
          descripcion: '',
          dificultad: 'media',
          direccion: '',
          duracion: '',
          imagen: '',
          mapaImagen: '',
          puntosInteres: [],
          grupoMinimo: 4,
          cupoMaximo: 10,
          diasSalida: [3, 6],
          precio: 0,
          habilitada: true
        });
      } catch (error) {
        console.error('Error agregando ruta:', error);
      }
    }
  };

  const eliminarRuta = async (id) => {
    if (userRole === 'admin') {
      try {
        await deleteDoc(doc(db, 'Rutas', id));
        setRutas(rutas.filter(ruta => ruta.id !== id));
      } catch (error) {
        console.error('Error eliminando ruta:', error);
      }
    }
  };

  const deshabilitarRuta = async (id) => {
    if (userRole === 'admin') {
      try {
        const ruta = rutas.find(ruta => ruta.id === id);
        await updateDoc(doc(db, 'Rutas', id), {
          habilitada: !ruta.habilitada
        });
        setRutas(rutas.map(ruta => 
          ruta.id === id ? { ...ruta, habilitada: !ruta.habilitada } : ruta
        ));
      } catch (error) {
        console.error('Error deshabilitando ruta:', error);
      }
    }
  };

  const iniciarEdicion = (ruta) => {
    setEdicionRuta(ruta);
    setNuevaRuta({
      ...ruta,
      puntosInteres: ruta.puntosInteres.join(', ')
    });
  };

  const actualizarRuta = async () => {
    if (userRole === 'admin' && edicionRuta) {
      try {
        const rutaActualizada = {
          ...nuevaRuta,
          puntosInteres: nuevaRuta.puntosInteres.split(',').map(item => item.trim())
        };
        await updateDoc(doc(db, 'Rutas', edicionRuta.id), rutaActualizada);
        setRutas(rutas.map(ruta => 
          ruta.id === edicionRuta.id ? { ...ruta, ...rutaActualizada } : ruta
        ));
        setEdicionRuta(null);
        setNuevaRuta({
          nombre: '',
          descripcion: '',
          dificultad: 'media',
          direccion: '',
          duracion: '',
          imagen: '',
          mapaImagen: '',
          puntosInteres: [],
          grupoMinimo: 4,
          cupoMaximo: 10,
          diasSalida: [3, 6],
          precio: 0,
          habilitada: true
        });
      } catch (error) {
        console.error('Error actualizando ruta:', error);
      }
    }
  };

  if (userRole !== 'admin') {
    return <p>No tienes permisos para acceder a esta página.</p>;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Gestión de Rutas</h1>

        {/* Formulario */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {edicionRuta ? 'Editar Ruta' : 'Añadir Nueva Ruta'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre de la ruta"
              className="border p-2 rounded w-full"
              value={nuevaRuta.nombre}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="direccion"
              placeholder="URL de Google Maps"
              className="border p-2 rounded w-full"
              value={nuevaRuta.direccion}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="duracion"
              placeholder="Duración"
              className="border p-2 rounded w-full"
              value={nuevaRuta.duracion}
              onChange={handleInputChange}
            />
            <select
              name="dificultad"
              className="border p-2 rounded w-full"
              value={nuevaRuta.dificultad}
              onChange={handleInputChange}
            >
              <option value="Principiante">Principiante</option>
              <option value="Intermedia">Intermedia</option>
              <option value="Avanzada">Avanzada</option>
            </select>
            <input
              type="text"
              name="imagen"
              placeholder="URL imagen"
              className="border p-2 rounded w-full"
              value={nuevaRuta.imagen}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="mapaImagen"
              placeholder="URL mapa"
              className="border p-2 rounded w-full"
              value={nuevaRuta.mapaImagen}
              onChange={handleInputChange}
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              className="border p-2 rounded w-full md:col-span-2"
              value={nuevaRuta.descripcion}
              onChange={handleInputChange}
              rows="4"
            />
            <input
              type="text"
              name="puntosInteres"
              placeholder="Puntos de interés (separados por comas)"
              className="border p-2 rounded w-full md:col-span-2"
              value={nuevaRuta.puntosInteres}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="grupoMinimo"
              placeholder="Grupo mínimo"
              className="border p-2 rounded w-full"
              value={nuevaRuta.grupoMinimo}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="cupoMaximo"
              placeholder="Cupo máximo"
              className="border p-2 rounded w-full"
              value={nuevaRuta.cupoMaximo}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="precio"
              placeholder="Precio"
              className="border p-2 rounded w-full"
              value={nuevaRuta.precio}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-4">
            {edicionRuta ? (
              <>
                <button
                  onClick={actualizarRuta}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setEdicionRuta(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={agregarRuta}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Añadir Ruta
              </button>
            )}
          </div>
        </div>

        {/* Listado de Rutas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rutas.map(ruta => (
            <div key={ruta.id} className="bg-white p-4 rounded-xl shadow-md">
              <div className="relative h-48 mb-4">
                <img
                  src={ruta.imagen}
                  alt={ruta.nombre}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="font-bold text-lg mb-2">{ruta.nombre}</h3>
              <p className="text-gray-600 text-sm mb-4">{ruta.descripcion}</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => iniciarEdicion(ruta)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => eliminarRuta(ruta.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                  <button
                    onClick={() => deshabilitarRuta(ruta.id)}
                    className={`${
                      ruta.habilitada ? 'bg-yellow-500' : 'bg-gray-500'
                    } text-white p-2 rounded hover:bg-yellow-600`}
                  >
                    {ruta.habilitada ? '🚫' : '✅'}
                  </button>
                </div>
                <span className={`text-sm ${
                  ruta.habilitada ? 'text-green-500' : 'text-red-500'
                }`}>
                  {ruta.habilitada ? 'Habilitada' : 'Deshabilitada'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
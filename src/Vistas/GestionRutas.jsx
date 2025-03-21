import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/FireBase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Header from './components/header';
import Footer from './components/Footer';
import { useAuth } from './AuthContext';

export default function GestionRutas() {
  const { userRole } = useAuth();
  const [rutas, setRutas] = useState([]);
  const [errores, setErrores] = useState({});
  const [nuevaRuta, setNuevaRuta] = useState({
    nombre: '',
    descripcion: '',
    dificultad: 'media',
    direccion: '',
    duracion: '',
    imagen: '',
    mapaImagen: '',
    puntosInteres: '',
    grupoMinimo: 4,
    cupoMaximo: 10,
    diasSalida: [3, 6],
    precio: 0,
    habilitada: true
  });
  const [edicionRuta, setEdicionRuta] = useState(null);

  const validarCampos = () => {
    const nuevosErrores = {};
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    const imagenRegex = /\.(jpeg|jpg|png|webp)$/i;

    // Validación nombre
    if (!nuevaRuta.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (nuevaRuta.nombre.length < 3) {
      nuevosErrores.nombre = "Mínimo 3 caracteres";
    }

    // Validación dirección (URL)
    if (!nuevaRuta.direccion.trim()) {
      nuevosErrores.direccion = "La URL del mapa es obligatoria";
    } else if (!urlRegex.test(nuevaRuta.direccion)) {
      nuevosErrores.direccion = "URL inválida";
    }

    // Validación duración
    if (!nuevaRuta.duracion.trim()) {
      nuevosErrores.duracion = "Duración obligatoria";
    }

    // Validación imagen
    if (!nuevaRuta.imagen.trim()) {
      nuevosErrores.imagen = "URL de imagen obligatoria";
    } else if (!urlRegex.test(nuevaRuta.imagen)) {
      nuevosErrores.imagen = "URL inválida";
    } else if (!imagenRegex.test(nuevaRuta.imagen)) {
      nuevosErrores.imagen = "Formato no válido (jpeg, jpg, png, webp)";
    }

    // Validación mapaImagen
    if (!nuevaRuta.mapaImagen.trim()) {
      nuevosErrores.mapaImagen = "URL del mapa obligatoria";
    } else if (!urlRegex.test(nuevaRuta.mapaImagen)) {
      nuevosErrores.mapaImagen = "URL inválida";
    } else if (!imagenRegex.test(nuevaRuta.mapaImagen)) {
      nuevosErrores.mapaImagen = "Formato no válido (jpeg, jpg, png, webp)";
    }

    // Validación descripción
    if (!nuevaRuta.descripcion.trim()) {
      nuevosErrores.descripcion = "Descripción obligatoria";
    } else if (nuevaRuta.descripcion.length < 50) {
      nuevosErrores.descripcion = "Mínimo 50 caracteres";
    }

    // Validación puntos de interés
    const puntos = nuevaRuta.puntosInteres.split(',').filter(p => p.trim());
    if (puntos.length === 0) {
      nuevosErrores.puntosInteres = "Al menos un punto de interés";
    }

    // Validación grupo mínimo
    if (nuevaRuta.grupoMinimo < 1) {
      nuevosErrores.grupoMinimo = "Mínimo 1 persona";
    } else if (nuevaRuta.grupoMinimo > nuevaRuta.cupoMaximo) {
      nuevosErrores.grupoMinimo = "No puede superar el cupo máximo";
    }

    // Validación cupo máximo
    if (nuevaRuta.cupoMaximo < nuevaRuta.grupoMinimo) {
      nuevosErrores.cupoMaximo = "Debe ser mayor al grupo mínimo";
    }

    // Validación precio
    if (nuevaRuta.precio < 0) {
      nuevosErrores.precio = "El precio no puede ser negativo";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  useEffect(() => {
    const cargarRutas = async () => {
      if (userRole === 'admin') {
        const querySnapshot = await getDocs(collection(db, 'Rutas'));
        const rutasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          habilitada: doc.data().habilitada ?? true,
          ...doc.data()
        }));
        setRutas(rutasData);
      }
    };
    cargarRutas();
  }, [userRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (['grupoMinimo', 'cupoMaximo', 'precio'].includes(name)) {
      parsedValue = value === '' ? 0 : Number(value);
    }

    setNuevaRuta(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const agregarRuta = async () => {
    if (userRole === 'admin' && validarCampos()) {
      try {
        const rutaParaGuardar = {
          ...nuevaRuta,
          puntosInteres: nuevaRuta.puntosInteres.split(',').map(item => item.trim())
        };
        
        const docRef = await addDoc(collection(db, 'Rutas'), rutaParaGuardar);
        setRutas([...rutas, { id: docRef.id, ...rutaParaGuardar }]);
        
        setNuevaRuta({
          nombre: '',
          descripcion: '',
          dificultad: 'media',
          direccion: '',
          duracion: '',
          imagen: '',
          mapaImagen: '',
          puntosInteres: '',
          grupoMinimo: 4,
          cupoMaximo: 10,
          diasSalida: [3, 6],
          precio: 0,
          habilitada: true
        });
        setErrores({});
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
        const nuevoEstado = !ruta.habilitada;
        
        await updateDoc(doc(db, 'Rutas', id), {
          habilitada: nuevoEstado
        });
        
        setRutas(rutas.map(ruta => 
          ruta.id === id ? { ...ruta, habilitada: nuevoEstado } : ruta
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
    if (userRole === 'admin' && edicionRuta && validarCampos()) {
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
          puntosInteres: '',
          grupoMinimo: 4,
          cupoMaximo: 10,
          diasSalida: [3, 6],
          precio: 0,
          habilitada: true
        });
        setErrores({});
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
            <div>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre de la ruta"
                className="border p-2 rounded w-full"
                value={nuevaRuta.nombre}
                onChange={handleInputChange}
              />
              {errores.nombre && <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>}
            </div>

            <div>
              <input
                type="text"
                name="direccion"
                placeholder="URL de Google Maps"
                className="border p-2 rounded w-full"
                value={nuevaRuta.direccion}
                onChange={handleInputChange}
              />
              {errores.direccion && <p className="text-red-500 text-sm mt-1">{errores.direccion}</p>}
            </div>

            <div>
              <input
                type="text"
                name="duracion"
                placeholder="Duración"
                className="border p-2 rounded w-full"
                value={nuevaRuta.duracion}
                onChange={handleInputChange}
              />
              {errores.duracion && <p className="text-red-500 text-sm mt-1">{errores.duracion}</p>}
            </div>

            <div>
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
            </div>

            <div>
              <input
                type="text"
                name="imagen"
                placeholder="URL imagen"
                className="border p-2 rounded w-full"
                value={nuevaRuta.imagen}
                onChange={handleInputChange}
              />
              {errores.imagen && <p className="text-red-500 text-sm mt-1">{errores.imagen}</p>}
            </div>

            <div>
              <input
                type="text"
                name="mapaImagen"
                placeholder="URL mapa"
                className="border p-2 rounded w-full"
                value={nuevaRuta.mapaImagen}
                onChange={handleInputChange}
              />
              {errores.mapaImagen && <p className="text-red-500 text-sm mt-1">{errores.mapaImagen}</p>}
            </div>

            <div className="md:col-span-2">
              <textarea
                name="descripcion"
                placeholder="Descripción"
                className="border p-2 rounded w-full"
                value={nuevaRuta.descripcion}
                onChange={handleInputChange}
                rows="4"
              />
              {errores.descripcion && <p className="text-red-500 text-sm mt-1">{errores.descripcion}</p>}
            </div>

            <div className="md:col-span-2">
              <input
                type="text"
                name="puntosInteres"
                placeholder="Puntos de interés (separados por comas)"
                className="border p-2 rounded w-full"
                value={nuevaRuta.puntosInteres}
                onChange={handleInputChange}
              />
              {errores.puntosInteres && <p className="text-red-500 text-sm mt-1">{errores.puntosInteres}</p>}
            </div>

            <div>
              <input
                type="number"
                name="grupoMinimo"
                placeholder="Grupo mínimo"
                className="border p-2 rounded w-full"
                value={nuevaRuta.grupoMinimo}
                onChange={handleInputChange}
                min="1"
              />
              {errores.grupoMinimo && <p className="text-red-500 text-sm mt-1">{errores.grupoMinimo}</p>}
            </div>

            <div>
              <input
                type="number"
                name="cupoMaximo"
                placeholder="Cupo máximo"
                className="border p-2 rounded w-full"
                value={nuevaRuta.cupoMaximo}
                onChange={handleInputChange}
                min={nuevaRuta.grupoMinimo || 1}
              />
              {errores.cupoMaximo && <p className="text-red-500 text-sm mt-1">{errores.cupoMaximo}</p>}
            </div>

            <div>
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                className="border p-2 rounded w-full"
                value={nuevaRuta.precio}
                onChange={handleInputChange}
                min="0"
              />
              {errores.precio && <p className="text-red-500 text-sm mt-1">{errores.precio}</p>}
            </div>
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
                  onClick={() => {
                    setEdicionRuta(null);
                    setErrores({});
                  }}
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
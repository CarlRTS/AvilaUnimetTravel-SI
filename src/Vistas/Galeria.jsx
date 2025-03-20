import React, { useState } from "react";
import Header from "./components/header";
import Footer from "./components/Footer";
import { useAuth } from "./AuthContext"; // Importa el hook useAuth

const Galeria = () => {
    const [photos, setPhotos] = useState([]); // Estado para almacenar las fotos
    const [selectedPhoto, setSelectedPhoto] = useState(null); // Estado para la foto seleccionada
    const { currentUser, userRole } = useAuth(); // Obtén el usuario actual y su rol
  
    // Función para agregar una foto
    const handleAddPhoto = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos([...photos, reader.result]); // Agrega la nueva foto al estado
        };
        reader.readAsDataURL(file); // Convierte la imagen a una URL base64
      } else {
        alert("Por favor, selecciona un archivo de imagen válido."); // Mensaje de error
      }
    };
  
    // Función para eliminar una foto
    const handleDeletePhoto = (index) => {
      const newPhotos = photos.filter((_, i) => i !== index); // Filtra la foto a eliminar
      setPhotos(newPhotos); // Actualiza el estado
    };
  
    // Función para abrir la foto en un modal
    const openPhoto = (photo) => {
      setSelectedPhoto(photo);
    };
  
    // Función para cerrar el modal
    const closePhoto = () => {
      setSelectedPhoto(null);
    };
  
    // Verifica si el usuario es administrador
    const isAdmin = userRole === "admin";
  
    return (
      <div>
        {/* Header */}
        <Header />
  
        {/* Contenido de la galería */}
        <div className="galeria-container">
          <h1 className="galeria-titulo">Galería Hiking</h1>
          <div className="galeria-grid">
            {photos.map((photo, index) => (
              <div key={index} className="photo-container">
                <img
                  src={photo}
                  alt={`Foto ${index}`}
                  className="photo"
                  onClick={() => openPhoto(photo)} // Abre la foto al hacer clic
                />
                {/* Botón de eliminar (solo visible para admin) */}
                {isAdmin && (
                  <button
                    onClick={() => handleDeletePhoto(index)}
                    className="delete-button"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
          </div>
          {/* Botón de agregar foto (solo visible para admin) */}
          {isAdmin && (
            <div className="add-button-container">
              <label htmlFor="file-input" className="add-button">
                Agregar Foto
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAddPhoto}
              />
            </div>
          )}
        </div>
  
        {/* Modal para ver la foto */}
        {selectedPhoto && (
          <div className="modal" onClick={closePhoto}>
            <div className="modal-content">
              <img src={selectedPhoto} alt="Foto seleccionada" />
            </div>
          </div>
        )}
  
        {/* Footer */}
        <Footer />
      </div>
    );
  };
  
  export default Galeria;
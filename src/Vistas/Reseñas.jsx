import React, { useState, useEffect } from "react";
import Header from "./components/header";
import Footer from "./components/Footer";
import db from "../Firebase/FireBase"; // Configuración de Firebase
import { collection, addDoc, getDocs } from "firebase/firestore";

function HikingTrailReviews() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(""); // Nueva variable para la ruta seleccionada

  // Obtener reseñas desde Firestore
  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsCollection = collection(db, "reviews");
      const reviewSnapshot = await getDocs(reviewsCollection);
      const reviewList = reviewSnapshot.docs.map((doc) => doc.data());
      setReviews(reviewList);
    };

    fetchReviews();
  }, []);

  // Añadir una reseña a Firestore
  const addReview = async () => {
    if (
      newReview.trim() !== "" &&
      userName.trim() !== "" &&
      selectedRoute.trim() !== ""
    ) {
      try {
        await addDoc(collection(db, "reviews"), {
          userName: userName,
          route: selectedRoute, // Ruta seleccionada
          review: newReview,
          timestamp: new Date(),
        });
        setReviews([
          ...reviews,
          { userName, route: selectedRoute, review: newReview },
        ]);
        setNewReview("");
        setUserName("");
        setSelectedRoute("");
      } catch (error) {
        console.error("Error añadiendo reseña: ", error);
      }
    }
  };

  return (
    
    <div>
      <Header />
      <div className="reseña-container">
      
      <h1 className="reseñatitulo">Reseñas Avila Hiking</h1>
      <p className="parrafo-reseña">
        ¡Comparte tus experiencias sobre las rutas de excursionismo y ayuda a
        otros a elegir sus próximas aventuras!
      </p>
      <input
        type="text"
        className="nombre-usuario"
        placeholder="Tu nombre"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "10px",
          padding: "10px",
          fontSize: "16px",
        }}
      />
      <select
        className="ruta-select"
        value={selectedRoute}
        onChange={(e) => setSelectedRoute(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "10px",
          padding: "10px",
          fontSize: "16px",
        }}
      >
        <option value="">Selecciona una ruta</option>
        <option value="Cortafuegos">Cortafuegos</option>
        <option value="Pico Humbolt">Pico Humbolt</option>
        <option value="La Julia">La Julia</option>
        <option value="Lagunazo">Lagunazo</option>
      </select>
      <textarea
        className="comentarios-reseñas"
        style={{
          width: "100%",
          height: "100px",
          marginBottom: "10px",
          padding: "10px",
          fontSize: "16px",
        }}
        placeholder="Escribe tu reseña aquí..."
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
      ></textarea>
      <button
        className="boton-reseña"
        onClick={addReview}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Añadir Reseña
      </button>
      <h2 className="reseñas2">Reseñas:</h2>
      <ul className="ul-reseña" style={{ listStyleType: "none", padding: "0" }}>
        {reviews.map((review, index) => (
          <li
            className="li-reseña"
            key={index}
            style={{
              backgroundColor: "#f8f8f8",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <strong>{review.userName} - {review.route}:</strong> {review.review}
          </li>
        ))}
      </ul>
      <Footer />
    </div>
    </div>
    
  );
}

export default HikingTrailReviews;
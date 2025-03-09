import React, { useState } from 'react';
import Header from './components/header';
import Footer from './components/Footer';
import { signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase/FireBase"; // Colocar tu ruta del proyecto hacia la carpera de firebase, si te sale error coloca el cursor arriba y copia la ruta :)
import { Link } from 'react-router-dom';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Función para iniciar sesión con correo y contraseña
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuario logueado:", user);
      alert("¡Inicio de sesión exitoso!");
    } catch (error) {
      console.error("Error en el inicio de sesión:", error.message);
      setError("Correo electrónico o contraseña incorrectos.");
    }
  };

  //Inicar sesion con tu cuenta de google 
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuario logueado con Google:", user);
      alert("¡Inicio de sesión con Google exitoso!");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
      setError("Error al iniciar sesión con Google.");
    }
  };

  // Iniciar sesion con tu cuenta de facebook(no funciona)
  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuario logueado con Facebook:", user);
      alert("¡Inicio de sesión con Facebook exitoso!");
    } catch (error) {
      console.error("Error al iniciar sesión con Facebook:", error.message);
      setError("Error al iniciar sesión con Facebook.");
    }
  };
  //html del login
  return (
    <div className="login-container" 
    >
      <Header />
      <style>
        display: grid
        margin: auto
        place-items: center

      </style>
      <form className="formulario" onSubmit={handleLogin}>
  
        <h2 className="crear-cuenta">Iniciar sesión</h2>
        <div className="iconos">
          {/* Botón para iniciar sesión con Google */}
          <div className="borde-iconos" onClick={handleGoogleLogin}>
            <img src="public/Imagenes/Google.png" alt="Google" />
          </div>
          {/* Botón para iniciar sesión con Facebook */}
          <div className="borde-iconos" onClick={handleFacebookLogin}>
            <img src="public/Imagenes/Facebook.png" alt="Facebook" />
          </div>
        </div>
        <p className="cuenta-gratis">Sé parte de la experiencia</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input type="submit" value="Iniciar Sesión" />
        <p className='accion'>¿No estás registrado?</p>
        <p className='Registro'>Haz click aquí para registrarte
        
        </p>
      </form>
      <Footer />
    </div>
  );
}
import React, { useState } from 'react';
import Header from './components/header';
import Footer from './components/Footer';
import { 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup 
} from "firebase/auth";
import { auth } from "../Firebase/FireBase";
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Expresión regular para validar emails
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEmailError("");

    // Validación de email antes de enviar a Firebase
    if (!validateEmail(email)) {
      setEmailError("Formato de email inválido");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("¡Inicio de sesión exitoso!");
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setEmailError('Formato de email inválido');
      } else {
        setError(getFirebaseError(error.code));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError("");
    setEmailError("");

    try {
      await signInWithPopup(auth, provider);
      alert("¡Inicio de sesión exitoso!");
    } catch (error) {
      setError(getFirebaseError(error.code));
    } finally {
      setLoading(false);
    }
  };

  const iniciarGoogle = () => handleSocialLogin(new GoogleAuthProvider());
  const iniciarFacebook = () => handleSocialLogin(new FacebookAuthProvider());

  const getFirebaseError = (errorCode) => {
    switch(errorCode) {
      case 'auth/user-not-found': 
        return 'Usuario no registrado';
      case 'auth/wrong-password': 
        return 'Contraseña incorrecta';
      case 'auth/invalid-email': 
        return 'Formato de email inválido';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta más tarde';
      default: 
        return 'Error en la autenticación';
    }
  };

  return (
    <div className="login-container">
    <Header />
    
    {/* Contenedor principal */}
    <div className="contenedor-principal">
      {/* Sección del formulario */}
      <form className="formulario" onSubmit={handleLogin}>
        <h2 className="crear-cuenta">Iniciar sesión</h2>
        
        <div className="iconos">
          <div 
            className="borde-iconos" 
            onClick={iniciarGoogle}
            role="button"
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            <img src="/Imagenes/Google.png" alt="Google" />
          </div>
          
          <div 
            className="borde-iconos" 
            onClick={iniciarFacebook}
            role="button"
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            <img src="/Imagenes/Facebook.png" alt="Facebook" />
          </div>
        </div>

        <p className="cuenta-gratis">Sé parte de la experiencia</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (e.target.value && !validateEmail(e.target.value)) {
              setEmailError('Formato de email inválido');
            } else {
              setEmailError('');
            }
          }}
          disabled={loading}
          className={emailError ? 'input-error' : ''}
        />
        {emailError && <p className="error-message">{emailError}</p>}

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button 
          type="submit" 
          className="boton-principal"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>

        {/* Nuevo bloque de registro */}
        <div className="registro-link">
          <span>¿No estás registrado?</span>
          <Link to="/registrar"> Haz click aquí para registrarte</Link>
        </div>
      </form>

      {/* Sección de imagen y texto */}
      <div className="seccion-derecha">
        <img 
          src="/Imagenes/Theavila.png" 
          alt="Ilustración" 
          className="imagen-login"
        />
        <div className="texto-informativo">
          <h3>¿Sabías que Ávila era un volcán extinto?</h3>
          <p>
          Aunque parezca sorprendente, 
          durante mucho tiempo se creyó que Ávila era un volcán inactivo. 
          Esto se debe a que en ocasiones se observaron emanaciones de humo y cenizas,
          especialmente en las zonas costeras cercanas. Sin embargo, 
          estudios geológicos más recientes han descartado esta teoría.
          </p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
);
}
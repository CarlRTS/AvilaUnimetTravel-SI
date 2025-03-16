import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/Footer';
import { signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "c:/Users/Sergio/Desktop/ProyectoSI/src/Firebase/FireBase"; // Colocar tu ruta del proyecto hacia la carpera de firebase, si te sale error coloca el cursor arriba y copia la ruta :)

export default function Login() {
  const navigate = useNavigate();
  const { currentUser, authloading} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirección si ya está autenticado
  useEffect(() => {
    // Solo redirige después de que Firebase termine de cargar el estado
    if (!authloading && currentUser) {
      navigate('/');
    }
  }, [currentUser, authloading, navigate]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Formato de email inválido");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error de autenticación:', error);
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
    } catch (error) {
      console.error('Error en autenticación social:', error);
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
      case 'auth/popup-closed-by-user':
        return 'Ventana cerrada por el usuario';
      case 'auth/account-exists-with-different-credential':
        return 'Cuenta ya existe con otro método';
      default: 
        return `Error de autenticación (${errorCode})`;
    }
  };

  return (
    <div className="login-container" 
    >
      <Header />
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
      </form>
      <Footer />
    </div>
  );
}
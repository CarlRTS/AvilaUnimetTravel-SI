import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from './AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { currentUser, authloading} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
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
    <div className="min-h-screen" style={{ backgroundColor: '#feae4b' }}>
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Sección del formulario */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Iniciar Sesión</h2>
            
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Botones Sociales */}
              <div className="flex gap-4 justify-center mb-6">
                <button
                  type="button"
                  onClick={iniciarGoogle}
                  className="p-2 border-2 border-gray-200 rounded-full hover:border-orange-500 transition-colors"
                  disabled={loading}
                >
                  <img src="/Imagenes/Google.png" alt="Google" className="w-8 h-8" />
                </button>
                
                <button
                  type="button"
                  onClick={iniciarFacebook}
                  className="p-2 border-2 border-gray-200 rounded-full hover:border-orange-500 transition-colors"
                  disabled={loading}
                >
                  <img src="/Imagenes/Facebook.png" alt="Facebook" className="w-8 h-8" />
                </button>
              </div>

              <p className="text-center text-gray-600 mb-6">Sé parte de la experiencia</p>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(validateEmail(e.target.value) ? '' : 'Formato inválido');
                  }}
                  disabled={loading}
                />
                {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2.5 pr-10 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-orange-400 hover:text-orange-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit" 
                className="w-full bg-orange-600 text-white py-2.5 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-400"
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
              </button>

              <p className="text-center text-sm text-gray-600">
                ¿No estás registrado? {" "}
                <Link 
                  to="/registrar" 
                  className="text-orange-600 hover:underline font-medium"
                >
                  Regístrate aquí
                </Link>
              </p>
            </form>
          </div>

          {/* Sección gráfica */}
          <div 
            className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center"
            style={{ backgroundColor: '#feae4b33' }}
          >
            <img 
              src="https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila//Theavila.png" 
              alt="Cerro El Ávila"
              className="w-full max-w-xs mb-6"
            />
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                ¿Sabías que Ávila era un volcán extinto?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Aunque parezca sorprendente, durante mucho tiempo se creyó que Ávila era un volcán inactivo. 
                Esto se debe a que en ocasiones se observaron emanaciones de humo y cenizas,
                especialmente en las zonas costeras cercanas. Sin embargo, 
                estudios geológicos más recientes han descartado esta teoría.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
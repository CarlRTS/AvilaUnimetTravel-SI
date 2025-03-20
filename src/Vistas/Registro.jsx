import { useState, useEffect } from "react";
import { auth } from "../Firebase/FireBase";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/Footer';

export default function Registro() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [numeroTelefono, setNumeroTelefono] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { forceUpdate, currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) navigate('/');
    }, [currentUser, navigate]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.length === 11 && cleaned.startsWith('04');
  };

  const handlePhoneChange = (value) => {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      
      // Nuevo formateo infalible
      if (cleaned.length > 4) formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}`;
      if (cleaned.length > 7) formatted = `${formatted}-${cleaned.slice(7, 11)}`;
      
      // Permitir máximo 11 dígitos numéricos
      formatted = formatted.slice(0, 13); // 4 + 3 + 4 + 2 guiones = 13 caracteres
      
      setNumeroTelefono(formatted);
      
      // Validación en tiempo real mejorada
      if (cleaned.length > 0) {
          if (!cleaned.startsWith('04')) {
              setPhoneError('Debe comenzar con 04xx');
          } else if (cleaned.length < 11) {
              setPhoneError('Faltan dígitos (04xx-xxx-xxxx)');
          } else if (cleaned.length > 11) {
              setPhoneError('Máximo 11 dígitos');
          } else {
              setPhoneError('');
          }
      }
    };

    const confirmacionRegistro = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setEmailError("");
        setPhoneError("");

        if (!validateEmail(email)) {
            setEmailError("Formato de email inválido");
            setLoading(false);
            return;
        }

        if (!validatePhone(numeroTelefono)) {
            setPhoneError('Número inválido');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            await updateProfile(userCredential.user, {
                displayName: `${nombre} ${apellido}`,
                photoURL: "https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila/images-removebg-preview.png"
            });

            forceUpdate();
            navigate('/mi-perfil');
            
        } catch (error) {
            console.error('Error de registro:', error);
            setError(getFirebaseError(error.code));
        } finally {
            setLoading(false);
        }
    };

    const getFirebaseError = (errorCode) => {
        switch(errorCode) {
            case 'auth/email-already-in-use': 
                return 'El correo electrónico ya está en uso';
            case 'auth/invalid-email': 
                return 'Formato de email inválido';
            case 'auth/weak-password': 
                return 'La contraseña debe tener al menos 6 caracteres';
            case 'auth/too-many-requests':
                return 'Demasiados intentos fallidos. Intenta más tarde';
            default: 
                return `Error de registro (${errorCode})`;
        }
    };

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#feae4b' }}>
          <Header />
          
          <div className="container mx-auto px-4 py-12 max-w-6xl">
              <div className="bg-orange-100 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                  {/* Sección Formulario */}
                  <div className="w-full md:w-1/2 p-8">
                      <h2 className="text-3xl font-bold text-orange-800 mb-6">Registro</h2>
                      
                      <form onSubmit={confirmacionRegistro} className="space-y-5">
                          {/* Nombre */}
                          <div>
                              <label className="block text-sm font-medium text-orange-700 mb-1">
                                  Nombre
                              </label>
                              <input
                                  type="text"
                                  className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                  value={nombre}
                                  onChange={(e) => setNombre(e.target.value)}
                                  required
                                  disabled={loading}
                              />
                          </div>
  
                          {/* Apellido */}
                          <div>
                              <label className="block text-sm font-medium text-orange-700 mb-1">
                                  Apellido
                              </label>
                              <input
                                  type="text"
                                  className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                  value={apellido}
                                  onChange={(e) => setApellido(e.target.value)}
                                  required
                                  disabled={loading}
                              />
                          </div>
  
                          {/* Email */}
                          <div>
                              <label className="block text-sm font-medium text-orange-700 mb-1">
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
                                  required
                                  disabled={loading}
                              />
                              {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
                          </div>
  
                          {/* Teléfono */}
                          <div>
                              <label className="block text-sm font-medium text-orange-700 mb-1">
                                  Teléfono
                              </label>
                              <div className="relative">
                                  <input
                                      type="tel"
                                      className="w-full px-4 py-2.5 pr-10 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                      placeholder="0414-123-4567"
                                      value={numeroTelefono}
                                      onChange={(e) => handlePhoneChange(e.target.value)}
                                      required
                                      disabled={loading}
                                      maxLength={13}
                                  />
                                  <span className="absolute right-3 top-3.5 text-orange-400">
                                      📞
                                  </span>
                              </div>
                              {phoneError && <p className="mt-1 text-sm text-red-500">{phoneError}</p>}
                          </div>
  
                          {/* Contraseña */}
                          <div>
                              <label className="block text-sm font-medium text-orange-700 mb-1">
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
  
                          {/* Botón y errores */}
                          {error && <p className="text-sm text-red-500">{error}</p>}
                          
                          <button
                              type="submit"
                              className="w-full bg-orange-600 text-white py-2.5 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-400"
                              disabled={loading}
                          >
                              {loading ? 'Creando cuenta...' : 'Registrarse'}
                          </button>
  
                          {/* Enlace Login */}
                          <p className="text-center text-sm text-orange-700">
                              ¿Ya tienes cuenta? {" "}
                              <Link 
                                  to="/login" 
                                  className="text-orange-600 hover:underline font-medium"
                              >
                                  Inicia sesión aquí
                              </Link>
                          </p>
                      </form>
                  </div>
  
                  {/* Sección Ilustración */}
                  <div className="w-full md:w-1/2 bg-gradient-to-br from-orange-100 to-orange-200 p-8 flex flex-col items-center justify-center">
                      <img 
                          src="https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila//Theavila.png" 
                          alt="Cerro El Ávila"
                          className="w-full max-w-xs mb-6"
                      />
                      <div className="text-center">
                          <h3 className="text-2xl font-semibold text-orange-800 mb-3">
                              ¿Por qué Ávila?
                          </h3>
                          <p className="text-orange-700 leading-relaxed">
                              El nombre honra al Cerro El Ávila, símbolo natural de Caracas, 
                              denominado así por el Gobernador Gerónimo de Ávila, cuyos 
                              terrenos formaron parte de este icónico parque nacional.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
  
          <Footer />
      </div>
  );
}
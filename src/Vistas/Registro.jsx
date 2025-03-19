import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/Footer';
import { auth } from "../Firebase/FireBase";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth } from './AuthContext'; // Importa el contexto
import { Link } from 'react-router-dom';

export default function Registro() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [numeroTelefono, setNumeroTelefono] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { forceUpdate, currentUser } = useAuth(); // Obtén la función de actualización

    // Redirección si ya está autenticado
    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const confirmacionRegistro = async (e) => {
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
            // 1. Crear usuario
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // 2. Actualizar perfil
            await updateProfile(userCredential.user, {
                displayName: `${nombre} ${apellido}`, // Nombre completo
                photoURL: "https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila/images-removebg-preview.png"
            });

            // 3. Forzar actualización del contexto
            forceUpdate();

            // 4. Redirigir
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
        <div className="login-container">
            <Header />
            <div className="contenedor-principal">
                <form className="formulario" onSubmit={confirmacionRegistro}>
                    <h2 className="crear-cuenta">Registro</h2>
                    
                    <div>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (e.target.value && !validateEmail(e.target.value)) {
                                    setEmailError('Formato de email inválido');
                                } else {
                                    setEmailError('');
                                }
                            }}
                            required
                            disabled={loading}
                            className={emailError ? 'input-error' : ''}
                        />
                        {emailError && <p className="error-message">{emailError}</p>}
                    </div>

                    <div className="relative">
                        <input
                            type="tel"
                            placeholder="Número de teléfono"
                            value={numeroTelefono}
                            onChange={(e) => setNumeroTelefono(e.target.value)}
                            pattern="[0-9]{11}" // Validación para 10 dígitos
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                            📞
                        </span>
                    </div>

                    <div className="password-wrapper relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
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
                        {loading ? 'Cargando...' : 'Registrarse'}
                    </button>

                    <div className="registro-link">
                        <span>¿Ya tienes una cuenta?</span>
                        <Link to="/login"> Haz click aquí para iniciar sesión</Link>
                    </div>
                </form>

                <div className="seccion-derecha">
                    <img 
                        src="https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila//Theavila.png" 
                        alt="Ilustración" 
                        className="imagen-login"
                    />
                    <div className="texto-informativo">
                        <h3>¿Por qué el nombre Ávila?</h3>
                        <p>
                        El nombre Ávila se debe al apellido del Gobernador Gerónimo de Ávila, 
                        quien era dueño de unos huertos en la serranía que está a los pies del cerro.
                         A la muerte del Gobernador, sus hijos heredan sus tierras, y para este entonces
                        ya todos en Caracas la conocían como la sierra de los Ávila o el Cerro de Ávila.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
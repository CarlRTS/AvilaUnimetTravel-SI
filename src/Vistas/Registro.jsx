import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/Footer';
import { auth } from "../Firebase/FireBase";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth } from './AuthContext'; // Importa el contexto

export default function Registro() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { forceUpdate } = useAuth(); // Obtén la función de actualización

    const confirmacionRegistro = async (e) => {
        e.preventDefault();
        try {
            // 1. Crear usuario
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // 2. Actualizar perfil
            await updateProfile(userCredential.user, {
                displayName: nombre || email.split('@')[0], // Nombre obligatorio
                photoURL: "https://qaibprcdanrwecebxhqp.supabase.co/storage/v1/object/public/avila/images-removebg-preview.png"
            });

            // 3. Forzar actualización del contexto
            forceUpdate();

            // 4. Redirigir
            navigate('/mi-perfil');
            
        } catch (error) {
            setError(error.message);
        } finally {
            setNombre("");
            setEmail("");
            setPassword("");
        }
    };

    return (
        <div>
            <Header />
            <div className="formulario">
                <h2 className="crear-cuenta">Registro</h2>
                <form onSubmit={confirmacionRegistro}>
                    <div>
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <button>Registrarse</button>
                        {error && <p className="error-message">{error}</p>}
                        <p className='accion'>Inicia sesión!</p>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}
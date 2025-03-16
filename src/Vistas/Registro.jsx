<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Añadir esto
import Header from './components/header';
import Footer from './components/Footer';
import { auth } from "../Firebase/FireBase";
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export default function Registro() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Obtener la función de navegación

    const confirmacionRegistro = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Limpiar formulario y redirigir
            setNombre("");
            setEmail("");
            setPassword("");
            await signOut(auth);
            navigate('/login'); // Redirección después de registro exitoso
            
        } catch (error) {
            setError(error.message);
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
=======
import React, { useState } from "react";
import Header from './components/header';
import AboutSection from './components/AboutSection';
import BenefitsSection from './components/BenefitsSection';
import Footer from './components/Footer';
import { Link } from 'react-router-dom';
import { auth } from "../Firebase/FireBase";
import {createUserWithEmailAndPassword} from 'firebase/auth';

const Registro = () => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    const confirmacionRegistro = async (e) => {
      e.preventDefault();
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Usuario registrado exitosamente");
      } catch (error) {
        setError(error.message);
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
          <button> Registrarse </button>
          {error && <p>{error}</p>}
          <p className='accion'>Inicia sesión!</p>
          </div>
          
        </form>
      </div>
      <Footer />
     </div>
        
      
    );
  };
  
  export default Registro;

    
  

  

  
>>>>>>> 999c08f35ddac9d87bbf36c378e0274a80be76c0

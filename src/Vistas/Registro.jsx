import React, { useState } from "react";
import Header from './components/header';
import AboutSection from './components/AboutSection';
import BenefitsSection from './components/BenefitsSection';
import Footer from './components/Footer';
import { Link } from 'react-router-dom';
import { auth } from "../Firebase/FireBase";
import {createUserWithEmailAndPassword} from 'firebase/auth';

export default function Registro () {
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
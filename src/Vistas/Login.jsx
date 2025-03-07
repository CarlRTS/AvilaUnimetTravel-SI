import React from 'react';
import Header from './components/header';

export default function Login() {
  return(
    <div className="login-container">
    {/* Formulario */}
    <form className="formulario">
      <h2 className="crear-cuenta">Iniciar sesión</h2>
      <div className="iconos">
        <div className="borde-iconos">
          <img src="public/Imagenes/Google.png" atl ="Google"/>
        </div>
        
        <div className="borde-iconos">
          <img src="public/Imagenes/Facebook.png" alt = "Facebook"/>
        </div>
      </div>
      <p className="cuenta-gratis">Se parte de la experiencia</p>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Contraseña" />
      <input type="button" value="Iniciar Sesión" />
    </form>

    {/* Footer */}
    <footer>
      <p>© 2025 Ávila - UNIMET</p>
    </footer>
  </div>
);
  

};
"public/Imagenes/Facebook.png"
import React from 'react';
import { BrowserRouter, Route , Routes} from 'react-router-dom';
import Landing from './Vistas/Landing';
import Login from './Vistas/Login';
import Destinos from './Vistas/Destinos';
import Foro from './Vistas/Foro';
import NotFound from './Vistas/NotFound';
import Registro from './Vistas/Registro';
import { registerVersion } from 'firebase/app';


export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/destinos" element={<Destinos />} />
        <Route path="/foro" element={<Foro />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </BrowserRouter>
  );
}


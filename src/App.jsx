import React from 'react';
import { BrowserRouter, Route , Routes} from 'react-router-dom';
import Landing from './Vistas/landing';
import Login from './Vistas/Login';
import Destinos from './Vistas/Destinos';
import Foro from './Vistas/Foro';
import NotFound from './Vistas/NotFound';
import Registro from './Vistas/Registro';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} /> 
        <Route path="/registrar" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/destinos" element={<Destinos />} />
        <Route path="/foro" element={<Foro />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}


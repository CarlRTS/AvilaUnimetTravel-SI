import React from 'react';
import { BrowserRouter, Route,Routes } from 'react-router-dom';
import Landing from './pages/landing';
import Login from './pages/Login';
import Destinos from './pages/Destinos';
import Foro from './pages/Foro';
import NotFound from './pages/NotFound';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/destinos" element={<Destinos />} />
        <Route path="/foro" element={<Foro />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}


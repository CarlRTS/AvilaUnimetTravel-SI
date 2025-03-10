
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Vistas/AuthContext';
import Landing from './Vistas/landing';
import Login from './Vistas/Login';
import Destinos from './Vistas/Destinos';
import Foro from './Vistas/Foro';
import NotFound from './Vistas/NotFound';
import Registro from './Vistas/Registro';
import Footer from './Vistas/components/Footer';
import { useAuth } from './Vistas/AuthContext';

// Componente para rutas protegidas (solo autenticados)
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  
  return currentUser ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<Landing />} />
          
          {/* Ruta de login accesible siempre */}
          <Route path="/login" element={<Login />} />
          
          {/* Resto de rutas públicas */}
          <Route path="/registrar" element={<Registro />} />
          
          {/* Rutas protegidas */}
          <Route path="/destinos" element={
            <ProtectedRoute>
              <Destinos />
            </ProtectedRoute>
          } />
          
          <Route path="/foro" element={
            <ProtectedRoute>
              <Foro />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
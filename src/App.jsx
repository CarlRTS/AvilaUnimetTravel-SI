
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './Vistas/AuthContext';
import Landing from './Vistas/landing';
import Login from './Vistas/Login';
import Destinos from './Vistas/Destinos';
import Foro from './Vistas/Foro';
import NotFound from './Vistas/NotFound';
import Registro from './Vistas/Registro';
import Footer from './Vistas/components/Footer';
import { useAuth } from './Vistas/AuthContext';
import MiPerfil from './Vistas/MiPerfil';
import GestionGuias from './Vistas/GestionGuias'; // 1. Importar el componente
import AdminRoute from './Vistas/components/AdminRoute';


// Componente para rutas protegidas
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
          
          {/* Ruta de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas públicas */}
          <Route path="/registrar" element={<Registro />} />

          {/* Rutas protegidas */}
          <Route path="/mi-perfil" element={
            <ProtectedRoute>
              <MiPerfil />
            </ProtectedRoute>
          }/>

          <Route path="/destinos" element={
            <ProtectedRoute>
              <Destinos />
            </ProtectedRoute>
          }/>

          <Route path="/foro" element={
            <ProtectedRoute>
              <Foro />
            </ProtectedRoute>
          }/>

          {/* 3. Nueva ruta admin */}
          <Route path="/gestion-guias" element={
            <AdminRoute>
              <GestionGuias />
            </AdminRoute>
          }/>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

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
import EditPerfile from './Vistas/EditPerfile';
import { MisReservas } from './Vistas/MisDestinos';
import GestionRutas from './Vistas/GestionRutas';
import Informacion from './Vistas/Informarcion';
import searchbar from './Vistas/components/searchbar';


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
           
              <Destinos />
            
          }/>

          <Route path="/informacion" element={
                    
                    <Informacion />
                  
                }/>

          <Route path="/editar-perfil" element={
            <ProtectedRoute>
              <EditPerfile />
            </ProtectedRoute>
          }/>

          <Route path="/gestion-rutas" element={
            <ProtectedRoute>
              <GestionRutas />
            </ProtectedRoute>
          }/>

          <Route path="/mis-reservas" element={
            <ProtectedRoute>
              <MisReservas />
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

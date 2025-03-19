import React, { useEffect, useState } from 'react';
import Header from './components/header'; // Importar Header
import { useAuth } from './AuthContext';
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../Firebase/FireBase';

export default function GestionGuias() {
  const { userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [isMobile, setIsMobile] = useState(false); // Estado para responsive

  // Función para obtener usuarios
  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      setUsers(usersSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })));
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
    }
  };

  // Actualizar rol
  const handleRoleChange = async (userId, newRole) => {
    await updateDoc(doc(db, 'users', userId), { role: newRole });
    fetchUsers(); // Refrescar lista
  };

  // Efecto para responsive y carga inicial
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    if (userRole === 'admin') fetchUsers();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [userRole]);

  if (userRole !== 'admin') return <div className="p-4 text-red-500">Acceso denegado</div>;

  return (
    <div className="min-h-screen">
      {/* Integrar Header */}
      <Header 
        isMobile={isMobile}
        isMenuOpen={false} // Ajustar según tu implementación
        setIsMenuOpen={() => {}} // Placeholder
      />

      <div className="bg-[#feae4b] min-h-[90vh] pt-12 pb-24">
        <div className="w-full max-w-6xl mx-auto px-4">
          <h2 className="text-white text-3xl font-bold mb-6">Gestión de Usuarios</h2>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="mb-2 md:mb-0">
                    <p className="font-semibold">{user.email}</p>
                    <p className="text-sm text-gray-600">UID: {user.id}</p>
                  </div>
                  <select 
                    value={user.role || 'user'}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="mt-2 md:mt-0 p-2 border rounded-lg bg-white"
                  >
                    <option value="user">Usuario</option>
                    <option value="guide">Guía</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

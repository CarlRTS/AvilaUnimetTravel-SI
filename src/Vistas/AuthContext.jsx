import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../Firebase/FireBase';
import { signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    let mounted = true;

    const initializeAuth = async () => {
      unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!mounted) return;
        
        if (user) {
          try {
            // Verificación forzada del token
            const token = await user.getIdToken(true);
            if (!token) throw new Error('Token inválido');
            
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            });
          } catch (error) {
            console.error('Error de autenticación:', error);
            await signOut(auth);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });
    };

    initializeAuth();
    
    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      // Limpieza adicional
      setCurrentUser(null);
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.removeItem('firebase:authUser:AIzaSyB_7mz17XXXXXXXXXXXXXXX:[DEFAULT]');
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
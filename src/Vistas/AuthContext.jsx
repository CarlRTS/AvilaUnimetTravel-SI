import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../Firebase/FireBase';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función mejorada para recargar usuario
  const reloadUser = async () => {
    if (!auth.currentUser) return null;
    
    try {
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;
      
      // Actualizar estado local
      setCurrentUser({ ...updatedUser });
      
      // Actualizar datos en Firestore si es necesario
      await handleUserDocument(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error("Error recargando usuario:", error);
      return null;
    }
  };

  const handleUserDocument = async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    
    try {
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          role: 'user',
          createdAt: new Date(),
        });
      }
      
      const updatedDoc = await getDoc(userDocRef);
      setUserRole(updatedDoc.data()?.role || 'user');
      
    } catch (error) {
      console.error("Error manejando documento de usuario:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // Verificar y actualizar perfil si es necesario
          if (user.providerData[0]?.providerId === 'password' && !user.displayName) {
            await updateProfile(user, {
              displayName: user.email.split('@')[0],
              photoURL: "https://tu-url-de-imagen-predeterminada.jpg"
            });
            await reloadUser(); // Forzar recarga después de actualización
          }
          
          await handleUserDocument(user);
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error en observer de autenticación:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
    } catch (error) {
      console.error("Error haciendo logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      userRole, 
      loading, 
      logout,
      reloadUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
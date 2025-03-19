import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../Firebase/FireBase';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Crear/actualizar usuario en Firestore
  const handleUserDocument = async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        role: 'user', // Rol por defecto
        createdAt: new Date(),
      });
    }

    // Obtener rol actualizado
    const updatedDoc = await getDoc(userDocRef);
    setUserRole(updatedDoc.data()?.role || 'user');
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await handleUserDocument(user);

        // Asignar nombre y foto predeterminados si es necesario
        if (user.providerData[0]?.providerId === 'password' && !user.displayName) {
          await updateProfile(user, {
            displayName: user.email.split('@')[0],
            photoURL: "https://tu-url-de-imagen-predeterminada.jpg"
          });
        }

        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      userRole, 
      loading, 
      logout 
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
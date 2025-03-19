import { db } from '../Firebase/FireBase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export const UserController = {
  // Obtener todos los usuarios
  getUsers: async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      return usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error("Error obteniendo usuarios: " + error.message);
    }
  },

  // Actualizar rol de usuario
  updateUserRole: async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
    } catch (error) {
      throw new Error("Error actualizando rol: " + error.message);
    }
  }
};
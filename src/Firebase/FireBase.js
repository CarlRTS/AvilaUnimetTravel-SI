import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Añade esta importación

const firebaseConfig = {
  apiKey: "AIzaSyCtTruY0EOCP-um2zuoxRKumi3Mbd5dIO8",
  authDomain: "proyecto-final-3ff5a.firebaseapp.com",
  projectId: "proyecto-final-3ff5a",
  storageBucket: "proyecto-final-3ff5a.firebasestorage.app",
  messagingSenderId: "759224117201",
  appId: "1:759224117201:web:6c5833adf4570e1de262f0"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Crea la instancia de Storage

export { auth, db, storage }; // Exporta storage
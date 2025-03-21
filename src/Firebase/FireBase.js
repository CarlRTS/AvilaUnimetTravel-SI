import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyCtTruY0EOCP-um2zuoxRKumi3Mbd5dIO8",

  authDomain: "proyecto-final-3ff5a.firebaseapp.com",

  projectId: "proyecto-final-3ff5a",

  storageBucket: "proyecto-final-3ff5a.firebasestorage.app",

  messagingSenderId: "759224117201",

  appId: "1:759224117201:web:6c5833adf4570e1de262f0"

};

// inicializacion del firebase.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Obtén la instancia de autenticación
const db = getFirestore(app);

export { auth }; // Exporta auth para usarlo en otros componentes
export { db };
export default db; //
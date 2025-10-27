import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDejg2g1Ye6jOfSuXEPnl6MRzi_Y2TL-g8",
  authDomain: "metaproject-fd87d.firebaseapp.com",
  projectId: "metaproject-fd87d",
  storageBucket: "metaproject-fd87d.firebasestorage.app",
  messagingSenderId: "511149114473",
  appId: "1:511149114473:web:a6ae0c11cdc0a12481cef8",
  measurementId: "G-YK37RZS6P2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Optional: Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
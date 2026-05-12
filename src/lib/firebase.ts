import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, orderBy, limit, onSnapshot, updateDoc, addDoc, serverTimestamp, getDocs, arrayUnion, increment } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  getDocs,
  arrayUnion,
  increment,
  orderBy,
  limit,
};
export type { User };

// Test connection
export async function testConnection() {
  try {
    const testDoc = doc(db, 'system', 'connection_test');
    await getDoc(testDoc);
    console.log("Firebase connection successful");
  } catch (error) {
    console.error("Firebase connection test failed", error);
  }
}

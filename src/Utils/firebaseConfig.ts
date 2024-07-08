// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCM9RbkSojJOxzcKPOUqIrOPQLhHfYFYYU',
  authDomain: 'montra-e9c39.firebaseapp.com',
  projectId: 'montra-e9c39',
  storageBucket: 'montra-e9c39.appspot.com',
  messagingSenderId: '426728684733',
  appId: '1:426728684733:web:fe7b8b2a93554f57bf4bd4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

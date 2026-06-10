// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA09jQgHCXfg0hNH085BSqZ3jNXEIItRys",
  authDomain: "cold-chain-project-767f2.firebaseapp.com",
  projectId: "cold-chain-project-767f2",
  storageBucket: "cold-chain-project-767f2.firebasestorage.app",
  messagingSenderId: "555465093103",
  appId: "1:555465093103:web:d2928f3247c8fcf562d01a",
  measurementId: "G-NQD9NRF2H1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

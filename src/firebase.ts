import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXOWcw5FcDjwjjAheiOAyx_t209Npv5C4",
  authDomain: "studycrate-3ecf8.firebaseapp.com",
  projectId: "studycrate-3ecf8",
  storageBucket: "studycrate-3ecf8.firebasestorage.app",
  messagingSenderId: "588351424129",
  appId: "1:588351424129:web:c61e77740168b166e2ef80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId if specified in firebase-applet-config.json
export const db = getFirestore(app, "ai-studio-6ed392ca-dab3-4677-b296-362ab4a0f8f3");

// Connection tester
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection test: ok");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration: Client is offline");
    } else {
      console.log("Firestore connection initialized gracefully");
    }
  }
}

testConnection();

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgEe2sNXEMw0n9zrNbw2lv6rP4zX9Rl44",
  authDomain: "steve-creations-01.firebaseapp.com",
  projectId: "steve-creations-01",
  storageBucket: "steve-creations-01.firebasestorage.app",
  messagingSenderId: "931546126483",
  appId: "1:931546126483:web:9cd904738a9894c6991566"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;

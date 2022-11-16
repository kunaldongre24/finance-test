import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  setPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAMF564E5eB69A1sX9J2Otttx2AxMNIvAE",
  authDomain: "fly247-f090e.firebaseapp.com",
  projectId: "fly247-f090e",
  storageBucket: "fly247-f090e.appspot.com",
  messagingSenderId: "154944788931",
  appId: "1:154944788931:web:05d7a6ba8e62715e5b8576",
  measurementId: "G-P95GY8VS2R",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const logInWithEmailAndPassword = async (email, password) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return { res: response };
  } catch (err) {
    return { error: err.code };
  }
};
const registerWithEmailAndPassword = async (
  name,
  email,
  username,
  password
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const response = await addDoc(collection(db, "users"), {
      uid: user.uid,
      username,
      name,
      authProvider: "local",
      email,
    });
    // try {
    //   await sendEmailVerification(user);
    //   alert("Email verification link sent!");
    // } catch (err) {
    //   return { error: err.code };
    // }
    return response;
  } catch (err) {
    return { error: err.code };
  }
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    return { error: err.code };
  }
};
const logout = () => {
  signOut(auth);
};
export {
  auth,
  db,
  storage,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};

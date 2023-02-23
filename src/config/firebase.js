//Kunal Dongre
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCbQI_7naKT-uJqKZPAzYhealvKllGU4Es",
  authDomain: "fintech-63d82.firebaseapp.com",
  projectId: "fintech-63d82",
  storageBucket: "fintech-63d82.appspot.com",
  messagingSenderId: "18324392682",
  appId: "1:18324392682:web:13e64de4d2e40248c32593",
  measurementId: "G-FDZYJG9MXS",
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
  password,
  sector,
  bank,
  city,
  education,
  experience
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const response = await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      sector,
      bank,
      city,
      education,
      experience,
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

//Kunal Dongre

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../style/login.css";
import Spinner from "./Spinner";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const navigate = useNavigate();
  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const response = await logInWithEmailAndPassword(email, password);
    if (response) {
      if (response.error) {
        const { error } = response;
        if (error == "auth/wrong-password") {
          setError("Your login credentials are incorrect, let's try again.");
        } else if (error == "auth/invalid-email") {
          setError("Your login credentials are incorrect, let's try again.");
        } else {
          setError(error);
        }
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ flex: 1 }}>
        <Spinner color="#000" />
      </div>
    );
  }
  return (
    <div className="login">
      <form className="form-container" onSubmit={login}>
        <div className="form-header">Sign In </div>
        <div className="login__container">
          {err ? <div className="error-message">{err}</div> : ""}

          <div className="row-input">
            <label>EMAIL</label>
            <input
              type="email"
              className="input__textBox"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail Address"
            />
          </div>
          <div className="row-input">
            <label>PASSWORD</label>
            <input
              type="password"
              className="input__textBox"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <button className="main__btn" type="submit">
            {isLoading ? <Spinner /> : "LOGIN"}
          </button>
          <div>
            <div className="login-button link">
              <Link to="/register">Register</Link>
            </div>
          </div>
          <div>
            <div className="login-button link">
              <Link to="/reset">Forgot Password</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
export default Login;

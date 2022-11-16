import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword } from "../config/firebase";
import Spinner from "./Spinner";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const register = async () => {
    setLoading(true);
    setError("");
    const email = `${username}@fly777.in`;
    const secure = `fly247${password}`;

    const response = await registerWithEmailAndPassword(
      name,
      email,
      username,
      secure
    );
    if (response) {
      if (response.error) {
        const { error } = response;
        if (error == "auth/email-already-in-use") {
          setError("username already in use");
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
    <div className="register">
      <form className="form-container">
        <div className="form-header">Sign Up</div>
        <div className="register__container">
          <div className="row-input">
            <label>NAME</label>
            <input
              type="text"
              className="input__textBox"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
          </div>
          <div className="row-input">
            <label>USERNAME</label>
            <input
              type="text"
              className="input__textBox"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="E-mail Address"
            />
          </div>
          <div className="row-input">
            <label>PASSWORD</label>
            <input
              type="password"
              className="input__textBox"
              value={password}
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          {err ? (
            <div className="error-message" style={{ marginBottom: "10px" }}>
              {err}
            </div>
          ) : (
            ""
          )}

          <button className="main__btn" type="button" onClick={register}>
            {isLoading ? <Spinner /> : "SIGN UP"}
          </button>
          <div className="login-button">
            <Link to="/">Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
export default Register;

//Kunal Dongre
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../config/firebase";
import "../style/reset.css";
function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <div className="reset">
      <div className="form-container">
        <div className="form-header">Sign Up</div>
        <div className="reset__container">
          <div className="row-input">
            <label>EMAIL</label>
            <input
              type="text"
              className="input__textBox"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail Address"
            />
          </div>
          <button
            className="main__btn"
            onClick={() => sendPasswordReset(email)}
          >
            RESET PASSWORD
          </button>
          <div>
            <div className="login-button link">
              <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Reset;

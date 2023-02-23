//Kunal Dongre
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword } from "../config/firebase";
import "../style/register.css";
import cityData from "./cityData";
import BankData from "./BankData";
import Spinner from "./Spinner";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [city, setCity] = useState("");
  const [bank, setBank] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [bankList, setBankList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const navigate = useNavigate();
  const register = async () => {
    setLoading(true);
    setError("");

    const response = await registerWithEmailAndPassword(
      name,
      email,
      password,
      sector,
      bank,
      city,
      education,
      experience
    );
    if (response) {
      if (response.error) {
        const { error } = response;
        if (error == "auth/email-already-in-use") {
          setError("Email already in use");
        } else {
          setError(error);
        }
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    const array = [];
    for (var property in BankData) {
      array.push({ code: BankData[property], name: property });
    }
    setBankList(array);
  }, [BankData]);

  useEffect(() => {
    if (document.getElementById("selectCity")) {
      const element = document.getElementById("selectCity");
      if (city != 0) {
        element.style.color = "#000";
      } else {
        element.style.color = "#959699";
      }
    }
  }, [city]);
  useEffect(() => {
    if (document.getElementById("sector")) {
      const element = document.getElementById("sector");
      if (sector != 0) {
        element.style.color = "#000";
      } else {
        element.style.color = "#959699";
      }
    }
  }, [sector]);
  if (loading) {
    return (
      <div style={{ flex: 1 }}>
        <Spinner color="#000" />
      </div>
    );
  }
  return (
    <div className="register">
      <div className="form-container">
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
            <label>EMAIL</label>
            <input
              type="text"
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
          <div className="row-input">
            <label>SECTOR</label>
            <select
              className="input__textBox"
              value={sector}
              id="sector"
              onChange={(e) => setSector(e.target.value)}
            >
              <option value="0">Select Sector</option>
              <option value="1">Banks</option>
              <option value="2">MNC & Investment </option>
              <option value="3">Other</option>
            </select>
          </div>
          {sector === "1" && (
            <div className="row-input">
              <label>BANK</label>
              <select
                className="input__textBox"
                id="selectBank"
                onChange={(e) => setBank(e.target.value)}
              >
                <option value="0">Select Bank</option>
                {bankList.map((x) => (
                  <option key={x.name} value={x.name}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="row-input">
            <label>CITY</label>

            <select
              className="input__textBox"
              id="selectCity"
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="0">Select City</option>
              {cityData.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="row-input">
            <label>EDUCATION</label>
            <input
              type="text"
              className="input__textBox"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="Educational Background"
            />
          </div>
          <div className="row-input">
            <label>EXPERIENCE</label>
            <input
              type="number"
              className="input__textBox"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Years of Experience"
            />
          </div>
          {err ? (
            <div className="error-message" style={{ marginBottom: "10px" }}>
              {err}
            </div>
          ) : (
            ""
          )}

          <button className="main__btn" onClick={register}>
            {isLoading ? <Spinner /> : "SIGN UP"}
          </button>
          <div className="login-button">
            <Link to="/">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;

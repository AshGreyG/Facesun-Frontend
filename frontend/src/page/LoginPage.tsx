import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./LoginPage.css";
import i18next from "../i18n/i18n.tsx";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "test") {
      navigate("/login");
    } else {
      alert("Login Failed");
    }
  };

  const handleRegister = () => {
    navigate("/");
  };

  return (
    <div className="container">
      <h1>{i18next.t("loginPage")}</h1>
      <form>
        <div className="form-control">
          <input type="text" required />
          <label>{i18next.t("loginUsername")}</label>
        </div>

        <div className="form-control">
          <input type="password" required />
          <label>{i18next.t("loginPassword")}</label>
        </div>

        <button id="login-btn">
          <strong>{i18next.t("loginButtonContent")}</strong>
        </button>

        <p className="text">
          {i18next.t("noAccountInfo")}
          <button 
            onClick={handleRegister}
            id="register-btn"
          >
            {i18next.t("registerButtonContent")}
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

import "./LoginPage.css";
import AnimatedLabel from "../components/AnimatedLabel.tsx";
import SwitchLanguageBar from "../components/SwitchLanguageBar.tsx";
import { 
  backendURL,
  getCurrentTime,
  LoginToken
} from "../utility/utility.tsx";

interface LoginTokenProps {
  token: LoginToken;
  onChangeToken: React.Dispatch<React.SetStateAction<LoginToken>>;
};

/**
 * 
 */
function LoginPage({
  token,
  onChangeToken
}: LoginTokenProps) {
  const loginAPI = axios.create({
    baseURL: backendURL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json"
    }
  });
  const {t} = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleUsernameInput = (event) => setUsername(event.target.value);
  const handlePasswordInput = (event) => setPassword(event.target.value);

  const handleLogin = (event) => {
    loginAPI
      .post("/manager/login", {
        "username": username,
        "password": password
      })
      .then(response => {
        onChangeToken({
          JWTAccessToken: response.data.access_token,
          JWTRefreshToken: response.data.refresh_token
        });
        console.log(
          "[" + getCurrentTime() + "]: User logins successfully.",
          "Its access token is ",
          token.JWTAccessToken,
          ". Its refresh token is ",
          token.JWTRefreshToken
        );
        navigate("/working");
      })
      .catch(error => {
        alert(error);
      })
  };

  const handleRegister = (event) => {
    // navigate("/");
    alert("You clicked register.")
  };

  return (
    <div className="login-page">
      <SwitchLanguageBar />
      <div className="container">
        <h1>{t("loginPage")}</h1>
        <form onSubmit={(event) => event.preventDefault()}>
          <div className="form-control">
            <input 
              type="text" 
              required 
              onChange={handleUsernameInput}
            />
            <AnimatedLabel content={t("loginUsername")}></AnimatedLabel>
          </div>
  
          <div className="form-control">
            <input 
              type="password" 
              required 
              onChange={handlePasswordInput}
            />
            <AnimatedLabel content={t("loginPassword")}></AnimatedLabel>
          </div>
  
          <button 
            id="login-btn"
            onClick={handleLogin}
          >
            <strong>{t("loginButtonContent")}</strong>
          </button>
  
          <p className="text">
            {t("noAccountInfo")}
            <button 
              onClick={handleRegister}
              id="register-btn"
            >
              {t("registerButtonContent")}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}  
  
export default LoginPage;
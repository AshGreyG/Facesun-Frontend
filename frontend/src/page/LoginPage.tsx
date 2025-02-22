import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

import "./LoginPage.css";
import SwitchLanguageBar from "../components/SwitchLanguageBar.tsx";
import { 
  backendURL,
  getCurrentTime,
  LoginToken
} from "../utility/utility.tsx";

interface AnimatedLabelPropType {
  content: string
};

function AnimatedLabel({content}: AnimatedLabelPropType) {
  const characters: string[] = content.split("");

  return (
    <label>
      {characters.map((letter, idx) => (
        <span
          key={idx}
          className="animated-letter"
          style={{ transitionDelay: `${idx * 50}ms` }}
        >
          {letter}
        </span>
      ))}
    </label>
  )
}

interface LoginPagePropType {
  token: LoginToken;
  onChangeToken: React.Dispatch<React.SetStateAction<LoginToken>>;
};

/**
 * @param prop The property of component `LoginPage`
 */
function LoginPage({token, onChangeToken}: LoginPagePropType) {
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

  const handleUsernameInput 
    = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);
  const handlePasswordInput 
    = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

  const handleLogin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    loginAPI
      .post("/manager/login", {
        "username": username,
        "password": password
      })
      .then(response => {
        onChangeToken({
          JWTAccessToken: response.data.access_token as string,
          JWTRefreshToken: response.data.refresh_token as string
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

  const handleRegister = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
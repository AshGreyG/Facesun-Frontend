import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios, { AxiosResponse } from "axios";

import "./LoginPage.css";
import SwitchLanguageBar from "../components/SwitchLanguageBar.tsx";
import { 
  backendURL,
  getCurrentTime,
  LoginToken
} from "../utility/utility.tsx";

import { 
  LoginTokenResponseData,
  ErrorResponse
} from "../utility/interface.tsx";

interface AnimatedLabelPropType {
  content: string
};

function AnimatedLabel({ content }: AnimatedLabelPropType) {
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

/**
 * @description This is the interface of component function {@link LoginPage}
 * @param {LoginToken} token
 */
interface LoginPagePropType {
  token: LoginToken;
  onChangeToken: React.Dispatch<React.SetStateAction<LoginToken>>;
};

/**
 * @type `"Success"` means that the user logins successfully and he will
 * automatically jump to the `/working` route after showing a success info 3s.
 * @type `"Fail"` means that the user fails to login, and browser will
 * show a failed info.
 * @type `"Unknown Error"` means that browser can't connect to the server, but
 * server returns some unknown errors.
 * @type `"Pending"` is the original login status.
 */
type LoginStatus =
  | "Success"
  | "Fail"
  | "Unknown Error"
  | "Pending";

/**
 * @param {LoginToken} token - The login token of user, passed by App entry
 * component. The token is stored in local storage.
 * @param {React.Dispatch<React.SetStateAction<LoginToken>>} onChangeToken
 * - The set function of parameter `token`, passed by App entry component.
 */
function LoginPage({ token, onChangeToken }: LoginPagePropType) {
  const loginAPI = axios.create({
    baseURL: backendURL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json"
    }
  });
  const {t} = useTranslation();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginStatus, setLoginStatus] = useState<LoginStatus>("Pending");

  const navigate = useNavigate();

  function handleLogin() {
    loginAPI
      .post("/manager/login", {
        "username": username,
        "password": password
      })
      .then((response: AxiosResponse<LoginTokenResponseData, any>) => {
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
        );  // This needs to be removed when in real environment.

        setLoginStatus("Success");
        setTimeout(() => navigate("/working"), 3000);
      })
      .catch((error: ErrorResponse) => {
        if (error.response.status === 400) {
          setLoginStatus("Fail");
        } else {
          setLoginStatus("Unknown Error");
        }
      });
  };

  function handleRegister() {
    // navigate("/");
    alert("You clicked register.")
  };

  return (
    <div className="login-page">
      <SwitchLanguageBar />
      <div className="login-container">
        <h1>{t("loginPage")}</h1>
        <form onSubmit={(event) => event.preventDefault()}>
          <div className="form-control">
            <input 
              type="text" 
              required 
              onChange={(e) => setUsername(e.target.value)}
            />
            <AnimatedLabel content={t("loginUsername")} />
          </div>
  
          <div className="form-control">
            <input 
              type="password" 
              required 
              onChange={(e) => setPassword(e.target.value)}
            />
            <AnimatedLabel content={t("loginPassword")} />
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
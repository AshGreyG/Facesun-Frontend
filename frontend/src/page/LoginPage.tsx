import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios, { AxiosResponse } from "axios";

import "./LoginPage.css";
import TopBar from "../components/TopBar.tsx";
import AlertModal from "../components/AlertModal.tsx";
import AnimatedLabel from "../components/AnimatedLabel.tsx";

import { 
  backendURL,
  getCurrentTime,
} from "../utility/utility.tsx";

import { 
  LoginToken,
  LoginTokenResponseData,
  ErrorResponse
} from "../utility/interface.tsx";

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
 * @param {LoginToken} token The login token of user, passed by App entry
 * component. The token is stored in local storage.
 * @param {React.Dispatch<React.SetStateAction<LoginToken>>} onChangeToken
 * The set function of parameter `token`, passed by App entry component.
 */
function LoginPage({ token, onChangeToken }: LoginPagePropType) {
  const loginAPI = axios.create({
    baseURL: backendURL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json"
    }
  });
  const { t } = useTranslation();
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
  };

  return (
    <div className="login-page">
      <TopBar />
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
      {(loginStatus === "Success") &&
        <AlertModal 
          message={t("loginInfoSuccess")}
          onCloseSignal={() => setLoginStatus("Pending")}
        />
      }
      {(loginStatus === "Fail") && 
        <AlertModal
          message={"[" + getCurrentTime() + "]: " + t("loginInfoFail")}
          onCloseSignal={() => setLoginStatus("Pending")}
        />
      }
      {(loginStatus === "Unknown Error") &&
        <AlertModal
          message={"[" + getCurrentTime() + "]: " + t("loginInfoUnknownError")}
          onCloseSignal={() => setLoginStatus("Pending")}
        />
      }
    </div>
  );
}

export default LoginPage;
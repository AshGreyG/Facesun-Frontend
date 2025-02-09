import axios from "axios";
import { useEffect } from "react";

export const backendURL = "";

export interface LoginToken {
  JWTAccessToken: string;
  JWTRefreshToken: string;
}

export function getCurrentTime(): string {
  const now = new Date();
  return `${now.getFullYear()}`
    + `-${String(now.getMonth() + 1).padStart(2, "0")}`
    + `-${String(now.getDay() + 1).padStart(2, "0")}`
    + `-${String(now.getHours() + 1).padStart(2, "0")}`
    + `:${String(now.getSeconds() + 1).padStart(2, "0")}`
    + `:${String(now.getMilliseconds() + 1).padStart(4, "0")}`;
}

/**
 * @param token:
 */
export function useRefreshToken(token: LoginToken) {
  const refreshAPI = axios.create({
    baseURL: backendURL,
    timeout: 5000,
    headers: {
      "Authorization": "Bearer " + token.JWTRefreshToken,
      "Content-Type": "application/json"
    }
  });

  console.log("[" + getCurrentTime() + "]: Start refreshing token.");

  useEffect(() => {
    refreshAPI
      .post("/manager/refresh")
      .then(response => {
        localStorage.setItem("userLoginToken", JSON.stringify({
          JWTAccessToken: response.data.access_token,
          JWTRefreshToken: token.JWTRefreshToken
        }));
      })
      .catch(error => {
        console.log(
          "[" + getCurrentTime() + "]: Failed to refresh, error status is ",
          error.response.status
        );
      });
  }, [refreshAPI, token.JWTRefreshToken]);
}
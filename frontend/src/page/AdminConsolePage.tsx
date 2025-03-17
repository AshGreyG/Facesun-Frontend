import React, { 
  useEffect,
  useRef,
  useState
} from "react";

import axios, {
  AxiosInstance,
  AxiosResponse
} from "axios";

import { backendURL } from "../utility/utility.tsx";

import { 
  AdminGetUserListResponseData, 
  ErrorResponse, 
  LoginToken,
  RefreshTokenResponseData,
  UserInfo
} from "../utility/interface.tsx";
import { useNavigate } from "react-router-dom";

interface AdminConsolePagePropType {
  token: LoginToken;
  onChangeToken: React.Dispatch<React.SetStateAction<LoginToken>>;
}

type AdminConsolePageError =
  | "RefreshTokenOutdatedError"
  | "AdminGetUsersListError"
  | null;

function AdminConsolePage({
  token,
  onChangeToken
}: AdminConsolePagePropType) {
  const [usersList, setUsersList] = useState<UserInfo[]>([]);
  const [adminConsolePageError, setAdminConsolePageError] 
    = useState<AdminConsolePageError>(null);
  const navigate = useNavigate();

  const workingAPI = useRef<AxiosInstance>(axios.create({
    baseURL: backendURL,
    timeout: 5000,
    headers: {
      "Authorization": "Bearer " + token.JWTAccessToken,
      "Content-Type": "application/json"
    }
  }));

  const refreshTokenAPI = useRef<AxiosInstance>(axios.create({
    baseURL: backendURL,
    timeout: 5000,
    headers: {
      "Authorization": "Bearer " + token.JWTRefreshToken,
      "Content-Type": "application/json"
    }
  }));

  useEffect(() => {
    workingAPI.current
      .get("/manager/admin/users")
      .then((response: AxiosResponse<AdminGetUserListResponseData, any>) => {
        setUsersList(response.data.data.users.map((rawUser): UserInfo => {
          return {
            defaultPhoneNumber: rawUser.default_phone,
            userID:             rawUser.id,
            userName:           rawUser.username,
            isAdmin:            rawUser.is_admin
          };
        }));
      })
      .catch((error: ErrorResponse) => {
        if (error.response.status === 401) {

          // If the server response 401 status, then user need to refresh this
          // token, and re-store this token to the local storage

          refreshTokenAPI.current
            .post("/manager/refresh")
            .then((response: AxiosResponse<RefreshTokenResponseData, any>) => {
              onChangeToken({
                JWTAccessToken: response.data.access_token,
                JWTRefreshToken: token.JWTRefreshToken
              });
            })
            .catch((error: ErrorResponse) => {
              setAdminConsolePageError("RefreshTokenOutdatedError");
              setTimeout(() => {
                setAdminConsolePageError(null);
                navigate("/login");
              })
            });
        } else {
          setAdminConsolePageError("AdminGetUsersListError");
        }
      })
  }, []);

  return (
    <div className="admin-console-page">

    </div>
  );
}

export default AdminConsolePage;
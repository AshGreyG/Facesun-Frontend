import React, { 
  useEffect,
  useRef
} from "react";

import axios, {
  AxiosInstance,
  AxiosResponse
} from "axios";

import { backendURL } from "../utility/utility.tsx";

import { 
  AdminGetUserListResponseData, 
  LoginToken 
} from "../utility/interface.tsx";

interface AdminConsolePagePropType {
  token: LoginToken;
  onChangeToken: React.Dispatch<React.SetStateAction<LoginToken>>;
}

function AdminConsolePage({
  token,
  onChangeToken
}: AdminConsolePagePropType) {
  const workingAPI = useRef<AxiosInstance>(axios.create({
    baseURL: backendURL,
    timeout: 5000,
    headers: {
      "Authorization": "Bearer " + token.JWTAccessToken,
      "Content-Type": "application/json"
    }
  }));

  useEffect(() => {
    workingAPI.current
      .get("/manager/admin/users")
      .then((response: AxiosResponse<AdminGetUserListResponseData, any>) => {

      })
  }, []);

  return (
    <div className="admin-console-page">

    </div>
  );
}

export default AdminConsolePage;
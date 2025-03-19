import React, { 
  useEffect,
  useRef,
  useState
} from "react";

import axios, {
  AxiosInstance,
  AxiosResponse
} from "axios";

import { useTranslation } from "react-i18next";
import { unstable_HistoryRouter, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";

import { 
  mdiLockReset,
  mdiPencil, 
  mdiTrashCanOutline 
} from "@mdi/js";

import "./AdminConsolePage.css"
import { backendURL } from "../utility/utility.tsx";

import { 
  AddUserInfo,
  AdminGetUserListResponseData, 
  ErrorResponse, 
  LoginToken,
  RefreshTokenResponseData,
  ResetPasswordInfo,
  UserInfo
} from "../utility/interface.tsx";

import TopBar from "../components/TopBar.tsx";
import TextFieldInput from "../components/TextFieldInput.tsx";

interface UserRowPropType {
  user: UserInfo;
}

function UserRow({ user }: UserRowPropType) {
  return (
    <tr key={user.userID}>
      <th scope="col" key={1}>{user.userID}</th>
      <th scope="col" key={2}>{user.username}</th>
      <th scope="col" key={3}>{user.defaultPhoneNumber ?? "/"}</th>
      <th scope="col" key={4}>
        <div className="buttons-container">
          <div className="edit-button-container">
            <button 
              className="edit-user"
            >
              <Icon
                path={mdiPencil}
                size={0.6}
              />
            </button>
          </div>
          <div className="reset-password-button-container">
            <button 
              className="reset-password"
            >
              <Icon
                path={mdiLockReset}
                size={0.6}
              />
            </button>
          </div>
          <div className="delete-button-container">
            <button 
              className="delete-user"
            >
              <Icon
                path={mdiTrashCanOutline}
                size={0.6}
              />
            </button>
          </div>
        </div>
      </th>
    </tr>
  );
}

interface UsersTableToolbarPropType {
  onAddUser: (addedUser: AddUserInfo) => void;
  onResetPassword: (newPassword: ResetPasswordInfo) => void;
  onDeleteUser: (deletedUserID: number) => void;
}

function UsersTableToolbar({
  onAddUser,
  onResetPassword,
  onDeleteUser
}: UsersTableToolbarPropType) {
  const { t } = useTranslation();
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false);

  return (
    <div className="users-list-toolbar">
      <div className="query-form-container">
        <form 
          className="query-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <TextFieldInput
            inputName="query-text-field"
          />
        </form>
      </div>
    </div>
  );
}

interface UsersTablePropType {
  usersList: UserInfo[];
}

function UsersTable({ usersList }: UsersTablePropType) {
  const { t } = useTranslation();
  return (
    <table className="users-table">
      <thead>
        <tr key={0}>
          <th scope="col" key={1}>{t("userID")}</th>
          <th scope="col" key={2}>{t("userName")}</th>
          <th scope="col" key={3}>{t("phoneNumber")}</th>
          <th scope="col" key={3}>{t("editButtons")}</th>
        </tr>
      </thead>
      <tbody>
        {usersList.map((user) => <UserRow user={user}/> )}
      </tbody>
    </table>
  );
}

interface UsersTableContainerPropType {
  usersList: UserInfo[];
}

function UsersTableContainer({ usersList }: UsersTableContainerPropType) {

  function handleAddUser(addedUser: AddUserInfo) {

  }

  function handleResetPassword(newPassword: ResetPasswordInfo) {

  }

  function handleDeleteUser(deletedUserID: number) {

  }

  return (
    <div className="users-table-container">

    <UsersTableToolbar
      onAddUser={handleAddUser}
      onResetPassword={handleResetPassword}
      onDeleteUser={handleDeleteUser}
    />
    <UsersTable usersList={usersList}/>
    </div>
  )
}

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
  const { t } = useTranslation();

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
            username:           rawUser.username,
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
      });
  }, []);

  return (
    <div className="admin-console-page">
      <TopBar
        isAdmin={true}
        message={t("adminConsolePageName")}
        isDisabled={true}
      />
      <div className="admin-console-container">
        <UsersTableContainer usersList={usersList}/>
      </div>
    </div>
  );
}

export default AdminConsolePage;
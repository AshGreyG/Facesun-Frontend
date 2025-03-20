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
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";

import { 
  mdiLockReset,
  mdiTrashCanOutline,
  mdiPlus,
  mdiRefresh
} from "@mdi/js";

import "./AdminConsolePage.css"
import { backendURL } from "../utility/utility.tsx";

import { 
  AdminGetUserListResponseData, 
  ErrorResponse, 
  LoginToken,
  RefreshTokenResponseData,
  UserInfo
} from "../utility/interface.tsx";

import TopBar from "../components/TopBar.tsx";
import TextFieldInput from "../components/TextFieldInput.tsx";
import AbstractModal from "../components/AbstractModal.tsx";

interface AddingUserModalPropType {
  message: string;
  onAddUser: (
    addUsername: string,
    addPassword: string,
    confirmPassword: string
  ) => void;
  onCloseSignal: () => void;
}

function AddingUserModal({
  message,
  onAddUser,
  onCloseSignal
}: AddingUserModalPropType) {
  const { t } = useTranslation();
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [confirmInput, setConfirmInput] = useState<string>("");

  return (
    <AbstractModal
      message={message}
      onCloseSignal={onCloseSignal}
    >
      <div className="username-input-container">
        <TextFieldInput
          inputName="username-input"
          placeholder={t("addingUserUsernameInputPlaceholder")}
          textInputValue={usernameInput}
          onTextInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setUsernameInput(e.target.value);
          }}
        />
      </div>
      <div className="password-input-container">
        <TextFieldInput
          inputName="password-input"
          placeholder={t("addingUserPasswordInputPlaceholder")}
          textInputValue={passwordInput}
          onTextInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPasswordInput(e.target.value);
          }}
        />
      </div>
      <div className="confirm-password-input-container">
        <TextFieldInput
          inputName="confirm-password-input"
          placeholder={t("addingUserConfirmInputPlaceholder")}
          textInputValue={confirmInput}
          onTextInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setConfirmInput(e.target.value);
          }}
        />
      </div>
      <div className="button-container">
        <div className="cancel-button-container">
          <button onClick={() => onCloseSignal()}>
            {t("cancelButton")}
          </button>
        </div>
        <div className="confirm-button-container">
          <button onClick={() => {
            onAddUser(usernameInput, passwordInput, confirmInput);
            onCloseSignal();
          }}>
            {t("confirmButton")}
          </button>
        </div>
      </div>
    </AbstractModal>
  );
}

interface UserRowPropType {
  user: UserInfo;
}

/**
 * @description This is the row unit components in `UsersTable`, notice there
 * is no API to edit the `userID` or `username`. Only admin can add new user
 */
function UserRow({ user }: UserRowPropType) {
  return (
    <tr key={user.userID}>
      <th scope="col" key={1}>{user.userID}</th>
      <th scope="col" key={2}>{user.username}</th>
      <th scope="col" key={3}>{user.defaultPhoneNumber ?? "/"}</th>
      <th scope="col" key={4}>
        <div className="buttons-container">
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
  onAddUser: (
    addUsername: string,
    addedPassword: string, 
    confirmPassword: string,
  ) => void;
  onResetPassword: (
    userID: number,
    newPassword: string,
    confirmPassword: string
  ) => void;
  onDeleteUser: (deletedUserID: number) => void;
}

function UsersTableToolbar({
  onAddUser,
  onResetPassword,
  onDeleteUser
}: UsersTableToolbarPropType) {
  const { t } = useTranslation();
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);

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
      <div className="button-components">
        <div className="add-case-button-container">
          <button
            className="add-case-button"
            onClick={() => setIsAddingUser(true)}
          >
            <Icon
              path={mdiPlus}
              size={1}
            />
          </button>
        </div>
        <div className="force-refresh-button-container">
          <button className="force-refresh-button">
            <Icon
              path={mdiRefresh}
              size={1}
            />
          </button>
        </div>
      </div>
      {isAddingUser && (
        <AddingUserModal
          message={t("addingUserModalTitle")}
          onAddUser={onAddUser}
          onCloseSignal={() => setIsAddingUser(false)}
        />
      )}
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
          <th scope="col" key={4}>{t("editButtons")}</th>
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
  onAddUser: (
    addUsername: string,
    addPassword: string, 
    confirmPassword: string, 
  ) => void;
  onResetPassword: (
    userID: number,
    newPassword: string,
    confirmPassword: string
  ) => void;
  onDeleteUser: (userID: number) => void;
}

function UsersTableContainer({ 
  usersList,
  onAddUser,
  onResetPassword,
  onDeleteUser
}: UsersTableContainerPropType) {

  return (
    <div className="users-table-container">
      <UsersTableToolbar
        onAddUser={onAddUser}
        onResetPassword={onResetPassword}
        onDeleteUser={onDeleteUser}
      />
      <UsersTable usersList={usersList} />
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

  function handleAddUser(
    addUsername: string,
    addPassword: string, 
    confirmPassword: string
  ) {
    workingAPI.current
      .post("/manager/admin/users", {
        username: addUsername,
        password: addPassword,
        confirm_password: confirmPassword
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function handleResetPassword(
    userID: number,
    newPassword: string,
    confirmPassword: string
  ) {

  }
  
  function handleDeleteUser(userID: number) {

  }

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
              }, 3000);
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
        <UsersTableContainer 
          usersList={usersList}
          onAddUser={handleAddUser}
          onResetPassword={handleResetPassword}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </div>
  );
}

export default AdminConsolePage;
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
  mdiRefresh,
  mdiFormatListBulleted,
  mdiSortDescending,
  mdiSortAscending,
  mdiPageFirst,
  mdiChevronLeft,
  mdiChevronRight,
  mdiPageLast,
  mdiCheck
} from "@mdi/js";

import "./AdminConsolePage.css"
import { backendURL, getCurrentTime, PAGINATION_RECORDS_NUM } from "../utility/utility.tsx";

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
import AlertModal from "../components/AlertModal.tsx";
import ConfirmModal from "../components/ConfirmModal.tsx";

interface AddingUserModalPropType {
  onAddUser: (
    addUsername: string,
    addPassword: string,
    confirmPassword: string
  ) => void;
  onCloseSignal: () => void;
}

function AddingUserModal({
  onAddUser,
  onCloseSignal
}: AddingUserModalPropType) {
  const { t } = useTranslation();
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [confirmInput,   setConfirmInput] = useState<string>("");

  return (
    <AbstractModal
      message={t("addingUserModalTitle")}
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

interface ResettingPasswordModalPropType {
  onResetPassword: (
    resetPassword: string,
    confirmPassword: string
  ) => void;
  onCloseSignal: () => void;
}

function ResettingPasswordModal({
  onResetPassword,
  onCloseSignal
}: ResettingPasswordModalPropType ) {
  const { t } = useTranslation();
  const [resetInput,     setResetInput] = useState<string>("");
  const [confirmInput, setConfirmInput] = useState<string>("");

  return (
    <AbstractModal
      message={t("resettingPasswordModalTitle")}
      onCloseSignal={onCloseSignal}
    >
      <div className="reset-password-input-container">
        <TextFieldInput
          inputName="reset-password-input"
          placeholder={t("resettingPasswordInputPlaceholder")}
          textInputValue={resetInput}
          onTextInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setResetInput(e.target.value);
          }}
        />
      </div>
      <div className="confirm-password-input-container">
        <TextFieldInput
          inputName="confirm-password-input"
          placeholder={t("resettingPasswordConfirmInputPlaceholder")}
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
            onResetPassword(resetInput, confirmInput);
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
  onResetPassword: (
    userID: number,
    newPassword: string,
    confirmPassword: string
  ) => void;
  onDeleteUser: (deletedUserID: number) => void;
}

type ResettingPasswordError =
  | "ConfirmPasswordError"
  | null;

/**
 * @description This is the row unit components in `UsersTable`, notice there
 * is no API to edit the `userID` or `username`. Only admin can add new user
 */
function UserRow({
  user,
  onResetPassword,
  onDeleteUser
}: UserRowPropType) {
  const { t } = useTranslation();
  const [isResettingPassword,       setIsResettingPassword] = useState<boolean>(false);
  const [resettingPasswordError, setResettingPasswordError] = useState<ResettingPasswordError>(null);
  const [isDeleting,                         setIsDeleting] = useState<boolean>(false);

  function checkResetPassword(resetPassword: string, confirmPassword: string) {
    if (resetPassword !== confirmPassword) {
      setResettingPasswordError("ConfirmPasswordError");
    }
    onResetPassword(user.userID, resetPassword, confirmPassword);
  }

  return (
    <tr key={user.userID}>
      <th scope="col" key={1}>{user.userID}</th>
      <th scope="col" key={2}>{user.username}</th>
      <th scope="col" key={3}>{user.isAdmin ? "✅" : "❌"}</th>
      <th scope="col" key={4}>{user.defaultPhoneNumber ?? "/"}</th>
      <th scope="col" key={5}>
        <div className="buttons-container">
          <div className="reset-password-button-container">
            <button 
              className="reset-password"
              onClick={() => setIsResettingPassword(true)}
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
              onClick={() => setIsDeleting(true)}
            >
              <Icon
                path={mdiTrashCanOutline}
                size={0.6}
              />
            </button>
          </div>
        </div>
        {(isResettingPassword) && (
          <ResettingPasswordModal
            onResetPassword={checkResetPassword}
            onCloseSignal={() => setIsResettingPassword(false)}
          />
        )}
        {(resettingPasswordError) && (
          <AlertModal
            message={
              "[" + getCurrentTime() + "]: "
                +  (resettingPasswordError === "ConfirmPasswordError"
                ? t("resettingPasswordConfirmError")
                : t("resettingPasswordUnknownError"))
            }
            onCloseSignal={() => setResettingPasswordError(null)}
          />
        )}
        {(isDeleting) && (
          <ConfirmModal
            title={t("deletingUserModalTitle")}
            message={t("deletingUserModalMessage") + " " + user.username}
            onCancel={() => setIsDeleting(false)}
            onConfirm={() => {
              onDeleteUser(user.userID)
              setIsDeleting(false);
            }}
          />
        )}
      </th>
    </tr>
  );
}

interface UsersTableToolbarPropType {
  isAscending: boolean;
  userQueryContent: string;
  checkUsernameRepeated: (username: string) => boolean;
  onChangAscending: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeUserQueryContent: React.Dispatch<React.SetStateAction<string>>;
  onAddUser: (
    addUsername: string,
    addedPassword: string, 
    confirmPassword: string
  ) => void;
  onRefreshUsers: () => void;
}

type AddingUserError =
  | "UsernameRepeatedError"
  | "ConfirmPasswordError"
  | "EmptyInputError"
  | null;

function UsersTableToolbar({
  isAscending,
  userQueryContent,
  checkUsernameRepeated,
  onChangAscending,
  onChangeUserQueryContent,
  onAddUser,
  onRefreshUsers
}: UsersTableToolbarPropType) {
  const { t } = useTranslation();
  const [isAddingUser,       setIsAddingUser] = useState<boolean>(false);
  const [addingUserError, setAddingUserError] = useState<AddingUserError>(null);

  function checkAddUser(
    addedUserName: string,
    addedPassword: string,
    confirmPassword: string
  ) {
    if (addedUserName === "" || addedPassword === "" || confirmPassword === "") {
      setAddingUserError("EmptyInputError");
      return;
    }
    if (addedPassword !== confirmPassword) {
      setAddingUserError("ConfirmPasswordError");
      return;
    }
    if (checkUsernameRepeated(addedUserName)) {
      setAddingUserError("UsernameRepeatedError");
      return;
    }
    onAddUser(addedUserName, addedPassword, confirmPassword);
  }

  return (
    <div className="users-list-toolbar">
      <div className="query-form-container">
        <form 
          className="query-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <TextFieldInput
            inputName="query-text-field"
            placeholder={t("queryTextInputPlaceholder")}
            textInputValue={userQueryContent}
            onTextInputChange={(e) => onChangeUserQueryContent(e.target.value)}
          />
        </form>
        <button className="select-query-field-button">
          <Icon
            path={mdiFormatListBulleted}
            size={1}
          />
        </button>
        {isAscending ? (
          <button 
            className="change-to-descending"
            onClick={() => onChangAscending(false)}
          >
            <Icon
              path={mdiSortDescending}
              size={1}
            />
          </button>
        ) : (
          <button 
            className="change-to-ascending"
            onClick={() => onChangAscending(true)}
          >
            <Icon
              path={mdiSortAscending}
              size={1}
            />
          </button>
        )}
      </div>
      <div className="button-components">
        <div className="add-user-button-container">
          <button
            className="add-user-button"
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
          onAddUser={checkAddUser}
          onCloseSignal={() => setIsAddingUser(false)}
        />
      )}
      {addingUserError && (
        <AlertModal
          message={
            "[" + getCurrentTime() + "]: "
              +  (addingUserError === "UsernameRepeatedError"
              ? t("addingUserUsernameRepeatedError")
              :   addingUserError === "ConfirmPasswordError"
              ? t("addingUserConfirmPasswordError")
              :   addingUserError === "EmptyInputError"
              ? t("addingUserEmptyInputError")
              : t("addingUserUnknownError"))
          }
          onCloseSignal={() => setAddingUserError(null)}
        />
      )}
    </div>
  );
}

interface PaginationNavbarPropType {
  totalPaginationCount: number;
  paginationIndex: number;
  onChangePaginationIndex: React.Dispatch<React.SetStateAction<number>>;
}

function PaginationNavbar({
  totalPaginationCount,
  paginationIndex,
  onChangePaginationIndex
}: PaginationNavbarPropType) {
  const { t } = useTranslation();
  const [paginationInput, setPaginationInput] = useState<string>(String(paginationIndex));

  return (
    <div className="pagination-navbar">
      <div className="direction-buttons-container">
        <span className="first-page-container">
          <button 
            className="first-page-button"
            onClick={() => onChangePaginationIndex(1)}
          >
            <Icon
              path={mdiPageFirst}
              size={1}
            />
          </button>
        </span>
        <span className="prev-page-container">
          <button 
            className="prev-page-button"
            onClick={() => onChangePaginationIndex(
              paginationIndex <= 1
                ? 1
                : paginationIndex - 1
            )}
          >
            <Icon
              path={mdiChevronLeft}
              size={1}
            />
          </button>
        </span>
        <span className="pagination-info">
          <p>
            {paginationIndex + "/" + totalPaginationCount}
          </p>
        </span>
        <span className="next-page-container">
          <button 
            className="next-page-button"
            onClick={() => onChangePaginationIndex(
              paginationIndex >= totalPaginationCount
                ? totalPaginationCount
                : paginationIndex + 1
            )}
          >
            <Icon
              path={mdiChevronRight}
              size={1}
            />
          </button>
        </span>
        <span className="last-page-container">
          <button 
            className="last-page-button"
            onClick={() => onChangePaginationIndex(totalPaginationCount)}
          >
            <Icon
              path={mdiPageLast}
              size={1}
            />
          </button>
        </span>
      </div>
      <span className="jump-to-page-container">
        <form 
          className="jump-to-page-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <TextFieldInput
            inputName="jump-to-page-input"
            placeholder=""
            textInputValue={paginationInput}
            onTextInputChange={(e) => setPaginationInput(e.target.value)}
          />
          <button 
            className="confirm-jump-button"
            onClick={() => {
              let parse = Number(paginationInput);
              if (!Number.isNaN(parse)) {
                onChangePaginationIndex(
                  parse <= 0
                    ? 1
                    : parse > totalPaginationCount
                      ? totalPaginationCount
                      : parse
                );
              } else {
                onChangePaginationIndex(paginationIndex);
              }
            }}
          >
            <Icon
              path={mdiCheck}
              size={1}
            />
          </button>
        </form>
      </span>
    </div>
  );
}

interface UsersTablePropType {
  usersList: UserInfo[];
  onResetPassword: (
    userID: number,
    newPassword: string,
    confirmPassword: string
  ) => void;
  onDeleteUser: (deletedUserID: number) => void;
}

function UsersTable({ 
  usersList,
  onResetPassword,
  onDeleteUser
}: UsersTablePropType) {
  const { t } = useTranslation();
  return (
    <table className="users-table">
      <thead>
        <tr key={0}>
          <th scope="col" key={1}>{t("userID")}</th>
          <th scope="col" key={2}>{t("userName")}</th>
          <th scope="col" key={3}>{t("isAdmin")}</th>
          <th scope="col" key={4}>{t("phoneNumber")}</th>
          <th scope="col" key={5}>{t("editButtons")}</th>
        </tr>
      </thead>
      <tbody>
        {usersList.map((user) => 
          <UserRow 
            user={user}
            onResetPassword={onResetPassword}
            onDeleteUser={onDeleteUser}
          /> 
        )}
      </tbody>
    </table>
  );
}

interface UsersTableContainerPropType {
  usersList: UserInfo[];
  isAscending: boolean;
  userQueryContent: string;
  paginationIdex: number;
  totalPaginationCount: number;
  checkUsernameRepeated: (username: string) => boolean;
  onChangAscending: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeUserQueryContent: React.Dispatch<React.SetStateAction<string>>;
  onChangePaginationIndex: React.Dispatch<React.SetStateAction<number>>;
  onRefreshUsers: () => void;
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
  isAscending,
  userQueryContent,
  paginationIdex,
  totalPaginationCount,
  checkUsernameRepeated,
  onChangAscending,
  onChangeUserQueryContent,
  onChangePaginationIndex,
  onRefreshUsers,
  onAddUser,
  onResetPassword,
  onDeleteUser
}: UsersTableContainerPropType) {

  return (
    <div className="users-table-container">
      <UsersTableToolbar
        isAscending={isAscending}
        userQueryContent={userQueryContent}
        checkUsernameRepeated={checkUsernameRepeated}
        onChangAscending={onChangAscending}
        onChangeUserQueryContent={onChangeUserQueryContent}
        onAddUser={onAddUser}
        onRefreshUsers={onRefreshUsers}
      />
      <UsersTable 
        usersList={usersList} 
        onResetPassword={onResetPassword}
        onDeleteUser={onDeleteUser}
      />
      <PaginationNavbar
        paginationIndex={paginationIdex}
        totalPaginationCount={totalPaginationCount}
        onChangePaginationIndex={onChangePaginationIndex}
      />
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
  | "AddUserUnknownError"
  | "DeleteUserUnknownError"
  | null;

function AdminConsolePage({
  token,
  onChangeToken
}: AdminConsolePagePropType) {
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

  const [usersList,                         setUsersList] = useState<UserInfo[]>([]);
  const [filteredUsersList,         setFilteredUsersList] = useState<UserInfo[]>([]);
  const [userClickedField,           setUserClickedField] = useState<keyof UserInfo>("userID");
  const [isAscending,                     setIsAscending] = useState<boolean>(true);
  const [userQueryContent,           setUserQueryContent] = useState<string>("");
  const [paginationIndex,             setPaginationIndex] = useState<number>(1);
  const [totalPaginationCount,   setTotalPaginationCount] = useState<number>(1);
  const [adminConsolePageError, setAdminConsolePageError] = useState<AdminConsolePageError>(null);

  function handleRefreshToken() {
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
  }

  function checkUsernameRepeated(username: string): boolean {
    for (const user of usersList) {
      if (user.username === username) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    let middleFilteredUsersList1: UserInfo[] 
      = usersList.filter((originalUser) => {
        if (
          userClickedField === "userID" &&
          String(originalUser[userClickedField]).indexOf(userQueryContent) !== -1
        ) {
          return true;
        } else if (
          userClickedField === "defaultPhoneNumber" &&
          ((originalUser[userClickedField] !== null && 
            originalUser[userClickedField].indexOf(userQueryContent) !== -1) ||
           (originalUser[userClickedField] === null &&
            userQueryContent === "/")
          )
        ) {
          return true;
        } else if (
          userClickedField === "isAdmin" &&
          originalUser[userClickedField] === (userQueryContent === "✅")
        ) {
          return true;
        } else if (
          userClickedField === "username" &&
          originalUser[userClickedField].indexOf(userQueryContent) !== -1
        ) {
          return true;
        } else {
          return false;
        }
      });
    
    // First use variable `middleFilteredUsersList1` to store the query result.

    let middleFilteredUsersList2: UserInfo[]
      = isAscending
      ? (middleFilteredUsersList1.sort(
        (a, b) => 2 * Number(
          a[userClickedField] && 
          b[userClickedField] && 
          a[userClickedField] > b[userClickedField]
        ) - 1
      ))
      : (middleFilteredUsersList1.sort(
        (a, b) => 2 * Number(
          a[userClickedField] &&
          b[userClickedField] &&
          a[userClickedField] < b[userClickedField]
        ) - 1
      ));

    // Then we use variable `middleFilteredUsersList2` to store the sort result.
    // Notice `a[userClickedField]` and `b[userClickedField]` may be `null`, and
    // `null` can't be compared.

    let middleFilteredUsersList3: UserInfo[]
      = middleFilteredUsersList2.slice(
        PAGINATION_RECORDS_NUM * (paginationIndex - 1),
        Math.min(PAGINATION_RECORDS_NUM * paginationIndex, middleFilteredUsersList2.length),
      );

    setFilteredUsersList(middleFilteredUsersList3);
  }, [usersList, isAscending, userClickedField, userQueryContent, paginationIndex]);

  function handleRefreshUsers() {
    workingAPI.current
      .get("/manager/admin/users")
      .then((response: AxiosResponse<AdminGetUserListResponseData, any>) => {
          let newUsersList: UserInfo[] = response.data.data.users.map((rawUser): UserInfo => {
          return {
            defaultPhoneNumber: rawUser.default_phone,
            userID:             rawUser.id,
            username:           rawUser.username,
            isAdmin:            rawUser.is_admin
          };
        });
        setUsersList(newUsersList);
        setFilteredUsersList(newUsersList);
      })
      .catch((error: ErrorResponse) => {
        if (error.response.status === 401) {
          handleRefreshToken();
        } else {
          setAdminConsolePageError("AdminGetUsersListError");
        }
      });
  }

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
      .catch((error: ErrorResponse) => {
        if (error.response.status === 401) {
          handleRefreshToken();
        } else {
          setAdminConsolePageError("AddUserUnknownError");
        }
      });

    // So where is added user's phone number? The backend API doesn't support
    // adding users's phone number, but the UserInfo indeed has!
    
    // Notice that the userID is determined by the backend, so we need to refresh the
    // usersList
    
    handleRefreshUsers();
  }

  function handleResetPassword(
    userID: number,
    newPassword: string,
    confirmPassword: string
  ) {

  }
  
  function handleDeleteUser(userID: number) {
    workingAPI.current
      .delete("/manager/admin/user/" + userID)
      .catch((error: ErrorResponse) => {
        if (error.response.status === 401) {
          handleRefreshToken();
        } else {
          setAdminConsolePageError("DeleteUserUnknownError");
        }
      });
    
    // 😠 The document is wrong... We should use delete method rather than post

    handleRefreshUsers();
  }

  useEffect(() => handleRefreshUsers(), []);

  return (
    <div className="admin-console-page">
      <TopBar
        isAdmin={true}
        message={t("adminConsolePageName")}
        isDisabled={true}
      />
      <div className="admin-console-container">
        <UsersTableContainer 
          usersList={filteredUsersList}
          isAscending={isAscending}
          userQueryContent={userQueryContent}
          paginationIdex={paginationIndex}
          totalPaginationCount={totalPaginationCount}
          checkUsernameRepeated={checkUsernameRepeated}
          onChangAscending={setIsAscending}
          onChangeUserQueryContent={setUserQueryContent}
          onChangePaginationIndex={setPaginationIndex}
          onRefreshUsers={handleRefreshUsers}
          onAddUser={handleAddUser}
          onResetPassword={handleResetPassword}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </div>
  );
}

export default AdminConsolePage;
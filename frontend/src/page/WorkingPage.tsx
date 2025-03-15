import React, { 
  useEffect, 
  useState,
  useRef
} from "react";

import axios, { 
  AxiosResponse, 
  AxiosInstance, 
} from "axios";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";

import { 
  mdiPlus,
  mdiPencil,
  mdiDotsHorizontal,
  mdiTrashCanOutline,
  mdiRefresh
} from "@mdi/js";

import "./WorkingPage.css";
import TopBar from "../components/TopBar.tsx";
import AbstractModal from "../components/AbstractModal.tsx";
import AlertModal from "../components/AlertModal.tsx";
import TextFieldInput from "../components/TextFieldInput.tsx";

import { 
  PAGINATION_RECORDS_NUM,
  backendURL,
  getCurrentTime,
} from "../utility/utility.tsx";

import {
  LoginToken,
  CaseInfo,
  RefreshTokenResponseData,
  GetCasesResponseData,
  RawGetCurrentUserResponseData,
  UserInfo,
  ErrorResponse,
  AdminGetUserListResponseData,
  AddCaseResponseData
} from "../utility/interface.tsx";

// State :
//   1. Is in cases table page or clues table page, this can use 
//      userClickedCaseID whose type is 'string | null', when it's string,
//      then we know we should render clues table page rather than cases.
//      In clues table page there is a return button, and when user clicks
//      this button, React sets the userClickedCaseID to null.
//   2. queryField, user should click menu to select the field he wants to
//      query. There are three fields he can query
//        + "CaseID"
//        + "CaseName"
//        + "AddUserID"
//   3. casesData, this is the core data of Cases. 

interface AddingCaseModalPropType {
  message: string;
  handleAddCase: (caseID: string, caseName: string) => void;
  onCloseSignal: () => void;
}

/**
 * @description `TextFieldInput` is a common component, because the event handler
 * function related to it is textInputChange, which is a common event handler (
 * state `input` and `setInput`). But buttons are not so common because the
 * event handlers related to them vary from different states and states set 
 * functions.
 * @param {AddingCaseModalPropType} param0
 * @param {string} message
 * 
 */
function AddingCaseModal({ 
  message,
  handleAddCase,
  onCloseSignal
}: AddingCaseModalPropType) {
  const { t } = useTranslation();
  const [caseIDInput, setCaseIDInput] = useState<string>("");
  const [caseNameInput, setCaseNameInput] = useState<string>("");

  return (
    <AbstractModal 
      message={message}
      onCloseSignal={onCloseSignal}
    >
      <div className="case-id-input-container">
        <TextFieldInput 
          inputName="case-id-input"
          placeholder={t("addingCaseModalCaseIDInputPlaceholder")}
          textInputValue={caseIDInput}
          onTextInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCaseIDInput(e.target.value);
          }}
        />
      </div>
      <div className="case-name-input-container">
        <TextFieldInput 
          inputName="case-name-input"
          placeholder={t("addingCaseModalCaseNameInputPlaceholder")}
          textInputValue={caseNameInput}
          onTextInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCaseNameInput(e.target.value);
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
            handleAddCase(caseIDInput, caseNameInput);
            onCloseSignal();
          }}>
            {t("confirmButton")}
          </button>
        </div>
      </div>
    </AbstractModal>
  );
}

interface CaseRowPropType {
  caseRow: CaseInfo;
  usersList: Map<number, string>;
}

function CaseRow({ 
  caseRow,
  usersList
}: CaseRowPropType) {
  return (
    <tr key={caseRow.caseID}>
      <th scope="col" key={1}>{caseRow.caseID}</th>
      <th scope="col" key={2}>{caseRow.caseName}</th>
      <th scope="col" key={3}>{caseRow.clueCount}</th>
      <th scope="col" key={4}>{usersList.get(caseRow.addUserID)}</th>
      <th scope="col" key={5}>
        <div className="buttons-container">
          <div className="edit-button-container">
            <button
              className="edit-case"
            >
              <Icon 
                path={mdiPencil}
                size={0.6}
              />
            </button>
          </div>
          <div className="clues-button-container">
            <button 
              className="check-clues"
            >
              <Icon 
                path={mdiDotsHorizontal}
                size={0.6}
              />
            </button>
          </div>
          <div className="delete-button-container">
            <button className="delete-case">
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

interface CasesTableToolbarPropType {
  onAddCase: (addedCase: CaseInfo) => void;
  checkCaseIDRepeated: (caseID: string) => boolean;
  userInfo: UserInfo;
}

type AddingCaseError = 
  | "NetworkError"
  | "CaseIDSyntaxError"
  | "CaseIDRepeatedError"
  | "EmptyInputError"
  | "TokenOutdatedError"
  | "UnknownError"
  | null;

/**
 * @description `CasesTableToolbar` includes those functions: 
 * - Use a `TextFieldInput` to query the corresponding records;
 * - Use a button to add case, and there will be a @see {AddingCaseModal}
 *   `AddingCaseModal` to input the caseID and caseName
 * 
 */
function CasesTableToolbar({
  onAddCase,
  checkCaseIDRepeated,
  userInfo
}: CasesTableToolbarPropType) {

  const { t } = useTranslation();
  const [isShowingAddingCaseModal, setIsShowingAddingCaseModal] = useState<boolean>(false);
  const [addingCaseError, setAddingCaseError] = useState<AddingCaseError>(null);

  function handleAddCase(caseID: string, caseName: string) {
    if (caseID === "" || caseName === "") {
      setAddingCaseError("EmptyInputError");
      return;
    }
    if (!caseID.match(/^A\d{22}$/)) {
      setAddingCaseError("CaseIDSyntaxError");
      return;
    }
    if (checkCaseIDRepeated(caseID)) {
      setAddingCaseError("CaseIDRepeatedError");
      return;
    }
    onAddCase({
      caseID: caseID,
      caseName: caseName,
      addUserID: userInfo.userID,
      clueCount: 0
    });
    
    // Actually there is no need to pass the `WorkingAPI` or `RefreshTokenAPI` to the
    // children components, we only need to pass event handlers using those APIs.
  }

  return (
    <div className="cases-table-toolbar">
      <div className="query-form-container">
        <form 
          className="query-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <TextFieldInput 
            inputName="query-text-field"
            placeholder={t("queryTextInputPlaceholder")}
          />
        </form>
      </div>
      <div className="button-components">
        <div className="add-case-button-container">
          <button
            className="add-case-button"
            onClick={() => setIsShowingAddingCaseModal(true)}
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
      {isShowingAddingCaseModal && (
        <AddingCaseModal
          message={t("addingCaseModalTitle")}
          handleAddCase={handleAddCase}
          onCloseSignal={() => setIsShowingAddingCaseModal(false)}
        />
      )}
      {addingCaseError && (
        <AlertModal 
          message={
            "[" + getCurrentTime() + "]: "
              +  (addingCaseError === "NetworkError"
              ? t("addingCaseNetworkError")
              :   addingCaseError === "CaseIDSyntaxError"
              ? t("addingCaseIDSyntaxError")
              :   addingCaseError === "EmptyInputError"
              ? t("addingCaseEmptyInputError")
              :   addingCaseError === "CaseIDRepeatedError"
              ? t("addingCaseIDRepeatedError")
              :   addingCaseError === "TokenOutdatedError"
              ? t("addingCaseTokenOutdatedError")
              : t("addingCaseUnknownError"))
          }
          onCloseSignal={() => setAddingCaseError(null)}
        />
      )}
    </div>
  );
}

interface CasesTablePropType {
  casesData: CaseInfo[];
  usersList: Map<number, string>;
}

function CasesTable({
  casesData,
  usersList
}: CasesTablePropType) {
  const { t } = useTranslation();
  return (
    <table className="cases-table">
      <thead>
        <tr key={0}>
          <th scope="col" key={1}>{t("caseID")}</th>
          <th scope="col" key={2}>{t("caseName")}</th>
          <th scope="col" key={3}>{t("clueCount")}</th>
          <th scope="col" key={4}>{t("addUserName")}</th>
          <th scope="col" key={5}>{t("editButtons")}</th>
        </tr>
      </thead>
      <tbody>
        {casesData.map((caseRow) => {
          return <CaseRow 
            caseRow={caseRow} 
            usersList={usersList}
            key={caseRow.caseID} 
          />
        })}
      </tbody>
    </table>
  );
}

interface CasesTableContainerPropType {
  casesData: CaseInfo[];
  onAddCase: (addedCase: CaseInfo) => void;
  checkCaseIDRepeated: (caseID: string) => boolean;
  usersList: Map<number, string>;
  userInfo: UserInfo;
}

function CasesTableContainer({
  casesData,
  onAddCase,
  checkCaseIDRepeated,
  usersList,
  userInfo
}: CasesTableContainerPropType) {

  return (
    <div className="cases-table-container">
      <CasesTableToolbar 
        onAddCase={onAddCase} 
        checkCaseIDRepeated={checkCaseIDRepeated}
        userInfo={userInfo}
      />
      <CasesTable 
        casesData={casesData} 
        usersList={usersList}
      />
    </div>
  );
}

interface CluesTableContainerPropType {
  casesData: CaseInfo[];
}

function CluesTableContainer({
  casesData
}: CluesTableContainerPropType) {

  return (
    <div className="clues-table-container">

    </div>
  )
}

interface WorkingPagePropType {
  token: LoginToken; 
  onChangeToken: React.Dispatch<React.SetStateAction<LoginToken>>;
};

type QueryFieldType =
  | "CaseID"
  | "CaseName"
  | "AddUserID";

type WorkingPageError =
  | "RefreshTokenOutdatedError"
  | "GetCasesUnknownError"
  | "GetCurrentUserUnknownError"
  | "AdminGetUsersListError"
  | null;

function WorkingPage({
  token,
  onChangeToken
}: WorkingPagePropType) {
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

  const userInfo = useRef<UserInfo | null>(null);
  const usersInfoMap = useRef<Map<number, string>>(new Map());

  const navigate = useNavigate();

  const { t } = useTranslation();
  const [casesData, setCasesData] = useState<CaseInfo[]>([]);
  const [userClickedCaseID, setUserClickedCaseID] = useState<string | null>(null);
  const [paginationIndex, setPaginationIndex] = useState<number>(1);
  const [workingPageError, setWorkingPageError] = useState<WorkingPageError>(null);

  const totalPaginationCount = useRef<number>(1);

  function handleAddCase(addedCase: CaseInfo) {
    workingAPI.current
      .post("/cases/case", {
        "case_id":    addedCase.caseID,
        "case_name":  addedCase.caseName
      })
      .then((response: AxiosResponse<AddCaseResponseData, any>) => {
        console.log(response.data);
      });

    setCasesData([addedCase, ...casesData]);
    totalPaginationCount.current
      = ((casesData.length - 1) + 1) / PAGINATION_RECORDS_NUM + 1;
    
    // Because setCasesData will wait for the next render, the casesData is still
    // the same with previous state. So here we need manually add the 1.
  }

  function checkCaseIDRepeated(caseID: string): boolean {
    for (const caseData of casesData) {
      if (caseData.caseID === caseID) {
        return true;
      }
    }
    return false;
  }

  function handleQueryTextField(queryField: QueryFieldType, queryText: string) {

  }

  function handleDeleteCase() {

  }

  function handleChangeCase() {

  }

  useEffect(() => {
    workingAPI.current
      .get("/cases/case")
      .then((response: AxiosResponse<GetCasesResponseData, any>) => {
        const cases: CaseInfo[] = response.data.data.map((rawCase): CaseInfo => {
          return {
            addUserID:  rawCase.add_user_id,
            caseID:     rawCase.case_id,
            caseName:   rawCase.case_name,
            clueCount:  rawCase.clue_count
          };
        });
        setCasesData(cases);
        totalPaginationCount.current = (cases.length - 1) / PAGINATION_RECORDS_NUM + 1;
      })
      .catch((error: ErrorResponse) => {
        if (error.response.status === 401) {

          // If the serve response 401 status, then user need to refresh his
          // token, and re-store this token to the local storage.

          refreshTokenAPI.current
            .post("/manager/refresh")
            .then((response: AxiosResponse<RefreshTokenResponseData, any>) => {
              onChangeToken({
                JWTAccessToken: response.data.access_token,
                JWTRefreshToken: token.JWTRefreshToken
              });
            })
            .catch((error: ErrorResponse) => {
              setWorkingPageError("RefreshTokenOutdatedError");
              setTimeout(() => {
                setWorkingPageError(null);
                navigate("/login");
              }, 3000);
            })
        } else {
          setWorkingPageError("GetCasesUnknownError");
        }
      });

    workingAPI.current
      .get("/manager/getCurrentUser")
      .then((response: AxiosResponse<RawGetCurrentUserResponseData, any>) => {
        userInfo.current = {
          defaultPhoneNumber: response.data.data.users.default_phone,
          userID:             response.data.data.users.id,
          isAdmin:            response.data.data.users.is_admin,
          userName:           response.data.data.users.username
        };
      })
      .catch((error: ErrorResponse) => {
        setWorkingPageError("GetCurrentUserUnknownError");

        // We have refreshed token in getting cases process, if there is still a
        // 401 error, it's unnecessary to refresh token again.
      });

    // For 'useRef' the RefObject will not be changed before the next render.
    // So in this 'useEffect' function, if we use the 'userInfo.isAdmin' to
    // decide whether to get the users list, we will never get the right answer!

    workingAPI.current
      .get("/manager/admin/users")
      .then((response: AxiosResponse<AdminGetUserListResponseData, any>) => {
        response.data.data.users.forEach((user) => {
          usersInfoMap.current.set(user.id, user.username);

          // In working page, we only need to get the k-v Map for users' info.
        });
      })
      .catch((error: ErrorResponse) => {
        setWorkingPageError("AdminGetUsersListError");
      });

  }, []);

  // If there add 'workingAPI' to the dependency array, then the page will
  // refresh token continuously.

  return (
    <div className="working-page">
      <TopBar 
        isAdmin={userInfo.current?.isAdmin}
        message={t("workingPageName")} 
      />
      <div className="working-container">
        {(userClickedCaseID === null) ? (
          <CasesTableContainer
            casesData={casesData}
            onAddCase={handleAddCase}
            checkCaseIDRepeated={checkCaseIDRepeated}
            usersList={usersInfoMap.current}
            userInfo={userInfo.current ? userInfo.current : {
              defaultPhoneNumber: null,
              userID: -1,
              userName: "",
              isAdmin: false,
            }}
          />
        ) : (
          <CluesTableContainer casesData={casesData} />
        )}
      </div>
      {workingPageError &&
        <AlertModal 
          message={
            "[" + getCurrentTime() + "]: "
            +  (workingPageError === "RefreshTokenOutdatedError"
            ? t("workingPageLoadingRefreshTokenOutdatedError")
            :   workingPageError === "GetCasesUnknownError"
            ? t("workingPageLoadingGetCasesUnknownError")
            :   workingPageError === "GetCurrentUserUnknownError"
            ? t("workingPageLoadingGetCurrentUserUnknownError")
            :  (workingPageError === "AdminGetUsersListError" && userInfo.current?.isAdmin)
            ? t("workingPageAdminGetUsersListError")
            : t("workingPageLoadingUnknownError"))
          }
          onCloseSignal={() => setWorkingPageError(null)}
        />
      }
    </div>
  );
}

export default WorkingPage;
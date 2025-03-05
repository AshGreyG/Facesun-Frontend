import React, { 
  useEffect, 
  useState,
  useReducer
} from "react";
import axios, { AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";

import "./WorkingPage.css";
import SwitchLanguageBar from "../components/SwitchLanguageBar.tsx";
import { 
  backendURL,
  getCurrentTime,
  LoginToken,
} from "../utility/utility.tsx";

import {
  RawCaseInfo,
  CaseInfo,
  RefreshTokenResponseData,
  GetCasesResponseData,
  ErrorResponse
} from "../utility/interface.tsx";

interface CaseRowPropType {
  caseRow: CaseInfo;
}

function CaseRow({ caseRow }: CaseRowPropType) {
  return (
    <tr key={caseRow.caseID}>
      <th scope="col" key={1}>{caseRow.caseID}</th>
      <th scope="col" key={2}>{caseRow.caseName}</th>
      <th scope="col" key={3}>{caseRow.clueCount}</th>
      <th scope="col" key={4}>{caseRow.addUserID}</th>
    </tr>
  );
}

interface CasesTableContainerPropType {
  casesData: CaseInfo[];
}

function CasesTableContainer({
  casesData,
}: CasesTableContainerPropType) {
  const {t} = useTranslation();

  return (
    <div className="cases-table-container">
      <table className="cases-table">
        <thead>
          <tr key={0}>
            <th scope="col" key={1}>{t("caseID")}</th>
            <th scope="col" key={2}>{t("caseName")}</th>
            <th scope="col" key={3}>{t("clueCount")}</th>
            <th scope="col" key={4}>{t("addUserID")}</th>
          </tr>
        </thead>
        <tbody>
          {casesData.map((caseRow) => {
            return <CaseRow caseRow={caseRow} key={caseRow.caseID}/>
          })}
        </tbody>
      </table>
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

function WorkingPage({
  token,
  onChangeToken
}: WorkingPagePropType) {
  const workingAPI = axios.create({
    baseURL: backendURL,
    timeout: 5000,
    headers: {
      "Authorization": "Bearer " + token.JWTAccessToken,
      "Content-Type": "application/json"
    }
  });

  const refreshTokenAPI = axios.create({
    baseURL: backendURL,
    timeout: 5000,
    headers: {
      "Authorization": "Bearer " + token.JWTRefreshToken,
      "Content-Type": "application/json"
    }
  });

  const {t} = useTranslation();
  const [casesData, setCasesData] = useState<CaseInfo[]>([]);
  const [isInCases, setIsInCases] = useState<boolean>(true);

  useEffect(() => {
    workingAPI
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
      })
      .catch((error: ErrorResponse) => {
        if (error.response.status === 401) {

          // If the serve response 401 status, then user need to refresh his
          // token, and re-store this token to the local storage.

          refreshTokenAPI
            .post("/manager/refresh")
            .then((response: AxiosResponse<RefreshTokenResponseData, any>) => {
              onChangeToken({
                JWTAccessToken: response.data.access_token,
                JWTRefreshToken: token.JWTRefreshToken
              });
            })
            .catch((error: ErrorResponse) => {
              alert("❌ Can't update");
            })
        } else {
          alert("Unknown Error");
        }
      })
  }, []);

  // 

  return (
    <div className="working-page">
      <SwitchLanguageBar />
      <div className="cases-container">
        {isInCases ? (
          <CasesTableContainer casesData={casesData} />
        ) : (
          <CluesTableContainer casesData={casesData} />
        )}
      </div>
    </div>
  );
}

export default WorkingPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import SwitchLanguageBar from "../components/SwitchLanguageBar.tsx";
import { 
  backendURL,
  getCurrentTime,
  LoginToken,
  // useRefreshToken
} from "../utility/utility.tsx";

interface WorkingPagePropType {
  token: LoginToken; 
  onChangeToken: React.Dispatch<React.SetStateAction<LoginToken>>;
};

interface RawCaseInfo {
  add_user_id: number;
  case_id: number;
  case_name: string;
  clue_count: number;
};

// The naming rule is not matching frontend naming rules.
// So I will process it.

interface CaseInfo {
  addUserID: number;
  caseID: number;
  caseName: string;
  clueCount: number;
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
  const {t} = useTranslation();
  const [casesData, setCasesData] = useState<CaseInfo[]>(() => {
    const storedCasesData = localStorage.getItem("casesData");
    return storedCasesData 
      ? JSON.parse(storedCasesData) as CaseInfo[] 
      : [] as CaseInfo[];
  });

  useEffect(() => {
    localStorage.setItem("casesData", JSON.stringify(casesData));
  }, [casesData]);

  const handleGetCases = () => {
    console.log("[" + getCurrentTime() + "]: Getting cases, please wait...");
    workingAPI
      .get("/cases/case")
      .then(response => {
        const rawCasesArray: RawCaseInfo[] = response.data.data;

        // The first 'data' is the property of 'response'
        // The second 'data' is the backend-defined property.

        setCasesData(rawCasesArray.map(rawCase => {
          return {
            addUserID:  rawCase.add_user_id,
            caseID:     rawCase.case_id,
            caseName:   rawCase.case_name,
            clueCount:  rawCase.clue_count
          }
        }));

        // Here I use 'map' function to map the RawCaseInfo[] to CaseInfo[]
        console.log("[" + getCurrentTime() + "]: Finish getting cases.");
      })
      .catch(error => {
        if (error.response.status === 401) {
          // useRefreshToken();
        }
      })
  };

  return (
    <div className="working-page">
      <SwitchLanguageBar />
      <div className="container">

      </div>
    </div>
  )
}

export default WorkingPage;
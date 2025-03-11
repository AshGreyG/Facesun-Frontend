export interface RawCaseInfo {
  add_user_id: string;
  case_id: string;
  case_name: string;
  clue_count: number;
};

// The naming rule is not matching frontend naming rules.
// So I will process it using Array method 'map'

export interface CaseInfo {
  addUserID: string;
  caseID: string;
  caseName: string;
  clueCount: number;
};

export interface LoginTokenResponseData {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenResponseData {
  access_token: string;
}

export interface GetCasesResponseData {
  data: RawCaseInfo[];
  message: string;
}

export interface RawGetCurrentUserResponseData {
  data: {
    users: {
      default_phone: string | null;
      id: number;
      is_admin: boolean;
      username: string;
    }
  }
  message: string;
}

export interface UserInfo {
  defaultPhoneNumber?: string | null;
  userID: number;
  isAdmin: boolean;
  userName: string;
}

export interface AddCaseResponseData {
  message: string;
}

export interface ErrorResponse {
  response: {
    status: number;
  }
}
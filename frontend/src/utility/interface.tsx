export interface LoginToken {
  JWTAccessToken: string;
  JWTRefreshToken: string;
}

export interface RawCaseInfo {
  add_user_id: number;
  case_id: string;
  case_name: string;
  clue_count: number;
};

// The naming rule is not matching frontend naming rules.
// So I will process it using Array method 'map'

export interface CaseInfo {
  addUserID: number;
  caseID: string;
  caseName: string;
  clueCount: number;
};

export interface RawUserInfo {
  default_phone: string | null;
  id: number;
  is_admin: boolean;
  username: string;
}

export interface UserInfo {
  defaultPhoneNumber: string | null;
  userID: number;
  isAdmin: boolean;
  username: string;
}

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
    users: RawUserInfo;
  };
  message: string;
}

export interface AdminGetUserListResponseData {
  data: {
    users: RawUserInfo[];
  };
  message: string;
}

export interface AddCaseResponseData {
  message: string;
}

export interface ErrorResponse {
  response: {
    status: number;
  }
}
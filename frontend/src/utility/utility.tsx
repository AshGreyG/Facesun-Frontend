export const backendURL: string = "http://127.0.0.1:5000";

export const PAGINATION_RECORDS_NUM: number = 10;
export const ADMIN_USER_ID: string = "1";

export interface LoginToken {
  JWTAccessToken: string;
  JWTRefreshToken: string;
}

export function getCurrentTime(): string {
  const now = new Date();
  return `${now.getFullYear()}`
    + `-${String(now.getMonth()        + 1).padStart(2, "0")}`
    + `-${String(now.getDay()          + 1).padStart(2, "0")}`
    + `-${String(now.getHours()        + 1).padStart(2, "0")}`
    + `:${String(now.getSeconds()      + 1).padStart(2, "0")}`
    + `:${String(now.getMilliseconds() + 1).padStart(4, "0")}`;
}
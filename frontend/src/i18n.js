import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const languageResources = {
  en: {
    translation: {

      // Common Words

      "confirmButton": "✅ Confirm",
      "cancelButton": "❌ Cancel",

      // Login Page Translation

      "loginPage": "Login Page",
      "loginUsername": "Username",
      "loginPassword": "Password",
      "loginButtonContent": "Login",
      "noAccountInfo": "Don't have an account?",
      "registerButtonContent": "Register here",

      "loginInfoSuccess": "Login successfully, please wait for 3s",
      "loginInfoFail": "Login failed, the username or password is incorrect or does not exist",
      "loginInfoUnknownError": "Unknown error occurs",

      // Working Page Translation

      "workingPageName": "Edit Cases & Clues",
      "caseID": "Case ID",
      "caseName": "Case Name",
      "clueCount": "Clue Count",
      "addUserName": "Add User Name",
      "editButtons": "Edit",

      "addingCaseModalTitle": "Add Case",
      "addingCaseModalCaseIDInputPlaceholder": "Case ID",
      "addingCaseModalCaseNameInputPlaceholder": "Case Name",
      "queryTextInputPlaceholder": "Query for something...",

      "deletingCaseModalTitle": "Delete Case",
      "deletingCaseModalMessage": "Are you sure to delete this case?",

      "editingCaseModalTitle": "Edit Case",
      "editingCaseIDSyntaxError": "Wrong case ID syntax, please check your case ID and retry later",
      "editingCaseEmptyInputError": "Case ID or Case Name input field are empty",
      "editingCaseIDRepeatedError": "Repeated Case ID",

      "addingCaseIDSyntaxError": "Wrong case ID syntax, please check your case ID and retry later",
      "addingCaseEmptyInputError": "Case ID or Case Name input field are empty",
      "addingCaseIDRepeatedError": "Repeated Case ID",
      "addingCaseUnknownError": "Unknown error occurs",
      "workingPageLoadingRefreshTokenOutdatedError": "Your refresh token has been outdated, the page will navigate to login page automatically in 3s",
      "workingPageLoadingGetCasesUnknownError": "Unknown error occurs when getting cases",
      "workingPageLoadingGetCurrentUserUnknownError": "Unknown error occurs when getting current user info",
      "workingPageAdminGetUsersListError": "Error occurs when admin getting users info list",
      "workingPageLoadingUnknownError": "Unknown error occurs",

      // Admin Console Page Translation

      "adminConsolePageName": "Manage Accounts",
      "userID": "User ID",
      "userName": "Username",
      "phoneNumber": "Tel.",
      "addingUserUsernameInputPlaceholder": "Username",
      "addingUserPasswordInputPlaceholder": "Password",
      "addingUserConfirmInputPlaceholder": "Confirm Your Password"
    }
  },
  zh: {
    translation: {

      // Common Words

      "confirmButton": "✅ 确认",
      "cancelButton": "❌ 取消",

      // Login Page Translation

      "workingPageName": "案件与线索编辑",
      "loginPage": "登录",
      "loginUsername": "用户名",
      "loginPassword": "密码",
      "loginButtonContent": "登录",
      "noAccountInfo": "还没有账号？",
      "registerButtonContent": "在这里注册",

      "loginInfoSuccess": "登录成功，等待 3 秒后自动跳转",
      "loginInfoFail": "登录失败，用户名或密码可能错误或者不存在",
      "loginInfoUnknownError": "未知错误",

      // Working Page Translation

      "caseID": "案件编号",
      "caseName": "案件名称",
      "clueCount": "线索数量",
      "addUserName": "案件添加人",
      "editButtons": "编辑",

      "addingCaseModalTitle": "增加案件",
      "addingCaseModalCaseIDInputPlaceholder": "案件编号",
      "addingCaseModalCaseNameInputPlaceholder": "案件名称",
      "queryTextInputPlaceholder": "搜索...",

      "deletingCaseModalTitle": "删除案件",
      "deletingCaseModalMessage": "你确定要删除这个案件吗？",

      "editingCaseModalTitle": "编辑案件",

      "addingCaseIDSyntaxError": "案件编号错误，请检查案件编号并重试",
      "addingCaseEmptyInputError": "案件编号或案件名称为空",
      "addingCaseIDRepeatedError": "案件编号重复",
      "addingCaseUnknownError": "未知错误",
      "workingPageLoadingRefreshTokenOutdatedError": "您的 refresh token 已过期，将在 3 秒内自动跳回登录页面",
      "workingPageLoadingGetCasesUnknownError": "在获取案件列表时发生未知错误",
      "workingPageLoadingGetCurrentUserUnknownError": "在获取用户信息时发生未知错误",
      "workingPageAdminGetUsersListError": "管理员在获取用户列表时出现错误",
      "workingPageLoadingUnknownError": "未知错误",

      // Admin Console Page Translation

      "adminConsolePageName": "账户管理",
      "userID": "用户编号",
      "userName": "用户名",
      "phoneNumber": "联系电话"
    }
  }
};

i18n.use(initReactI18next).init({
  lng: "en",
  interpolation: {
    escapeValue: false
  },
  resources: languageResources
});

export default i18n;
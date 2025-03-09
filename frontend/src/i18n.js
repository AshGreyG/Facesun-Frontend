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

      // Working Page Translation

      "workingPageName": "Edit Cases & Clues",
      "caseID": "Case ID",
      "caseName": "Case Name",
      "clueCount": "Clue Count",
      "addUserID": "Add User ID",
      "addingCaseModalTitle": "Add Case",
      "addingCaseModalCaseIDInputPlaceholder": "Case ID",
      "addingCaseModalCaseNameInputPlaceholder": "Case Name",
      "addingCaseNetworkError": "Network error occurs, please refresh your web page or check your network",
      "addingCaseIDSyntaxError": "Wrong case ID, please check your case ID and retry later",
      "addingCaseEmptyInputError": "Case ID or Case Name input field are empty",
      "addingCaseUnknownError": "Unknown error occurs"
    }
  },
  zh: {
    translation: {

      // Common Words

      "confirmButton": "✅ 确认",
      "cancelButton": "❌ 取消",

      // Login Page Translation

      "workingPageName": "案件线索编辑",
      "loginPage": "登录",
      "loginUsername": "用户名",
      "loginPassword": "密码",
      "loginButtonContent": "登录",
      "noAccountInfo": "还没有账号？",
      "registerButtonContent": "在这里注册",

      // Working Page Translation

      "caseID": "案件编号",
      "caseName": "案件名称",
      "clueCount": "线索数量",
      "addUserID": "案件添加人",
      "addingCaseModalTitle": "增加案件",
      "addingCaseModalCaseIDInputPlaceholder": "案件编号",
      "addingCaseModalCaseNameInputPlaceholder": "案件名称",
      "addingCaseNetworkError": "网络错误，请刷新页面或检查您的网络",
      "addingCaseIDSyntaxError": "案件编号错误，请检查案件编号并重试",
      "addingCaseEmptyInputError": "案件编号或案件名称为空",
      "addingCaseUnknownError": "未知错误"
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
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const languageResources = {
  en: {
    translation: {

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
      "addingCaseModalTitle": "Add Case"
    }
  },
  zh: {
    translation: {

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
      "addingCaseModalTitle": "增加案件"
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
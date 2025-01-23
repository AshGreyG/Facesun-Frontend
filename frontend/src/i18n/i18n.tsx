import i18next from "i18next";

const languageResources = {
  en: {
    translation: {

      // Login Page Translation

      "loginPage": "Login Page",
      "loginUsername": "Username",
      "loginPassword": "Password",
      "loginButtonContent": "Login",
      "noAccountInfo": "Don't have an account?",
      "registerButtonContent": "Register here"
    }
  },
  zh: {
    translation: {

      // Login Page Translation

      "loginPage": "登录",
      "loginUsername": "用户名",
      "loginPassword": "密码",
      "loginButtonContent": "登录",
      "noAccountInfo": "还没有账号？",
      "registerButtonContent": "在这里注册"
    }
  }
};

i18next.init({
  lng: "en",
  interpolation: {
    escapeValue: false
  },
  resources: languageResources
});

export default i18next;
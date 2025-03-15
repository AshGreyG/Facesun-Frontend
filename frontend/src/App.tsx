import React, { 
  useEffect, 
  useState 
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { LoginToken } from "./utility/interface.tsx";
import LoginPage from "./page/LoginPage.tsx";
import WorkingPage from "./page/WorkingPage.tsx";
import AdminConsolePage from "./page/AdminConsolePage.tsx";

// State:
// userLoginToken changes over time, and it's from backend, so it's
// a state. Every route needs userLoginToken, so it should be handled
// by App. Because we need jump among different route pages, and the
// state / context will be reloaded, so we need use localStorage or
// cookie to store the token.

function App() {
  const [userLoginToken, setUserLoginToken] 
    = useState<LoginToken>((): LoginToken => {
      const storedToken: string | null = localStorage.getItem("userLoginToken");
      return storedToken
        ? JSON.parse(storedToken) as LoginToken
        : {
          JWTAccessToken: "",
          JWTRefreshToken: ""
        };
    });

  // This is to get the token from local storage, if there is no
  // 'userLoginToken' in local storage, then initialize the token

  useEffect(() => {
    localStorage.setItem("userLoginToken", JSON.stringify(userLoginToken));
  }, [userLoginToken]);

  return (
    <Router>
      <Routes>
        <Route 
          path="login" 
          element={
            <LoginPage 
              token={userLoginToken}
              onChangeToken={setUserLoginToken}
            />
          }
        />
        <Route 
          path="working" 
          element={
            <WorkingPage 
              token={userLoginToken}
              onChangeToken={setUserLoginToken}
            />
          } 
        />
        <Route
          path="admin"
          element={
            <AdminConsolePage 
              token={userLoginToken}
              onChangeToken={setUserLoginToken}
            />
          }
        />
      </Routes>
    </Router>
  )
}

export default App;

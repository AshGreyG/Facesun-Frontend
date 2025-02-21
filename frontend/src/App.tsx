import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { LoginToken } from "./utility/utility.tsx";
import LoginPage from "./page/LoginPage.tsx";
import WorkingPage from "./page/WorkingPage.tsx";

// State:
// userLoginToken changes over time, and it's from backend, so it's
// a state. Every route needs userLoginToken, so it should be handled
// by App.

function App() {
  const [userLoginToken, setUserLoginToken] = useState<LoginToken>(() => {
    const storedToken = localStorage.getItem("userLoginToken");
    return storedToken ? JSON.parse(storedToken) : {
      JWTAccessToken: "",
      JWTRefreshToken: ""
    }
  });

  useEffect(() => {
    localStorage.setItem("userLoginToken", JSON.stringify(userLoginToken));
  }, [userLoginToken])

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
      </Routes>
    </Router>
  )
}

export default App;

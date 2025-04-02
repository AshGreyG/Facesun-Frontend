import React from "react";
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { 
  mdiTranslate,
  mdiShieldAccount,
  mdiAccountChildCircle
} from "@mdi/js"

import "./TopBar.css"

interface TopBarPropType {
  isAdmin?: boolean;
  message?: string;
  isDisabled?: boolean;
}

function TopBar({ 
  isAdmin,
  message,
  isDisabled
}: TopBarPropType) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  function handleSwitchLanguage() {
    if (i18n.language === "en") {
      i18n.changeLanguage("zh");
    } else {
      i18n.changeLanguage("en");
    }
  };

  return (
    <div className="top-bar">
      <div className="message-component">
        {message}
      </div>
      <div className="button-components">
        <div className="switch-button-container">
          <button
            className="switch-button top-bar-button"
            onClick={handleSwitchLanguage}
          >
            <Icon
              path={mdiTranslate}
              size={1}
            />
          </button>
        </div>
        {(isAdmin) ? (
          <div className="admin-console-button-container">
            <button
              className="admin-console-button top-bar-button"
              onClick={() => navigate("/admin")}
              disabled={isDisabled}
            >
              <Icon
                path={mdiShieldAccount}
                size={1}
              />
            </button>
          </div>
        ) : (
          <div className="user-profile-button-container">
            <button 
              className="user-profile-button top-bar-button"
              onClick={() => navigate("/profile")}
            >
              <Icon
                path={mdiAccountChildCircle}
                size={1}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;
import React from "react";
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next";

import { 
  mdiTranslate,
  mdiShieldAccount
} from "@mdi/js"

import "./TopBar.css"

interface TopBarPropType {
  isAdmin?: boolean;
  message?: string;
}

function TopBar({ 
  isAdmin,
  message,
}: TopBarPropType) {
  const { i18n } = useTranslation();

  function handleSwitchLanguage() {
    if (i18n.language === "en") {
      i18n.changeLanguage("zh");
    } else {
      i18n.changeLanguage("en");
    }
  };

  function handleNavigateAdminConsole() {

  }

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
        {(isAdmin) && (
          <div className="admin-console-button-container">
            <button
              className="admin-console-button top-bar-button"
              onClick={handleNavigateAdminConsole}
            >
              <Icon
                path={mdiShieldAccount}
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
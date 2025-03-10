import React from "react";
import Icon from "@mdi/react"
import { mdiTranslate } from "@mdi/js"
import { useTranslation } from "react-i18next";

import "./TopBar.css"

interface TopBarPropType {
  message?: string;
}

function TopBar({ 
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

  return (
    <div className="switch-language-bar">
      <div className="message-component">
        {message}
      </div>
      <div className="switch-button-container">
        <button
          className="switch-button"
          onClick={handleSwitchLanguage}
        >
          <Icon
            path={mdiTranslate}
            size={1}
          />
        </button>
      </div>
    </div>
  );
}

export default TopBar;
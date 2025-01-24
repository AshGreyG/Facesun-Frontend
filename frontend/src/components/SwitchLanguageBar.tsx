import React from "react";
import Icon from "@mdi/react"
import { mdiTranslate } from "@mdi/js"
import { useTranslation } from "react-i18next";

import "./SwitchLanguageBar.css"

function SwitchLanguageBar() {
  const { t, i18n } = useTranslation();
  const handleSwitchLanguage = () => {
    if (i18n.language === "en") {
      i18n.changeLanguage("zh");
    } else {
      i18n.changeLanguage("en");
    }
  };

  return (
    <div className="switch-language-bar">
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
  )
}

export default SwitchLanguageBar;
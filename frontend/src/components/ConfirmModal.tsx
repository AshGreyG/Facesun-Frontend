import React from "react";

import AbstractModal from "./AbstractModal.tsx";
import "./ConfirmModal.css"
import { useTranslation } from "react-i18next";

interface ConfirmModalPropType {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmModal({
  title,
  message,
  onCancel,
  onConfirm
}: ConfirmModalPropType) {
  const { t } = useTranslation();

  return (
    <AbstractModal
      message={title}
      onCloseSignal={onCancel}
    >
      <div className="confirm-modal-container">
        <div className="confirm-message">
          {message}
        </div>
        <div className="button-container">
          <div className="cancel-button-container">
            <button onClick={onCancel}>
              {t("cancelButton")}
            </button>
          </div>
          <div className="confirm-button-container">
            <button onClick={onConfirm}>
              {t("confirmButton")}
            </button>
          </div>
        </div>
      </div>
    </AbstractModal>
  );
}

export default ConfirmModal;
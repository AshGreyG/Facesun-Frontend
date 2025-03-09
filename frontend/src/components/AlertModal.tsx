import React from "react";

import AbstractModal from "./AbstractModal.tsx";

interface AlertModalPropType {
  message: string;
  onCloseSignal: () => void;
}

function AlertModal({ 
  message,
  onCloseSignal
}: AlertModalPropType) {
  return (
    <AbstractModal onCloseSignal={onCloseSignal}>
      <div className="alert-modal-container">
        {message}
      </div>
    </AbstractModal>
  )
}

export default AlertModal;
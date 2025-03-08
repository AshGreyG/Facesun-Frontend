import React, { 
  useEffect, 
  useState 
} from "react";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

import "./AbstractModal.css"

interface AbstractModalPropType {
  message?: string;
  children: React.ReactNode;
  onCloseSignal: () => void;
}

function AbstractModal({ 
  message,
  children,
  onCloseSignal
}: AbstractModalPropType) {
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => setActive(true), []);

  return (
    <div className={`abstract-modal-background ${active ? "active" : ""}`}>
      <div className="modal-container">
        <div className="headline">
          <div className="headline-title">
            {message}
          </div>
          <button 
            className="close-button"
            onClick={() => {
              setActive(false);
              setTimeout(() => onCloseSignal(), 150);
            }}
          >
            <Icon
              path={mdiClose}
              size={0.8}
            />
          </button>
        </div>
        <div className="children-component">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AbstractModal;
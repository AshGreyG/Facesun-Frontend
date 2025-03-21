import React, { 
  useEffect, 
  useState 
} from "react";

import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

import "./AbstractModal.css"

/**
 * This is the interface of `AbstractModal` component props.
 * @interface
 */
interface AbstractModalPropType {
  /** 
   * `message` is an optional property, it is the message shown on the left-top corner 
   * of the modal derived from this `AbstractModal`.
   * @type {string | undefined} 
   */
  message?: string;
  /** 
   * `children` is the children components or React nodes in the `AbstractModal`, 
   * such as 'AlertModel' is the derived component of 'AbstractModal', it has message 
   * React node.
   * @type {React.ReactNode}
   */
  children: React.ReactNode;
  /**
   * `onCloseSignal` is the outer close event handler function passed by props. The 
   * `close-button` will trigger this `onCloseSignal` function
   * @type {() => void} 
   */
  onCloseSignal: () => void;
}

/**
 * @description This component is like the base class of different modals,
 * such as `AlertModal` and `AddCaseModal` etc. It receives children components
 * to render them in its UI region and messages to show them at the top-left
 * corner of it.
 * @param {AbstractModalPropType} param0 
 * @param {string} param0.message An optional property, it is the message shown 
 * on the left-top corner of the modal derived from this `AbstractModal`
 * @param {React.ReactNode} param0.children The children components or React nodes 
 * in the `AbstractModal`, such as 'AlertModel' is the derived component of 
 * 'AbstractModal', it has message React node.
 * @param {() => void} param0.onCloseSignal The outer close event handler function 
 * passed by props. The `close-button` will trigger this `onCloseSignal`function
 * @returns This function returns the `AbstractModal` component, which is the
 * base component of other `*Modal`s
 */
function AbstractModal({
  message,
  children,
  onCloseSignal
}: AbstractModalPropType) {
  const [active, setActive] = useState<boolean>(false);

  // This state is used for add `active` class name to the container, it's to produce
  // the animation of this `AbstractModal` component

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
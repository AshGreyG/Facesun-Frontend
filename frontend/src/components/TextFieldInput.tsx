import React from "react";

import "./TextFieldInput.css"

interface TextFieldInputPropType {
  inputName: string;
  placeholder?: string;
  textInputValue?: string;
  onTextInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function TextFieldInput({ 
  inputName,
  placeholder,
  textInputValue,
  onTextInputChange
}: TextFieldInputPropType) {
  return (
    <div className="text-field-container">
      <input
        type="text"
        className={`${inputName} text-field-input`}
        placeholder={placeholder}
        value={textInputValue}
        onChange={onTextInputChange}
      />
    </div>
  );
}

export default TextFieldInput;
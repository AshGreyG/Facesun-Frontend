import React from "react";

interface TextFieldInputPropType {
  inputName: string;
  placeholder?: string;
}

function TextFieldInput({ 
  inputName,
  placeholder 
}: TextFieldInputPropType) {
  return (
    <input
      type="text" 
      className={inputName}
      placeholder={placeholder}
    />
  );
}

export default TextFieldInput;
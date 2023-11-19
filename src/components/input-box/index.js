import React from "react";
import "./index.css";

const InputBox = (props) => {
  const {
    inputType,
    inputMode,
    label,
    name,
    errorText,
    helperText,
    onBlur,
    onChange,
  } = props;

  return (
    <div className={`input-group${(errorText && " input-group-danger") || ""}`}>
      <label className="input-filled">
        <input
          type={inputType}
          inputMode={inputMode}
          placeholder=" "
          name={name}
          onBlur={onBlur}
          onChange={onChange}
        />
        <span className="input-label">{label}</span>
      </label>
      {errorText && <p className="input-error">{errorText}</p>}
      {helperText && <p className="input-helper">{helperText}</p>}
    </div>
  );
};

export default InputBox;

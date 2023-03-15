import React from "react";
import "./index.css";

const InputBox = (props) => {
  const { inputType, inputMode, label, name, errorText, helperText, onBlur, onChange } = props;

  return (
    <div className="input-group">
      <label className={`input-filled${(errorText && " input-danger") || ""}`}>
        <input
          type={inputType}
          inputMode={inputMode}
          placeholder=" "
          name={name}
          onBlur={onBlur}
          onChange={onChange}
        />
        <span className="input-label">{label}</span>
        {errorText && <p className="input-error">{errorText}</p>}
        {helperText && <p className="input-helper">{helperText}</p>}
      </label>
    </div>
  );
};

export default InputBox;

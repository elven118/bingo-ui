import React from "react";
import "./index.css";

const Button = ({ children, type, ...props }) => {
  return (
    <button
      className={`submit-btn ${type ? `submit-btn-${type}` : ""} ${
        props.className || ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

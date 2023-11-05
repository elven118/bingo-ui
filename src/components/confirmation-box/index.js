import React from "react";
import Button from "../button";
import "./index.css";

const ConfirmationBox = ({ children, okBtnProps, onOk, onClose }) => {
  return (
    <div className="confirmation-container">
      <div className="confirmation-box">
        {children}
        <div className="btn-container">
          <Button {...okBtnProps} onClick={onOk}>{okBtnProps?.title || "OK"}</Button>
          <Button onClick={onClose} type="soft">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationBox;

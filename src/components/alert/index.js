import React from "react";
import "./index.css"

const Alert = (props) => {
  const { children, message, isShow, setIsShow } = props;

  const renderElAlert = () => {
    return React.cloneElement(children);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setIsShow(false);
  };

  return (
    <div className={`alert error${(!isShow && " hide") || ""}`}>
      <span className="closebtn" onClick={handleClose}>
        &times;
      </span>
      {children ? renderElAlert() : message}
    </div>
  );
};

export default Alert;

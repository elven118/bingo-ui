import React from "react";
import "./index.css";

const Popup = ({ children }) => {
  return (
    <div className="popup-container">
      <div className="popup-content">{children}</div>
    </div>
  );
};

export default Popup;

import React, { useEffect } from "react";
import Popup from "../../../components/popup";
import "./index.css";

const ResultPopup = ({ validateResult, setIsOpen }) => {
  useEffect(() => {
    setTimeout(function () {
      setIsOpen(false);
    }, process.env.REACT_APP_POPUP_TIME || 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Popup>
      {validateResult.isValid ? (
        <span className="result-text">Congratulation 🎉</span>
      ) : (
        <span className="result-text">Fail ❌</span>
      )}
    </Popup>
  );
};

export default ResultPopup;

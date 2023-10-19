import React, { useEffect, useState } from "react";
import "./index.css";

const Alert = ({ children }) => {
  const [isShow, setIsShow] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    alertEmitter.subscribe(showAlert);

    return () => {
      alertEmitter.unsubscribe(showAlert);
    };
  }, []);

  const showAlert = (message) => {
    setIsShow(true);
    setMessage(message);

    // Automatically hide the alert after a certain time (e.g., 5 seconds)
    setTimeout(() => {
      setIsShow(false);
      setMessage("");
    }, 5000);
  };

  const handleClose = () => {
    setIsShow(false);
    setMessage("");
  };

  return (
    <div className={`alert error${(!isShow && " hide") || ""}`}>
      <span className="closebtn" onClick={handleClose}>
        &times;
      </span>
      {children || message}
    </div>
  );
};

class AlertEmitter {
  constructor() {
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  unsubscribe(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  showAlert(message) {
    this.listeners.forEach((listener) => {
      listener(message);
    });
  }
}

export const alertEmitter = new AlertEmitter();
export default Alert;

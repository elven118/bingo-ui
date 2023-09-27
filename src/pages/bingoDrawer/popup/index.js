import React, { useEffect, useState } from "react";
import "./index.css";

const Popup = ({ numberArray, setIsOpen, setNumberArray }) => {
  const [number, setNumber] = useState();

  useEffect(() => {
    const generateNumber = () => {
      let turn = 0;
      const animationTimer = setInterval(function () {
        if (turn === 8) {
          clearInterval(animationTimer); // Stop the loop
          let randomNubmer = Math.floor(Math.random() * 75) + 1;
          while (numberArray.includes(randomNubmer)) {
            randomNubmer = Math.floor(Math.random() * 75) + 1;
          }
          setNumber(randomNubmer);
          setTimeout(function () {
            setNumberArray((n) => [...n, randomNubmer]);
            setIsOpen(false);
          }, process.env.REACT_APP_POPUP_TIME || 1000);
        } else {
          setNumber(Math.floor(Math.random() * 75) + 1);
        }
        turn++;
      }, 150);
    };

    generateNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="popup-container">
      <div className="popup-content">
        <span>{number}</span>
      </div>
    </div>
  );
};

export default Popup;

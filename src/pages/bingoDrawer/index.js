import React, { useEffect, useState } from "react";
// import { request, gql } from "graphql-request";
import Menu from "./menu";
import Popup from "./popup";
import AutoAdjustText from "../../components/auto-adjust-text";
import "./index.css";

const BingoDrawer = () => {
  const [numberArray, setNumberArray] = useState([]);
  const [rowNum, setRowNum] = useState(6);
  const [colNum] = useState(10);
  const [gridFontSize, setGridFontSize] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setGridFontSize(null);
    };

    // on window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const drawOpen = () => {
    if (numberArray.length === 75) return;
    setIsOpen(true);
  };

  const updateRowNum = () => {
    if (Math.ceil(numberArray.length / colNum) > 6) {
      setRowNum(Math.ceil(numberArray.length / colNum));
    }
  };

  return (
    <>
      {isOpen && (
        <Popup
          setIsOpen={setIsOpen}
          numberArray={numberArray}
          setNumberArray={setNumberArray}
        />
      )}
      <Menu generateNumber={drawOpen} />
      <div id="drawer-container">
        <div
          id="numbers-grid"
          style={{
            gridTemplateColumns: `repeat(${colNum}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rowNum}, 1fr)`,
          }}
        >
          {numberArray.map((item) => (
            <div
              key={`number-${item.toString()}`}
              className="numbers-grid-item"
            >
              <AutoAdjustText
                text={item.toString()}
                textClassName="adjust-font"
                fontSize={gridFontSize}
                setFontSize={setGridFontSize}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BingoDrawer;

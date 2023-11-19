import React, { useEffect, useState } from "react";
import { request, gql } from "graphql-request";
import { useHistory } from "react-router-dom";
import DrawerPopup from "./drawer-popup";
import { alertEmitter } from "../../components/alert";
import AutoAdjustText from "../../components/auto-adjust-text";
import Menu from "../../components/menu";
import { getJwt } from "../../utils/jwt";
import "./index.css";

const AdminBingoDrawer = () => {
  const [numberArray, setNumberArray] = useState([]);
  const [rowNum, setRowNum] = useState(6);
  const [colNum] = useState(10);
  const [gridFontSizes, setGridFontSizes] = useState([]);
  const [globalFontSize, setGlobalFontSize] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  const getLotteryNumbers = () => {
    const jwt = getJwt();
    if (!jwt) return;
    const query = gql`
      query {
        lotteryNumbers
      }
    `;
    request({
      url: process.env.REACT_APP_BACKEND_URL,
      document: query,
      requestHeaders: {
        Authorization: jwt,
      },
    })
      .then((res) => {
        setNumberArray(res.lotteryNumbers);
        setGridFontSizes(Array(res.lotteryNumbers.length).fill(null));
      })
      .catch((error) => {
        alertEmitter.showAlert(
          error?.response?.errors?.map((e) => e.message).join(", ")
        );
      });
  };

  const drawOpen = () => {
    if (numberArray.length === 75) return;
    setIsOpen(true);
  };

  const updateNumberArray = (element) => {
    const jwt = getJwt();
    if (!jwt) return;
    const mutation = gql`
      mutation ($number: Int!) {
        addLotteryNumber(number: $number)
      }
    `;
    const variables = {
      number: element,
    };
    request({
      url: process.env.REACT_APP_BACKEND_URL,
      variables,
      document: mutation,
      requestHeaders: {
        Authorization: jwt,
      },
    })
      .then((res) => {
        setNumberArray((n) => [...n, res.addLotteryNumber]);
        setGridFontSizes((n) => [...n, null]);
      })
      .catch((error) => {
        alertEmitter.showAlert(
          error?.response?.errors?.map((e) => e.message).join(", ")
        );
        setIsOpen(false);
      });
  };

  const updateFontSize = (fontSize, index) => {
    setGridFontSizes((value) => {
      const newArray = [...value];
      newArray[index] = fontSize;
      return newArray;
    });
  };

  useEffect(() => {
    // query all numbers
    getLotteryNumbers();

    const handleResize = () => {
      setGlobalFontSize(null);
    };
    // on window resize
    window.addEventListener("resize", handleResize);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const updateRowNum = () => {
      if (Math.ceil(numberArray.length / colNum) > 6) {
        setRowNum(Math.ceil(numberArray.length / colNum));
      }
    };

    updateRowNum();
  }, [colNum, numberArray]);

  useEffect(() => {
    const calMinOfFontSize = () => {
      const minSize = gridFontSizes.reduce((min, item) => {
        return Math.min(min, item);
      }, Infinity);
      setGlobalFontSize(minSize !== Infinity ? minSize : null);
    };

    calMinOfFontSize();
  }, [gridFontSizes]);

  return (
    <>
      {isOpen && (
        <DrawerPopup
          setIsOpen={setIsOpen}
          numberArray={numberArray}
          updateNumberArray={updateNumberArray}
        />
      )}
      <Menu
        menuItems={[
          {
            key: "DrawMenuItem",
            title: "Draw !!!",
            onClick: drawOpen,
          },
          {
            key: "BackMenuItem",
            title: "Back",
            onClick: () => history.goBack(),
          },
        ]}
      />
      <div id="drawer-container">
        <div
          id="numbers-grid"
          style={{
            gridTemplateColumns: `repeat(${colNum}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rowNum}, 1fr)`,
          }}
        >
          {numberArray.map((item, index) => (
            <div
              key={`number-${item.toString()}`}
              className="numbers-grid-item"
            >
              <AutoAdjustText
                text={item.toString()}
                textClassName="adjust-font"
                fontSize={globalFontSize}
                updateFontSize={(fontSize) => updateFontSize(fontSize, index)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminBingoDrawer;

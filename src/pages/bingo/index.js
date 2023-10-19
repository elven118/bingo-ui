import React, { useEffect, useState } from "react";
import { request, gql } from "graphql-request";
import { FaArrowCircleRight, FaArrowCircleDown } from "react-icons/fa";
import bingoLogo from "../../assets/images/bingo_logo.png";
import freeIcon from "../../assets/images/free.png";
import crossIcon from "../../assets/images/cross.png";
import "./index.css";
import AutoAdjustText from "../../components/auto-adjust-text";
import { alertEmitter } from "../../components/alert";
import { getJwt } from "../../utils/jwt";

const Bingo = ({ validateResult, lotterNumbers, chooseValidLine }) => {
  const [numbers, setNumbers] = useState([]);
  const [cross, setCross] = useState(Array(25).fill(false));
  const [fontSize, setFontSize] = useState(null);
  const [gridFontSizes, setGridFontSizes] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState();

  const queryBingoNumbers = () => {
    const jwt = getJwt();
    if (!jwt) return;
    const query = gql`
      query {
        bingoCard {
          numbers
        }
      }
    `;
    request({
      url: process.env.REACT_APP_BACKEND_URL,
      document: query,
      requestHeaders: {
        Authorization: jwt,
      },
    })
      .then((data) => {
        setNumbers(data.bingoCard.numbers);
        const defaultGridFontSizes = Array(data.bingoCard.numbers.length).fill(
          null
        );
        defaultGridFontSizes[12] = Infinity;
        setGridFontSizes(defaultGridFontSizes);
      })
      .catch((error) => {
        alertEmitter.showAlert(
          error?.response?.errors?.map((e) => e.message).join(", ")
        );
      });
  };

  const addCross = (id) => {
    const newCross = [...cross];
    newCross[id] = true;
    setCross(newCross);
  };

  const remove = (id) => {
    const newCross = [...cross];
    newCross[id] = false;
    setCross(newCross);
  };

  const updateFontSize = (fontSize, index) => {
    setGridFontSizes((value) => {
      const newArray = [...value];
      newArray[index] = fontSize;
      return newArray;
    });
  };

  useEffect(() => {
    if (validateResult) {
      setNumbers(validateResult.numbers);
      const defaultGridFontSizes = Array(validateResult.numbers.length).fill(
        null
      );
      defaultGridFontSizes[12] = Infinity;
      setGridFontSizes(defaultGridFontSizes);
    } else {
      queryBingoNumbers();
    }
  }, [validateResult]);

  useEffect(() => {
    if (validateResult && lotterNumbers) {
      const newCross = new Array(25).fill(false);
      validateResult.numbers.forEach((n, index) => {
        if (lotterNumbers.includes(n)) {
          newCross[index] = true;
        }
      });
      newCross[12] = true;
      setCross(newCross);
    }
  }, [validateResult, lotterNumbers]);

  useEffect(() => {
    const handleResize = () => {
      setFontSize(null);
    };
    if (validateResult) {
      // on window resize
      window.addEventListener("resize", handleResize);
    }
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [validateResult]);

  useEffect(() => {
    const calMinOfFontSize = () => {
      const minSize = gridFontSizes.reduce((min, item) => {
        return Math.min(min, item);
      }, Infinity);
      setFontSize(minSize !== Infinity ? minSize : 16);
    };

    calMinOfFontSize();
  }, [gridFontSizes]);

  return (
    <div
      className={`center-widescreen-width${
        validateResult ? " bingo-component-width" : ""
      }`}
      id="bingo-container"
    >
      <div>
        <img src={bingoLogo} alt="bingoLogo" id="bingoLogo" />
      </div>
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridTemplateColumns: `${validateResult ? "20px " : ""}repeat(5, 1fr)${
            validateResult ? " 20px" : ""
          }`,
          gridTemplateRows: `${validateResult ? "20px " : ""}repeat(5, 1fr)`,
        }}
      >
        {validateResult && (
          <div className="arrow-div">
            {validateResult.diagonal.includes(0) && (
              <FaArrowCircleRight
                className={`diagonal arrow-icon${
                  selectedIcon === "diagonal0" ? " arrow-icon-selected" : ""
                }`}
                onClick={() => {
                  setSelectedIcon(`diagonal0`);
                  chooseValidLine("diagonal", 0);
                }}
              />
            )}
          </div>
        )}
        {validateResult ? (
          <>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={`row-${index}`} className="arrow-div">
                  {validateResult.row.includes(index) && (
                    <FaArrowCircleRight
                      className={`arrow-icon${
                        selectedIcon === `row${index}`
                          ? " arrow-icon-selected"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedIcon(`row${index}`);
                        chooseValidLine("row", index);
                      }}
                    />
                  )}
                </div>
              ))}
          </>
        ) : null}
        {numbers.map((n, index) => (
          <React.Fragment key={`${n}-fragment`}>
            {validateResult && index % 5 === 0 && (
              <div key={`col-${index / 5}`} className="arrow-div">
                {validateResult.col.includes(index / 5) && (
                  <FaArrowCircleDown
                    className={`arrow-icon${
                      selectedIcon === `col${index / 5}`
                        ? " arrow-icon-selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedIcon(`col${index / 5}`);
                      chooseValidLine("col", index / 5);
                    }}
                  />
                )}
              </div>
            )}
            <div className="number-div">
              {index === 12 ? (
                <img
                  src={freeIcon}
                  alt="freeIcon"
                  className="free-img"
                  onClick={validateResult ? undefined : () => addCross(index)}
                />
              ) : (
                <div
                  className="number-container"
                  onClick={validateResult ? undefined : () => addCross(index)}
                >
                  <div className="number-circle">
                    <AutoAdjustText
                      text={n.toString()}
                      textClassName="number-text"
                      fontSize={fontSize}
                      updateFontSize={(fontSize) =>
                        updateFontSize(fontSize, index)
                      }
                    />
                  </div>
                </div>
              )}
              <img
                src={crossIcon}
                alt={`${index}Cross`}
                className={cross[index] ? "cross-img" : "cross-img-hide"}
                onClick={validateResult ? undefined : () => remove(index)}
              />
            </div>
          </React.Fragment>
        ))}
        {validateResult && (
          <div className="arrow-div">
            {validateResult.diagonal.includes(1) && (
              <FaArrowCircleDown
                className={`diagonal arrow-icon${
                  selectedIcon === `diagonal1` ? " arrow-icon-selected" : ""
                }`}
                onClick={() => {
                  setSelectedIcon(`diagonal1`);
                  chooseValidLine("diagonal", 1);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bingo;

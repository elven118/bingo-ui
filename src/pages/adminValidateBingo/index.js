import React, { useEffect, useState, useRef } from "react";
import { request, gql } from "graphql-request";
import { useHistory } from "react-router-dom";
import Select, { createFilter } from "react-select";
import ResultPopup from "./result-popup";
import AutoAdjustText from "../../components/auto-adjust-text";
import Button from "../../components/button";
import Menu from "../../components/menu";
import Loader from "../../components/loader";
import { alertEmitter } from "../../components/alert";
import Bingo from "../bingo";
import { getJwt } from "../../utils/jwt";
import "./index.css";

const AdminValidateBingo = () => {
  const [numberArray, setNumberArray] = useState([]);
  const [rowNum, setRowNum] = useState(6);
  const [colNum] = useState(10);
  const [gridFontSizes, setGridFontSizes] = useState([]);
  const [globalFontSize, setGlobalFontSize] = useState();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [validateResult, setValidateResult] = useState();
  const [popupOpen, setPopupOpen] = useState(false);
  const [flashNumbers, setFlashNumbers] = useState([]);
  const animatedElementRefs = useRef([]);
  const history = useHistory();

  const handleChangeUser = (option) => {
    setSelectedUser(option);
  };

  const validateBingoRequest = () => {
    if (!selectedUser) return;
    const jwt = getJwt();
    if (!jwt) return;

    // get all lottery numbers
    const lotteryNumbersQuery = gql`
      query {
        lotteryNumbers
      }
    `;

    // validate user's bingo
    const validateQuery = gql`
      query ($selectedUser: String!) {
        validateCard(id: $selectedUser) {
          row
          col
          diagonal
          isValid
          numbers
        }
      }
    `;
    const validateVariables = {
      selectedUser: selectedUser.value,
    };

    setSubmitting(true);
    Promise.all([
      request({
        url: process.env.REACT_APP_BACKEND_URL,
        document: lotteryNumbersQuery,
        requestHeaders: {
          Authorization: jwt,
        },
      }),
      request({
        url: process.env.REACT_APP_BACKEND_URL,
        document: validateQuery,
        variables: validateVariables,
        requestHeaders: {
          Authorization: jwt,
        },
      }),
    ])
      .then(([lotteryNumbersData, validateCardData]) => {
        setSubmitting(false);
        setNumberArray(lotteryNumbersData.lotteryNumbers);
        setGridFontSizes(
          Array(lotteryNumbersData.lotteryNumbers.length).fill(null)
        );
        setValidateResult(validateCardData.validateCard);
        flashNumbers.forEach((n) => {
          if (n > 0) {
            const element = animatedElementRefs.current[n];
            element.classList.remove("flash-text");
            void element.offsetWidth;
          }
        });
        setFlashNumbers([]);
        setPopupOpen(true);
      })
      .catch((error) => {
        alertEmitter.showAlert(
          error?.response?.errors?.map((e) => e.message).join(", ")
        );
        setSubmitting(false);
      });
  };

  const updateFontSize = (fontSize, index) => {
    setGridFontSizes((value) => {
      const newArray = [...value];
      newArray[index] = fontSize;
      return newArray;
    });
  };

  const updateAnimationClass = (numbers, prevNumbers) => {
    prevNumbers.forEach((n) => {
      if (n > 0) {
        const element = animatedElementRefs.current[n];
        element.classList.remove("flash-text");
        void element.offsetWidth;
      }
    });
    numbers.forEach((n) => {
      if (n > 0) {
        const element = animatedElementRefs.current[n];
        element.classList.add("flash-text");
      }
    });
  };

  const handleChooseValidLine = (type, index) => {
    const prevFlashNumbers = flashNumbers;
    let indices = [];
    if (type === "row") {
      for (let i = 0; i < 5; i++) {
        indices.push(validateResult.numbers[index + i * 5]);
      }
    } else if (type === "col") {
      indices = validateResult.numbers.slice(index * 5, (index + 1) * 5);
    } else if (index === 0) {
      for (let i = 0; i <= 24; i += 6) {
        indices.push(validateResult.numbers[i]);
      }
    } else {
      for (let i = 4; i <= 20; i += 4) {
        indices.push(validateResult.numbers[i]);
      }
    }
    setFlashNumbers(indices);
    updateAnimationClass(indices, prevFlashNumbers);
  };

  useEffect(() => {
    // query users
    const jwt = getJwt();
    if (!jwt) return;
    const query = gql`
      query {
        users {
          value: id
          label: name
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
        setUserOptions(data.users);
      })
      .catch((error) => {
        alertEmitter.showAlert(
          error?.response?.errors?.map((e) => e.message).join(", ")
        );
      });

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
      setGlobalFontSize(minSize !== Infinity ? minSize : 16);
    };

    calMinOfFontSize();
  }, [gridFontSizes]);

  return (
    <div id="validate-container">
      <Menu
        menuItems={[
          {
            key: "BackMenuItem",
            title: "Back",
            onClick: () => history.goBack(),
          },
        ]}
      />
      {popupOpen && (
        <ResultPopup validateResult={validateResult} setIsOpen={setPopupOpen} />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <Select
          value={selectedUser}
          onChange={handleChangeUser}
          options={userOptions}
          isSearchable={true}
          filterOption={createFilter({
            matchFrom: "any",
            stringify: (option) => `${option.label}`,
          })}
          placeholder="Search or select a Name..."
          className="select"
        />
        <Button
          type="submit"
          disabled={submitting}
          style={{ flex: 0.3, margin: "0 10px", padding: 10 }}
          onClick={validateBingoRequest}
        >
          {submitting ? <Loader /> : <span>Validate</span>}
        </Button>
      </div>
      {validateResult && (
        <div style={{ display: "flex", gap: 10, height: "100%" }}>
          <div style={{ flex: 0.3 }}>
            <Bingo
              validateResult={validateResult}
              lotterNumbers={numberArray}
              chooseValidLine={handleChooseValidLine}
            />
          </div>
          <div
            id="numbers-grid"
            style={{
              flex: 0.7,
              gridTemplateColumns: `repeat(${colNum}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rowNum}, 1fr)`,
            }}
          >
            {numberArray.map((item, index) => (
              <div
                key={`number-${item.toString()}`}
                className="numbers-grid-item"
                ref={(el) => (animatedElementRefs.current[item] = el)}
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
      )}
    </div>
  );
};

export default AdminValidateBingo;

import React, { useEffect, useState } from "react";
import { request, gql } from "graphql-request";
import Select, { createFilter } from "react-select";
import AutoAdjustText from "../../components/auto-adjust-text";
import Button from "../../components/button";
import Loader from "../../components/loader";
import "./index.css";

const ValidateBingo = () => {
  const [numberArray, setNumberArray] = useState([]);
  const [rowNum, setRowNum] = useState(6);
  const [colNum] = useState(10);
  const [gridFontSize, setGridFontSize] = useState();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [validateResult, setValidateResult] = useState();

  useEffect(() => {
    const handleResize = () => {
      setGridFontSize(undefined);
    };
    // on window resize
    window.addEventListener("resize", handleResize);

    // query users
    const jwt = localStorage.getItem("jwt");
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
    }).then((data) => {
      setUserOptions(data.users);
    });

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const updateRowNum = () => {
    if (Math.ceil(numberArray.length / colNum) > 6) {
      setRowNum(Math.ceil(numberArray.length / colNum));
    }
  };

  const handleChangeUser = (option) => {
    setSelectedUser(option);
  };

  const validateBingoRequest = () => {
    if (!selectedUser) return;
    // validate user's bingo
    const jwt = localStorage.getItem("jwt");
    const query = gql`
      query ($selectedUser: String!) {
        validateCard(id: $selectedUser) {
          isValid
          diagonal
          row
          col
          numbers
        }
      }
    `;
    const variables = {
      selectedUser: selectedUser.value,
    };
    setSubmitting(true);
    request({
      url: process.env.REACT_APP_BACKEND_URL,
      document: query,
      variables,
      requestHeaders: {
        Authorization: jwt,
      },
    }).then((data) => {
      setSubmitting(false);
      setValidateResult(data.validateCard);
    }).catch((error) => {
      setSubmitting(false);
    });;
  };

  return (
    <div id="validate-container">
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
      {/* <div
        id="numbers-grid"
        style={{
          gridTemplateColumns: `repeat(${colNum}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rowNum}, 1fr)`,
        }}
      >
        {numberArray.map((item) => (
          <div key={`number-${item.toString()}`} className="numbers-grid-item">
            <AutoAdjustText
              text={item.toString()}
              textClassName="adjust-font"
              fontSize={gridFontSize}
              setFontSize={setGridFontSize}
            />
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default ValidateBingo;

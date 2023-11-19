import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { request, gql } from "graphql-request";
import { useHistory } from "react-router-dom";
import { alertEmitter } from "../../components/alert";
import AutoAdjustText from "../../components/auto-adjust-text";
import ConfirmationBox from "../../components/confirmation-box";
import InputBox from "../../components/input-box";
import Loader from "../../components/loader";
import Menu from "../../components/menu";
import { getJwt } from "../../utils/jwt";
import "./index.css";

const AdminBingoDrawer = () => {
  const [numberArray, setNumberArray] = useState([]);
  const [rowNum, setRowNum] = useState(6);
  const [colNum] = useState(10);
  const [gridFontSizes, setGridFontSizes] = useState([]);
  const [globalFontSize, setGlobalFontSize] = useState(null);
  const [isAddBoxOpen, setIsAddBoxOpen] = useState(false);
  const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const history = useHistory();

  const getLotteryNumbers = () => {
    const jwt = getJwt();
    if (!jwt) return;
    const mutation = gql`
      query {
        lotteryNumbers
      }
    `;
    request({
      url: process.env.REACT_APP_BACKEND_URL,
      document: mutation,
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

  const addNumberOpen = () => {
    if (numberArray.length === 75) return;
    setIsAddBoxOpen(true);
  };

  const onAddOk = () => {
    handleSubmit(updateNumberArray)();
  };

  const updateNumberArray = (data) => {
    const jwt = getJwt();
    if (!jwt) return;
    const mutation = gql`
      mutation ($number: Int!) {
        addLotteryNumber(number: $number)
      }
    `;
    const variables = {
      number: data.number,
    };
    setSubmitting(true);
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
        setSubmitting(false);
        setIsAddBoxOpen(false);
      })
      .catch((error) => {
        alertEmitter.showAlert(
          error?.response?.errors?.map((e) => e.message).join(", ")
        );
        setSubmitting(false);
      });
  };

  const deleteLastNumberArray = () => {
    const jwt = getJwt();
    if (!jwt) return;
    const mutation = gql`
      mutation () {
        deleteLastLotteryNumber
      }
    `;
    setSubmitting(true);
    request({
      url: process.env.REACT_APP_BACKEND_URL,
      document: mutation,
      requestHeaders: {
        Authorization: jwt,
      },
    })
      .then((res) => {
        if (res?.deleteLastLotteryNumber) {
          setNumberArray((n) => n.slice(0, -1));
          setGridFontSizes((n) => n.slice(0, -1));
          setIsDeleteBoxOpen(false);
        }
        setSubmitting(false);
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
      <Menu
        menuItems={[
          {
            key: "AddMenuItem",
            title: "Add",
            onClick: addNumberOpen,
          },
          {
            key: "DeleteMenuItem",
            title: "Delete",
            onClick: () => setIsDeleteBoxOpen(true),
          },
          {
            key: "BackMenuItem",
            title: "Back",
            onClick: () => history.goBack(),
          },
        ]}
      />
      {isAddBoxOpen && (
        <ConfirmationBox
          onClose={() => setIsAddBoxOpen(false)}
          onOk={onAddOk}
          okBtnProps={{ title: submitting ? <Loader /> : "Add" }}
        >
          <form onSubmit={handleSubmit(updateNumberArray)}>
            <Controller
              name="number"
              control={control}
              rules={{
                required: "Number is required",
                min: {
                  value: 1,
                  message: "Number must be larger than or equal to 1",
                },
                max: {
                  value: 75,
                  message: "Number must be smaller than or equal to 75",
                },
              }}
              render={({ field: { name, onChange, onBlur } }) => (
                <InputBox
                  name={name}
                  label="Number *"
                  inputType="number"
                  errorText={errors.number && errors.number.message}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
            />
          </form>
        </ConfirmationBox>
      )}
      {isDeleteBoxOpen && (
        <ConfirmationBox
          onClose={() => setIsDeleteBoxOpen(false)}
          onOk={deleteLastNumberArray}
          okBtnProps={{
            title: submitting ? <Loader /> : "DELETE",
            type: "danger",
          }}
        >
          <h2>Are you sure to delete the latest number?</h2>
        </ConfirmationBox>
      )}
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

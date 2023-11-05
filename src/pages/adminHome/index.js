import React, { useState } from "react";
import { request, gql } from "graphql-request";
import { useHistory } from "react-router-dom";
import { alertEmitter } from "../../components/alert";
import Button from "../../components/button";
import ConfirmationBox from "../../components/confirmation-box";
import Loader from "../../components/loader";
import "./index.css";
import { getJwt } from "../../utils/jwt";

const AdminHome = () => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleResetOk = (data) => {
    const jwt = getJwt();
    if (!jwt) return;
    const mutation = gql`
      mutation {
        resetLotteryNumbers
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
      .then((data) => {
        setSubmitting(false);
        setIsOpen(false);
      })
      .catch((error) => {
        alertEmitter.showAlert(
          error?.response?.errors?.map((e) => e.message).join(", ")
        );
        setSubmitting(false);
      });
  };

  return (
    <div id="home-container">
      {isOpen && (
        <ConfirmationBox
          onClose={() => setIsOpen(false)}
          onOk={handleResetOk}
          okBtnProps={{
            title: submitting ? <Loader /> : "RESET",
            type: "danger",
          }}
        >
          <h2>Are you sure to reset all numbers?</h2>
        </ConfirmationBox>
      )}
      <Button id="reset-btn" onClick={() => setIsOpen(true)}>
        Reset All Numbers
      </Button>
      <ul className="home-menu">
        <li onClick={() => history.push("admin-display")}>Custom Draw</li>
        <li onClick={() => history.push("/admin-draw")}>Auto Draw</li>
        <li onClick={() => history.push("/admin-validate")}>Validate</li>
      </ul>
    </div>
  );
};

export default AdminHome;

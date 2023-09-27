import React, { useEffect, useState } from "react";
import { request, gql } from "graphql-request";
import bingoLogo from "../../assets/images/bingo_logo.png";
import freeIcon from "../../assets/images/free.png";
import crossIcon from "../../assets/images/cross.png";
import "./index.css";
import AutoAdjustText from "../../components/auto-adjust-text";

const Bingo = () => {
  const [numbers, setNumbers] = useState([]);
  const [cross, setCross] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [fontSize, setFontSize] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
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
      // query
    }).then((data) => {
      console.log(data);
      setNumbers(data.bingoCard.numbers);
    });

    const handleResize = () => {
      setFontSize(null);
    };
    // on window resize
    window.addEventListener("resize", handleResize);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const addCross = (id) => {
    var newCross = cross.slice();
    newCross[id] = true;
    setCross(newCross);
  };

  const remove = (id) => {
    var newCross = cross.slice();
    newCross[id] = false;
    setCross(newCross);
  };

  return (
    <div className="center-widescreen-width" id="bingo-container">
      <div className="col-5">
        <img src={bingoLogo} alt="bingoLogo" id="bingoLogo" />
      </div>
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridTemplateColumns: `repeat(5, 1fr)`,
          gridTemplateRows: `repeat(5, 1fr)`,
        }}
        className="col-5"
      >
        {numbers.map((n, index) => (
          <div className="number-div">
            {index === 12 ? (
              <img
                src={freeIcon}
                alt="freeIcon"
                className="free-img"
                onClick={() => addCross(index)}
              />
            ) : (
              <div className="number-container" onClick={() => addCross(index)}>
                <div className="number-circle">
                  <AutoAdjustText
                    text={n.toString()}
                    textClassName="number-text"
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                  />
                </div>
              </div>
            )}
            <img
              src={crossIcon}
              alt={`${index}Cross`}
              className={cross[index] ? "cross-img" : "cross-img-hide"}
              onClick={() => remove(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bingo;

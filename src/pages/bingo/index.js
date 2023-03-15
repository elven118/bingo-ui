import React, { useEffect, useState } from "react";
import { request, gql } from "graphql-request";
import bingoLogo from "../../images/bingo_logo.png";
import freeIcon from "../../images/free.png";
import crossIcon from "../../images/cross.png";
import "./index.css";

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

  useEffect(() => {
    // var rangeFrom = 1;
    // var rangeTo = 15;
    // var randomArray = [];
    // var images = [];
    // for (var c = 0; c < 5; c++) {
    //   for (var i = 0; i < 5; i++) {
    //     var randomNubmer = Math.floor(
    //       Math.random() * (rangeTo - rangeFrom + 1) + rangeFrom
    //     );
    //     while (randomArray.includes(randomNubmer)) {
    //       randomNubmer = Math.floor(
    //         Math.random() * (rangeTo - rangeFrom + 1) + rangeFrom
    //       );
    //     }
    //     randomArray[i] = randomNubmer;
    //   }
    //   for (var r = 0; r < 5; r++) {
    //     if (r !== 2 || c !== 2) {
    //       images.push(require("./image/" + randomArray[r] + ".png"));
    //       //var child = table.rows[r].cells[c].children[0];
    //       //child.value = randomArray[r];
    //       // var img = document.createElement("img");
    //       // img.src = "./image/"+randomArray[r]+".png";
    //       // child.append(img);
    //     }
    //   }
    //   rangeFrom += 15;
    //   rangeTo += 15;
    // }

    // setImages(images);

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

  const images = require.context("../../images", true);

  return (
    <div className="center-widescreen-width bingo-container">
      <div className="col-5">
        <img src={bingoLogo} alt="bingoLogo" id="bingoLogo" />
      </div>
      <div>
        {numbers.length === 25 &&
          [1, 2, 3, 4, 5].map((col) => (
            <div key={`col-${col}`} className="col-1">
              {numbers.slice((col - 1) * 5, col * 5).map((n, index) => {
                const imageIndex = (col - 1) * 5 + index;
                return (
                  <div key={`col-${col - 1}r${index}`} className="image-div">
                    {/* <span id={`c${col - 1}r${index}`}> */}
                    <img
                      src={crossIcon}
                      alt={`c${col - 1}r${index}Cross`}
                      className={
                        cross[imageIndex] ? "cross-img" : "cross-img-hide"
                      }
                      onClick={() => remove(imageIndex)}
                    />
                    <img
                      src={
                        n !== -1
                          ? images("./" + n.toString() + ".png")
                          : freeIcon
                      }
                      className="number-img"
                      alt={`c${col - 1}r${index}Number`}
                      onClick={() => addCross(imageIndex)}
                    />
                    {/* </span> */}
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Bingo;

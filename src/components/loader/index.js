import React from "react";
import "./index.css";

const Loader = (props) => {
  const { size, color } = props;

  return (
    <div className="loader-container">
      <div
        className="loader"
        style={{
          width: size || 13,
          height: size || 13,
          borderTopColor: color || "black",
        }}
      />
    </div>
  );
};

export default Loader;

import React from "react";
import { FaAngleRight } from "react-icons/fa";
import "./index.css";

const Menu = ({ generateNumber }) => {
  return (
    <div className="sliding-menu">
      <div className="menu-icon-circle">
        <FaAngleRight color="white" size={20} />
      </div>
      <ul className="menu-items">
        <li onClick={generateNumber}>Draw !!!</li>
      </ul>
    </div>
  );
};

export default Menu;

import React from "react";
import { FaAngleRight } from "react-icons/fa";
import "./index.css";

const Menu = ({ menuItems }) => {
  return (
    <div className="sliding-menu">
      <div className="menu-icon-circle">
        <FaAngleRight color="white" size={20} />
      </div>
      <div>
        <ul className="menu">
          {menuItems.map((menu) => (
            <li key={menu.key} onClick={menu.onClick}>
              {menu.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Menu;

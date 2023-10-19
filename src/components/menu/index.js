import React from "react";
import { FaAngleRight } from "react-icons/fa";
// import { useHistory } from "react-router-dom";
import "./index.css";

const Menu = ({ menuItems }) => {
  // const history = useHistory();

  return (
    <div className="sliding-menu">
      <div className="menu-icon-circle">
        <FaAngleRight color="white" size={20} />
      </div>
      <ul className="menu">
        {menuItems.map((menu) => (
          <li key={menu.key} onClick={menu.onClick}>
            {menu.title}
          </li>
        ))}
        {/* <li>Draw !!!</li>
        <li onClick={() => history.push("/admin-validate")}>Validate</li> */}
      </ul>
    </div>
  );
};

export default Menu;

import React from "react";
import { NavLink } from "react-router-dom";

function NavBtn({ path, onClick, title }) {
  return (
    <NavLink
      to={path}
      exact
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      className={({ isActive }) => (isActive ? "sel-nav" : undefined)}
    >
      <span>{title}</span>
      <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40">
        <path d="M15.625 31.125 12.5 28l8.083-8.042-8.083-8.041 3.125-3.125 11.208 11.166Z" />
      </svg>
    </NavLink>
  );
}

export default NavBtn;

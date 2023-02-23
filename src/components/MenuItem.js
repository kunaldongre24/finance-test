//Kunal Dongre

import React from "react";
import { Link } from "react-router-dom";

function MenuItem({ title, Icon, address }) {
  return (
    <Link to={address} className="header-link">
      <div className="menu-item">
        <Icon style={{ fontSize: 18, marginRight: 4 }} /> <span>{title}</span>
      </div>
    </Link>
  );
}

export default MenuItem;

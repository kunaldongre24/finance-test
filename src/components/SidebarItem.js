import React from "react";
import { Link } from "react-router-dom";

function SidebarItem({ title, Icon, link }) {
  return (
    <Link to={link}>
      <div class="c">
        {Icon}
        <span>{title}</span>
      </div>
    </Link>
  );
}

export default SidebarItem;

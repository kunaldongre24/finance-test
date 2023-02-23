//Kunal Dongre

import React from "react";

function DButton({
  count,
  bgColor,
  right,
  fontSize,
  left,
  title,
  Icon,
  onClick,
}) {
  return (
    <div style={{ display: "flex" }} className="rew-s">
      <button
        style={{ background: bgColor }}
        className="navigate"
        type="button"
        onClick={onClick}
      >
        {left === true && title}
        {Icon ? <Icon style={{ fontSize: fontSize }} /> : ""}
        {right === true && title}
      </button>
      {count ? <span className="btn-count">{count}</span> : null}
    </div>
  );
}

export default DButton;

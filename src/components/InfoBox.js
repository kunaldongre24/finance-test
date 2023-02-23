//Kunal Dongre

import React from "react";

function InfoBox({ value, title }) {
  return (
    <div className="flex-fdr">
      <div className="cnum">{value}</div>
      <div className="ctitle">{title}</div>
    </div>
  );
}

export default InfoBox;

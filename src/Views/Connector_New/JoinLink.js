import React from "react";
import { Box } from "@mui/material";
import style from "./connector.module.css";

const lineStyle = {
  border: "1px solid #00A94F",
  height: "18px",
};
const JoinLink = () => {
  return (
    <div>
      <span style={lineStyle} className={style.pt2}></span>
      <div className={`${style.mtMinus11} ${style.mbMinus12} cursor-pointer`}>
        <img
          src={require("../../Assets/Img/link_icon.svg")}
          id="integrated-card-link-button"
        />
      </div>
      <span style={lineStyle}></span>
    </div>
  );
};

export default JoinLink;

import React from "react";
import "./Rightintro.css";
import Farmstack from "../../Assets/Img/farmstack.jpg";

export default function Rightintro() {
  return (
    <div>
      <img src={Farmstack} alt="FarmStack" className="rightimg" />
      <h3 className="rightcontent">
        Sign your organisation up in just a few steps.
      </h3>
    </div>
  );
}

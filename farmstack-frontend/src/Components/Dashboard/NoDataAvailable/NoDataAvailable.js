import React from "react";
import { Col, Row } from "react-bootstrap";
import labels from "../../../Constants/labels";
import styles from "./nodataavailable.module.css";
const NoDataAvailable = (props) => {
  const useStyles = {
    // cardcolor: {background:"#FCFCFC", "box-shadow": "none", cursor: "pointer", height: "355px", "border-radius": "2px", width: "346px", "margin-left": "20px", "margin-top": "20px","padding-top":"50px" },
    // togglecardcolor: { "box-shadow": "0px 4px 20px rgba(216, 175, 40, 0.28)", "border": "1px solid #ebd79c", cursor: "pointer", height: "355px", width: "346px", "margin-left": "20px","margin-top": "20px","padding-top":"50px" },
    cardtext: {
      color: "#A3B0B8",
      "font-size": "14px",
      "font-family": "Open Sans",
      "font-style": "normal",
      "font-weight": 400,
      "font-size": "14px",
      "line-height": "19px",
      "text-align": "center",
      color: "#A3B0B8",
    },
    //   cardHeading:{'font-family': 'Open Sans', 'font-style': 'normal', 'font-weight': '400', 'font-size': '14px', 'line-height': '19px', 'text-align': 'center', color: '#3D4A52'}
  };
  return (
    <div className={styles.nodatamainbox}>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} style={{ "margin-top": "20px" }}>
          <img src={require("../../../Assets/Img/no_datasets.svg")} alt="new" />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <span style={useStyles.cardtext}>
            {" "}
            {props.message ?? labels.en.dashboard.no_data_available}{" "}
          </span>
        </Col>
      </Row>
    </div>
  );
};

export default NoDataAvailable;

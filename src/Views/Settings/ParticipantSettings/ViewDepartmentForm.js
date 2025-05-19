import React from "react";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import labels from "../../../Constants/labels";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { isRoleName } from "../../../Utils/Common";

const useStyles = {
  marginrowtop: { "margin-top": "30px" },
  inputwidth: {
    "font-family": "Open Sans",
    "margin-left": "170px",
    "padding-top": "45px",
    "font-weight": "700",
  },
  inputwidthright: {
    width: "95%",
    "text-align": "left",
    "font-family": "Open Sans",
    width: "420px",
    height: "48px",
    right: "65px",
  },
  headingbold: { fontWeight: "bold" },
  marginrowtophead: {
    "margin-top": "40px",
    "font-weight": "600",
    "font-family": "Open Sans",
    width: "202px",
    height: "27px",
    "margin-left": "112px",
  },
  marginrowtop8px: { "margin-top": "8px" },
  secondleftheading: {
    float: "left",
    "text-align": "left",
    "margin-left": "111px",
  },
  secondrightheading: { "margin-top": "10px", "margin-right": "500px" },
  backline: { "border-bottom": "1px", color: "#EEEEEE" },
};

export default function ViewDepartmentForm(props) {
  console.log(props, "PROPS");
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const history = useHistory();
  const location = useLocation();

  const getTabNumber = () => {
    if (isRoleName(location.pathname) == "/datahub/") {
      return "6";
    } else {
      return "4";
    }
  };

  return (
    <>
      <Row>
        <Col className="supportViewDetailsbackimage">
          <span
            style={useStyles.backline}
            onClick={() => {
              history.push(
                isRoleName(location.pathname) + "settings/" + getTabNumber()
              );
            }}
          >
            <img src={require("../../../Assets/Img/Vector.svg")} alt="new" />
          </span>
          <span
            className="supportViewDetailsback"
            onClick={() => {
              history.push(
                isRoleName(location.pathname) + "settings/" + getTabNumber()
              );
            }}
          >
            {"Back"}
          </span>
        </Col>
      </Row>
      <hr
        style={{
          "margin-left": "-200px",
          "margin-right": "-200px",
          "margin-top": "20px",
          "border-top": "1px solid rgba(238, 238, 238, 0.5)",
        }}
      />

      <Row style={useStyles.marginrowtophead}>
        <span className="mainheading">
          {screenlabels.department.viewheading}
        </span>
      </Row>
      <Row style={useStyles.marginrowtop}>
        <Col xs={12} sm={12} md={4} lg={4} style={{ textAlign: "left" }}>
          <span
            className="secondmainheading"
            style={useStyles.secondleftheading}
          >
            {screenlabels.department.department_name}
          </span>
          <br />
          <span
            className="thirdmainheading"
            style={useStyles.secondleftheading}
          >
            {props.departmentname}
          </span>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4} style={{ textAlign: "left" }}>
          <span
            className="secondmainheading"
            style={useStyles.secondleftheading}
          >
            {screenlabels.department.department_description}
          </span>
          <br />
          <span
            className="thirdmainheading"
            style={useStyles.secondleftheading}
          >
            {props.departmentdescription}
          </span>
        </Col>
      </Row>
    </>
  );
}

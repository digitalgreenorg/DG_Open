import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import THEME_COLORS from "../../../Constants/ColorConstants";
import labels from "../../../Constants/labels";
import RegexConstants from "../../../Constants/RegexConstants";
import { isRoleName, validateInputField } from "../../../Utils/Common";
import { TextField } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
const useStyles = {
  btncolor: {
    color: THEME_COLORS.THEME_COLOR,
    "border-color": THEME_COLORS.THEME_COLOR,
    "border-radius": 0,
  },
  marginrowtop: { "margin-top": "30px" },
  inputwidth: {
    width: "95%",
    "text-align": "left",
    "font-family": "Open Sans",
    width: "420px",
    height: "48px",
    left: "65px",
  },
  inputwidthright: {
    width: "95%",
    "text-align": "left",
    "font-family": "Open Sans",
    width: "420px",
    height: "48px",
    right: "65px",
    "word-break": "break-word",
  },
  headingbold: { fontWeight: "bold" },
  marginrowtophead: {
    "margin-top": "40px",
    "font-weight": "600",
    "font-family": "Open Sans",
    width: "202px",
    height: "27px",
    "margin-left": "122px",
  },
};

//    departmentname={departmentname}
// setdepartmentname={ref => { setdepartmentname(ref) }}
// departmentdescription={departmentdescription}
// setdepartmentdescription={ref => { setdepartmentdescription(ref) }}
// first_dept_heading={screenlabels.department.heading}
export default function DepartmentSettingsForm(props) {
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const history = useHistory();
  const location = useLocation()
  // console.log(props, "PROPS")

  const getTabNumber = () => {
    if(isRoleName(location.pathname) == '/datahub/'){
      return '6'
    } else{
      return '4'
    }
  }

  return (
    <>
      <Row>
        <Col className="supportViewDetailsbackimage">
          <span
            onClick={() => {
              history.push(isRoleName(location.pathname)+"settings/"+getTabNumber());
            }}>
            <img src={require("../../../Assets/Img/Vector.svg")} alt="new" />
          </span>
          <span
            className="supportViewDetailsback"
            onClick={() => {
              history.push(isRoleName(location.pathname)+"settings/"+getTabNumber());
            }}>
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
        <span className="mainheading">{props.first_dept_heading}</span>
      </Row>
      <Row style={useStyles.marginrowtop}>
        <Col xs={12} sm={12} md={6} lg={6}>
          <TextField
            style={useStyles.inputwidth}
            id="filled-basic"
            variant="filled"
            maxRows={1}
            // maxLength={100}
            inputProps={{ maxLength: 255 }}
            required
            label={screenlabels.department.department_name}
            value={props.departmentname}
            onKeyDown={props.handledepartnameKeydown}
            onChange={(e) =>
              validateInputField(e.target.value, RegexConstants.city_name)
                ? props.setdepartmentname(e.target.value)
                : e.preventDefault()
            }
            error={props.nameErrorMessage ? true : false}
            helperText={props.nameErrorMessage}
            // onChange={(e) => validateInputField(e.target.value) ? props.setdepartmentname(e.target.value.trim()) : e.preventDefault()}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <TextField
            style={useStyles.inputwidthright}
            id="filled-basic"
            multiline
            rows={4}
            variant="filled"
            // maxLength={500}
            inputProps={{ maxLength: 255 }}
            required
            label={screenlabels.department.description}
            value={props.departmentdescription}
            onKeyDown={props.handledepartdescriptionKeydown}
            onChange={(e) =>
              validateInputField(e.target.value, RegexConstants.city_name)
                ? props.setdepartmentdescription(e.target.value)
                : e.preventDefault()
            }
            error={props.descriptionErrorMessage ? true : false}
            helperText={props.descriptionErrorMessage}
          />
        </Col>
      </Row>
    </>
  );
}

import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import { useHistory, useLocation } from "react-router-dom";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./ProjectForm.css";

import { isRoleName } from "../../../../Utils/Common";
import labels from "../../../../Constants/labels";

export default function ProjectForm(props) {
  const history = useHistory();
  const location = useLocation();
  const [screenlabels, setscreenlabels] = useState(labels["en"]);

  //   const [department, setdepartment] = React.useState("");
  //   const [project, setproject] = React.useState("");
  //   const [description, setdescription] = React.useState("");

  //   const [department_variable, setdepartment_variable] = React.useState([]);

  //   const handleChangeDepartment = (event) => {
  //     console.log(event.target.value);
  //     setdepartment(event.target.value);
  //   };
  //   const handleChangeProject = (e) => {
  //     validateInputField(e.target.value, RegexConstants.connector_name)
  //       ? setproject(e.target.value)
  //       : e.preventDefault();

  //     console.log(e.target.value);

  //     // setproject(e.target.value);
  //   };

  //   const handleChangedescription = (e) => {
  //     console.log(e.target.value);
  //     validateInputField(e.target.value, RegexConstants.DES_SET_REGEX)
  //       ? setdescription(e.target.value)
  //       : e.preventDefault();
  //   };
  //   const handledescriptionKeydown = (e) => {
  //     handleUnwantedSpace(description, e);
  //   };

  const getTabNumber = () => {
    if (isRoleName(location.pathname) == "/datahub/") {
      return "7";
    } else {
      return "5";
    }
  };

  return (
    <Container className="projectform">
      <Row>
        <Col className="supportViewDetailsbackimage">
          <span
            onClick={() => {
              history.push(
                isRoleName(location.pathname) + "settings/" + getTabNumber()
              );
            }}
          >
            <img src={require("../../../../Assets/Img/Vector.svg")} alt="new" />
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
      <Row className="connectormainheading">
        <Col xs={12} sm={12} md={12} lg={12}>
          <span> {props.title}</span>
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={6} md={6} lg={6} className="department">
          <FormControl variant="filled" sx={{ m: 1, width: 420 }}>
            <InputLabel id="demo-simple-select-required-label">
              {screenlabels.project.select_department}
            </InputLabel>
            <Select
              labelId="demo-simple-select-required-label"
              id="demo-simple-select-required"
              value={props.department}
              onChange={props.handleChangeDepartment}
            >
              {props.department_variable.map((department, index) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.department_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} className="project">
          <TextField
            className="projectName"
            id="filled-basic"
            variant="filled"
            value={props.project}
            inputProps={{ maxLength: 255 }}
            onKeyDown={props.handleprojectnameKeydown}
            onChange={props.handleChangeProject}
            label={screenlabels.project.project_name}
            error={props.nameErrorMessage ? true : false}
            helperText={props.nameErrorMessage}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} className="description">
          <TextField
            className="descriptionName"
            label={screenlabels.project.project_des}
            multiline
            rows={4}
            variant="filled"
            value={props.description}
            inputProps={{ maxLength: 255 }}
            onKeyDown={props.handleprojectdescriptionKeydown}
            // maxLength={500}
            // onKeyDown={props.handledescriptionKeydown}
            onChange={props.handleChangedescription}
            error={props.descriptionErrorMessage ? true : false}
            helperText={props.descriptionErrorMessage}
          />
        </Col>
      </Row>
    </Container>
  );
}

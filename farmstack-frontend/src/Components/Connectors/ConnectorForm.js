import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import { useHistory } from "react-router-dom";
import "./ConnectorForm.css";

import Link from "@mui/material/Link";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { FileUploader } from "react-drag-drop-files";
import UploadDataset from "../../Components/Datasets/UploadDataset";
import {useLocation } from "react-router-dom";
import { validateInputField, handleUnwantedSpace } from "../../Utils/Common";
import RegexConstants from "../../Constants/RegexConstants";

import labels from "../../Constants/labels";
import { FormHelperText } from "@mui/material";
import {
  isRoleName
} from "../../Utils/Common";
const connectorType = ["Provider", "Consumer"];
const fileTypes = ["p12", "pfx"];

export default function ConnectorForm(props) {
  const history = useHistory();
  const location = useLocation();
  const [screenlabels, setscreenlabels] = useState(labels["en"]);

  //   const [department, setdepartment] = React.useState("");
  //   const [project, setproject] = React.useState("");
  //   const [connector, setconnector] = React.useState("");
  //   const [connectorName, setconnectorName] = React.useState("");
  //   const [description, setdescription] = React.useState("");
  //   const [Dataset, setDataset] = React.useState("");
  //   const [docker, setdocker] = React.useState("");
  //   const [port, setport] = React.useState("");

  //   const [file, setFile] = useState(null);
  //   const [fileValid, setfileValid] = useState("");

  //   const handleFileChange = (file) => {
  //     setFile(file);
  //     console.log(file);
  //     setfileValid("");
  //   };

  //   const handleChangeDepartment = (event) => {
  //     console.log(event.target.value);
  //     setdepartment(event.target.value);
  //   };
  //   const handleChangeProject = (event) => {
  //     console.log(event.target.value);
  //     setproject(event.target.value);
  //   };
  //   const handleChangeConnector = (event) => {
  //     console.log(event.target.value);
  //     setconnector(event.target.value);
  //   };
  //   const handleChangeConnectorName = (e) => {
  //     validateInputField(e.target.value, RegexConstants.DATA_SET_REGEX)
  //       ? setconnectorName(e.target.value)
  //       : e.preventDefault();
  //     console.log(e.target.value);
  //     // setconnectorName(event.target.value);
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
  //   const handleChangeDataset = (e) => {
  //     console.log(e.target.value);
  //     setDataset(e.target.value);
  //   };
  //   const handleChangeDocker = (e) => {
  //     console.log(e.target.value);
  //     setdocker(e.target.value);
  //   };
  //   const handleChangeport = (e) => {
  //     console.log(e.target.value);
  //     setport(e.target.value);
  //   };
  return (
    <Container className="connectorform">
      <Row>
        <Col className="supportViewDetailsbackimage">
          <span
            onClick={() => {
              history.push(isRoleName(location.pathname)+"connectors");
            }}>
            <img src={require("../../Assets/Img/Vector.svg")} alt="new" />
          </span>
          <span
            className="supportViewDetailsback"
            onClick={() => {
              history.push(isRoleName(location.pathname)+"connectors");
            }}>
            {"Back"}
          </span>
        </Col>
      </Row>
      <Row className="connectormainheading">
        <Col xs={12} sm={12} md={12} lg={12}>
          <span>{props.title}</span>
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={6} md={6} lg={6} className="connector">
          <FormControl variant="filled" sx={{ m: 1, width: 420 }}>
            <InputLabel id="demo-simple-select-required-label">
              {screenlabels.connector_form.connectorType}
            </InputLabel>
            <Select
              labelId="demo-simple-select-required-label"
              id="demo-simple-select-required"
              value={props.connector}
              onChange={props.handleChangeConnector}>
              {connectorType.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
               {/* error={props.typeErrorMessage ? true : false} */}
            </Select>
             {/*<FormHelperText>{props.typeErrorMessage}</FormHelperText>*/}
          </FormControl>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} className="dataset">
          {props.connector ? (
            <FormControl variant="filled" sx={{ m: 1, width: 420 }}>
              <InputLabel id="demo-simple-select-required-label">
                {screenlabels.connector_form.selectDataset}
              </InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={props.Dataset}
                onChange={props.handleChangeDataset}>
                {props.datasets.map((dataset, index) => (
                  //    console.log(dataset)
                  <MenuItem key={dataset.id} value={dataset.id}>
                    {dataset.name}
                  </MenuItem>
                ))}
                {/* error={props.datasetErrorMessage ? true : false} */}
              </Select>
              {/*<FormHelperText>{props.datasetErrorMessage}</FormHelperText>*/}
            </FormControl>
          ) : (
            <FormControl variant="filled" sx={{ m: 1, width: 420 }} disabled>
              <InputLabel id="demo-simple-select-required-label">
                {screenlabels.connector_form.selectDataset}
              </InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={props.Dataset}
                onChange={props.handleChangeDataset}>
                {props.datasets.map((dataset, index) => (
                  //    console.log(dataset)
                  <MenuItem key={dataset.id} value={dataset.id}>
                    {dataset.name}
                  </MenuItem>
                ))}
                {/* error={props.datasetErrorMessage ? true : false} */}
              </Select>
              {/*<FormHelperText>{props.datasetErrorMessage}</FormHelperText>*/}
            </FormControl>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} className="Name">
          <TextField
            // style={useStyles.inputwidth}
            className="connectorName"
            id="filled-basic"
            variant="filled"
            required
            // width="100%"
            value={props.connectorName}
            onChange={props.handleChangeConnectorName}
            label={screenlabels.connector_form.connectorName}
            error={props.nameErrorMessage ? true : false}
            helperText={props.nameErrorMessage}

          />
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={6} md={6} lg={6} className="link1">
          <Link
            component="button"
            variant="body2"
            onClick={(e) => { 
              history.push(isRoleName(location.pathname)+"settings/adddepartment")
              console.info("I'm a button.");
              e.preventDefault();
            }}
            underline="hover">
            {screenlabels.connector_form.addDepartment}
          </Link>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} className="link2">
          <Link
            component="button"
            variant="body2"
            onClick={(e) => {
              history.push(isRoleName(location.pathname)+"settings/project/add")
              console.info("I'm a button.");
              e.preventDefault();
            }}
            underline="hover">
            {screenlabels.connector_form.addProject}
          </Link>
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={6} md={6} lg={6} className="department">
          <FormControl variant="filled" sx={{ m: 1, width: 420 }}>
            <InputLabel id="demo-simple-select-required-label">
              {screenlabels.connector_form.selectDepartment}
            </InputLabel>
            <Select
              labelId="demo-simple-select-required-label"
              id="demo-simple-select-required"
              value={props.department}
              onChange={props.handleChangeDepartment}>
              {props.department_variable.map((department, index) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.department_name}
                </MenuItem>
              ))}
              {/* error={props.departErrorMessage ? true : false} */}
            </Select>
            {/*<FormHelperText>{props.departErrorMessage}</FormHelperText>*/}
          </FormControl>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} className="project">
          {props.department ? (
            <FormControl variant="filled" sx={{ m: 1, width: 420 }}>
              <InputLabel id="demo-simple-select-required-label">
                {screenlabels.connector_form.selectProject}
              </InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                //   onOpen={props.handleOpen}
                value={props.project}
                onChange={props.handleChangeProject}>
                {props.project_variable.map((project, index) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.project_name}
                  </MenuItem>
                ))}
                {/* error={props.projectErrorMessage ? true : false} */}
              </Select>
              {/* <FormHelperText>{props.projectErrorMessage}</FormHelperText> */}
            </FormControl>
          ) : (
            <FormControl variant="filled" sx={{ m: 1, width: 420 }} disabled>
              <InputLabel id="demo-simple-select-required-label">
                {screenlabels.connector_form.selectProject}
              </InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                //   onOpen={props.handleOpen}
                value={props.project}
                onChange={props.handleChangeProject}>
                {props.project_variable.map((project, index) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.project_name}
                  </MenuItem>
                ))}
                {/* error={props.projectErrorMessage ? true : false} */}
              </Select>
              {/* <FormHelperText>{props.projectErrorMessage}</FormHelperText> */}
            </FormControl>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={6} md={6} lg={6} className="docker">
          <TextField
            // style={useStyles.inputwidth}
            className="dockerName"
            id="filled-basic"
            variant="filled"
            required
            // width="100%"
            value={props.docker}
            onChange={props.handleChangeDocker}
            label={screenlabels.connector_form.docker}
            error={props.dockerErrorMessage ? true : false}
            helperText={props.dockerErrorMessage}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} className="port">
          <TextField
            className="portName"
            id="filled-basic"
            variant="filled"
            required
            // type={"number"}
            // width="100%"
            value={props.port}
            onChange={props.handleChangeport}
            label={screenlabels.connector_form.port}
            inputProps={{
              maxLength: 5,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            error={props.portErrorMessage ? true : false}
            helperText={props.portErrorMessage}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} className="description">
          <TextField
            className="descriptionName"
            label={screenlabels.connector_form.des}
            multiline
            rows={4}
            variant="filled"
            value={props.description}
            maxLength={500}
            onKeyDown={props.handledescriptionKeydown}
            onChange={props.handleChangedescription}
            error={props.descriptionErrorMessage ? true : false}
            helperText={props.descriptionErrorMessage}
          />
        </Col>
      </Row>
      {!props.upload ? (
        ""
      ) : (
        <>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <span className="uploadheading">Upload Certificate *</span>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} className="fileupload">
              <FileUploader
                handleChange={props.handleFileChange}
                name="file"
                types={fileTypes}
                children={
                  <UploadDataset
                    uploaddes="Supports: P12 format only"
                    uploadtitle="Upload Certificate"
                  />
                }
                classes="fileUpload"
              />
            </Col>
          </Row>
          <Row xs={12} sm={12} md={12} lg={12}>
            <p className="uploaddatasetname">
              {props.file
                ? props.file.size
                  ? `File name: ${props.file.name}`
                  : ""
                : ""}
            </p>
            <p className="oversizemb-uploadimglogo">
              {props.file != null && props.file.size > 2097152
                ? "File uploaded is more than 2MB!"
                : ""}
              {props.fileValid}
            </p>
          </Row>
        </>
      )}
    </Container>
  );
}

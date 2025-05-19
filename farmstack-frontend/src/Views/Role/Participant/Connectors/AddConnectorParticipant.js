import React, { useState, useEffect } from "react";
import ConnectorForm from "../../../../Components/Connectors/ConnectorForm";
import {
  validateInputField,
  handleUnwantedSpace,
  getUserMapId,
  GetErrorHandlingRoute,
  GetErrorKey,
} from "../../../../Utils/Common";
import RegexConstants from "../../../../Constants/RegexConstants";
import { useHistory } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import labels from "../../../../Constants/labels";
import Button from "@mui/material/Button";
import THEME_COLORS from "../../../../Constants/ColorConstants";
import Success from "../../../../Components/Success/Success";
import Loader from "../../../../Components/Loader/Loader";
import HTTPService from "../../../../Services/HTTPService";
import UrlConstants from "../../../../Constants/UrlConstants";
import { useLocation } from "react-router-dom";
import HandleSessionTimeout, {
  setTokenLocal,
  getTokenLocal,
  setUserId,
  getUserLocal,
  handleAddressCharacters,
  setUserMapId,
  setOrgId,
  getOrgLocal,
  isRoleName,
} from "../../../../Utils/Common";

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

const useStyles = {
  btncolor: {
    color: "white",
    "border-color": THEME_COLORS.THEME_COLOR,
    "background-color": THEME_COLORS.THEME_COLOR,
    float: "right",
    "border-radius": 0,
  },
  marginrowtop: { "margin-top": "20px" },
};

export default function AddConnectorParticipant() {
  const history = useHistory();
  const location = useLocation();
  //   dataset values
  const [datasets, setdatasets] = React.useState([]);
  const [department_variable, setdepartment_variable] = React.useState([]);
  const [project_variable, setproject_variable] = React.useState([
    { id: "3526bd39-4514-43fe-bbc4-ee0980bde252", project_name: "Default" },
  ]);
  const [screenlabels, setscreenlabels] = useState(labels["en"]);

  const [department, setdepartment] = React.useState("");
  const [project, setproject] = React.useState("");
  const [connector, setconnector] = React.useState("");
  const [connectorName, setconnectorName] = React.useState("");
  const [description, setdescription] = React.useState("");
  const [Dataset, setDataset] = React.useState("");
  const [docker, setdocker] = React.useState("");
  const [port, setport] = React.useState("");

  const [file, setFile] = useState(null);
  const [fileValid, setfileValid] = useState("");

  //   success screen
  const [isSuccess, setisSuccess] = useState(false);

  //   loader
  const [isLoader, setIsLoader] = useState(false);
  const [nameErrorMessage, setnameErrorMessage] = useState(null);
  const [dockerErrorMessage, setDockerErrorMessage] = useState(null);
  const [typeErrorMessage, setTypeErrorMessage] = useState(null);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState(null);
  const [portErrorMessage, setPortErrorMessage] = useState(null);
  const [departErrorMessage, setDepartMentErrorMessage] = useState(null);
  const [projectErrorMessage, setProjectErrorMessage] = useState(null);
  const [datasetErrorMessage, setDatasetErrorMessage] = useState(null);

  //   get dataset
  //   const getDatasetDetails = async () => {
  //     var id = getUserLocal();
  //     console.log("user id", id);
  //     setIsLoader(true);

  //     await HTTPService(
  //       "GET",
  //       UrlConstants.base_url + UrlConstants.list_of_dataset,
  //       { user_id: id },
  //       false,
  //       true
  //     )
  //       .then((response) => {
  //         setIsLoader(false);
  //         console.log("get request for dataset", response.data);
  //         setdatasets(response.data);
  //         console.log("datasets", datasets);
  //       })
  //       .catch((e) => {
  //         setIsLoader(false);
  //         // history.push(GetErrorHandlingRoute(e));
  //       });
  //   };

  //   get Department
  const getDepartmentDetails = async () => {
    // var id = getUserLocal();
    // console.log("user id", id);
    setIsLoader(true);

    await HTTPService(
      "GET",
      UrlConstants.base_url + UrlConstants.departments_connector_list,
      { org_id: getOrgLocal() },
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("get request for Department", response.data);
        setdepartment_variable(response.data);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  useEffect(() => {
    // getDatasetDetails();
    getDepartmentDetails();
    setdepartment("e459f452-2b4b-4129-ba8b-1e1180c87888");
    setproject("3526bd39-4514-43fe-bbc4-ee0980bde252");
  }, []);

  const handleFileChange = (file) => {
    setFile(file);
    console.log(file);
    setfileValid("");
  };

  const handleChangeDepartment = async (event) => {
    console.log(event.target.value);
    setdepartment(event.target.value);
    setIsLoader(true);
    setproject("3526bd39-4514-43fe-bbc4-ee0980bde252");

    await HTTPService(
      "GET",
      UrlConstants.base_url + UrlConstants.project_list,
      { department: event.target.value, org_id: getOrgLocal() },
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("get request for project", response.data);
        setproject_variable(response.data);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  const handleChangeProject = (event) => {
    console.log(event.target.value);
    setproject(event.target.value);
  };
  const handleChangeConnector = async (event) => {
    console.log("connector", event.target.value);
    setconnector(event.target.value);
    setDataset("");
    var id = getUserLocal();
    console.log("user id", id);
    setIsLoader(true);

    if (event.target.value == "Provider") {
      await HTTPService(
        "GET",
        UrlConstants.base_url + UrlConstants.list_of_dataset,
        { user_id: id },
        false,
        true
      )
        .then((response) => {
          setIsLoader(false);
          console.log("get request for dataset", response.data);
          setdatasets(response.data);
          console.log("datasets", datasets);
        })
        .catch((e) => {
          setIsLoader(false);
          history.push(GetErrorHandlingRoute(e));
        });
    } else {
      await HTTPService(
        "GET",
        UrlConstants.base_url + UrlConstants.list_of_dataset,
        false,
        true
      )
        .then((response) => {
          setIsLoader(false);
          console.log("get request for dataset", response.data);
          setdatasets(response.data);
          console.log("datasets", datasets);
        })
        .catch((e) => {
          setIsLoader(false);
          history.push(GetErrorHandlingRoute(e));
        });
    }
  };
  const handleChangeConnectorName = (e) => {
    validateInputField(e.target.value, RegexConstants.connector_name)
      ? setconnectorName(e.target.value)
      : e.preventDefault();
    console.log(e.target.value);
    // setconnectorName(event.target.value);
  };
  const handleChangedescription = (e) => {
    console.log(e.target.value);
    validateInputField(e.target.value, RegexConstants.DES_SET_REGEX)
      ? setdescription(e.target.value)
      : e.preventDefault();
  };
  const handledescriptionKeydown = (e) => {
    handleUnwantedSpace(description, e);
  };
  const handleChangeDataset = (e) => {
    console.log(e.target.value);
    setDataset(e.target.value);
  };
  const handleChangeDocker = (e) => {
    console.log(e.target.value);
    setdocker(e.target.value);
  };
  const handleChangeport = (e) => {
    console.log(e.target.value);
    // setport(e.target.value);
    validateInputField(e.target.value, RegexConstants.PINCODE_REGEX)
      ? setport(e.target.value)
      : e.preventDefault();
  };
  const handleAddDatasetSubmit = async (e) => {
    e.preventDefault();

    setnameErrorMessage(null);
    setTypeErrorMessage(null);
    setDescriptionErrorMessage(null);
    setPortErrorMessage(null);
    setDepartMentErrorMessage(null);
    setDockerErrorMessage(null);
    setProjectErrorMessage(null);
    setDatasetErrorMessage(null);

    // setisSuccess(true);
    setIsLoader(true);
    var bodyFormData = new FormData();
    bodyFormData.append("connector_name", connectorName);
    bodyFormData.append("connector_type", connector);
    bodyFormData.append("connector_description", description);
    bodyFormData.append("application_port", port);
    bodyFormData.append("department", department);
    bodyFormData.append("docker_image_url", docker);
    bodyFormData.append("project", project);
    bodyFormData.append("dataset", Dataset);
    bodyFormData.append("user_map", getUserMapId());
    console.log("Form Data", bodyFormData);

    await HTTPService(
      "POST",
      UrlConstants.base_url + UrlConstants.connector,
      bodyFormData,
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        setisSuccess(true);
        console.log("connector uploaded!", response.data);
      })
      .catch((e) => {
        setIsLoader(false);
        console.log(e);
        var returnValues = GetErrorKey(e, bodyFormData.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "connector_name":
                setnameErrorMessage(errorMessages[i]);
                break;
              //case "connector_type": setTypeErrorMessage(errorMessages[i]); break;
              case "connector_description":
                setDescriptionErrorMessage(errorMessages[i]);
                break;
              case "application_port":
                setPortErrorMessage(errorMessages[i]);
                break;
              //case "department": setDepartMentErrorMessage(errorMessages[i]); break;
              case "docker_image_url":
                setDockerErrorMessage(errorMessages[i]);
                break;
              //case "project": setProjectErrorMessage(errorMessages[i]); break;
              //case "dataset": setDatasetErrorMessage(errorMessages[i]); break;
              default:
                history.push(GetErrorHandlingRoute(e));
                break;
            }
          }
        } else {
          history.push(GetErrorHandlingRoute(e));
        }

        /*
        if (e.response && e.response.status === 400 && e.response.data.connector_name && e.response.data.connector_name[0].includes('connectors with this connector name already exists')){
          setnameErrorMessage(e.response.data.connector_name)
        }
        else if (e.response && e.response.status === 400 && e.response.data.docker_image_url && e.response.data.docker_image_url[0].includes('Invalid docker Image:')){
          setDockerErrorMessage(e.response.data.docker_image_url)
        }
        else{
          history.push(GetErrorHandlingRoute(e))
        }*/
      });
  };
  return (
    <>
      {isLoader ? <Loader /> : ""}
      {isSuccess ? (
        <Success
          okevent={() =>
            history.push(isRoleName(location.pathname) + "connectors")
          }
          route={"/participant/connectors"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Successfully Saved"}
          imageText={"Success!"}
          msg={
            "The connector configuration is saved successfully and a request for a certificate has been sent to the admin. You may receive the certificate via email soon. "
          }></Success>
      ) : (
        <div noValidate autoComplete="off">
          <ConnectorForm
            title={"Configure a new connector"}
            connector={connector}
            department={department}
            project={project}
            connectorName={connectorName}
            Dataset={Dataset}
            docker={docker}
            port={port}
            file={file}
            fileValid={fileValid}
            description={description}
            handleFileChange={handleFileChange}
            handleChangeDepartment={handleChangeDepartment}
            handleChangeProject={handleChangeProject}
            handleChangeConnector={handleChangeConnector}
            handleChangeConnectorName={handleChangeConnectorName}
            handleChangedescription={handleChangedescription}
            handledescriptionKeydown={handledescriptionKeydown}
            handleChangeDataset={handleChangeDataset}
            handleChangeDocker={handleChangeDocker}
            handleChangeport={handleChangeport}
            names={names}
            upload={false}
            datasets={datasets}
            department_variable={department_variable}
            project_variable={project_variable}
            nameErrorMessage={nameErrorMessage}
            typeErrorMessage={typeErrorMessage}
            descriptionErrorMessage={descriptionErrorMessage}
            portErrorMessage={portErrorMessage}
            departErrorMessage={departErrorMessage}
            dockerErrorMessage={dockerErrorMessage}
            projectErrorMessage={projectErrorMessage}
            datasetErrorMessage={datasetErrorMessage}
          />
          <Row>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              {connector &&
              //   department &&
              //   project &&
              connectorName &&
              Dataset &&
              docker &&
              port ? (
                <Button
                  style={useStyles.marginrowtop}
                  onClick={handleAddDatasetSubmit}
                  variant="contained"
                  className="submitbtn"
                  type="submit">
                  {screenlabels.connector_form.submit}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  disabled
                  className="disbalesubmitbtn">
                  {screenlabels.connector_form.submit}
                </Button>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() =>
                  history.push(isRoleName(location.pathname) + "connectors")
                }
                variant="outlined"
                className="cancelbtn">
                {screenlabels.common.cancel}
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect } from "react";
import ProjectForm from "../../../../Components/Settings/Participants/Project/ProjectForm";
import Success from "../../../../Components/Success/Success";
import Loader from "../../../../Components/Loader/Loader";
import THEME_COLORS from "../../../../Constants/ColorConstants";
import labels from "../../../../Constants/labels";
import Button from "@mui/material/Button";
import {
  validateInputField,
  handleUnwantedSpace,
  GetErrorHandlingRoute,
  GetErrorKey,
  getOrgLocal,
  getUserMapId,
  isRoleName,
} from "../../../../Utils/Common";
import RegexConstants from "../../../../Constants/RegexConstants";
import { useHistory, useLocation } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import HTTPService from "../../../../Services/HTTPService";
import UrlConstants from "../../../../Constants/UrlConstants";

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

export default function AddProjectParticipant() {
  const [department, setdepartment] = React.useState("");
  const [project, setproject] = React.useState("");
  const [description, setdescription] = React.useState("");

  const [screenlabels, setscreenlabels] = useState(labels["en"]);

  //   success screen
  const [isSuccess, setisSuccess] = useState(false);

  //   loader
  const [isLoader, setIsLoader] = useState(false);

  const history = useHistory();
  const location = useLocation()

  const [department_variable, setdepartment_variable] = React.useState([]);
  const [nameErrorMessage, setnameErrorMessage] = useState(null)
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState(null)

  const getTabNumber = () => {
    if(isRoleName(location.pathname) == '/datahub/'){
      return '7'
    } else{
      return '5'
    }
  }

  const handleChangeDepartment = (event) => {
    console.log(event.target.value);
    setdepartment(event.target.value);
  };
  const handleChangeProject = (e) => {
    validateInputField(e.target.value, RegexConstants.connector_name)
      ? setproject(e.target.value)
      : e.preventDefault();

    console.log(e.target.value);

    // setproject(e.target.value);
  };

  const handleChangedescription = (e) => {
    console.log(e.target.value);
    validateInputField(e.target.value, RegexConstants.connector_name)
      ? setdescription(e.target.value)
      : e.preventDefault();
  };
  const handledescriptionKeydown = (e) => {
    handleUnwantedSpace(description, e);
  };

  const handleAddProjectSubmit = async (e) => {
    e.preventDefault();
    var userid = getUserMapId();

    // setnameErrorMessage(null);
    // setTypeErrorMessage(null);
    // setDescriptionErrorMessage(null);
    // setPortErrorMessage(null);
    // setDepartMentErrorMessage(null);
    // setDockerErrorMessage(null);
    // setProjectErrorMessage(null);
    // setDatasetErrorMessage(null);

    // setisSuccess(true);
    setIsLoader(true);
    var bodyFormData = new FormData();
    bodyFormData.append("user_map", userid)
    bodyFormData.append(" project_discription", description);
    bodyFormData.append("department", department);
    bodyFormData.append("project_name", project);
    bodyFormData.append("organization", getOrgLocal());
    console.log("Form Data", bodyFormData);

    await HTTPService(
      "POST",
      UrlConstants.base_url + UrlConstants.add_project,
      bodyFormData,
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        setisSuccess(true);
        console.log("project uploaded!", response.data);
      })
      .catch((e) => {
        setIsLoader(false);
        console.log(e);
        var returnValues = GetErrorKey(e, bodyFormData.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            console.log(errorMessages[i], errorKeys[i])
                // if(errorKeys[i] == "project_name"){
                //     setnameErrorMessage(errorMessages[i])
                // }else if(errorKeys[i] == "project_description"){
                //     setDescriptionErrorMessage(errorMessages[i])
                // }else{history.push(GetErrorHandlingRoute(e));
                // }
                switch (errorKeys[i]) {
                  case "project_name": setnameErrorMessage(errorMessages[i]); break;
                  case "project_description": setDescriptionErrorMessage(errorMessages[i]); break;
                  default: history.push(GetErrorHandlingRoute(e)); break;
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

  const handleprojectnameKeydown= (e) => {
    handleUnwantedSpace(project, e);
};
const handleprojectdescriptionKeydown= (e) => {
    handleUnwantedSpace(description, e)
}
  //   get Department
  const getDepartmentDetails = async () => {
    // var id = getUserLocal();
    // console.log("user id", id);
    setIsLoader(true);

    await HTTPService(
      "GET",
      UrlConstants.base_url + UrlConstants.departments_connector_list,
      { org_id: getOrgLocal(), default: false },
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
    // setdepartment("e459f452-2b4b-4129-ba8b-1e1180c87888");
    // setproject("3526bd39-4514-43fe-bbc4-ee0980bde252");
  }, []);
  return (
    <>
      {isLoader ? <Loader /> : ""}
      {isSuccess ? (
        <Success
          okevent={() => history.push(isRoleName(location.pathname)+"settings/"+getTabNumber())}
          route={isRoleName(location.pathname)+"settings/"+getTabNumber()}
          imagename={"success"}
          btntext={"ok"}
          heading={"Project added successfully !"}
          imageText={"Success!"}
          msg={"You added a project. "}></Success>
      ) : (
        <form noValidate autoComplete="off" onSubmit={handleAddProjectSubmit}>
          <ProjectForm
            title={"Add a project"}
            department={department}
            project={project}
            description={description}
            department_variable={department_variable}
            nameErrorMessage= {nameErrorMessage}
            descriptionErrorMessage= {descriptionErrorMessage}
            handleChangeDepartment={handleChangeDepartment}
            handleprojectnameKeydown={handleprojectnameKeydown}
            handleprojectdescriptionKeydown={handleprojectdescriptionKeydown}
            handleChangeProject={handleChangeProject}
            handleChangedescription={handleChangedescription}
            handledescriptionKeydown={handledescriptionKeydown}
          />
          <Row>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              {department && project && description ? (
                <Button
                  style={useStyles.marginrowtop}
                  //   onClick={() => addNewParticipants()}
                  variant="contained"
                  className="submitbtn"
                  type="submit">
                  {screenlabels.project.submit}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  disabled
                  className="disbalesubmitbtn">
                  {screenlabels.project.submit}
                </Button>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() => history.push(isRoleName(location.pathname)+"settings/"+getTabNumber())}
                variant="outlined"
                className="cancelbtn">
                {screenlabels.common.cancel}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </>
  );
}

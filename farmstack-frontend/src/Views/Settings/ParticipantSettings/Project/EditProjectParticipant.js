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
  isRoleName,
} from "../../../../Utils/Common";
import RegexConstants from "../../../../Constants/RegexConstants";
import { useHistory, useLocation } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import HTTPService from "../../../../Services/HTTPService";
import UrlConstants from "../../../../Constants/UrlConstants";

import { useParams } from "react-router-dom";

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

export default function EditProjectParticipant() {
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

  //   retrive id for project list
  const { id } = useParams();

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

  const handleEditProjectSubmit = async (e) => {
    e.preventDefault();

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
    bodyFormData.append(" project_discription", description);
    bodyFormData.append("department", department);
    bodyFormData.append("project_name", project);
    console.log("Form Data", bodyFormData);

    await HTTPService(
      "PUT",
      UrlConstants.base_url + UrlConstants.add_project + id + "/",
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
            switch (errorKeys[i]) {
              //    case "connector_name":
              //      setnameErrorMessage(errorMessages[i]);
              //      break;
              //    //case "connector_type": setTypeErrorMessage(errorMessages[i]); break;
              //    case "connector_description":
              //      setDescriptionErrorMessage(errorMessages[i]);
              //      break;
              //    case "application_port":
              //      setPortErrorMessage(errorMessages[i]);
              //      break;
              //    //case "department": setDepartMentErrorMessage(errorMessages[i]); break;
              //    case "docker_image_url":
              //      setDockerErrorMessage(errorMessages[i]);
              //      break;
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

  //   get project data
  const getProjectDetails = async () => {
    // var id = getUserLocal();
    // console.log("user id", id);
    setIsLoader(true);
    console.log(id);

    await HTTPService(
      "GET",
      UrlConstants.base_url + UrlConstants.add_project + id + "/",
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("get request for edit project", response.data);
        setproject(response.data.project_name);
        setdepartment(response.data.department.id);
        setdescription(response.data.project_discription);

        // console.log(typeof typeof file);
        // console.log(typeof response.data.certificate);
        console.log("name", response.data.project_name);
        console.log(response.data.department);
        console.log(response.data.project_discription);
        // console.log(response.data.department_details.department_name);
      })
      .catch((e) => {
        setIsLoader(false);
        // history.push(GetErrorHandlingRoute(e));
      });
  };

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
    getProjectDetails();
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
        <form noValidate autoComplete="off" onSubmit={handleEditProjectSubmit}>
          <ProjectForm
            title={"Edit Project"}
            department={department}
            project={project}
            description={description}
            department_variable={department_variable}
            handleChangeDepartment={handleChangeDepartment}
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

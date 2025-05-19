import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Delete from "../../../../Components/Delete/Delete";
import Success from "../../../../Components/Success/Success";
import labels from "../../../../Constants/labels";
import UrlConstant from "../../../../Constants/UrlConstants";
import HTTPService from "../../../../Services/HTTPService";
import { GetErrorHandlingRoute, isRoleName } from "../../../../Utils/Common";
import Button from "@mui/material/Button";

export default function ProjectDetailView(props) {
  const useStyles = {
    datasetdescription: {
      "margin-left": "0px",
      "margin-right": "0px",
      "font-family": "Open Sans",
      "font-style": "normal",
      "font-weight": "400",
      "font-size": "14px",
      "line-height": "19px",
      overflow: "hidden",
      "text-overflow": "ellipsis",
      display: "-webkit-box",
      "-webkit-line-clamp": "1",
      "-webkit-box-orient": "vertical",
      float: "left",
      width: "300px",
    },
  };

  const [isLoader, setIsLoader] = useState(false);

  const history = useHistory();
  const location = useLocation()
  const { id } = useParams();
  const [screenlabels, setscreenlabels] = useState(labels["en"]);

  const [isViewDetail, setisViewDetail] = useState(true);
  const [isDelete, setisDelete] = useState(false);
  const [isDeleteSuccess, setisDeleteSuccess] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [departmentName, setDepartmentName] = useState("");

  useEffect(() => {
    getProjectDetails();
  }, []);

  const getProjectDetails = () => {
    console.log("Project Id: ", id);
    setIsLoader(true);

    HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.project_list + id + "/",
      "",
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log(response.data);

        setProjectName(response.data.project_name);
        setProjectDescription(response.data.project_discription);
        setDepartmentName(response.data.department.department_name);

        // console.log("projectDetails", projectDetails)
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  const deleteProject = () => {
    setIsLoader(true);
    HTTPService(
      "DELETE",
      UrlConstant.base_url + UrlConstant.project_list + id + "/",
      "",
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("otp valid", response.data);
        setisDeleteSuccess(true);
        setisViewDetail(false);
        setisDelete(false);
      })
      .catch((e) => {
        setIsLoader(false);
        setisDeleteSuccess(false);
        setisViewDetail(true);
        setisDelete(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  //returns tab corresponding tab number of project tab depending on user role
  const getTabNumber = () => {
    if(isRoleName(location.pathname) == '/datahub/'){
      return '7'
    } else{
      return '5'
    }
  }

  return (
    <>
      {isDelete ? (
        <Delete
          route={"login"}
          imagename={"delete"}
          firstbtntext={"Delete"}
          secondbtntext={"Cancel"}
          deleteEvent={() => deleteProject()}
          cancelEvent={() => {
            setisDelete(false);
            setisViewDetail(true);
            setisDeleteSuccess(false);
          }}
          heading={screenlabels.project.delete_project}
          imageText={screenlabels.project.delete_msg}
          msg={screenlabels.project.second_delete_msg}
          firstmsg={screenlabels.project.second_delete_msg}
          secondmsg={screenlabels.project.third_delete_msg}></Delete>
      ) : (
        <></>
      )}
      {isDeleteSuccess ? (
        <Success
          okevent={() => {
            setisDelete(false);
            setisViewDetail(true);
            setisDeleteSuccess(false);

            history.push(isRoleName(location.pathname)+"settings/"+getTabNumber());
          }}
          imagename={"success"}
          btntext={"ok"}
          heading={"Project deleted successfully!"}
          imageText={"Deleted!"}
          msg={"You deleted a project."}></Success>
      ) : (
        <></>
      )}
      {isViewDetail && (
        <>
          <Row>
            <Col className="supportViewDetailsbackimage">
              <span onClick={() => history.push(isRoleName(location.pathname)+"settings/"+getTabNumber())}>
                <img
                  src={require("../../../../Assets/Img/Vector.svg")}
                  alt="new"
                />
              </span>
              <span
                className="supportViewDetailsback"
                onClick={() => history.push(isRoleName(location.pathname)+"settings/"+getTabNumber())}>
                {"Back"}
              </span>
            </Col>
          </Row>
          <Row className="supportViewDeatilsSecondRow"></Row>
          <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
            <span className="mainheading">{"Project Details"}</span>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "30px",
              "text-align": "left",
            }}>
            <Col>
              <span className="secondmainheading">{"Department Name"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{"Project Name"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{"Description"}</span>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "5px",
              "text-align": "left",
            }}>
            <Col>
              {/* <Tooltip title={props.data['connector_name']}> */}
              <Row style={useStyles.datasetdescription}>
                <span className="thirdmainheading">{departmentName}</span>
              </Row>
              {/* </Tooltip> */}
            </Col>
            <Col>
              <span className="thirdmainheading">{projectName}</span>
            </Col>
            <Col>
              {/* <Tooltip title={props.data['dataset_details']['name']}> */}
              <Row style={useStyles.datasetdescription}>
                <span className="thirdmainheading">{projectDescription}</span>
              </Row>
              {/* </Tooltip> */}
            </Col>
          </Row>
          <Row style={{ "margin-top": "110px" }}>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() =>
                  history.push(isRoleName(location.pathname)+"settings/project/edit/" + id)
                }
                variant="outlined"
                className="cancelbtn"
                style={{ "text-transform": "none" }}>
                Edit project
              </Button>
            </Col>
          </Row>
          <Row style={{ "margin-top": "-40px" }}>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() => {
                  setisDelete(true);
                  setisViewDetail(false);
                  setisDeleteSuccess(false);
                }}
                variant="outlined"
                className="cancelbtn"
                style={{ "text-transform": "none" }}>
                Delete project
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

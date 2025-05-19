import React, { useEffect, useState } from "react";
import ProjectCard from "../../../../Components/Projects/ProjectCard";
import "./ProjectListing.css";
import { Col, Row } from "react-bootstrap";
import AddProjectCard from "../../../../Components/Projects/AddProjectCard";
import NoProjectCard from "../../../../Components/Projects/NoProjectCard";
import UrlConstant from "../../../../Constants/UrlConstants";
import { GetErrorHandlingRoute, getOrgLocal, isRoleName } from "../../../../Utils/Common";
import HTTPService from "../../../../Services/HTTPService";
import { useHistory, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Loader from "../../../../Components/Loader/Loader";
// import ProjectDetailsView from '../../../../Components/Projects/ProjectDetailsView'

export default function ProjectListing() {
  const [isLoader, setIsLoader] = useState(false);
  const history = useHistory();
  const location = useLocation()

  const [projectUrl, setProjectUrl] = useState(
    UrlConstant.base_url + UrlConstant.project_listing_page_url
  );
  const [showLoadMore, setShowLoadMore] = useState(true);

  const [projectList, setProjectList] = useState([]);
  const [projectDetails, setProjectDetails] = useState([]);

  // const [screenView, setscreenView] = useState(
  //     {
  //         "isProjectList": true,
  //         "isProjectViewDetails": false,
  //         "isDelete": false,
  //         "isDeleSuccess": false,
  //     }
  // );

  useEffect(() => {
    getProjectList(false);
  }, []);

  const getProjectList = (isLoadMore) => {
    setIsLoader(true);

    var payload = {};
    payload["org_id"] = getOrgLocal();

    HTTPService(
      "POST",
      isLoadMore
        ? projectUrl
        : UrlConstant.base_url + UrlConstant.project_listing_page_url,
      payload,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("response:", response);
        console.log("project:", response.data.results);

        if (response.data.next == null) {
          setShowLoadMore(false);
          setProjectUrl(
            UrlConstant.base_url + UrlConstant.project_listing_page_url
          );
        } else {
          setProjectUrl(response.data.next);
          setShowLoadMore(true);
        }
        let finalDataList = [];
        if (isLoadMore) {
          finalDataList = [...projectList, ...response.data.results];
        } else {
          finalDataList = response.data.results;
        }
        setProjectList(finalDataList);
      })
      .catch((e) => {
        console.log(e);
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  // const viewCardDetails = (id) => {
  //     console.log("Project Id: ", id)
  //     // setIsLoader(true);
  //     changeView('isProjectViewDetails')
  //     // HTTPService(
  //     //     "GET",
  //     //     UrlConstant.base_url + UrlConstant.project_list + id + '/',
  //     //     '',
  //     //     true,
  //     //     true
  //     // )
  //     //     .then((response) => {
  //     //         setIsLoader(false);
  //     //         console.log(response.data)
  //     //         changeView('isProjectViewDetails')

  //     //         setProjectDetails(response.data)

  //     //         console.log("projectDetails", projectDetails)
  //     //     }).catch((e) => {
  //     //         setIsLoader(false);
  //     //         history.push(GetErrorHandlingRoute(e));
  //     //     });
  // }

  // const changeView = (keyname) => {
  //     let tempScreenObject = { ...screenView }
  //     Object.keys(tempScreenObject).forEach(function (key) { if (key != keyname) { tempScreenObject[key] = false } else { tempScreenObject[key] = true } });
  //     setscreenView(tempScreenObject)
  // }

  return (
    <>
      {isLoader ? <Loader /> : ""}
      {/* {screenView.isProjectViewDetails ?
            <ProjectDetailsView
                projectDetails={projectDetails}
                departmentName="Test"
                projectName="Test"
                description="asdfadfa"
                back={() => {changeView('isProjectList')}}
            />
        :<></>} */}
      {/* {screenView.isProjectList ? */}
      <div className="projects">
        <Row>
          <span
            style={{
              "font-weight": "700",
              "font-size": "20px",
              "margin-left": "20px",
              "margin-top": "30px",
              "margin-bottom": "20px",
              "font-style": "normal",
              "font-family": "Open Sans",
            }}>
            My Projects
          </span>
        </Row>
        <Row>
          <AddProjectCard
            addevent={() => history.push(isRoleName(location.pathname)+"settings/project/add")}
          />
          {(!projectList || projectList.length == 0) && <NoProjectCard />}
          {projectList &&
            projectList.length > 0 &&
            projectList.map((project) => (
              <ProjectCard
                id={project.id}
                departmentName={project.department.department_name}
                projectName={project.project_name}
                description={project.project_discription}
                // viewCardDetails={()=>viewCardDetails(project.id)}
              />
            ))}
          {/* <ProjectCard
                        id={1}
                        departmentName={"Sample Department Name"}
                        projectName={"Sample Project Name Blah"}
                        description={"Sample Description blah blahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblah"}
                        // viewCardDetails={()=>viewCardDetails(1)}
                    />
                    <ProjectCard
                        departmentName={"Sample Department Name"}
                        projectName={"Sample Project Name Blah"}
                        description={"Sample Description"}
                    />
                    <ProjectCard
                        departmentName={"Sample Department Name"}
                        projectName={"Sample Project Name Blah"}
                        description={"Sample Description blah blahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblah"}
                    />
                    <ProjectCard
                        departmentName={"Sample Department Name"}
                        projectName={"Sample Project Name Blah"}
                        description={"Sample Description blah blahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblah"}
                    /> */}
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={3}></Col>
          {showLoadMore ? (
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() => getProjectList(true)}
                variant="outlined"
                className="cancelbtn"
                style={{ "text-transform": "none" }}>
                Load more
              </Button>
            </Col>
          ) : (
            <></>
          )}
        </Row>
      </div>
      {/* : <></> */}
      {/* }   */}
    </>
  );
}

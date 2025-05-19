import { Box } from "@mui/material";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from "@mui/material/Button";
import React from "react";
import styles from "./pairiing.module.css";
import donestatusicon from "../../Assets/Img/donestatusicon.svg";
import { Tooltip } from "@mui/material";
import {
  GetErrorHandlingRoute,
  getDockerHubURL,
  openLinkInNewTab,
} from "../../Utils/Common";

import UrlConstants from "../../Constants/UrlConstants";
import { useHistory } from "react-router-dom";
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
    width: "200px",
  },
};
const PairingRequest = (props) => {
  const history = useHistory()

  //   props = {
  //     connector_name: "Agnext - 1",
  //     connector_type: "Provider",
  //     org_name: "Agnext",
  //     hash: "476a7175bfe907acd0b936e735700f67cd9bb48e226e32763a6727707f2516b6",
  //     docker_img_url: "farmstack/kde-app:latest",
  //     org_web: "www.agnext.in",
  //     certificate_status: "Agnext Certificate.p12",
  //     dataset_name: "Soil Data",
  //     department_name: "Default",
  //     port_number: "1044",
  //     project_name: "Default",
  //   };
  const datasetDetailPage = (url) => {
    console.log(url)
    openLinkInNewTab(url)
    history.push("connectors/detail")
  }
  const redirectToNewPage = (url) => {
    window.open(url, "_blank")
  }

  return (
    <div style={{}} className={styles.mainPairRequest}>
      <Box
        sx={{
          //   border: "1px solid #D8AF28",

          padding: "30px 109px 0px 110px",
          display: "flex",
          justifyContent: "space-between",
          textAlign: "left",
        }}
        className={styles.PairingRequestMainBox}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            //   marginRight: "114px",
          }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="secondmainheading">Consumer Connector Name</div>
            <Tooltip
              title={
                props.data["connector_details"]
                  ? props.data["connector_details"]["connector_name"]
                  : ""
              }>
              <div
                style={useStyles.datasetdescription}
                className={styles.marginbottom50px}>
                <span className="thirdmainheading">
                  {props.data["connector_details"]
                    ? props.data["connector_details"]["connector_name"]
                    : ""}
                </span>
              </div>
            </Tooltip>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="secondmainheading">
              Certificate Status{" "}
              <img
                style={{ marginLeft: "11px" }}
                src={donestatusicon}
                alt="done"
              />
            </div>
            <Tooltip
              title={
                props.data["connector_details"]
                  ? props.data["connector_details"]["certificate"]
                  : ""
              }>
              <div
                style={useStyles.datasetdescription}
                className={styles.marginbottom50px}>
                <span className="thirdmainheading">
                  {props.data["connector_details"]
                    ? props.data["connector_details"]["certificate"]
                    : ""}
                </span>
              </div>
            </Tooltip>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="secondmainheading">
              Participant Organization Name
            </div>
            <Tooltip
              title={
                props.data["organization_details"]
                  ? props.data["organization_details"]["name"]
                  : ""
              }>
              <div
                style={useStyles.datasetdescription}
                className={styles.marginbottom50px}>
                <span className="thirdmainheading">
                  {props.data["organization_details"]
                    ? props.data["organization_details"]["name"]
                    : ""}
                </span>
              </div>
            </Tooltip>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="secondmainheading">Dataset Name</div>
            <Tooltip
              title={
                props.data["dataset_details"]
                  ? props.data["dataset_details"]["name"]
                  : ""
              }>
              <div
                style={useStyles.datasetdescription}
                className={styles.marginbottom50px}>
                <span className="thirdmainheading">
                  {props.data["dataset_details"]
                    ? props.data["dataset_details"]["name"]
                    : ""}
                </span>
              </div>
            </Tooltip>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}>
            <div className="secondmainheading">Docker image url</div>
            <Tooltip
              title={
                props.data["connector_details"]
                  ? getDockerHubURL(
                    props.data["connector_details"]["docker_image_url"]
                  )
                  : ""
              }>
              <div
                style={useStyles.datasetdescription}
                className={styles.marginbottom50px}>
                {props.data["connector_details"] ? (
                  <span
                    className="thirdmainheading dockerImageURL"
                    onClick={() => {
                      openLinkInNewTab(
                        getDockerHubURL(
                          props.data["connector_details"]["docker_image_url"]
                        )
                      );
                    }}>
                    {props.data["connector_details"]
                      ? props.data["connector_details"]["docker_image_url"]
                      : ""}
                  </span>
                ) : (
                  <span>{""}</span>
                )}
              </div>
            </Tooltip>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="secondmainheading">
              Participant Organization Website
            </div>
            <Tooltip
              title={
                props.data["organization_details"]
                  ? props.data["organization_details"]["website"]
                  : ""
              }>
              <div
                style={useStyles.datasetdescription}
                className={styles.marginbottom50px}>
                {props.data["organization_details"] ? (
                  <span
                    className="thirdmainheading dockerImageURL"
                    onClick={() => {
                      openLinkInNewTab(
                        props.data["organization_details"]["website"]
                      );
                    }}>
                    {props.data["organization_details"]
                      ? props.data["organization_details"]["website"]
                      : ""}
                  </span>
                ) : (
                  <span>{""}</span>
                )}
              </div>
            </Tooltip>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="secondmainheading">Department Name</div>
            <Tooltip
              title={
                props.data["department_details"]
                  ? props.data["department_details"]["department_name"]
                  : ""
              }>
              <div
                style={useStyles.datasetdescription}
                className={styles.marginbottom50px}>
                <span className="thirdmainheading">
                  {props.data["department_details"]
                    ? props.data["department_details"]["department_name"]
                    : ""}
                </span>
              </div>
            </Tooltip>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="secondmainheading">Port Number</div>
            <div
              className="thirdmainheading"
              className={styles.marginbottom50px}>
              {props.data["connector_details"]
                ? props.data["connector_details"]["application_port"]
                : ""}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="secondmainheading">Status</div>
            <Tooltip
              title={
                props.data["connector_pair_status"]
                  ? props.data["connector_pair_status"]
                  : ""
              }>
              <div
                style={useStyles.datasetdescription}
                className={styles.marginbottom50px}>
                <span className="thirdmainheading tocapitalizethefirstletter">
                  {props.data["connector_pair_status"]
                    ? props.data["connector_pair_status"]
                    : ""}
                </span>
              </div>
            </Tooltip>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="secondmainheading">Project Name</div>
            <Tooltip
              title={
                props.data["project_details"]
                  ? props.data["project_details"]["project_name"]
                  : ""
              }>
              <div
                style={useStyles.datasetdescription}
                className={styles.marginbottom50px}>
                <span className="thirdmainheading">
                  {props.data["project_details"]
                    ? props.data["project_details"]["project_name"]
                    : ""}
                </span>
              </div>
            </Tooltip>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "256px",
            }}>
            <div className="secondmainheading">Hash (Usage Policy)</div>
            <Tooltip
              title={
                props.data["connector_details"]
                  ? props.data["connector_details"]["usage_policy"]
                  : ""
              }>
              <div
                style={useStyles.datasetdescription}
                className={styles.marginbottom50px}>
                <span className="thirdmainheading">
                  {props.data["connector_details"]
                    ? props.data["connector_details"]["usage_policy"]
                    : ""}
                </span>
              </div>
            </Tooltip>
          </div>
          {props.data["connector_pair_status"] == "paired" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "256px",
              }}>
              <div className="secondmainheading">View Data</div>
              <Tooltip
                title={
                  props.data["ports"]
                    ? UrlConstants.view_data_connector + props.data['ports']['consumer_app'] + "/"
                    : ""
                }>
                <div
                  style={useStyles.datasetdescription}
                  className={styles.marginbottom50px}>
                  {props.data["ports"]["consumer_app"] ? (
                    // <span
                    //   className="thirdmainheading dockerImageURL"
                    //   onClick={() => { history.push("connectors/detail") }}
                    //   >
                    //   {props.data["ports"] ? "Click here" : ""}
                    // </span>
                    <span
                      className="thirdmainheading dockerImageURL"
                      onClick={() => {
                        redirectToNewPage(UrlConstants.view_data_connector + props.data['ports']['consumer_app'] + "/")
                        // datasetDetailPage(
                        //   UrlConstants.base_url_without_slash +"/participant/connectors/show_data/?port=" +props.data['ports']['consumer_app']
                        // );

                      }}
                    // onClick={() => {
                    //   datasetDetailPage(
                    //     UrlConstants.base_url_without_slash +"/participant/connectors/show_data/?port=" +props.data['ports']['consumer_app']
                    //   );
                    // }}
                    >
                      {props.data["ports"] ? "Click here" : ""}
                    </span>
                  ) : (
                    <span>{""}</span>
                  )}
                </div>
              </Tooltip>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Box>

      {props.data["connector_pair_status"] == "awaiting for approval" ? (
        <div>
          <button
            className={styles.rejectbtn}
            onClick={() => props.approveReject(props.data["id"], "rejected")}>
            Reject
          </button>
          <button
            className={styles.approvebutton}
            onClick={() => props.approveReject(props.data["id"], "paired")}>
            Approve and Pair
          </button>
        </div>
      ) : (
        <></>
      )}
      {props.data["connector_pair_status"] == "paired" ?
        <><Row>
          <Col xs={12} sm={12} md={6} lg={3} >
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} >
            <Button onClick={() => props.approveReject(props.data["id"], 'unpaired')} variant="outlined" className="submitbtn">
              Unpair
            </Button>
          </Col>
        </Row>
          <Row className="margin">
            <Col xs={12} sm={12} md={6} lg={3} >
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} >
              <Button onClick={() => props.cancel()} style={{ "margin-top": "0px" }} variant="outlined" className="editbtn">
                Cancel
              </Button>
            </Col>
          </Row><Row className="marginrowtop8px"></Row></> : <></>}
      {/* //   <div>
      //     <button
      //       className={styles.approvebutton}
      //       onClick={() => props.approveReject(props.data["id"], "unpaired")}>
      //       Unpair
      //     </button>
      //   </div>
      // ) : (
        // <></> */}
    </div>

  );
};

export default PairingRequest;

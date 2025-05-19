import React, { useState, useMemo } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import labels from "../../Constants/labels";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { dateTimeFormat } from "../../Utils/Common";
import UrlConstants from "../../Constants/UrlConstants";
import Avatar from "@mui/material/Avatar";
import { FileUploader } from "react-drag-drop-files";
import UploadDataset from "../../Components/Datasets/UploadDataset";
import Button from "@mui/material/Button";
import { Tooltip } from "@mui/material";
import {
  GetErrorHandlingRoute,
  getDockerHubURL,
  openLinkInNewTab,
} from "../../Utils/Common";
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
    width: "300px",
  },
};
export default function ViewConnectorDetails(props) {
  const history = useHistory();
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const [isLoader, setIsLoader] = useState(false);

  const datasetDetailPage = (url) => {
    openLinkInNewTab(url);
    history.push("connectors/detail");
  };
  const redirectToNewPage = (url) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <Row>
        <Col className="supportViewDetailsbackimage">
          <span onClick={() => props.back()}>
            <img src={require("../../Assets/Img/Vector.svg")} alt="new" />
          </span>
          <span className="supportViewDetailsback" onClick={() => props.back()}>
            {"Back"}
          </span>
        </Col>
      </Row>
      <Row className="supportViewDeatilsSecondRow"></Row>
      <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
        <span className="mainheading">{"My Connector Details"}</span>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "30px",
          "text-align": "left",
        }}
      >
        <Col>
          <span className="secondmainheading">{"Connector Name"}</span>
        </Col>
        <Col>
          <span className="secondmainheading">{"Connector Type"}</span>
        </Col>
        <Col>
          <span className="secondmainheading">{"Dataset Name"}</span>
        </Col>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "5px",
          "text-align": "left",
        }}
      >
        <Col>
          <Tooltip title={props.data["connector_name"]}>
            <Row style={useStyles.datasetdescription}>
              <span className="thirdmainheading">
                {props.data["connector_name"]}
              </span>
            </Row>
          </Tooltip>
        </Col>
        <Col>
          <span className="thirdmainheading">
            {props.data["connector_type"]}
          </span>
        </Col>
        <Col>
          <Tooltip title={props.data["dataset_details"]["name"]}>
            <Row style={useStyles.datasetdescription}>
              <span className="thirdmainheading">
                {props.data["dataset_details"]["name"]}
              </span>
            </Row>
          </Tooltip>
        </Col>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "40px",
          "text-align": "left",
        }}
      >
        <Col>
          <span className="secondmainheading">{"Status"}</span>
        </Col>
        <Col>
          <span className="secondmainheading">{"Project Name"}</span>
        </Col>
        <Col>
          <span className="secondmainheading">{"Department Name"}</span>
        </Col>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "5px",
          "text-align": "left",
        }}
      >
        <Col>
          <span>
            {props.data["connector_status"] == "install certificate" ? (
              <img
                src={require("../../Assets/Img/dwonloadblack.svg")}
                alt="new"
              />
            ) : (
              ""
            )}
            {props.data["connector_status"] == "paired" ? (
              <img
                src={require("../../Assets/Img/status_paired_icon.svg")}
                alt="new"
              />
            ) : (
              ""
            )}
            {props.data["connector_status"] == "unpaired" ? (
              <img
                src={require("../../Assets/Img/status_unpaired_icon.svg")}
                alt="new"
              />
            ) : (
              ""
            )}
            {props.data["connector_status"] == "rejected" ? (
              <img
                src={require("../../Assets/Img/status_rejected_icon.svg")}
                alt="new"
              />
            ) : (
              ""
            )}
            {props.data["connector_status"] == "awaiting for approval" ? (
              <img
                src={require("../../Assets/Img/status_awaiting_approval_icon.svg")}
                alt="new"
              />
            ) : (
              ""
            )}
            {props.data["connector_status"] == "pairing request received" ? (
              <img
                src={require("../../Assets/Img/status_pairing_request_received_icon.svg")}
                alt="new"
              />
            ) : (
              ""
            )}
          </span>{" "}
          <span className="thirdmainheading tocapitalizethefirstletter">
            {props.data["connector_status"]}
          </span>
        </Col>
        <Col>
          <Tooltip title={props.data["project_details"]["project_name"]}>
            <Row style={useStyles.datasetdescription}>
              <span className="thirdmainheading">
                {props.data["project_details"]["project_name"]}
              </span>
            </Row>
          </Tooltip>
        </Col>
        <Col>
          <Tooltip title={props.data["department_details"]["department_name"]}>
            <Row style={useStyles.datasetdescription}>
              <span className="thirdmainheading">
                {props.data["department_details"]["department_name"]}
              </span>
            </Row>
          </Tooltip>
        </Col>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "40px",
          "text-align": "left",
        }}
      >
        <Col>
          <span className="secondmainheading">{"Docker Image url"}</span>
        </Col>
        <Col>
          <span className="secondmainheading">{"Application Port"}</span>
        </Col>
        <Col>
          <span className="secondmainheading">{"Hash (usage Policy)"}</span>
        </Col>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "5px",
          "text-align": "left",
        }}
      >
        <Col>
          <Tooltip title={getDockerHubURL(props.data["docker_image_url"])}>
            <Row style={useStyles.datasetdescription}>
              <span
                className="thirdmainheading dockerImageURL"
                onClick={() => {
                  openLinkInNewTab(
                    getDockerHubURL(props.data["docker_image_url"])
                  );
                }}
              >
                {props.data["docker_image_url"]}
              </span>
            </Row>
          </Tooltip>
        </Col>
        <Col>
          <span className="thirdmainheading">
            {props.data["application_port"]}
          </span>
        </Col>
        <Col>
          <Tooltip title={props.data["usage_policy"]}>
            <Row style={useStyles.datasetdescription}>
              <span className="thirdmainheading">
                {props.data["usage_policy"]}
              </span>
            </Row>
          </Tooltip>
        </Col>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "40px",
          "text-align": "left",
        }}
      >
        <Col>
          <span className="secondmainheading">{"Description"}</span>
        </Col>
        {props.data["connector_status"] != "install certificate" ? (
          <>
            <Col>
              <span className="secondmainheading">
                {"Certificate Status"}{" "}
                <img
                  style={{ marginLeft: "8px" }}
                  src={require("../../Assets/Img/donestatusicon.svg")}
                  alt="done"
                />
              </span>
            </Col>
            <Col>
              <span className="thirdmainheading">{""}</span>
            </Col>
          </>
        ) : (
          <></>
        )}
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "5px",
          "text-align": "left",
        }}
      >
        <Col>
          <Tooltip title={props.data["connector_description"]}>
            <Row style={useStyles.datasetdescription}>
              <span className="thirdmainheading">
                {props.data["connector_description"]
                  ? props.data["connector_description"]
                  : "N/A"}
              </span>
            </Row>
          </Tooltip>
        </Col>
        {props.data["connector_status"] != "install certificate" ? (
          <>
            <Col>
              <Tooltip title={props.data["certificate"]}>
                <Row style={useStyles.datasetdescription}>
                  <span className="thirdmainheading">
                    {props.data["certificate"]}
                  </span>
                </Row>
              </Tooltip>
            </Col>
            <Col>
              <span className="thirdmainheading">{""}</span>
            </Col>
          </>
        ) : (
          <></>
        )}
      </Row>
      {props.data["connector_type"] == "Consumer" &&
      (props.data["connector_status"] == "unpaired" ||
        props.data["connector_status"] == "rejected") ? (
        <>
          <Row className="marginrowtop8px"></Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() => props.edit()}
                variant="outlined"
                className="submitbtn"
              >
                Update Connector
              </Button>
            </Col>
          </Row>
          <Row className="margin">
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() => props.delete()}
                style={{ "margin-top": "0px" }}
                variant="outlined"
                className="editbtn"
              >
                Delete Connector
              </Button>
            </Col>
          </Row>
          <Row className="marginrowtop8px"></Row>
        </>
      ) : (
        <></>
      )}
      <Row className="supportViewDeatilsSecondRow"></Row>
      {props.data["connector_type"] == "Consumer" &&
      (props.data["connector_status"] == "awaiting for approval" ||
        props.data["connector_status"] == "paired") ? (
        <>
          <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
            <span className="mainheading">
              {props.data["connector_status"] == "awaiting for approval"
                ? "Pending with"
                : "Paired with"}
            </span>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "30px",
              "text-align": "left",
            }}
          >
            <Col>
              <span className="secondmainheading">{"Connector Name"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{"Connector Type"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{"Dataset Name"}</span>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "5px",
              "text-align": "left",
            }}
          >
            <Col>
              <Tooltip
                title={
                  props.providerdata["connector_details"]
                    ? props.providerdata["connector_details"]["connector_name"]
                    : ""
                }
              >
                <Row style={useStyles.datasetdescription}>
                  <span className="thirdmainheading">
                    {props.providerdata["connector_details"]
                      ? props.providerdata["connector_details"][
                          "connector_name"
                        ]
                      : ""}
                  </span>
                </Row>
              </Tooltip>
            </Col>
            <Col>
              <span className="thirdmainheading">
                {props.providerdata["connector_details"]
                  ? props.providerdata["connector_details"]["connector_type"]
                  : ""}
              </span>
            </Col>
            <Col>
              <Tooltip
                title={
                  props.providerdata["dataset_details"]
                    ? props.providerdata["dataset_details"]["name"]
                    : ""
                }
              >
                <Row style={useStyles.datasetdescription}>
                  <span className="thirdmainheading">
                    {props.providerdata["dataset_details"]
                      ? props.providerdata["dataset_details"]["name"]
                      : ""}
                  </span>
                </Row>
              </Tooltip>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "30px",
              "text-align": "left",
            }}
          >
            <Col>
              <span className="secondmainheading">{"Department Name"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{"Project Name"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">
                {"Certificate Status"}{" "}
                <img
                  style={{ marginLeft: "8px" }}
                  src={require("../../Assets/Img/donestatusicon.svg")}
                  alt="done"
                />
              </span>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "5px",
              "text-align": "left",
            }}
          >
            <Col>
              <Tooltip
                title={
                  props.providerdata["department_details"]
                    ? props.providerdata["department_details"][
                        "department_name"
                      ]
                    : ""
                }
              >
                <Row style={useStyles.datasetdescription}>
                  <span className="thirdmainheading">
                    {props.providerdata["department_details"]
                      ? props.providerdata["department_details"][
                          "department_name"
                        ]
                      : ""}
                  </span>
                </Row>
              </Tooltip>
            </Col>
            <Col>
              <Tooltip
                title={
                  props.providerdata["project_details"]
                    ? props.providerdata["project_details"]["project_name"]
                    : ""
                }
              >
                <Row style={useStyles.datasetdescription}>
                  <span className="thirdmainheading">
                    {props.providerdata["project_details"]
                      ? props.providerdata["project_details"]["project_name"]
                      : ""}
                  </span>
                </Row>
              </Tooltip>
            </Col>
            <Col>
              <Tooltip
                title={
                  props.providerdata["connector_details"]
                    ? props.providerdata["connector_details"]["certificate"]
                    : ""
                }
              >
                <Row style={useStyles.datasetdescription}>
                  <span className="thirdmainheading">
                    {props.providerdata["connector_details"]
                      ? props.providerdata["connector_details"]["certificate"]
                      : ""}
                  </span>
                </Row>
              </Tooltip>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "30px",
              "text-align": "left",
            }}
          >
            <Col>
              <span className="secondmainheading">{"Docker Image url"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{"Application Port"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{"Hash (usage Policy)"}</span>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "5px",
              "text-align": "left",
            }}
          >
            <Col>
              <Tooltip
                title={
                  props.providerdata["connector_details"]
                    ? getDockerHubURL(
                        props.providerdata["connector_details"][
                          "docker_image_url"
                        ]
                      )
                    : ""
                }
              >
                <Row style={useStyles.datasetdescription}>
                  {props.providerdata["connector_details"] ? (
                    <span
                      className="thirdmainheading dockerImageURL"
                      onClick={() => {
                        openLinkInNewTab(
                          getDockerHubURL(
                            props.providerdata["connector_details"][
                              "docker_image_url"
                            ]
                          )
                        );
                      }}
                    >
                      {props.providerdata["connector_details"]
                        ? props.providerdata["connector_details"][
                            "docker_image_url"
                          ]
                        : ""}
                    </span>
                  ) : (
                    <span>{""}</span>
                  )}
                </Row>
              </Tooltip>
            </Col>
            <Col>
              <Tooltip
                title={
                  props.providerdata["connector_details"]
                    ? props.providerdata["connector_details"][
                        "application_port"
                      ]
                    : ""
                }
              >
                <Row style={useStyles.datasetdescription}>
                  <span className="thirdmainheading">
                    {props.providerdata["connector_details"]
                      ? props.providerdata["connector_details"][
                          "application_port"
                        ]
                      : ""}
                  </span>
                </Row>
              </Tooltip>
            </Col>
            <Col
              style={{
                width: "30px",
                height: "37px",
                "line-height": "19px",
                "word-break": "break-word",
              }}
            >
              <Tooltip
                title={
                  props.providerdata["connector_details"]
                    ? props.providerdata["connector_details"]["usage_policy"]
                    : ""
                }
              >
                <Row style={useStyles.datasetdescription}>
                  <span className="thirdmainheading">
                    {props.providerdata["connector_details"]
                      ? props.providerdata["connector_details"]["usage_policy"]
                      : ""}
                  </span>
                </Row>
              </Tooltip>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "30px",
              "text-align": "left",
            }}
          >
            <Col>
              <span className="secondmainheading">
                {"Participant organisation name"}
              </span>
            </Col>
            <Col>
              <span className="secondmainheading">
                {"Participant organisation website"}
              </span>
            </Col>
            {props.data["connector_status"] == "paired" ? (
              <Col>
                <span className="secondmainheading">{"View Data"}</span>
              </Col>
            ) : (
              <Col></Col>
            )}
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "5px",
              "text-align": "left",
            }}
          >
            <Col>
              <Tooltip
                title={
                  props.providerdata["organization_details"]
                    ? props.providerdata["organization_details"]["name"]
                    : ""
                }
              >
                <Row style={useStyles.datasetdescription}>
                  <span className="thirdmainheading">
                    {props.providerdata["organization_details"]
                      ? props.providerdata["organization_details"]["name"]
                      : ""}
                  </span>
                </Row>
              </Tooltip>
            </Col>
            <Col>
              <Tooltip
                title={
                  props.providerdata["organization_details"]
                    ? props.providerdata["organization_details"]["website"]
                    : ""
                }
              >
                <Row style={useStyles.datasetdescription}>
                  {props.providerdata["organization_details"] ? (
                    <span
                      className="thirdmainheading dockerImageURL"
                      onClick={() => {
                        openLinkInNewTab(
                          props.providerdata["organization_details"]["website"]
                        );
                      }}
                    >
                      {props.providerdata["organization_details"]
                        ? props.providerdata["organization_details"]["website"]
                        : ""}
                    </span>
                  ) : (
                    <span>{""}</span>
                  )}
                </Row>
              </Tooltip>
            </Col>
            {props.data["connector_status"] == "paired" ? (
              <Col>
                <Tooltip
                  title={
                    props.providerdata["ports"]
                      ? UrlConstants.view_data_connector +
                        props.providerdata["ports"]["consumer_app"] +
                        "/"
                      : ""
                  }
                >
                  <Row style={useStyles.datasetdescription}>
                    {props.providerdata["ports"] ? (
                      <span
                        className="thirdmainheading dockerImageURL"
                        onClick={() => {
                          redirectToNewPage(
                            UrlConstants.view_data_connector +
                              props.providerdata["ports"]["consumer_app"] +
                              "/"
                          );
                          // datasetDetailPage(
                          //   UrlConstants.base_url_without_slash +"/participant/connectors/show_data/?port=" +props.data['ports']['consumer_app']
                          // );
                        }}
                      >
                        {props.providerdata["ports"] ? "Click here" : ""}
                      </span>
                    ) : (
                      <span>{""}</span>
                    )}
                    {/* {props.providerdata['ports'] ? <span className="thirdmainheading dockerImageURL" onClick={() => { history.push("connectors/detail") }}>{props.providerdata["ports"] ? "Click here" : ""}</span> : <span>{""}</span>} */}
                  </Row>
                </Tooltip>
              </Col>
            ) : (
              <Col></Col>
            )}
          </Row>
          <Row className="supportViewDeatilsSecondRow"></Row>
        </>
      ) : (
        <></>
      )}
      {props.data["connector_type"] == "Consumer" &&
      props.data["connector_status"] == "paired" ? (
        <>
          <Row>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() =>
                  props.approveReject(props.providerdata["id"], "unpaired")
                }
                variant="outlined"
                className="submitbtn"
              >
                Unpair
              </Button>
            </Col>
          </Row>
          <Row className="margin">
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() => props.cancel()}
                style={{ "margin-top": "0px" }}
                variant="outlined"
                className="editbtn"
              >
                Cancel
              </Button>
            </Col>
          </Row>
          <Row className="marginrowtop8px"></Row>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

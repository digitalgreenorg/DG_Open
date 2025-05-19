import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import LocalStyle from "./Support.module.css";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import SupportResolution from "./SupportResolution";
import HTTPService from "../../Services/HTTPService";
import UrlConstants from "../../Constants/UrlConstants";
import UrlConstant from "../../Constants/UrlConstants";
import {
  GetErrorKey,
  GetErrorHandlingRoute,
  getUserMapId,
  dateTimeFormat,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import { FarmStackContext } from "../Contexts/FarmStackContext";
export default function SupportView(props) {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [queryField, setQueryField] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");
  const [orgName, setOrgname] = useState("");
  const [userNmae, setUserName] = useState("");
  const [createdDtate, setCreatedDate] = useState("");
  const [logoPath, setLogoPath] = useState("");
  const { callToast, callLoader } = useContext(FarmStackContext);
  const [resolutionfield, setResolution] = useState("");
  const [resolutionError, setResolutionError] = useState("");
  const [resolutionMessage, setResolutionMessage] = useState([]);
  const history = useHistory();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [editResolutionMessage, setEditResolutionMessage] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState("");
  const [resolutionFileError, setResolutionFileError] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState("");
  const [updateResErrorMessage, setUpdateResErrorMessage] = useState("");
  const [fileErrorMessage, setFileErrorMessage] = useState("");

  const handleSupportViewRoute = () => {
    if (isLoggedInUserCoSteward() || isLoggedInUserAdmin()) {
      return `/datahub/support`;
    } else if (isLoggedInUserParticipant()) {
      return `/participant/support`;
    }
  };
  const handleClearResolutionField = () => {
    setResolution("");
    setResolutionError("");
  };

  const handleUpdateResolutionMessage = (index, newValue, e) => {
    e.stopPropagation();
    const updatedResolutionMessage = [...resolutionMessage];
    updatedResolutionMessage[index].resolution_text = newValue.trimStart();
    setResolutionMessage(updatedResolutionMessage);
    setUpdateResErrorMessage("");
  };
  const handleSubmitResolution = (e) => {
    e.preventDefault();
    callLoader(true);

    var bodyFormData = new FormData();
    bodyFormData.append("resolution_text", resolutionfield);
    bodyFormData.append("ticket", id);
    if (uploadFile) {
      bodyFormData.append("solution_attachments", uploadFile);
    }
    HTTPService(
      "POST",
      UrlConstants.base_url + UrlConstants.support_resolution,
      bodyFormData,
      true,
      true,
      false,
      false
    )
      .then((response) => {
        callLoader(false);
        if (response?.status == 201) {
          handleClearResolutionField(true);
          setUploadFile("");
          getSupportTicketDetail();
          callToast(
            "Your message has been sent successfully!",
            "success",
            true
          );
        }
      })
      .catch(async (e) => {
        callLoader(false);
        var returnValues = GetErrorKey(e, bodyFormData.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "resolution_text":
                setResolutionError(errorMessages[i]);
                break;
              case "solution_attachments":
                setFileErrorMessage(errorMessages[i]);
              default:
            }
          }
        } else {
          let error = await GetErrorHandlingRoute(e);
          if (error?.toast) {
            callToast(
              "Something went wrong",
              error?.status === 200 ? "success" : "error",
              true
            );
          }
          if (error.path) {
            history.push(error.path);
          }
        }
      });
  };
  const handleUpgradeResolutionMessage = (e, index) => {
    e.preventDefault();
    const messageId = resolutionMessage[index].id;
    var bodyFormData = new FormData();
    bodyFormData.append(
      "resolution_text",
      resolutionMessage[index].resolution_text
    ); // Get the resolution text from the specific index
    callLoader(true);
    HTTPService(
      "PUT",
      UrlConstants.base_url + UrlConstants.support_resolution + messageId + "/",
      bodyFormData,
      true,
      true,
      false,
      false
    )
      .then((response) => {
        if (response?.status == 200) {
          callLoader(false);
          getSupportTicketDetail();
          let tmp = [...editResolutionMessage];
          tmp[index] = false;
          setEditResolutionMessage(tmp);
        }
      })
      .catch(async (e) => {
        callLoader(false);
        var returnValues = GetErrorKey(e, bodyFormData.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "resolution_text":
                setUpdateResErrorMessage(errorMessages[i]);
                break;
              default:
                let error = GetErrorHandlingRoute(e);
                callToast(error?.message, "error", true);
                break;
            }
          }
        } else {
          let error = await GetErrorHandlingRoute(e);
          if (error?.toast) {
            callToast(
              "Something went wrong",
              error?.status === 200 ? "success" : "error",
              true
            );
          }
          if (error.path) {
            history.push(error.path);
          }
        }
      });
    callLoader(false);
  };
  const getSupportTicketDetail = () => {
    callLoader(true);
    HTTPService(
      "GET",
      UrlConstants.base_url + UrlConstants.support_ticket + id + "/",
      "",
      false,
      true
    )
      .then((response) => {
        callLoader(false);
        setTitle(response.data.ticket.ticket_title);
        setSelectedCategory(response.data.ticket.category);
        setQueryField(response.data.ticket.description);
        setTicketStatus(response.data.ticket.status);
        setOrgname(response.data.ticket.user_map.organization?.name);
        setUserName(response.data.ticket.user_map.user.first_name);
        setCreatedDate(response.data.ticket.created_at);
        setLogoPath(response.data.ticket.user_map.organization?.logo);
        setResolutionMessage(response.data.resolutions);
        setSelectedStatus(response?.data?.ticket?.status);
        setUserLoggedIn(response.data.logged_in_organization.org_logo);
      })
      .catch(async (e) => {
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };
  const handleUpdateSupportTicket = (e) => {
    e.preventDefault();
    callLoader(true);

    var bodyFormData = new FormData();
    bodyFormData.append("ticket_title", title);
    bodyFormData.append("category", selectedCategory);
    bodyFormData.append("description", queryField);
    bodyFormData.append("user_map", getUserMapId());
    bodyFormData.append("status", selectedStatus);
    HTTPService(
      "PUT",
      UrlConstants.base_url + UrlConstants.support_ticket + id + "/",
      bodyFormData,
      true,
      true,
      false,
      false
    )
      .then((response) => {
        callLoader(false);
        if (response?.status == 200) {
          callToast(
            "Your Ticket has been updated successfully!",
            "success",
            true
          );
          getSupportTicketDetail();
        }
      })
      .catch(async (e) => {
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        if (error?.toast) {
          callToast(
            "Something went wrong",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };
  useEffect(() => {
    getSupportTicketDetail();
  }, []);
  return (
    <>
      <Box className={LocalStyle.containerMain}>
        <Row>
          <Col style={{ marginBottom: "20px" }}>
            <div className="text-left mt-50">
              <span
                className="add_light_text cursor-pointer breadcrumbItem"
                onClick={() => history.push(handleSupportViewRoute())}
              >
                Support
                {/* {breadcrumbFromRoute ?? "Participant"} */}
              </span>
              <span className="add_light_text ml-16">
                <ArrowForwardIosIcon
                  sx={{ fontSize: "14px", fill: "#00A94F" }}
                />
              </span>
              <span className="add_light_text ml-16 fw600">
                View ticket details
              </span>
            </div>
          </Col>
        </Row>
        <Row className={"justify-content-start"}>
          <Col xs={12} sm={6} md={4} xl={4}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "275px !important",
                height: "262px",
                background: "#ffffff",
                border: "1px solid #f2f3f5",
                boxShadow: "-40px 40px 80px rgba(145, 158, 171, 0.16)",
                borderRadius: "16px",
              }}
              className={LocalStyle.highlitedImg}
            >
              {logoPath ? (
                <img
                  src={UrlConstant.base_url_without_slash + logoPath}
                  style={{ width: "179px", height: "90px" }}
                />
              ) : (
                <h1 className={LocalStyle.firstLetterOnLogo}>
                  {orgName?.split("")[0]?.toUpperCase()}
                </h1>
              )}
            </Card>
          </Col>
        </Row>
        <Row className={LocalStyle.section}>
          <Col xs={12} sm={12} md={6} xl={6}>
            <Row className={LocalStyle.textRow}>
              <Col xs={12} sm={12} md={12} xl={12}>
                <Typography
                  // id={title + "-form-title"}
                  className={`${GlobalStyle.size24} ${GlobalStyle.bold600} ${LocalStyle.title}`}
                >
                  Ticket Details
                </Typography>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} xl={6}>
            <Row className={LocalStyle.textRow}>
              <Col xs={12} sm={12} md={6} xl={6}>
                <Typography
                  className={`${GlobalStyle.bold400} ${GlobalStyle.size16} ${LocalStyle.lightText}`}
                >
                  Ticket Title
                </Typography>
                <Typography
                  className={`${GlobalStyle.bold600} ${GlobalStyle.size16} ${LocalStyle.highlitedText}`}
                >
                  {title ? title : "NA"}
                </Typography>
              </Col>
              <Col xs={12} sm={12} md={6} xl={6}>
                <Typography
                  className={`${GlobalStyle.bold400} ${GlobalStyle.size16} ${LocalStyle.lightText}`}
                >
                  Status
                </Typography>
                <Typography
                  className={`${GlobalStyle.bold600} ${GlobalStyle.size16} ${
                    LocalStyle.highlitedText
                  } ${
                    ticketStatus === "closed"
                      ? LocalStyle.greenText
                      : LocalStyle.redText
                  }`}
                >
                  {ticketStatus ? ticketStatus : "NA"}
                </Typography>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={LocalStyle.textRow}>
          <Col xs={12} sm={12} md={6} xl={6}>
            <Typography
              className={`${GlobalStyle.bold400} ${GlobalStyle.size16} ${LocalStyle.lightText}`}
            >
              Description
            </Typography>
            <Typography
              className={`${GlobalStyle.bold600} ${GlobalStyle.size16} ${LocalStyle.highlitedText}`}
            >
              {queryField ? queryField : "NA"}
            </Typography>
          </Col>
        </Row>
        <Row className={LocalStyle.textRow}>
          <Col xs={12} sm={12} md={6} xl={6}>
            <Row>
              <Col xs={12} sm={12} md={6} xl={6}>
                <Typography
                  className={`${GlobalStyle.bold400} ${GlobalStyle.size16} ${LocalStyle.lightText}`}
                >
                  Organisation Name
                </Typography>
                <Typography
                  className={`${GlobalStyle.bold600} ${GlobalStyle.size16} ${LocalStyle.highlitedText}`}
                >
                  {orgName ? orgName : "NA"}
                </Typography>
              </Col>
              <Col xs={12} sm={12} md={6} xl={6}>
                <Typography
                  className={`${GlobalStyle.bold400} ${GlobalStyle.size16} ${LocalStyle.lightText}`}
                >
                  Name of Participant User
                </Typography>
                <Typography
                  className={`${GlobalStyle.bold600} ${GlobalStyle.size16} ${LocalStyle.highlitedText}`}
                >
                  {userNmae ? userNmae : "NA"}
                </Typography>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={LocalStyle.textRow}>
          <Col xs={12} sm={12} md={6} xl={6}>
            <Row>
              <Col xs={12} sm={12} md={6} xl={6}>
                <Typography
                  className={`${GlobalStyle.bold400} ${GlobalStyle.size16} ${LocalStyle.lightText}`}
                >
                  Date & Time
                </Typography>
                <Typography
                  className={`${GlobalStyle.bold600} ${GlobalStyle.size16} ${LocalStyle.highlitedText}`}
                >
                  {createdDtate ? dateTimeFormat(createdDtate, false) : "NA"}
                </Typography>
              </Col>
              <Col xs={12} sm={12} md={6} xl={6}>
                <Typography
                  className={`${GlobalStyle.bold400} ${GlobalStyle.size16} ${LocalStyle.lightText}`}
                >
                  Category
                </Typography>
                <Typography
                  className={`${GlobalStyle.bold600} ${GlobalStyle.size16} ${LocalStyle.highlitedText}`}
                >
                  {selectedCategory ? selectedCategory : "NA"}
                </Typography>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={LocalStyle.textRow}>
          <Col lg={12} sm={12}>
            <Typography
              className={`${GlobalStyle.size24} ${GlobalStyle.bold600} ${LocalStyle.title}`}
            >
              Resolution
            </Typography>
          </Col>
        </Row>
        <Row className={LocalStyle.textRow}>
          <Col lg={12} sm={12}>
            <SupportResolution
              resolutionfield={resolutionfield}
              setResolution={setResolution}
              handleClearResolutionField={handleClearResolutionField}
              handleSubmitResolution={handleSubmitResolution}
              resolutionError={resolutionError}
              setResolutionError={setResolutionError}
              resolutionMessage={resolutionMessage}
              editResolutionMessage={editResolutionMessage}
              setEditResolutionMessage={setEditResolutionMessage}
              handleUpdateResolutionMessage={handleUpdateResolutionMessage}
              handleUpgradeResolutionMessage={handleUpgradeResolutionMessage}
              uploadFile={uploadFile}
              setUploadFile={setUploadFile}
              hoveredMessage={hoveredMessage}
              setHoveredMessage={setHoveredMessage}
              logoPath={logoPath}
              resolutionFileError={resolutionFileError}
              setResolutionFileError={setResolutionFileError}
              userLoggedIn={userLoggedIn}
              updateResErrorMessage={updateResErrorMessage}
              setFileErrorMessage={setFileErrorMessage}
              fileErrorMessage={fileErrorMessage}
            />
          </Col>
        </Row>
        <Row className={LocalStyle.textRow}>
          <Col xs={12} sm={12} md={6} xl={6}>
            <FormControl
              required
              fullWidth
              className={LocalStyle.textFieldSupport}
              variant="outlined"
            >
              <InputLabel id="support-status" variant="outlined">
                Status
              </InputLabel>
              <Select
                required
                id="ticket_status"
                value={selectedStatus}
                name="Status"
                onChange={(e) => setSelectedStatus(e.target.value)}
                label="Status"
                variant="outlined"
                style={{ textAlign: "left" }}
              >
                <MenuItem value={"open"} id="open">
                  Open
                </MenuItem>
                <MenuItem value={"closed"} id="closed">
                  Closed
                </MenuItem>
              </Select>
            </FormControl>
          </Col>
          <Col style={{ textAlign: "right", margin: "20px" }}>
            <Button
              onClick={() => history.push(handleSupportViewRoute())}
              className={`${GlobalStyle.outlined_button} ${LocalStyle.supportButton}`}
              id="cancel-button-support"
              variant="outlined"
              style={{ marginRight: "20px" }}
            >
              Cancel
            </Button>
            <Button
              disabled={selectedStatus || ticketStatus ? false : true}
              onClick={(e) => handleUpdateSupportTicket(e)}
              className={`${GlobalStyle.primary_buttonSupport} ${LocalStyle.supportButton}`}
              id="Submit-button-support"
              variant="outlined"
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Box>
    </>
  );
}

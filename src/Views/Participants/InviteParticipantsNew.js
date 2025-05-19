import React, { Component, PropTypes, useState, useContext } from "react";
import {
  Button,
  Chip,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Col, Container, Row } from "react-bootstrap";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import LocalStyle from "./InviteParticipantsNew.module.css";
import RichTextEditor from "react-rte";
import validator from "validator";
import { FarmStackContext } from "../../Components/Contexts/FarmStackContext";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import { GetErrorHandlingRoute, GetErrorKey } from "../../Utils/Common";
import { useHistory } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const InviteParticipantsNew = (props) => {
  let title = "Invite Participants";
  let errorTextField = LocalStyle.customTextFieldError;
  const history = useHistory();

  const { callToast, callLoader } = useContext(FarmStackContext);
  let errorTextFieldClass = "";
  const [inviteNote, setInviteNote] = useState(RichTextEditor.createEmptyValue);
  const [email, setEmail] = useState("");
  const [allEmails, setAllEmails] = useState([]);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");

  const RTEOnChange = (value) => {
    console.log("rte on chaange", value.toString("html"));
    setInviteNote(value);
  };

  const handleChipEmailDelete = (index) => {
    console.log(",index in delete", index);
    let tmpAllEmails = [...allEmails];
    console.log("tmpAllEmails", tmpAllEmails);
    tmpAllEmails.splice(index, 1);
    console.log("tmpAllEmails", tmpAllEmails);
    setAllEmails(tmpAllEmails);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    errorTextFieldClass = "";
  };

  const hanldeEnterClick = (e) => {
    if (e.key === "Enter") {
      if (validator.isEmail(email)) {
        let tmpAllEmails = [...allEmails];
        tmpAllEmails.push(email);
        setAllEmails(tmpAllEmails);
        setEmail("");
        errorTextFieldClass = "";
      } else if (!validator.isEmail(email)) {
        errorTextFieldClass = "error";
        console.log("error");
        callToast("Please enter valid email.", "error", true);
      }
    }
    console.log("hanldeEnterClick");
  };

  const handleSubmit = () => {
    if (validator.isEmail(email)) {
      callToast("Please press enter after entering email!", "info", true);
      return;
    } else if (email !== "") {
      callToast("Please enter valid email and press enter!", "info", true);
      return;
    }
    let url = UrlConstant.base_url + UrlConstant.inviteparticipant;
    let data = {
      to_email: allEmails,
      content: inviteNote.toString("html"),
    };

    callLoader(true);
    HTTPService("POST", url, data, false, true)
      .then((response) => {
        callLoader(false);
        console.log("otp valid", response.data);
        callToast("Invite sent successfully!", "success", true);
        setAllEmails([]);
        setInviteNote(RichTextEditor.createEmptyValue);
      })
      .catch(async (e) => {
        callLoader(false);
        var returnValues = GetErrorKey(e, Object.keys(data));
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "to_email":
                setEmailErrorMessage(errorMessages[i]);
                break;
              case "content":
                setDescriptionErrorMessage(errorMessages[i]);
                break;
            }
          }
        } else {
          console.log("error ", GetErrorHandlingRoute(e));

          let error = await GetErrorHandlingRoute(e);
          console.log("Error obj", error);
          console.log(e);
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
        }
      });
  };

  const handleCancel = () => {
    setAllEmails([]);
    setEmail("");
    setInviteNote(RichTextEditor.createEmptyValue);
    history.go(-1);
  };

  return (
    <Container>
      <Row>
        <Col style={{ marginLeft: "inherit" }}>
          <div className="text-left mt-50">
            <span
              className="add_light_text cursor-pointer breadcrumbItem"
              onClick={() => history.push("/datahub/participants/")}
            >
              {"Participant"}
            </span>
            <span className="add_light_text ml-16">
              <ArrowForwardIosIcon sx={{ fontSize: "14px", fill: "#00A94F" }} />
            </span>
            <span className="add_light_text ml-16 fw600">
              {"Invite Participant"}
            </span>
          </div>
        </Col>
      </Row>
      <div className={LocalStyle.emailFieldContainer}>
        <Row className={`${GlobalStyle.padding0}`}>
          <Col
            className={`${GlobalStyle.padding0}`}
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <Typography
              id={title + "-form-title"}
              className={`${GlobalStyle.size32} ${GlobalStyle.bold600} ${LocalStyle.title} ${GlobalStyle.padding0}`}
            >
              Invite Participants
            </Typography>
          </Col>
        </Row>
        <Row>
          <TextField
            className={errorTextFieldClass == "error" ? errorTextField : ""}
            required
            id="invite-participants-emails-textfield"
            label="Enter Email ID"
            variant="outlined"
            fullWidth
            value={email}
            onKeyDown={(e) => hanldeEnterClick(e)}
            onChange={(e) => handleEmailChange(e.target.value.trimStart())}
          />
          {allEmails.length ? (
            <Paper
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0.5,
                m: 0,
              }}
              component="div"
              className={LocalStyle.chipsContainer}
            >
              {allEmails?.map((email, index) => {
                console.log("index", index);
                return (
                  <ListItem className={LocalStyle.chipsListItem} key={index}>
                    <Chip
                      label={email}
                      onDelete={() => handleChipEmailDelete(index)}
                    />
                  </ListItem>
                );
              })}
            </Paper>
          ) : (
            ""
          )}
        </Row>
      </div>
      <Row className={`${GlobalStyle.padding0}`}>
        <Col
          className={`${GlobalStyle.padding0}`}
          xs={12}
          sm={12}
          md={12}
          lg={12}
        >
          <Typography
            id={title + "-form-title"}
            className={`${GlobalStyle.size32} ${GlobalStyle.bold600} ${LocalStyle.title} ${GlobalStyle.padding0}`}
          >
            Add Invite Note
          </Typography>
        </Col>
      </Row>
      <Row>
        <RichTextEditor
          className={LocalStyle.RTEClassName}
          value={inviteNote}
          onChange={RTEOnChange}
        />
      </Row>
      <Row className={LocalStyle.backButtonContainer}>
        <Button
          id={"details-page-load-more-dataset-button"}
          variant="outlined"
          className={`${GlobalStyle.primary_button} ${LocalStyle.primary_button}`}
          onClick={handleSubmit}
          disabled={!allEmails.length && !email}
        >
          Submit
        </Button>
        <Button
          id={"details-page-load-more-dataset-button"}
          variant="outlined"
          className={`${GlobalStyle.outlined_button} ${LocalStyle.backButton}`}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Row>
    </Container>
  );
};

export default InviteParticipantsNew;

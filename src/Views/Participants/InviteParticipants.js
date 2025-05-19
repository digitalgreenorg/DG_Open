import React, { useState } from "react";
import Success from "../../Components/Success/Success";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import labels from "../../Constants/labels";
import Button from "@mui/material/Button";
import THEME_COLORS from "../../Constants/ColorConstants";
import HTTPService from "../../Services/HTTPService";
import UrlConstants from "../../Constants/UrlConstants";
import { useHistory } from "react-router-dom";
import RichTextEditor from "react-rte";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import Loader from "../../Components/Loader/Loader";
import { GetErrorHandlingRoute, GetErrorKey } from "../../Utils/Common";
const useStyles = {
  btncolor: {
    color: "white",
    "border-color": THEME_COLORS.THEME_COLOR,
    "background-color": THEME_COLORS.THEME_COLOR,
    float: "right",
    "border-radius": 0,
  },
  marginrowtop: { "margin-top": "20px" },
  marginrowtop50: { "margin-top": "50px" },
  btn: {
    width: "420px",
    height: "42px",
    "margin-top": "30px",
    background: "#ffffff",
    opacity: "0.5",
    border: "2px solid #c09507",
    color: "black",
  },
  submitbtn: { width: "420px", height: "42px", "margin-top": "30px" },
};
function InviteParticipants(props) {
  const history = useHistory();
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const [organisationname, setorganisationname] = useState("");
  const [organisationaddress, setorganisationaddress] = useState("");
  const [isSuccess, setisSuccess] = useState(false);
  const [orgdesc, setorgdesc] = useState("");
  const [emails, setemails] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  const [editorValue, setEditorValue] = React.useState(
    RichTextEditor.createValueFromString(orgdesc, "html")
  );

  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState(null);
  const [errorWhileEmailTyping, setErrorWhileTyping] = useState("");
  const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: [
      "INLINE_STYLE_BUTTONS",
      "BLOCK_TYPE_BUTTONS",
      //   "LINK_BUTTONS",
      "BLOCK_TYPE_DROPDOWN",
      //   "HISTORY_BUTTONS",
    ],
    INLINE_STYLE_BUTTONS: [
      { label: "Bold", style: "BOLD", className: "custom-css-class" },
      { label: "Italic", style: "ITALIC" },
      { label: "Underline", style: "UNDERLINE" },
    ],
    BLOCK_TYPE_DROPDOWN: [
      { label: "Normal", style: "unstyled" },
      { label: "Heading Large", style: "header-one" },
      { label: "Heading Medium", style: "header-two" },
      { label: "Heading Small", style: "header-three" },
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" },
    ],
  };
  const addInviteParticipants = () => {
    let data = {
      to_email: emails,
      content: orgdesc,
    };
    setDescriptionErrorMessage(null);
    setEmailErrorMessage(null);

    setIsLoader(true);
    HTTPService(
      "POST",
      UrlConstants.base_url + UrlConstants.inviteparticipant,
      data,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("otp valid", response.data);
        setisSuccess(true);
      })
      .catch((e) => {
        setIsLoader(false);
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
          history.push(GetErrorHandlingRoute(e));
        }
      });
  };

  const handleOrgDesChange = (value) => {
    console.log("valuevalue", value);

    // console.log(value.getEditorState().getCurrentContent().hasText())
    setEditorValue(value);
    setorgdesc(value.toString("html"));
  };

  return (
    <>
      {isLoader ? <Loader /> : ""}
      <Container style={useStyles.marginrowtop50}>
        {isSuccess ? (
          <Success
            okevent={() => history.push("/datahub/participants")}
            route={"datahub/participants"}
            imagename={"success"}
            btntext={"ok"}
            heading={"Invite participants sent successfully!"}
            imageText={"Invited"}
            msg={"Your invitation sent to participants."}
          ></Success>
        ) : (
          <>
            {" "}
            <Row style={useStyles.marginrowtop}>
              <Col xs={12} sm={12} md={12} lg={12}>
                <span className="mainheadingsuccess" style={{ float: "left" }}>
                  {screenlabels.inviteParticipants.first_heading}
                </span>
              </Col>
            </Row>
            <Row style={useStyles.marginrowtop}>
              <Col xs={12} sm={12} md={12} lg={12}>
                <ReactMultiEmail
                  style={{
                    width: "100%",
                    "font-family": "Open Sans",
                    "font-style": "normal",
                    "font-weight": "400",
                    "font-size": "14px",
                    "line-height": "19px",
                    color: "#3D4A52",
                  }}
                  placeholder="Email"
                  variant="filled"
                  emails={emails}
                  onChange={(email) => setemails(email)}
                  validateEmail={(email) => {
                    if (isEmail(email)) {
                      setErrorWhileTyping(false);
                      return isEmail(email);
                    } else {
                      setErrorWhileTyping(true);
                      return isEmail(email);
                    }
                  }}
                  getLabel={(
                    email: string,
                    index: number,
                    removeEmail: (index: number) => void
                  ) => {
                    return (
                      <div data-tag key={index}>
                        {email}
                        <span
                          data-tag-handle
                          onClick={() => removeEmail(index)}
                        >
                          ×
                        </span>
                      </div>
                    );
                  }}
                  error={emailErrorMessage ? true : true}
                  helperText={"emailErrorMessage"}
                />
                <span style={{ color: "red" }}>
                  {errorWhileEmailTyping ? "Enter valid mail Id" : ""}
                </span>
              </Col>
            </Row>
            <Row style={useStyles.marginrowtop}>
              <Col xs={12} sm={12} md={12} lg={12}>
                <span className="mainheadingsuccess" style={{ float: "left" }}>
                  {screenlabels.inviteParticipants.second_heading}
                </span>
              </Col>
            </Row>
            <Row style={useStyles.marginrowtop}>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className="invite-participant-text-editor"
              >
                <RichTextEditor
                  toolbarConfig={toolbarConfig}
                  value={editorValue}
                  onChange={handleOrgDesChange}
                  required
                  id="body-text"
                  name="bodyText"
                  type="string"
                  placeholder={"Message"}
                  multiline
                  variant="filled"
                  style={{
                    minHeight: 410,
                    border: "1px solid black",
                    zIndex: 4,
                  }}
                  error={setDescriptionErrorMessage ? true : false}
                  helperText={setDescriptionErrorMessage}
                />
              </Col>
            </Row>
            <Row style={{ "margin-top": "20px" }}>
              <Col xs={12} sm={12} md={6} lg={3}></Col>
              <Col xs={12} sm={12} md={6} lg={6}>
                {emails.length > 0 &&
                editorValue.getEditorState().getCurrentContent().hasText() ? (
                  <Button
                    onClick={() => addInviteParticipants()}
                    variant="contained"
                    className="submitbtn"
                  >
                    {screenlabels.common.submit}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    disabled
                    className="disbalesubmitbtn"
                  >
                    {screenlabels.common.submit}
                  </Button>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={6} lg={3}></Col>
              <Col xs={12} sm={12} md={6} lg={6}>
                <Button
                  onClick={() => history.push("/datahub/participants")}
                  variant="outlined"
                  className="cancelbtn"
                >
                  {screenlabels.common.cancel}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
}
export default InviteParticipants;

import React, { useState, useEffect } from "react";
import ParticipantRegistrationForm from "./ParticipantRegistrationForm";
import Success from "../../Components/Success/Success";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import labels from "../../Constants/labels";
import THEME_COLORS from "../../Constants/ColorConstants";
import HTTPService from "../../Services/HTTPService";
import UrlConstants from "../../Constants/UrlConstants";
import validator from "validator";
import { useHistory } from "react-router-dom";
import RegexConstants from "../../Constants/RegexConstants";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  mobileNumberMinimunLengthCheck,
} from "../../Utils/Common";
import Loader from "../../Components/Loader/Loader";
import { Snackbar, Button, IconButton, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = {
  btncolor: {
    color: "white",
    "border-color": THEME_COLORS.THEME_COLOR,
    "background-color": THEME_COLORS.THEME_COLOR,
    float: "right",
    "border-radius": 0,
  },
  marginrowtop: { "margin-top": "20px" },
  marginrowtop8px: { "margin-top": "0px" },
};
function AddParticipantsRegistrationform(props) {
  const history = useHistory();
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const [organisationname, setorganisationname] = useState("");
  const [organisationaddress, setorganisationaddress] = useState("");
  const [orginsationemail, setorginsationemail] = useState("");
  const [countryvalue, setcountryvalue] = useState("");
  const [contactnumber, setcontactnumber] = useState("");
  const [websitelink, setwebsitelink] = useState("");
  const [pincode, setpincode] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [useremail, setuseremail] = useState("");
  const [isorganisationemailerror, setisorganisationemailerror] =
    useState(false);
  const [iscontactnumbererror, setiscontactnumbererror] = useState(false);
  const [iswebsitelinkrerror, setwebsitelinkerror] = useState(false);
  const [isuseremailerror, setisuseremailerror] = useState(false);
  const [isexisitinguseremail, setisexisitinguseremail] = useState(false);
  const [isSuccess, setisSuccess] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState(null);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState(null);
  const [orgNameErrorMessage, setOrgNameErrorMessage] = useState(null);
  const [orgEmailErrorMessage, setOrgEmailErrorMessage] = useState(null);
  const [orgWebsiteErrorMessage, setOrgWebsiteErrorMessage] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [messageForSnackBar, setMessageForSnackBar] = useState("");
  const [errorOrSuccess, setErrorOrSuccess] = useState("error");
  const [selectCoSteward, setSelectCoSteward] = useState([]);
  const [selectedCosteward, setSelectedCosteward] = useState([]);

  useEffect(() => {
    getListOfCostewards();
  }, []);

  const isValidURL = (string) => {
    var res = string.match(RegexConstants.NEW_WEBSITE_REGEX);
    return res !== null;
  };
  const isValidCapsUrl = (string) => {
    var res1 = string.match(RegexConstants.NEW_C_WEBSITE_REGEX);
    return res1 !== null;
  };
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const getListOfCostewards = () => {
    setIsLoader(true);
    HTTPService(
      "POST",
      UrlConstants.base_url + UrlConstants.costewardlist_selfregister,
      "",
      false,
      false
    )
      .then((response) => {
        setIsLoader(false);
        console.log(response);
        setSelectCoSteward([...response.data]);
        console.log("response of costewards", response.data);
      })
      .catch((e) => {
        setMessageForSnackBar("Get list of Co-Stewards failed!!!");
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  const handlelistofCosteward = (e) => {
    console.log(e.target.value);
    setSelectedCosteward(e.target.value);
  };
  const addNewParticipants = () => {
    setFirstNameErrorMessage(null);
    setLastNameErrorMessage(null);
    setEmailErrorMessage(null);
    setPhoneNumberErrorMessage(null);
    setOrgNameErrorMessage(null);
    setOrgEmailErrorMessage(null);
    setOrgWebsiteErrorMessage(null);
    setisorganisationemailerror(null);

    var bodyFormData = new FormData();
    bodyFormData.append("email", useremail.toLowerCase());
    bodyFormData.append("org_email", orginsationemail.toLowerCase());
    bodyFormData.append("first_name", firstname);
    bodyFormData.append("last_name", lastname);
    bodyFormData.append("name", organisationname);
    bodyFormData.append("phone_number", contactnumber);
    bodyFormData.append("website", websitelink);
    bodyFormData.append("on_boarded_by", selectedCosteward);

    bodyFormData.append(
      "address",
      JSON.stringify({
        address: organisationaddress,
        country: countryvalue,
        pincode: pincode,
      })
    );
    setIsLoader(true);
    HTTPService(
      "POST",
      UrlConstants.base_url + UrlConstants.register_participant,
      bodyFormData,
      false,
      false
    )
      .then((response) => {
        console.log(response);
        setIsLoader(false);
        setisSuccess(true);
        setMessageForSnackBar("You are added as a Participant");
        setErrorOrSuccess("success");
        handleClick();
      })
      .catch((e) => {
        setIsLoader(false);
        setErrorOrSuccess("error");
        handleClick();
        console.log(e);
        var returnValues = GetErrorKey(e, bodyFormData.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "first_name":
                setFirstNameErrorMessage(errorMessages[i]);
                break;
              case "last_name":
                setLastNameErrorMessage(errorMessages[i]);
                break;
              case "email":
                setEmailErrorMessage(errorMessages[i]);
                break;
              case "phone_number":
                setPhoneNumberErrorMessage(errorMessages[i]);
                break;
              case "name":
                setOrgNameErrorMessage(errorMessages[i]);
                break;
              case "org_email":
                setOrgEmailErrorMessage(errorMessages[i]);
                break;
              case "website":
                setOrgWebsiteErrorMessage(errorMessages[i]);
                break;
              default:
                setMessageForSnackBar("Something went wrong");
                break;
            }
          }
        } else {
          history.push(GetErrorHandlingRoute(e));
        }
      });
  };
  return (
    <>
      {isLoader ? <Loader /> : ""}
      <Container style={useStyles.marginrowtop}>
        {isSuccess ? (
          <Success
            okevent={() => history.push("/home")}
            route={"/home"}
            imagename={"success"}
            btntext={"ok"}
            heading={"You are registered as a Participant!"}
            imageText={"Added"}
            msg={"Click ok to Login."}
          ></Success>
        ) : (
          <>
            <Snackbar
              open={open}
              autoHideDuration={4000}
              onClose={handleClose}
              action={action}
            >
              <Alert
                autoHideDuration={4000}
                onClose={handleClose}
                sx={{ width: "100%" }}
                severity={errorOrSuccess}
              >
                {messageForSnackBar}
              </Alert>
            </Snackbar>
            <ParticipantRegistrationForm
              organisationname={organisationname}
              setorganisationname={(ref) => {
                setorganisationname(ref);
              }}
              orginsationemail={orginsationemail}
              isorganisationemailerror={isorganisationemailerror}
              setorginsationemail={(ref) => {
                setorginsationemail(ref);
                setisorganisationemailerror(!validator.isEmail(ref));
              }}
              countryvalue={countryvalue}
              setcountryvalue={(ref) => {
                setcountryvalue(ref);
              }}
              contactnumber={contactnumber}
              setcontactnumber={(ref) => {
                setcontactnumber(ref);
                console.log("sss", ref);
              }}
              iscontactnumbererror={iscontactnumbererror}
              websitelink={websitelink}
              setwebsitelink={(ref) => {
                setwebsitelink(ref);
                setwebsitelinkerror(!isValidURL(ref) && !isValidCapsUrl(ref));
              }}
              iswebsitelinkrerror={iswebsitelinkrerror}
              organisationaddress={organisationaddress}
              setorganisationaddress={(ref) => {
                setorganisationaddress(ref);
              }}
              pincode={pincode}
              setpincode={(ref) => {
                setpincode(ref);
              }}
              firstname={firstname}
              setfirstname={(ref) => {
                setfirstname(ref);
              }}
              lastname={lastname}
              setlastname={(ref) => {
                setlastname(ref);
              }}
              useremail={useremail}
              setuseremail={(ref) => {
                setuseremail(ref);
                setisuseremailerror(!validator.isEmail(ref));
                setisexisitinguseremail(false);
              }}
              isuseremailerror={isuseremailerror}
              isexisitinguseremail={isexisitinguseremail}
              first_heading={screenlabels.addparticipants.first_heading}
              second_heading={screenlabels.addparticipants.second_heading}
              third_heading={screenlabels.addparticipants.third_heading}
              fourth_heading={screenlabels.addparticipants.fourth_heading}
              firstNameErrorMessage={firstNameErrorMessage}
              lastNameErrorMessage={lastNameErrorMessage}
              emailErrorMessage={emailErrorMessage}
              phoneNumberErrorMessage={phoneNumberErrorMessage}
              orgNameErrorMessage={orgNameErrorMessage}
              orgEmailErrorMessage={orgEmailErrorMessage}
              orgWebsiteErrorMessage={orgWebsiteErrorMessage}
              selectCoSteward={selectCoSteward}
              setSelectCoSteward={setSelectCoSteward}
              getListOfCostewards={getListOfCostewards}
              handlelistofCosteward={handlelistofCosteward}
              selectedCosteward={selectedCosteward}
            ></ParticipantRegistrationForm>
            <Row>
              <Col xs={12} sm={12} md={6} lg={3}></Col>
              <Col xs={12} sm={12} md={6} lg={6}>
                {organisationname &&
                orginsationemail &&
                !isorganisationemailerror &&
                countryvalue &&
                mobileNumberMinimunLengthCheck(contactnumber) &&
                websitelink &&
                !iswebsitelinkrerror &&
                organisationaddress &&
                pincode.length >= 5 &&
                firstname &&
                useremail &&
                !isuseremailerror &&
                !messageForSnackBar ? (
                  // organisationlength ?
                  <Button
                    onClick={() => addNewParticipants()}
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
            <Row style={useStyles.marginrowtop8px}>
              <Col xs={12} sm={12} md={6} lg={3}></Col>
              <Col xs={12} sm={12} md={6} lg={6}>
                <Button
                  onClick={() => history.push("/home")}
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
export default AddParticipantsRegistrationform;

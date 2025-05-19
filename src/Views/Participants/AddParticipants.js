import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import ParticipantForm from "../../Components/Participants/ParticipantForm";
import Success from "../../Components/Success/Success";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import labels from "../../Constants/labels";
import Button from "@mui/material/Button";
import THEME_COLORS from "../../Constants/ColorConstants";
import HTTPService from "../../Services/HTTPService";
import UrlConstants from "../../Constants/UrlConstants";
import validator from "validator";
import { useHistory } from "react-router-dom";
import RegexConstants from "../../Constants/RegexConstants";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  isLoggedInUserCoSteward,
  mobileNumberMinimunLengthCheck,
  getUserLocal,
  stringMinimumLengthCheck,
} from "../../Utils/Common";
import Loader from "../../Components/Loader/Loader";
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
function AddParticipants(props) {
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
  // const [organisationlength, setorganisationlength] = useState(3);
  const [istrusted, setistrusted] = React.useState(false);
  const [isorganisationemailerror, setisorganisationemailerror] =
    useState(false);
  const [iscontactnumbererror, setiscontactnumbererror] = useState(false);
  const [iswebsitelinkrerror, setwebsitelinkerror] = useState(false);
  const [isuseremailerror, setisuseremailerror] = useState(false);
  const [isexisitinguseremail, setisexisitinguseremail] = useState(false);
  // const [ispincodeerror, setispincodeerror] = useState(false)
  const [isSuccess, setisSuccess] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState(null);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState(null);
  const [orgNameErrorMessage, setOrgNameErrorMessage] = useState(null);
  const [orgEmailErrorMessage, setOrgEmailErrorMessage] = useState(null);
  const [orgWebsiteErrorMessage, setOrgWebsiteErrorMessage] = useState(null);
  // const[orgSubscriptionErrorMessage, setOrgSubscriptionErrorMessage] = useState(null)

  const isValidURL = (string) => {
    var res = string.match(RegexConstants.NEW_WEBSITE_REGEX);
    return res !== null;
  };
  const isValidCapsUrl = (string) => {
    var res1 = string.match(RegexConstants.NEW_C_WEBSITE_REGEX);
    return res1 !== null;
  };
  const addNewParticipants = () => {
    setFirstNameErrorMessage(null);
    setLastNameErrorMessage(null);
    setEmailErrorMessage(null);
    setPhoneNumberErrorMessage(null);
    setOrgNameErrorMessage(null);
    setOrgEmailErrorMessage(null);
    setOrgWebsiteErrorMessage(null);
    // setOrgSubscriptionErrorMessage(null)
    setisorganisationemailerror(null);
    var id = getUserLocal();
    var bodyFormData = new FormData();
    bodyFormData.append("email", useremail.toLowerCase());
    bodyFormData.append("org_email", orginsationemail.toLowerCase());
    bodyFormData.append("first_name", firstname);
    bodyFormData.append("last_name", lastname);
    bodyFormData.append("name", organisationname);
    bodyFormData.append("phone_number", contactnumber);
    bodyFormData.append("website", websitelink);
    bodyFormData.append(
      "address",
      JSON.stringify({
        address: organisationaddress,
        country: countryvalue,
        pincode: pincode,
      })
    );
    //bodyFormData.append("approval_status", istrusted)
    // bodyFormData.append("subscription", organisationlength);
    bodyFormData.append("role", 3);
    if (isLoggedInUserCoSteward()) {
      bodyFormData.append("on_boarded_by", id);
    }
    setIsLoader(true);
    HTTPService(
      "POST",
      UrlConstants.base_url + UrlConstants.participant,
      bodyFormData,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        setisSuccess(true);
        console.log(response);
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
              // case "subscription": setOrgSubscriptionErrorMessage(errorMessages[i]); break;
              default:
                history.push(GetErrorHandlingRoute(e));
                break;
            }
          }
        } else {
          history.push(GetErrorHandlingRoute(e));
        }
        //setisexisitinguseremail(true);
        //history.push(GetErrorHandlingRoute(e));
      });
  };

  const handleistrusted = (event) => {
    console.log(event.target.checked);
    setistrusted(event.target.checked);
  };
  return (
    <>
      {isLoader ? <Loader /> : ""}
      <Container style={useStyles.marginrowtop}>
        {isSuccess ? (
          <Success
            okevent={() => history.push("/datahub/participants")}
            route={"datahub/participants"}
            imagename={"success"}
            btntext={"ok"}
            heading={"Participant added successfully !"}
            imageText={"Added"}
            msg={"You added a participant."}
          ></Success>
        ) : (
          <>
            <ParticipantForm
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
              // setpincode={ref => { setpincode(ref); setispincodeerror(!validateInputField(ref,RegexConstants.PINCODE_REGEX)) }}
              setpincode={(ref) => {
                setpincode(ref);
              }}
              istrusted={istrusted}
              handleistrusted={handleistrusted}
              // ispincodeerror={ispincodeerror}
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
              // organisationlength={organisationlength}
              // setorganisationlength={(ref) => {
              //   setorganisationlength(ref);
              // }}
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
              // orgSubscriptionErrorMessage={orgSubscriptionErrorMessage}
            ></ParticipantForm>
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
                stringMinimumLengthCheck(pincode, 5) &&
                firstname &&
                useremail &&
                !isuseremailerror ? (
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
export default AddParticipants;

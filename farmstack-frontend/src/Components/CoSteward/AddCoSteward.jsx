import React, { useState, useEffect } from "react";
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
  mobileNumberMinimunLengthCheck,
  stringMinimumLengthCheck,
} from "../../Utils/Common";
import Loader from "../../Components/Loader/Loader";
import CoStewardForm from "../CoSteward/CoStewardForm";

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
export default function AddCoSteward(props) {
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

  const isValidURL = (string) => {
    var res = string.match(RegexConstants.NEW_WEBSITE_REGEX);
    return res !== null;
  };
  const isValidCapsUrl = (string) => {
    var res1 = string.match(RegexConstants.NEW_C_WEBSITE_REGEX);
    return res1 !== null;
  };
  const addNewCoSteward = () => {
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
    bodyFormData.append(
      "address",
      JSON.stringify({
        address: organisationaddress,
        country: countryvalue,
        pincode: pincode,
      })
    );
    bodyFormData.append("role", 6);
    setIsLoader(true);
    HTTPService(
      "POST",
      UrlConstants.base_url + UrlConstants.co_steward_add,
      bodyFormData,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        setisSuccess(true);
        console.log(response, "response of costeward added");
      })
      .catch((e) => {
        setIsLoader(false);
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
                history.push(GetErrorHandlingRoute(e));
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
            okevent={() => history.push("/datahub/participants")}
            route={"datahub/participants"}
            imagename={"success"}
            btntext={"ok"}
            heading={"Co-Steward added successfully !"}
            imageText={"Added"}
            msg={"You added a Co-Steward."}
          ></Success>
        ) : (
          <>
            <CoStewardForm
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
              first_heading={screenlabels.co_steward?.first_heading}
              second_heading={screenlabels.co_steward?.second_heading}
              third_heading={screenlabels.co_steward?.third_heading}
              firstNameErrorMessage={firstNameErrorMessage}
              lastNameErrorMessage={lastNameErrorMessage}
              emailErrorMessage={emailErrorMessage}
              phoneNumberErrorMessage={phoneNumberErrorMessage}
              orgNameErrorMessage={orgNameErrorMessage}
              orgEmailErrorMessage={orgEmailErrorMessage}
              orgWebsiteErrorMessage={orgWebsiteErrorMessage}
            ></CoStewardForm>
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
                  <Button
                    onClick={() => addNewCoSteward()}
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

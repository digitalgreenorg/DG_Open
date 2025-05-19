import React, { useState, useEffect } from "react";
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
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  mobileNumberMinimunLengthCheck,
  stringMinimumLengthCheck,
} from "../../Utils/Common";
const useStyles = {
  btncolor: {
    color: "white",
    "border-color": THEME_COLORS.THEME_COLOR,
    "background-color": THEME_COLORS.THEME_COLOR,
    float: "right",
    "border-radius": 0,
  },
  marginrowtop: { "margin-top": "20px" },
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
  marginrowtop8px: { "margin-top": "8px" },
};
function EditParticipants(props) {
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
  const [idorg, setidorg] = useState("");
  // const [organisationlength, setorganisationlength] = useState(3);
  const [isorganisationemailerror, setisorganisationemailerror] =
    useState(false);
  const [iscontactnumbererror, setiscontactnumbererror] = useState(false);
  const [iswebsitelinkrerror, setwebsitelinkerror] = useState(false);
  const [isuseremailerror, setisuseremailerror] = useState(false);
  const [isexisitinguseremail, setisexisitinguseremail] = useState(false);
  const [isSuccess, setisSuccess] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [istrusted, setistrusted] = React.useState(false);

  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState(null);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState(null);
  const [orgNameErrorMessage, setOrgNameErrorMessage] = useState(null);
  const [orgEmailErrorMessage, setOrgEmailErrorMessage] = useState(null);
  const [orgWebsiteErrorMessage, setOrgWebsiteErrorMessage] = useState(null);
  // const[orgSubscriptionErrorMessage, setOrgSubscriptionErrorMessage] = useState(null)

  const history = useHistory();
  const { id } = useParams();
  useEffect(() => {}, []);
  const isValidURL = (string) => {
    var res = string.match(
      "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"
    );
    return res !== null;
  };
  useEffect(() => {
    setIsLoader(true);
    HTTPService(
      "GET",
      UrlConstants.base_url + UrlConstants.participant + id + "/",
      "",
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("otp valid", response.data);
        // let addressdata=JSON.parse(response.data.organization.address)
        setorganisationname(response.data.organization.name);
        setorganisationaddress(
          response.data.organization.address.address ||
            JSON.parse(response?.data?.organization?.address)?.address
        );
        setorginsationemail(response.data.organization.org_email);
        setcountryvalue(
          response.data.organization.address.country ||
            JSON.parse(response?.data?.organization?.address)?.country
        );
        setcontactnumber(response.data.user.phone_number);
        setwebsitelink(response.data.organization.website);
        setpincode(
          response.data.organization.address.pincode ||
            JSON.parse(response?.data?.organization?.address)?.pincode
        );
        setfirstname(response.data.user.first_name);
        setlastname(response.data.user.last_name);
        setuseremail(response.data.user.email);
        // setorganisationlength(response.data.user.subscription)
        setidorg(response.data.organization_id);
        setistrusted(response.data.user.approval_status);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  }, []);

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
    // bodyFormData.append('subscription', organisationlength);
    {
      props.coSteward
        ? bodyFormData.append("role", 6)
        : bodyFormData.append("role", 3);
    }
    bodyFormData.append("id", idorg);
    bodyFormData.append("approval_status", istrusted);
    setIsLoader(true);
    HTTPService(
      "PUT",
      UrlConstants.base_url + UrlConstants.participant + id + "/",
      bodyFormData,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        setisSuccess(true);
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
              // case "subscription": setOrgSubscriptionErrorMessage(errorMessages[i]); break;
              default:
                history.push(GetErrorHandlingRoute(e));
                break;
            }
          }
        } else {
          history.push(GetErrorHandlingRoute(e));
        } //history.push(GetErrorHandlingRoute(e));
      });
  };
  const handleistrusted = (event) => {
    setistrusted(event.target.checked);
  };

  return (
    <>
      {isLoader ? <Loader /> : ""}
      <Container style={useStyles.marginrowtop}>
        {isSuccess ? (
          <Success
            okevent={() =>
              history.push(
                "/datahub/participants" +
                  `?costeward=${props.coSteward == true}`
              )
            }
            route={"datahub/participants"}
            imagename={"success"}
            btntext={"ok"}
            heading={"Changes are updated!"}
            imageText={"Updated"}
            msg={"Your changes are updated successfully."}
          ></Success>
        ) : (
          <>
            <ParticipantForm
              organisationname={organisationname}
              setorganisationname={(ref) => {
                setorganisationname(ref);
              }}
              orginsationemail={orginsationemail}
              handleistrusted={handleistrusted}
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
                setwebsitelinkerror(!isValidURL(ref));
              }}
              iswebsitelinkrerror={iswebsitelinkrerror}
              organisationaddress={organisationaddress}
              istrusted={istrusted}
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
              // organisationlength={organisationlength}
              // setorganisationlength={ref => { setorganisationlength(ref) }}
              first_heading={
                props.coSteward
                  ? screenlabels.editcosteward.first_heading
                  : screenlabels.editparticipants.first_heading
              }
              second_heading={
                props.coSteward
                  ? screenlabels.editcosteward.second_heading
                  : screenlabels.editparticipants.second_heading
              }
              // third_heading={screenlabels.editparticipants.third_heading}
              fourth_heading={screenlabels.editparticipants.fourth_heading}
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
export default EditParticipants;

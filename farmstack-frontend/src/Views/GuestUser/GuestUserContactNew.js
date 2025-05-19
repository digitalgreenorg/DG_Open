import React, { useState, useContext, useEffect } from "react";
import LocalStyle from "./GuestUserContactNew.module.css";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import { Row, Col, Button } from "react-bootstrap";
import {
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { FarmStackContext } from "../../Components/Contexts/FarmStackContext";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  goToTop,
} from "../../Utils/Common";
import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import { useHistory } from "react-router-dom";
import { isPhoneValid } from "../../Components/NewOnboarding/utils";
import MuiPhoneNumber from "material-ui-phone-number";

const GuestUserContactNew = () => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  let history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [describeQuery, setDescribeQuery] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [subjectErrorMessage, setSubjectErrorMessage] = useState("");
  const [describeQueryErrorMessage, setDescribeQueryErrorMessage] =
    useState("");
  const [contactNumberErrorMessage, setContactNumberErrorMessage] =
    useState("");
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    email: "",
    contactNumber: "",
    organizationName: "",
    address: "",
    postalCode: "",
    country: "",
    organizationWebsite: "",
    organizationEmail: "",
  });

  const handleRadioButton = (e) => {
    // console.log("handleRadioButton value", e.target.value);
    setSubject(e.target.value);
  };
  const handleContactNumber = (e, countryData) => {
    if (!isPhoneValid(e, countryData)) {
      setContactNumberErrorMessage("Invalid phone number");
    } else {
      setContactNumberErrorMessage("");
    }
    if (e.startsWith(`+${countryData?.dialCode}`)) {
      console.log("e", e, countryData?.dialCode);
      let index = `+${countryData?.dialCode}`.length;
      if (!e.includes(" ", index)) {
        e = e.substr(0, index) + " " + e.substr(index);
        console.log(e, "e");
        setContactNumber(e);
      } else {
        setContactNumber(e);
      }
    }

    setContactNumber(e);
  };

  const getDatahubAdminDetails = () => {
    callLoader(true);

    HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.guest_organization_details,
      "",
      false,
      false
    )
      .then((response) => {
        console.log("response", response);
        callLoader(false);
        const admin = response.data.user;
        const organization = response.data.organization;
        const message = response.data.message;
        setAdminDetails({
          name: admin?.first_name + " " + admin?.last_name,
          email: admin?.email,
          contactNumber: admin?.phone_number,
          organizationName: organization?.name,
          address: organization?.address?.address,
          postalCode: organization?.address?.pincode,
          country: organization?.address?.country,
          organizationWebsite: organization?.website,
          organizationEmail: organization?.org_email,
        });
        // const adminErrorMessage = (e) => {
        //   history.push(adminNotFoundRoute(e));
        // };
        // setDatahubUserDetails(
        //   admin == null
        //     ? setAdminNotFound(adminErrorMessage)
        //     : {
        //         admin_name: admin?.first_name,
        //         org_name: organization?.name,
        //         address: `${organization?.address?.address}, ${organization?.address?.city}`,
        //         phone_number: organization?.phone_number,
        //         admin_email: admin?.email,
        //         country: organization?.address?.country,
        //         city: organization?.address?.city,
        //         website: organization?.website,
        //         admin_phone: admin?.phone_number,
        //         admin_pin_code: organization?.address?.pincode,
        //         email_id: organization?.org_email,
        //       }
        // setIsSuccess(true);
        // );
      })
      .catch(async (e) => {
        callLoader(false);
        console.log(e);
        let response = await GetErrorHandlingRoute(e);
        if (response.toast) {
          //callToast(message, type, action)
          callToast(
            response?.message ?? response?.data?.detail ?? "Unknown",
            response.status == 200 ? "success" : "error",
            response.toast
          );
        } else {
          history.push(response?.path);
        }
      });
  };

  const clearErrorMessages = () => {
    setFirstNameErrorMessage("");
    setLastNameErrorMessage("");
    setEmailErrorMessage("");
    setSubjectErrorMessage("");
    setDescribeQueryErrorMessage("");
    setContactNumberErrorMessage("");
  };

  const handleCancelButtonClick = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setSubject("null");
    setDescribeQuery("");
    setContactNumber("");
    clearErrorMessages();
    history.push("/home");
  };

  const addNewGuestUserData = () => {
    callLoader(true);

    const useDetails = {
      firstName,
      lastName,
      email,
      contactNumber,
      queryDescription: describeQuery,
    };

    const bodyFormData = new FormData();
    bodyFormData.append("first_name", useDetails.firstName);
    bodyFormData.append("last_name", useDetails.lastName);
    bodyFormData.append("email", useDetails.email);
    bodyFormData.append("subject", subject);
    bodyFormData.append("describe_query", useDetails.queryDescription);
    bodyFormData.append("contact_number", useDetails.contactNumber);

    HTTPService(
      "POST",
      UrlConstant.base_url + UrlConstant.microsite_contact_form,
      bodyFormData,
      true,
      false
    )
      .then((response) => {
        callLoader(false);
        if (response.status == 200) {
          console.log("responce", response);
          callToast(
            "Your message has been sent successfully.",
            "success",
            true
          );
          handleCancelButtonClick();
        }
      })
      .catch(async (e) => {
        callLoader(false);
        console.log(e);
        const returnValues = GetErrorKey(e, bodyFormData.keys());
        const errorKeys = returnValues[0];
        const errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (let i = 0; i < errorKeys.length; i++) {
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
              case "subject":
                setSubjectErrorMessage(errorMessages[i]);
                break;
              case "describe_query":
                setDescribeQueryErrorMessage(errorMessages[i]);
                break;
              case "contact_number":
                setContactNumberErrorMessage(errorMessages[i]);
                break;
              default:
                let response = await GetErrorHandlingRoute(e);
                if (response.toast) {
                  //callToast(message, type, action)
                  callToast(
                    response?.message ?? response?.data?.detail ?? "Unknown",
                    response.status == 200 ? "success" : "error",
                    response.toast
                  );
                }
                break;
            }
          }
        } else {
          let response = await GetErrorHandlingRoute(e);
          console.log("responce in err", response);
          if (response.toast) {
            //callToast(message, type, action)
            callToast(
              response?.message ?? response?.data?.detail ?? "Unknown",
              response.status == 200 ? "success" : "error",
              response.toast
            );
          }
          if (response.path) {
            history.push(response.path);
          }
        }
      });
  };
  useEffect(() => {
    getDatahubAdminDetails();
    goToTop(0);
  }, []);
  const containerStyle = {
    marginLeft: mobile || tablet ? "30px" : "144px",
    marginRight: mobile || tablet ? "30px" : "144px",
  };
  return (
    <Box sx={containerStyle}>
      <Row className={LocalStyle.titleContainer}>
        <div className={LocalStyle.title}>Talk with us</div>
        <div className="d-flex justify-content-center">
          <div
            className={
              mobile ? LocalStyle.descriptionSm : LocalStyle.description
            }
          >
            We are eager to connect with organizations, researchers, and
            individuals who share our passion for revolutionizing agriculture.
            If you have questions, suggestions or would like to explore
            collaboration opportunities, please don't hesitate to get in touch
            with us.
          </div>
        </div>
      </Row>
      <Row className={LocalStyle.title2}>
        {/* <Typography className={`${GlobalStyle.size24} ${GlobalStyle.bold600}`}>
          Say hello..
        </Typography> */}
      </Row>
      <Row>
        <Col lg={6} md={12}>
          <TextField
            id="firstName"
            label="First Name"
            placeholder="Enter your first name"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value.trim())}
            error={firstNameErrorMessage}
            helperText={firstNameErrorMessage ?? ""}
          />
        </Col>
        <Col lg={6} md={12}>
          <TextField
            id="lastName"
            label="Last Name"
            placeholder="Enter your last name"
            variant="outlined"
            margin="normal"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value.trim())}
            error={lastNameErrorMessage}
            helperText={lastNameErrorMessage ?? ""}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={12}>
          <TextField
            id="mail"
            label="Mail ID"
            placeholder="Enter your email address"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.trim());
            }}
            error={emailErrorMessage}
            helperText={emailErrorMessage ?? ""}
          />
        </Col>
        <Col lg={6} md={12}>
          <MuiPhoneNumber
            fullWidth
            required
            defaultCountry={"in"}
            margin="normal"
            countryCodeEditable={false}
            placeholder="Contact Number"
            label="Contact Number"
            variant="outlined"
            name="contact_number"
            value={contactNumber}
            onChange={(e, countryData) => handleContactNumber(e, countryData)}
            error={contactNumberErrorMessage}
            helperText={contactNumberErrorMessage ?? ""}
            id="contactNumber"
          />
        </Col>
      </Row>
      <Row>
        <Col
          className={
            mobile
              ? LocalStyle.radioButtonContainerSm
              : LocalStyle.radioButtonContainer
          }
        >
          {/* <FormControl component="fieldset" margin="normal" required> */}
          {/* <FormLabel component="legend">Select an option</FormLabel> */}
          {/* <RadioGroup aria-label="contactType" name="contactType"> */}
          {/* <div> */}
          <RadioGroup
            name="subject"
            onChange={(e) => handleRadioButton(e)}
            row
            value={subject}
            aria-labelledby="demo-row-radio-buttons-group-label"
            defaultValue="null"
            // name="row-radio-buttons-group"
            style={{
              //   border: "1px solid green",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <FormControlLabel
              value="Become a Participant"
              control={<Radio />}
              label={
                <span style={{ fontSize: mobile ? "12px" : "16px" }}>
                  Become a Participant (Data Provider / Consumer)
                </span>
              }
            />
            <FormControlLabel
              value="Other queries"
              control={<Radio />}
              label={
                <span style={{ fontSize: mobile ? "12px" : "16px" }}>
                  Other queries (Describe your query in detail)
                </span>
              }
            />
          </RadioGroup>
          {/* </div> */}
          {/* </RadioGroup>
          </FormControl> */}
        </Col>
      </Row>
      <Row>
        <Col>
          <TextField
            value={describeQuery}
            id="description"
            label="Describe your query"
            placeholder="Describe your query"
            multiline
            rows={4}
            variant="outlined"
            margin="normal"
            // required
            fullWidth
            onChange={(e) => setDescribeQuery(e.target.value.trimStart())}
            error={describeQueryErrorMessage}
            helperText={describeQueryErrorMessage ?? ""}
            required
          />
        </Col>
      </Row>
      <Row className={LocalStyle.backButtonContainer}>
        <Button
          data-testId="submit-button-test"
          id={"details-page-load-more-dataset-button"}
          variant="outlined"
          className={`${GlobalStyle.primary_button} ${LocalStyle.primary_button}`}
          onClick={() => addNewGuestUserData()}
          disabled={
            !firstName || !email || !contactNumber || !subject || !describeQuery
          }
        >
          Submit
        </Button>
        <Button
          data-testId="cancel-button-test"
          id={"details-page-load-more-dataset-button"}
          variant="outlined"
          className={`${GlobalStyle.outlined_button} ${LocalStyle.backButton}`}
          onClick={() => handleCancelButtonClick()}
        >
          Cancel
        </Button>
      </Row>
      <Row className={LocalStyle.title2}>
        <Typography className={`${GlobalStyle.size24} ${GlobalStyle.bold600}`}>
          Contact with us!
        </Typography>
      </Row>
      <Row className={LocalStyle.adminDetailsContainer}>
        <Col lg={10}>
          <Row className={LocalStyle.textRow}>
            <Col className={LocalStyle.adminDetailsCol}>
              <Typography className={GlobalStyle.bold400}>
                Datahub admin name
              </Typography>
              <Typography className={GlobalStyle.bold600}>
                {adminDetails.name}
              </Typography>
            </Col>
            <Col className={LocalStyle.adminDetailsCol}>
              <Typography className={GlobalStyle.bold400}>
                Datahub admin email
              </Typography>
              <Typography className={GlobalStyle.bold600}>
                {adminDetails.email}
              </Typography>
            </Col>
          </Row>
          <Row className={LocalStyle.textRow}>
            <Col className={LocalStyle.adminDetailsCol}>
              <Typography className={GlobalStyle.bold400}>
                Contact Number
              </Typography>
              <Typography className={GlobalStyle.bold600}>
                {adminDetails.contactNumber}
              </Typography>
            </Col>
            <Col className={LocalStyle.adminDetailsCol}>
              <Typography className={GlobalStyle.bold400}>
                Organisation name
              </Typography>
              <Typography className={GlobalStyle.bold600}>
                {adminDetails.organizationName}
              </Typography>
            </Col>
          </Row>
          <Row className={LocalStyle.textRow}>
            <Col className={LocalStyle.adminDetailsCol}>
              <Typography className={GlobalStyle.bold400}>Address</Typography>
              <Typography className={GlobalStyle.bold600}>
                {adminDetails.address}
              </Typography>
            </Col>
          </Row>
          <Row className={LocalStyle.textRow}>
            <Col className={LocalStyle.adminDetailsCol}>
              <Typography className={GlobalStyle.bold400}>
                Postal Code
              </Typography>
              <Typography className={GlobalStyle.bold600}>
                {adminDetails.postalCode}
              </Typography>
            </Col>
            <Col className={LocalStyle.adminDetailsCol}>
              <Typography className={GlobalStyle.bold400}>Country</Typography>
              <Typography className={GlobalStyle.bold600}>
                {adminDetails.country}
              </Typography>
            </Col>
          </Row>
          <Row className={LocalStyle.textRow}>
            <Col className={LocalStyle.adminDetailsCol}>
              <Typography className={GlobalStyle.bold400}>Email</Typography>
              <Typography className={GlobalStyle.bold600}>
                {adminDetails.organizationEmail}
              </Typography>
            </Col>
            <Col className={LocalStyle.adminDetailsCol}>
              <Typography className={GlobalStyle.bold400}>
                Organization Website
              </Typography>
              <Typography className={GlobalStyle.bold600}>
                {adminDetails.organizationWebsite}
              </Typography>
            </Col>
          </Row>
        </Col>
      </Row>
    </Box>
  );
};

export default GuestUserContactNew;

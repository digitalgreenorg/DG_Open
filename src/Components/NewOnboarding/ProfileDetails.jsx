import React, { useContext, useEffect, useState } from "react";
import styles from "./onboarding.module.css";
import { Col, Row } from "react-bootstrap";
import { Button, TextField, Typography } from "@mui/material";
import global_style from "../../Assets/CSS/global.module.css";
import UrlConstant from "../../Constants/UrlConstants";
import MuiPhoneNumber from "material-ui-phone-number";
import HTTPService from "../../Services/HTTPService";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  getTokenLocal,
  getUserLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import { useHistory } from "react-router-dom";
import { isPhoneValid } from "./utils";
import GlobalStyle from "../../Assets/CSS/global.module.css";

const ProfileDetails = (props) => {
  const { callLoader, callToast } = useContext(FarmStackContext);

  const { setActiveStep } = props;
  const history = useHistory();
  const [profileDetails, setProfileDetails] = useState({
    first_name: "",
    last_name: "",
    email_id: localStorage.getItem("email")
      ? localStorage.getItem("email")
      : "",
    contact_number: "",
  });
  const [profileDetailsError, setProfileDetailsError] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    contact_number: "",
  });
  const [dialCode, setDialCode] = useState("");
  const handleChangeProfileDetails = (e, countryData) => {
    console.log("inside change");
    if (e.target) {
      setProfileDetails({
        ...profileDetails,
        [e.target.name]: e.target.value.trimStart(),
      });
    } else {
      if (!isPhoneValid(e, countryData)) {
        setProfileDetailsError((prevState) => ({
          ...prevState,
          contact_number: "Invalid phone number",
        }));
      } else {
        setProfileDetailsError((prevState) => ({
          ...prevState,
          contact_number: "",
        }));
      }
      //setProfileDetails({ ...profileDetails, contact_number: e ? e : "" });
      console.log(e, "e here1", countryData?.dialCode);
      if (e.startsWith(`+${countryData?.dialCode}`)) {
        let index = `+${countryData?.dialCode}`.length;
        if (!e.includes(" ", index)) {
          e = e.substr(0, index) + " " + e.substr(index);
          console.log(e, "e");
          setProfileDetails({ ...profileDetails, contact_number: e });
        } else {
          setProfileDetails({ ...profileDetails, contact_number: e });
        }
      }
    }
  };

  const handleSubmitProfileData = (e) => {
    console.log("inside submit call");
    e.preventDefault();
    let method = "PUT";

    let url = UrlConstant.base_url + UrlConstant.profile + getUserLocal() + "/";
    console.log("kanhaiya", url);
    var bodyFormData = new FormData();
    bodyFormData.append("email", profileDetails.email_id);
    bodyFormData.append("first_name", profileDetails.first_name);
    bodyFormData.append("last_name", profileDetails.last_name);
    bodyFormData.append("phone_number", profileDetails.contact_number);
    callLoader(true);
    HTTPService(method, url, bodyFormData, true, true, false, false)
      .then((res) => {
        callLoader(false);

        if (!props.isAccountSetting) {
          // if (isLoggedInUserParticipant() || isLoggedInUserCoSteward()) {
          //   setOnBoardedTrue();
          // } else {
          setActiveStep((prev) => prev + 1);
          // }
        }
        if (res.status === 201) {
          if (props.isAccountSetting)
            callToast(
              "Account settings updated successfully!",
              "success",
              true
            );
          else {
            callToast("Profile details added successfully!", "success", true);
          }
        }
        setProfileDetailsError({
          first_name: "",
          last_name: "",
          email_id: "",
          contact_number: "",
        });
      })
      .catch(async (e) => {
        callLoader(false);
        var returnValues = GetErrorKey(e, bodyFormData.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "first_name":
                setProfileDetailsError({
                  ...profileDetailsError,
                  first_name: errorMessages[i],
                });
                break;
              case "last_name":
                setProfileDetailsError({
                  ...profileDetailsError,
                  last_name: errorMessages[i],
                });
                break;
              case "email":
                setProfileDetailsError({
                  ...profileDetailsError,
                  email_id: errorMessages[i],
                });
                break;
              case "phone_number":
                setProfileDetailsError({
                  ...profileDetailsError,
                  contact_number: errorMessages[i],
                });
                break;
              default:
                let error = await GetErrorHandlingRoute(e);
                if (error) {
                  callToast(
                    error?.message,
                    error?.status === 200 ? "success" : "error",
                    true
                  );
                }
                break;
            }
          }
        } else {
          // let error = await GetErrorHandlingRoute(e);
          // if (error) {
          //   callToast(error?.message ?? "Unknown",
          //   error?.status === 200 ? "success" : "error",
          //   true);
          // }
          let error = await GetErrorHandlingRoute(e);
          console.log("Error obj", error);
          console.log(e);
          if (error.toast) {
            callToast(
              error?.message,
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
  const getProfileData = () => {
    callLoader(true);
    let method = "GET";
    let url = UrlConstant.base_url + UrlConstant.profile + getUserLocal() + "/";
    HTTPService(method, url, "", false, true, false, false)
      .then((res) => {
        setProfileDetails({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          email_id: res.data.email,
          contact_number: res.data.phone_number,
        });
        callLoader(false);
      })
      .catch(async (e) => {
        callLoader(false);
        let response = await GetErrorHandlingRoute(e);
        if (response.toast) {
          //callToast(message, type, action)

          callToast(
            response?.message,
            response?.status == 200 ? "success" : "error",
            response?.toast
          );
        } else {
          history.push(response?.path);
        }
      });
  };
  useEffect(() => {
    if (getUserLocal()) {
      getProfileData();
    }
  }, []);
  return (
    <>
      <div className={styles.main_box}>
        <div className={styles.main_label}>
          <p>
            {props.isAccountSetting ? "Account settings" : "Profile Details"}
          </p>
          <Typography
            className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
          >
            {props.isAccountSetting
              ? "Customize and manage your account settings to ensure a personalized and seamless experience."
              : ""}
          </Typography>
        </div>

        {props.isAccountSetting ? (
          ""
        ) : (
          <div className={styles.sub_label}>
            Enter your profile details, we will show to others!
          </div>
        )}

        <div className={styles.all_inputs}>
          <Row>
            <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
              <TextField
                name="first_name"
                fullWidth
                required
                placeholder="First Name"
                id="profile_details_first_name"
                label="First Name"
                variant="outlined"
                value={profileDetails.first_name}
                onChange={(e) => handleChangeProfileDetails(e)}
                error={profileDetailsError.first_name ? true : false}
                helperText={profileDetailsError.first_name}
              />
            </Col>
            <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
              <TextField
                fullWidth
                placeholder="Last Name"
                id="profile_details_last_name"
                label="Last Name"
                variant="outlined"
                name="last_name"
                value={profileDetails.last_name}
                onChange={(e) => handleChangeProfileDetails(e)}
                error={profileDetailsError.last_name ? true : false}
                helperText={profileDetailsError.last_name}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
              <TextField
                name="email_id"
                disabled
                fullWidth
                required
                placeholder="Enter mail id"
                id="profile_details_email"
                label="Enter mail id"
                variant="outlined"
                value={profileDetails.email_id}
                onChange={(e) => handleChangeProfileDetails(e)}
                error={profileDetailsError.email_id ? true : false}
                helperText={profileDetailsError.email_id}
              />
            </Col>
            <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
              <MuiPhoneNumber
                fullWidth
                required
                defaultCountry={"in"}
                countryCodeEditable={false}
                name="contact_number"
                placeholder="Contact Number"
                id="profile_details_contact_number"
                label="Contact Number"
                variant="outlined"
                value={profileDetails.contact_number}
                onChange={(value, countryData) =>
                  handleChangeProfileDetails(value, countryData)
                }
                error={profileDetailsError.contact_number ? true : false}
                helperText={profileDetailsError.contact_number}
              />
            </Col>
          </Row>
        </div>
        {props.isAccountSetting ? (
          <Row>
            <Col style={{ textAlign: "right", margin: "20px" }}>
              <Button
                id="cancelbutton_account"
                variant="outlined"
                style={{ margin: "20px" }}
                className={global_style.secondary_button}
                onClick={() =>
                  isLoggedInUserParticipant()
                    ? history.push("/participant/new_datasets")
                    : history.push("/datahub/new_datasets")
                }
              >
                Cancel
              </Button>
              {console.log(
                !profileDetailsError.contact_number,
                profileDetails.contact_number,
                profileDetails.email_id,
                profileDetails.first_name
              )}
              <Button
                disabled={
                  !profileDetailsError.contact_number &&
                  profileDetails.contact_number &&
                  profileDetails.email_id &&
                  profileDetails.first_name
                    ? false
                    : true
                }
                id="submitbutton_account"
                variant="outlined"
                className={
                  global_style.primary_button + " " + styles.next_button
                }
                onClick={(e) => handleSubmitProfileData(e)}
              >
                Submit
              </Button>
            </Col>
          </Row>
        ) : (
          <div className={styles.button_grp}>
            <Button
              onClick={() => setActiveStep((prev) => prev + 1)}
              className={global_style.secondary_button}
              id="finish-later-button"
              style={{ paddingRight: "25px" }}
            >
              {" "}
              Finish later
            </Button>
            <Button
              disabled={
                !profileDetailsError.contact_number &&
                profileDetails.contact_number &&
                profileDetails.email_id &&
                profileDetails.first_name
                  ? false
                  : true
              }
              onClick={(e) => handleSubmitProfileData(e)}
              className={global_style.primary_button + " " + styles.next_button}
              id="nextbutton_account_onboard"
            >
              {" "}
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileDetails;

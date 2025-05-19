import React, { useContext, useEffect, useState } from "react";
import styles from "./onboarding.module.css";
import {
  Button,
  Checkbox,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
// import { CheckBox } from "@mui/icons-material";
import global_style from "../../Assets/CSS/global.module.css";
import UrlConstant from "../../Constants/UrlConstants";
// import { logIn } from "./utils";
import HTTPService from "../../Services/HTTPService";

import validator from "validator";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  getRoleLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
  setOrgId,
  setRefreshTokenLocal,
  setRoleLocal,
  setTokenLocal,
  setUserId,
  setUserMapId,
} from "../../Utils/Common";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useHistory } from "react-router-dom";
import { FarmStackContext } from "../Contexts/FarmStackContext";

const VerifyEmailStep = (props) => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [agreementChecked, setAgreementChecked] = useState(
    localStorage.getItem("dev_mode") ? true : false
  );
  const { setActiveStep } = props;
  const [loginError, setLoginError] = useState("");
  const [emailId, setEmailId] = useState("");
  const [otp, setOtp] = useState("");
  const [isValidEmailSent, setIsValidEmailSent] = useState(false);
  const [gotOtp, setGotOtp] = useState(false);
  const [key, setKey] = useState(0);

  const [resend, showResend] = useState(false);
  const [timer, showTimer] = useState(false);
  const [agreement, showAgreement] = useState(true);

  const history = useHistory();

  const handleSubmit = async (action) => {
    console.log("handleSubmit", action);
    setLoginError("");
    let data;
    let url;
    let method;
    if (action == "email") {
      url = UrlConstant.base_url + UrlConstant.login;
      data = {
        email: emailId,
      };
      method = "POST";
    } else if (action == "otp") {
      url = UrlConstant.base_url + UrlConstant.otp;
      data = {
        email: emailId?.toLowerCase(),
        otp,
      };
      method = "POST";
    }
    callLoader(true);
    console.log("🚀 ~ file: VerifyEmail.jsx:71 ~ handleSubmit ~ data:", data);

    HTTPService(method, url, data, false, false, false, false)
      .then((response) => {
        console.log(
          "🚀 ~ file: VerifyEmail.jsx:80 ~ .then ~ response:",
          isEmailValid,
          !isValidEmailSent,
          agreementChecked,
          response
        );
        if (action == "email") {
          callLoader(false);
          console.log(response);
          setLoginError("");
          handleStates("timer");
          setGotOtp(
            response?.data?.message ? response?.data?.message : "Enter Otp"
          );
          // setTimer(10);
          setIsValidEmailSent(true);
        } else if (action == "otp") {
          callLoader(false);
          console.log(action, response);
          if (response.status === 201) {
            localStorage.setItem("email", response?.data?.email);
            localStorage.setItem("resource_country", response?.data?.country);
            setRefreshTokenLocal(response?.data?.refresh);
            setTokenLocal(response?.data?.access);
            setRoleLocal(response?.data?.role);
            setUserMapId(response?.data?.user_map);
            setOrgId(response?.data?.org_id);
            setUserId(response?.data?.user);
            console.log(getRoleLocal());
            if (response?.data?.on_boarded) {
              if (isLoggedInUserAdmin()) {
                history.push("/datahub/new_datasets");
              } else if (isLoggedInUserParticipant()) {
                history.push("/participant/new_datasets");
              } else if (isLoggedInUserCoSteward()) {
                history.push("/datahub/new_datasets");
              }
            } else {
              setActiveStep((prev) => prev + 1);
              return;
            }
          } else {
            setLoginError("Some error occurred");
            return;
          }
          setActiveStep((prev) => prev + 1);
        }
      })
      .catch(async (e) => {
        console.log("e.response.status", key, e.response?.status, e);
        callLoader(false);
        if (
          e.response != null &&
          e.response != undefined &&
          e.response.status === 401
        ) {
          setLoginError(
            e.response.data && e.response.data.message
              ? e.response.data.message
              : "User not registered"
          );
        } else if (
          e.response != null &&
          e.response != undefined &&
          e.response.status === 403
        ) {
          setLoginError(
            e.response.data && e.response.data.message
              ? e.response.data.message
              : "User suspended. Please try after sometime."
          );
        } else if (
          e.response != null &&
          e.response != undefined &&
          e.response.status === 400
        ) {
          console.log(
            "🚀 ~ file: VerifyEmail.jsx:158 ~ handleSubmit ~ data:",
            key,
            e.response.status,
            e
          );
          var returnValues = GetErrorKey(
            e,
            action == "email" ? ["email"] : ["otp"]
          );
          var errorKeys = returnValues[0];
          var errorMessages = returnValues[1];
          if (errorKeys.length > 0) {
            for (var i = 0; i < errorKeys.length; i++) {
              switch (errorKeys[i]) {
                case "email":
                  setLoginError(errorMessages[i]);
                  break;
                case "otp":
                  setLoginError(errorMessages[i]);
                  break;
                default:
                  break;
              }
            }
          } else {
            let error = await GetErrorHandlingRoute(e);
            if (error) {
              callToast(error?.message, "error", true);
            }
          }
        } else {
          let error = await GetErrorHandlingRoute(e);
          if (error) {
            callToast(error?.message, "error", true);
          }
        }
      });
  };

  const handleStates = (key) => {
    if (key == "timer") {
      showResend(false);
      showAgreement(false);
      showTimer(true);
    } else if (key == "resend") {
      showAgreement(false);
      showTimer(false);
      showResend(true);
    }
  };

  const hanleResendOTp = async (e) => {
    console.log("hanleResendOTp");
    e.preventDefault();
    let url = UrlConstant.base_url + UrlConstant.resend_otp;
    callLoader(true);
    HTTPService(
      "POST",
      url,
      {
        email: emailId?.toLowerCase(),
      },
      false,
      false
    )
      .then((response) => {
        console.log(
          "🚀 ~ file: VerifyEmail.jsx:228 ~ .then ~ response:",
          response
        );
        callLoader(false);
        console.log(response);
        handleStates("timer");
        setKey((prevKey) => prevKey + 1);
      })
      .catch(async (e) => {
        callLoader(false);
        if (
          e.response != null &&
          e.response != undefined &&
          e.response.status === 401
        ) {
          setLoginError(
            e.response.data && e.response.data.message
              ? e.response.data.message
              : "User not registered"
          );
        } else if (
          e.response != null &&
          e.response != undefined &&
          e.response.status === 403
        ) {
          setLoginError(
            e.response.data && e.response.data.message
              ? e.response.data.message
              : "User suspended. Please try after sometime."
          );
        } else {
          let error = await GetErrorHandlingRoute(e);
          if (error?.path) {
            history.push(error.path);
          }
          if (error.toast) {
            callToast(error?.message ?? "Unknown error", "error", true);
          }
        }
      });
  };
  console.log("loginError", loginError);

  const children = ({ remainingTime }) => {
    return (
      <div
        style={{ color: "#00A94F", width: "564px", marginLeft: "auto" }}
        role="timer"
        aria-live="assertive"
      >
        {remainingTime}
      </div>
    );
  };
  const isEmailValid = validator.isEmail(emailId);
  // console.log(
  //   "🚀 ~ file: VerifyEmail.jsx:273 ~ .then ~ response:",
  //   isEmailValid,
  //   !isValidEmailSent,
  //   agreementChecked
  // );
  console.log(isEmailValid);
  useEffect(() => {}, []);
  return (
    <div style={{ margin: mobile ? "30px" : "", minHeight: "400px" }}>
      <div className={styles.email_id_label}>
        {" "}
        {isValidEmailSent ? "Enter the OTP" : "Enter your email Id"}
      </div>

      <div className={styles.email_id_sub_label}>
        {isValidEmailSent
          ? "we sent you the otp, please check your email."
          : "We will send you otp to verify your email id."}
      </div>
      <div className={styles.inputs}>
        <TextField
          fullWidth
          placeholder={isValidEmailSent ? "Enter 6 digit OTP" : "Enter mail id"}
          id="email_id_for_login"
          data-testid="email_id_for_login_test"
          label={isValidEmailSent ? "Enter 6 digit OTP" : "Enter mail id"}
          variant="outlined"
          value={isValidEmailSent ? otp : emailId}
          onChange={(e) =>
            !isValidEmailSent
              ? setEmailId(e.target.value.toLowerCase())
              : setOtp(
                  e.target.value.length <= 6 && !isNaN(e.target.value)
                    ? e.target.value
                    : otp // If the input is not a valid 6-digit number, keep the current value
                )
          }
          required
          onKeyDown={(e) => {
            console.log(e.key);
            if (e.key == " ") {
              e.preventDefault();
            } else if (e.key == "Enter") {
              if (!isValidEmailSent && emailId && agreementChecked) {
                handleSubmit("email");
              } else if (isValidEmailSent && otp) {
                handleSubmit("otp");
              }
            }
          }}
          error={loginError ? true : false}
          helperText={loginError}
        />
      </div>
      {agreement && (
        <div className={styles.agreement}>
          <Checkbox
            id="login-agree-terms-and-condition-check-box"
            data-testid="login-agree-terms-and-condition-check-box-test"
            checked={agreementChecked}
            onClick={(e) => setAgreementChecked(e.target.checked)}
            className={styles.checkbox}
          />{" "}
          <span className={styles.agreement_line}>
            {" "}
            Agree to the following{" "}
            <span
              className={styles.termsAndConditionClass}
              onClick={() => history.push("/home/legal")}
            >
              terms and privacy policy.
            </span>{" "}
          </span>
        </div>
      )}
      {timer && isValidEmailSent && (
        <div
          style={{
            maxWidth: "564px",
            margin: "auto",
            display: "flex",
            justifyContent: "right",
          }}
        >
          <CountdownCircleTimer
            data-testid="timer-circle-test"
            id={"countdown"}
            key={key}
            size={40}
            isPlaying
            duration={props.timer ?? 120}
            strokeWidth={6}
            colors={["#00A94F", "#A30000"]}
            colorsTime={props.timer ? [props.timer, 0] : [120, 0]}
            children={children}
            onComplete={() => {
              handleStates("resend");
            }}
          ></CountdownCircleTimer>
        </div>
      )}
      {isValidEmailSent && resend && (
        <div className={styles.resend_otp_button + " " + global_style.font700}>
          <Button
            data-testid="resend-otp-button-test"
            onClick={(e) => hanleResendOTp(e)}
            className={styles.resend_main_button + " " + global_style.blue}
          >
            Resend OTP
          </Button>
        </div>
      )}

      <div className={styles.send_otp_div}>
        <Button
          // disabled={
          //   isEmailValid && !isValidEmailSent && agreementChecked
          //     ? false
          //     : isValidEmailSent && otp && otp.length == 6
          //     ? false
          //     : true
          // }
          onClick={() =>
            !isValidEmailSent && emailId
              ? handleSubmit("email")
              : isValidEmailSent && otp
              ? handleSubmit("otp")
              : ""
          }
          className={global_style.primary_button + " " + styles.send_otp}
          id="send-otp-btn"
          data-testid="send-otp-btn-test"
          disabled={!agreementChecked ? true : false}
        >
          {" "}
          {!isValidEmailSent ? "Send OTP" : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmailStep;

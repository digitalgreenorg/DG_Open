import React, { useState, useRef } from "react";
import SignInHeader from "../components/SignInHeader";
import Leftintro from "../components/intros/Leftintro";
import Rightintro from "../components/intros/Rightintro";
// import SignupEmail from "../components/signup/SignupEmail";
import Footerimg from "../components/Footerimg";
import SignupOtp from "../components/signup/SignupOtp";

export default function OtpScreen() {
  const [verifyOtpbutton, setOtpButton] = useState(false);
  const otp = useRef();
  const [isOtperror, setOtpError] = useState(false);
  const [restartcounter, Setrestartcounter] = useState(0);
  const [disable, setDisable] = useState(true);

  const handleSubmitOtp = (e) => {
    e.preventDefault();
    console.log(otp.current.value);
    const valid = otp.current.value;
    var numbers = /^[0-9]+$/;
    // console.log(valid);
    if (!valid.match(numbers)) {
      setOtpError(true);
    } else {
      setOtpError(false);
    }
  };

  const handleOtp = (e) => {
    e.preventDefault();
    const value = e.target.value;
    console.log(value);
    if (e.target.value.length === 6) {
      setOtpButton(true);
      setOtpError(false);
    } else {
      setOtpButton(false);
      //   setOtpError(true);
    }
  };
  const hanleResendOTp = (e) => {
    e.preventDefault();
    console.log("resend otp btn clicked");
    // SetCounterTimeout(false);
    // Setrestart(restart + 1);
    Setrestartcounter(restartcounter + 1);
    setDisable(true);
  };

  return (
    <div>
      <SignInHeader></SignInHeader>
      <h1 className="headertext">Let’s build a datahub together</h1>
      <Leftintro />
      <Rightintro />
      <Footerimg />
      {/* <SignupEmail /> */}
      <SignupOtp
        handleSubmitOtp={handleSubmitOtp}
        handleOtp={handleOtp}
        isOtperror={isOtperror}
        otp={otp}
        button={verifyOtpbutton}
        hanleResendOTp={hanleResendOTp}
        // isCounterTimeout={isCounterTimeout}
        // SetCounterTimeout={SetCounterTimeout}
        // Setrestart={restart}
        restartcounter={restartcounter}
        disable={disable}
        setDisable={setDisable}
      />
    </div>
  );
}

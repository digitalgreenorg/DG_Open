import React, { useState } from "react";
import "./otpcounter.css";
import Countdown from "react-countdown";

export default function OtpCountDownTimer(props) {

  // Random component
  const Completionist = () => <span>0:00</span>;
  // Renderer callback with condition
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <Completionist />;
    } else {
      // Render a countdown
      return props.disable ? (
        <span>
          {(minutes < 10 ? "0" : "") + minutes}:
          {(seconds < 10 ? "0" : "") + seconds}
        </span>
      ) : (
        <span>00:00</span>
      );
    }
  };

  return (
    <>
      <div className="counter">
        <Countdown
          date={Date.now() + props.remainingCounterTime}
          renderer={renderer}
          key={props.restartcounter}
          precision={1}
          onComplete={() => props.setDisable(false) && <Completionist />}
          onTick = {()=>{props.setRemainingCounterTime(props.remainingCounterTime - 1000)}}
          controlled = {false}
        />
      </div>
      <button
        id="resend-otpbtn"
        type="button"
        className={props.disable ? "disabledotp" : "resendotp"}
        onClick={props.hanleResendOTp}
        disabled={props.disable}>
        Resend OTP
      </button>
    </>
  );
}

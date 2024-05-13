import React from "react";
import getStartedImage from "../../Assets/Img/Farmstack V2.0/onboarding_initial_image.svg";
// import { Button } from "react-bootstrap";
import global_style from "../../Assets/CSS/global.module.css";
import styles from "./onboarding.module.css";
import { Button } from "@mui/material";

const LetsGetStarted = (props) => {
  const { setActiveStep } = props;
  return (
    <>
      <div className={styles.get_started_image}>
        <img src={getStartedImage} alt="let's get started" />
      </div>
      <div className={global_style.bold600 + " " + styles.highlight}>
        Great job, you're almost there!
      </div>
      <span className={global_style.bold300 + " " + styles.texts}>
        Complete your onboarding to get started.
      </span>
      <span>
        <Button
          onClick={() => setActiveStep((prev) => prev + 1)}
          className={
            global_style.primary_button + " " + styles.lets_get_started
          }
          id="login-get-started-btn"
        >
          Let's get started
        </Button>
      </span>
    </>
  );
};

export default LetsGetStarted;

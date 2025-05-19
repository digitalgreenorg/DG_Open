import { Button } from "@mui/material";
import { Typography } from "antd";
import React from "react";
import { Row } from "react-bootstrap";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import LocalStyle from "./noData.module.css";

const NoData = (props) => {
  const {
    title,
    subTitle,
    primaryButton,
    secondaryButton,
    primaryButtonOnClick,
    secondaryButtonOnClick,
  } = props;
  return (
    <>
      <Typography
        className={`${GlobalStyle.size24} ${GlobalStyle.bold600} ${LocalStyle.title}`}
      >
        {title ? title : ""}
      </Typography>
      <Typography
        className={`${GlobalStyle.size16} ${GlobalStyle.bold400} ${LocalStyle.subTitle}`}
      >
        {subTitle ? subTitle : ""}
      </Typography>
      <Row>
        {primaryButton ? (
          <Button
            id="add-participant-button"
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: 700,
              fontSize: "12px",
              width: "fit-content",
              height: "30px", // Increased height for better visibility
              border: "1px solid rgba(0, 171, 85, 0.48)",
              borderRadius: "5px",
              color: "#FFFFFF",
              background: "#00A94F",
              textTransform: "none",
              padding: "10 10px", // Added horizontal padding for a better button shape
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // Soft shadow for 3D effect
              transition: "background-color 0.3s ease, transform 0.2s ease", // Smooth transition for hover effects
              "&:hover": {
                background: "#00873d", // Slightly darker green for hover effect
                transform: "translateY(-2px)", // Subtle lift effect on hover
                boxShadow: "0 6px 9px rgba(0,0,0,0.2)", // Increased shadow on hover for depth
              },
              "&:active": {
                transform: "translateY(1px)", // Button presses down on click
                boxShadow: "0 3px 5px rgba(0,0,0,0.1)", // Less shadow on active to mimic pressing
              },
            }}
            onClick={primaryButtonOnClick}
            className={`${LocalStyle.primary}`}
          >
            {primaryButton}
          </Button>
        ) : (
          ""
        )}
      </Row>
      <Row>
        {secondaryButton ? (
          <Button
            id="invite-participants-button"
            onClick={secondaryButtonOnClick}
            variant="outlined"
            className={`${GlobalStyle.outlined_button} ${LocalStyle.primary}`}
          >
            {secondaryButton}
          </Button>
        ) : (
          ""
        )}
      </Row>
    </>
  );
};

export default NoData;

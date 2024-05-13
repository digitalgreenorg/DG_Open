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
            onClick={primaryButtonOnClick}
            className={`${GlobalStyle.primary_button} ${LocalStyle.primary}`}
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

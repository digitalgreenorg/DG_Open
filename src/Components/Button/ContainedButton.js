import { Button } from "@mui/material";
import React from "react";

const ContainedButton = ({
  text,
  fontWeight,
  fontSize,
  fontFamily,
  width,
  height,
  border,
  radius,
  ml,
  mr,
  mt,
  handleClick,
  disabled,
  color,
}) => {
  return (
    <Button
      sx={{
        fontFamily: fontFamily
          ? fontFamily + "!important"
          : "Montserrat !important",
        fontWeight: fontWeight,
        fontSize: fontSize,
        width: width,
        height: height,
        border: disabled
          ? "1px solid rgba(0, 0, 0, 0.1)"
          : border || "1px solid rgba(0, 171, 85, 0.48)",
        borderRadius: radius ? radius : "8px",
        color: disabled ? "white" : "white",
        background: disabled ? "rgba(0, 0, 0, 0.1)" : "#00A94F",
        textTransform: "none",
        marginLeft: ml ? ml : "",
        marginRight: mr ? mr : "",
        marginTop: mt ? mt : "",
        "&:hover": {
          backgroundColor: disabled ? "rgba(0, 0, 0, 0.1)" : "#00A94F",
          color: disabled ? "rgba(0, 0, 0, 0.5)" : "#ffffff",
        },
      }}
      disabled={disabled}
      variant="cotained"
      id="add-connector-button"
      onClick={() => handleClick()}
    >
      {text}
    </Button>
  );
};

export default ContainedButton;

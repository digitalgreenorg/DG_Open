import { Button } from "@mui/material";
import React from "react";

const OutlinedButton = ({
  text,
  fontWeight,
  fontSize,
  width,
  height,
  border,
  radius,
  ml,
  mr,
  mt,
  handleClick,
}) => {
  return (
    <Button
      sx={{
        fontFamily: "Montserrat",
        fontWeight: fontWeight,
        fontSize: fontSize,
        width: width,
        height: height,
        border: border ? border : "1px solid rgba(0, 171, 85, 0.48)",
        borderRadius: radius ? radius : "8px",
        color: "#00A94F",
        textTransform: "none",
        marginLeft: ml ?? "",
        marginRight: mr ?? "",
        marginTop: mt ?? "",
        "&:hover": {
          background: "none",
          border: "1px solid rgba(0, 171, 85, 0.48)",
        },
      }}
      id="join-more-button"
      variant="outlined"
      onClick={() => handleClick()}
    >
      {text}
    </Button>
  );
};

export default OutlinedButton;

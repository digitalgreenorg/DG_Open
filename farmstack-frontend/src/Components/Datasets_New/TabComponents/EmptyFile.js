import { Box, Divider, Typography } from "@mui/material";
import React from "react";

const EmptyFile = ({ text, className, mt }) => {
  return (
    <Box className={className}>
      <div className="text-center">
        <img src={require("../../../Assets/Img/warning.svg")} />
      </div>
      <Typography
        sx={{
          fontFamily: "Montserrat !important",
          fontWeight: "400",
          fontSize: "14px",
          lineHeight: "17.07px",
          color: "#A3B0B8",
          textAlign: "center",
          marginTop: mt ?? "26.7px",
          marginBottom: "20px",
        }}
      >
        {text}
      </Typography>
      <div className="d-flex justify-content-center">
        <Divider sx={{ marginBottom: "10px", width: "150px" }} />
      </div>
    </Box>
  );
};

export default EmptyFile;

import React from "react";
import Typography from "@mui/material/Typography";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const NoDataAvailable = () => {
  return (
    <div style={{ textAlign: "center", padding: "16px" }}>
      <ReportProblemIcon style={{ fontSize: 48, color: "gray" }} />
      <Typography variant="h6" color="textSecondary">
        No Data Available for this Graph
      </Typography>
    </div>
  );
};

export default NoDataAvailable;

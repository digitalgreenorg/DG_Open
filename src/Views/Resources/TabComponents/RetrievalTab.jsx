import { Box } from "@mui/material";
import React from "react";
import RetrievalTable from "./RetrievalTable";

const RetrievalTab = ({ id }) => {
  return (
    <Box className="mt-10">
      <RetrievalTable id={id} />
    </Box>
  );
};

export default RetrievalTab;

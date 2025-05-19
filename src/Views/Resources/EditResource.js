import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import AddResource from "./AddResource";

const EditResource = () => {
  const { id } = useParams();
  return (
    <Box>
      <AddResource resourceId={id} />
    </Box>
  );
};

export default EditResource;

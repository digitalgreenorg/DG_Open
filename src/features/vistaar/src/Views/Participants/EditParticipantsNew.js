import React from "react";
import { Container } from "react-bootstrap";
import ParticipantFormNew from "../../Components/Card/ParticipantForm/ParticipantFormNew";
import { Box, useMediaQuery, useTheme } from "@mui/material";

const EditParticipantsNew = () => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box
      sx={{
        marginLeft: mobile || tablet ? "30px" : "144px",
        marginRight: mobile || tablet ? "30px" : "144px",
      }}
    >
      <ParticipantFormNew
        title={"Edit Participant organisation details"}
        isEditModeOn={true}
      />
    </Box>
  );
};

export default EditParticipantsNew;

import { Box, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import ControlledAccordion from "../../../Components/Accordion/Accordion";

const accordionTitleStyle = {
  fontFamily: "Montserrat' !important",
  fontWeight: "600 !important",
  fontSize: "18px !important",
  lineHeight: "30px !important",
  color: "#424242 !important",
};
const ContentTab = ({ getAccordionDataForLinks, selectedPanelIndex }) => {
  console.log("🚀 ~ ContentTab ~ selectedPanelIndex:", selectedPanelIndex);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box className="mt-30">
      <ControlledAccordion
        data={getAccordionDataForLinks()}
        isCustomStyle={true}
        width={"100%"}
        titleStyle={accordionTitleStyle}
        isCustomArrowColor={true}
        addHeaderBackground={true}
        headerBackground={"#F6F6F6"}
        selectedPanelIndex={selectedPanelIndex}
      />
    </Box>
  );
};

export default ContentTab;

import delete_gray from '../../Assets/Img/delete_gray.svg';
import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Accordion.css";

const detailsStyle = {
  fontFamily: "'Arial' !important",
  fontWeight: "400 !important",
  fontSize: "16px !important",
  lineHeight: "22px !important",
  color: "#212B36 !important",
  textAlign: "left",
  marginBottom: "24px !important",
};

const accordionTitleStyle = {
  fontFamily: "'Arial' !important",
  fontWeight: "600 !important",
  fontSize: "16px !important",
  lineHeight: "24px !important",
  color: "#212B36 !important",
  textAlign: "left !important",
};

const accordionSummaryStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
};

const ControlledAccordion = ({
  data,
  isCustomStyle,
  width,
  titleStyle,
  selectedPanelIndex,
  customBorder,
  showDeleteIcon,
  customPadding,
  isTables,
  isCustomDetailStyle,
  customDetailsStyle,
  addHeaderBackground,
  headerBackground,
  emptyMessage,
  shouldAlwaysOpen,
}) => {
  const [expanded, setExpanded] = useState(
    selectedPanelIndex ? selectedPanelIndex : false
  );

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    setExpanded(selectedPanelIndex ? selectedPanelIndex : false);
  }, [selectedPanelIndex]);

  return (
    <div style={{ width: isCustomStyle && width }}>
      {data?.map((acc, index) => (
        <Accordion
          key={index}
          sx={{
            boxShadow:
              expanded === acc.panel
                ? "0px 20px 40px -4px rgba(145, 158, 171, 0.16)"
                : "",
            borderRadius: expanded === acc.panel ? "8px" : "",
            border:
              customBorder && expanded === acc.panel ? "1px solid #919EAB" : "",
          }}
          // expanded={expanded === acc.panel}
          defaultExpanded={shouldAlwaysOpen}
          onChange={handleChange(acc.panel)}
          id={`uploaded-file-accordion-${index}`}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
            sx={{
              "&.MuiAccordionSummary-root": {
                borderBottom:
                  customBorder && expanded === acc.panel
                    ? "1px solid #919EAB"
                    : "",
                backgroundColor: addHeaderBackground
                  ? headerBackground
                  : "none",
              },
            }}
          >
            <Box
              className={
                showDeleteIcon ? "w-100 d-flex justify-content-between" : ""
              }
            >
              <Typography sx={isCustomStyle ? titleStyle : accordionTitleStyle}>
                {acc.title}
              </Typography>
              {showDeleteIcon ? (
                <img className="mr-55"
                   src={delete_gray} 
                />
              ) : (
                <></>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={
                isCustomStyle || isTables
                  ? { padding: "8px 0px 16px !important" }
                  : accordionSummaryStyle
              }
              style={isCustomDetailStyle ? { textAlign: "left" } : {}}
            >
              {acc?.details?.length ? (
                acc?.details.map((detail, index) => (
                  <Box
                    id={`dataset-accourdion-details-${index}`}
                    key={index}
                    sx={isCustomDetailStyle ? customDetailsStyle : detailsStyle}
                  >
                    {detail}
                  </Box>
                ))
              ) : (
                <Box>{emptyMessage}</Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default ControlledAccordion;

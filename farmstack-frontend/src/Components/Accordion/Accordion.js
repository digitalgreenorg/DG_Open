import React, { useState, useEffect, useRef } from "react";
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
  fontFamily: "'Montserrat' !important",
  fontWeight: "400 !important",
  fontSize: "16px !important",
  lineHeight: "22px !important",
  color: "#212B36 !important",
  textAlign: "left",
  marginBottom: "24px !important",
};

const accordionTitleStyle = {
  fontFamily: "'Montserrat' !important",
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
  isCustomArrowColor,
  isCustomDetailStyle,
  customDetailsStyle,
  addHeaderBackground,
  headerBackground,
  emptyMessage,
  shouldAlwaysOpen,
  isAddContent,
}) => {
  // console.log("🚀 ~ data:54", data, data?.[0]?.details?.[0]);
  const [expanded, setExpanded] = useState(
    selectedPanelIndex ? selectedPanelIndex : false
  );
  const accordionRef = useRef(null);
  // const scrollPosition = window.scrollY;
  const scrollPosition = accordionRef?.current?.scrollTop;
  console.log("🚀 ~ scrollPosition:", scrollPosition);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    setExpanded(selectedPanelIndex ? selectedPanelIndex : false);
  }, [selectedPanelIndex]);

  console.log(data, expanded, "expanded");
  return (
    <div
      style={{
        width: isCustomStyle && width,
        margin: isAddContent ? "auto" : "",
      }}
    >
      {data?.map((acc, index) => (
        <Accordion
          ref={accordionRef}
          key={index}
          sx={{
            boxShadow:
              expanded === acc.panel
                ? "0px 20px 40px -4px rgba(145, 158, 171, 0.16)"
                : "",
            borderRadius: expanded === acc.panel ? "6px 6px 0px 0px" : "",
            border:
              customBorder && expanded === acc.panel ? "1px solid #919EAB" : "",
          }}
          expanded={expanded === acc.panel}
          defaultExpanded={shouldAlwaysOpen} // comment expanded props then only it will work
          onChange={handleChange(acc.panel)}
          id={`uploaded-file-accordion-${index}`}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  color: isCustomArrowColor
                    ? "rgba(0, 0, 0, 0.54) !important"
                    : "#00a94f",
                }}
              />
            }
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

                borderRadius: "6px 6px 0px 0px",
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
                <img
                  className="mr-55"
                  src={require("../../Assets/Img/delete_gray.svg")}
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
                  ? {
                      padding: "8px 0px 16px !important",
                      maxHeight: "400px",
                      overflow: "auto",
                    }
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

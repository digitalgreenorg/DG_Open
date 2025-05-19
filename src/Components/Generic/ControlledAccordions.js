import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import global_styles from "../../Assets/CSS/global.module.css";
import LocalStyle from "./ControlledAccordions.module.css";
export default function ControlledAccordions(props) {
  const { data, Component, index, heading, accordionDelete } = props;
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  console.log("in controlled accordion");
  console.log("in controlled accordion");

  return (
    <>
      <div className={LocalStyle.accordionContainer}>
        <Accordion
          className={LocalStyle.accordion}
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography
              className={global_styles.bold600 + " " + global_styles.font28}
              sx={{ width: "95%", flexShrink: 0, textAlign: "left" }}
            >
              {heading}
            </Typography>
            {accordionDelete ? (
              <DeleteOutlineIcon onClick={(e) => accordionDelete(e, index)} />
            ) : (
              ""
            )}
          </AccordionSummary>
          <AccordionDetails>
            {Component && <Component data={data} index={index} />}
          </AccordionDetails>
        </Accordion>
      </div>
      <hr />
    </>
  );
}

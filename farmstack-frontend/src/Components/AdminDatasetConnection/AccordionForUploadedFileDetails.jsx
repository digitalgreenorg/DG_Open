import {
  Avatar,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const AccordionForUploadedFileDetails = ({
  data,
  title,
  deleteFunc,
  source,
  datasetname,
}) => {
  console.log(data);
  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ width: "33%", flexShrink: 0 }}>
          {title}

          <sup
            style={{
              height: "20px",
              width: "20px",
              backgroundColor: "#00a94f",
              color: "white",
              borderRadius: "10px",
              padding: "0px 5px",
              fontSize: "small",
              margin: "0px 5px",
            }}
          >
            {data?.length}{" "}
          </sup>
        </Typography>
        <Typography sx={{ color: "text.secondary" }}></Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography style={{ maxHeight: "300px", overflowY: "scroll" }}>
          {/* <ul> */}
          {data?.map((item) => {
            return (
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <DescriptionOutlinedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item} secondary="Jan 9, 2014" />
                <IconButton edge="end" aria-label="delete">
                  <DeleteOutlinedIcon
                    onClick={() => deleteFunc(datasetname, source, item)}
                    color="warning"
                  />
                </IconButton>
                <Divider />
              </ListItem>
            );
          })}
          {/* </ul> */}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionForUploadedFileDetails;

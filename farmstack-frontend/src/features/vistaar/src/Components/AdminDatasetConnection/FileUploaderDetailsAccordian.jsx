import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
  LinearProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Row, Col } from "react-bootstrap";

export default function FileUploaderDetailsAccordian({
  data,
  title,
  deleteFunc,
  source,
  datasetname,
  loader,
  key,
  setKey,
  uploadFile,
  localUploaded,
}) {
  console.log("uploaded file", uploadFile);
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
              backgroundColor: "",
              color: "white",
              borderRadius: "10px",
              padding: "0px 5px",
              fontSize: "small",
              margin: "0px 5px",
            }}
          >
            {uploadFile?.length}{" "}
          </sup>
        </Typography>
      </AccordionSummary>
      {uploadFile ? (
        <AccordionDetails>
          <Typography
            style={{
              maxHeight: "300px",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            <ol className="uploaddatasetname">
              {uploadFile.map((item, index) => {
                console.log(
                  "index and item while rendring progress component",
                  index,
                  item,
                  item?.progress
                );
                return (
                  <>
                    <Row key={key}>
                      {/* <Col> */}
                      <li className="uploadList">{item.name}</li>
                      {/* </Col> */}
                      {/* <Col > */}
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        // style={{alignItem : "right", "marginRight": "80px"}}
                      >
                        <DeleteOutlinedIcon
                          onClick={() =>
                            deleteFunc(datasetname, source, item.name)
                          }
                          color="warning"
                        />
                      </IconButton>
                      {/* </Col> */}
                      {/* </Row> */}
                      <LinearProgress
                        variant="determine"
                        value={
                          item?.progress && index == uploadFile.length - 1
                            ? item?.progress
                            : item?.progress && index < uploadFile.length - 1
                            ? 100
                            : 0
                        }
                        key={key}
                        color="success"
                        style={{ width: "350px" }}
                      />
                    </Row>
                    <p>
                      {item?.progress && index == uploadFile.length - 1
                        ? item?.progress
                        : item?.progress && index < uploadFile.length - 1
                        ? 100
                        : 0}
                      %
                    </p>
                  </>
                );
              })}
            </ol>
          </Typography>
        </AccordionDetails>
      ) : (
        ""
      )}
    </Accordion>
  );
}

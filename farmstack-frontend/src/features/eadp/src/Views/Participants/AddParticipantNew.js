import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import ParticipantFormNew from "../../Components/Card/ParticipantForm/ParticipantFormNew";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useHistory } from "react-router-dom";
// import ParticipantFormNew from "../../Components/Card/ParticipantFormNew/ParticipantFormNew";

const AddParticipantNew = (props) => {
  const { breadcrumbFromRoute } = props;
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const history = useHistory();
  return (
    <Box
      sx={{
        marginLeft: mobile || tablet ? "30px" : "144px",
        marginRight: mobile || tablet ? "30px" : "144px",
      }}
    >
      {props.userType !== "guest" ? (
        <Row>
          <Col>
            <div className="text-left mt-50">
              <span
                className="add_light_text cursor-pointer breadcrumbItem"
                onClick={() => history.push("/datahub/participants/")}
              >
                {breadcrumbFromRoute ?? "Participant"}
              </span>
              <span className="add_light_text ml-16">
                <ArrowForwardIosIcon
                  sx={{ fontSize: "14px", fill: "#00A94F" }}
                />
              </span>
              <span className="add_light_text ml-16 fw600">
                Add
                {/* {isParticipantRequest ? "" : ""} */}
              </span>
            </div>
          </Col>
        </Row>
      ) : (
        <></>
      )}
      <ParticipantFormNew userType={props.userType} />
    </Box>
  );
};

export default AddParticipantNew;

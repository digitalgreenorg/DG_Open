import React, { useState, useMemo } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import labels from "../../Constants/labels";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { dateTimeFormat } from "../../Utils/Common";
import UrlConstants from "../../Constants/UrlConstants";
import Avatar from "@mui/material/Avatar";
import { Tooltip, Zoom } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const useStyles = {
  datasetdescription: {
    "margin-left": "0px",
    "margin-right": "0px",
    "font-family": "Open Sans",
    "font-style": "normal",
    "font-weight": "400",
    "font-size": "14px",
    "line-height": "19px",
    overflow: "hidden",
    "text-overflow": "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": "1",
    "-webkit-box-orient": "vertical",
    float: "left",
    width: "300px",
    // height: "37px",
    // "line-height": "19px",
    // "word-break": "break-word",
  },
};

export default function ViewDataSet(props) {
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const [isLoader, setIsLoader] = useState(false);
  let category;
  let categoryStr = "";
  if (
    typeof props.rowdata.category === "string" ||
    props.rowdata.category instanceof String
  ) {
    category = JSON.parse(props.rowdata.category);
  } else {
    category = props.rowdata.category;
  }

  categoryStr += category["crop_data"] ? "Crop data" : "";
  categoryStr += category["cultivation_data"] ? " | Cultivation data" : "";
  categoryStr += category["practice_data"] ? " | Practice data" : "";
  categoryStr += category["farmer_profile"] ? " | Farmer profile" : "";
  categoryStr += category["land_records"] ? " | Land records" : "";
  categoryStr += category["soil_data"] ? " | Soil data" : "";
  categoryStr += category["weather_data"] ? " | Weather data" : "";
  categoryStr += category["research_data"] ? " | Research data" : "";
  categoryStr += category["livestock"] ? " | Livestock" : "";
  categoryStr += category["diary"] ? " | Diary" : "";
  categoryStr += category["poultry"] ? " | Poultry" : "";
  categoryStr += category["other"] ? " | Other" : "";

  if (categoryStr.startsWith(" |")) {
    categoryStr = categoryStr.replace(" |", "").trim();
  }
  return (
    <>
      <Row>
        <Col className="supportViewDetailsbackimage">
          <span onClick={() => props.back()}>
            <img src={require("../../Assets/Img/Vector.svg")} alt="new" />
          </span>
          <span className="supportViewDetailsback" onClick={() => props.back()}>
            {"Back"}
          </span>
        </Col>
      </Row>
      <Row className="supportViewDeatilsSecondRow"></Row>
      <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
        <span className="mainheading">{"Dataset Details"}</span>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "30px",
          "text-align": "left",
        }}
      >
        <Col>
          <span className="secondmainheading">{"Dataset name"}</span>
        </Col>
        <Col>
          <span className="secondmainheading">{"Description"}</span>
        </Col>
        <Col>
          <span className="secondmainheading">{"Data category"}</span>
        </Col>
      </Row>

      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "5px",
          "text-align": "left",
        }}
      >
        <Col
          style={{
            width: "30px",
            height: "37px",
            "line-height": "19px",
            "word-break": "break-word",
          }}
        >
          <Tooltip TransitionComponent={Zoom} title={props.rowdata.name}>
            <span
              style={{ maxWidth: "300px" }}
              className="thirdmainheading memberDataSetCardTooltipAndWidthAndOverflow d-inline-block text-truncate"
            >
              {props.rowdata.name}
            </span>
          </Tooltip>
        </Col>
        {/* <Col
          style={{
            width: "30px",
            height: "37px",
            "line-height": "19px",
            "word-break": "break-word",
          }}>
          <span className="thirdmainheading">{props.rowdata.description}</span>
        </Col> */}
        <Col
          style={{
            width: "30px",
            height: "37px",
            "line-height": "19px",
            "word-break": "break-word",
          }}
        >
          <Row style={useStyles.datasetdescription}>
            <Tooltip
              TransitionComponent={Zoom}
              title={props.rowdata.description}
            >
              <span
                style={{ maxWidth: "300px" }}
                className="thirdmainheading memberDataSetCardTooltipAndWidthAndOverflow d-inline-block text-truncate"
              >
                {" "}
                {props.rowdata.description}
              </span>
            </Tooltip>
          </Row>
        </Col>
        <Col className="text-truncate">
          <Tooltip TransitionComponent={Zoom} title={categoryStr}>
            <span
              style={{ maxWidth: "300px" }}
              className="thirdmainheading memberDataSetCardTooltipAndWidthAndOverflow d-inline-block text-truncate"
            >
              {categoryStr}
            </span>
          </Tooltip>
        </Col>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "40px",
          "text-align": "left",
        }}
      >
        <Col>
          <span className="secondmainheading">{"Geography"}</span>
        </Col>
        <Col>
          <span className="secondmainheading">{"Value Chain"}</span>
        </Col>
        <Col>
          <span className="secondmainheading">{"Constantly updating"}</span>
        </Col>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "5px",
          "text-align": "left",
        }}
      >
        <Col
          className="memberDataSetCardTooltipAndWidthAndOverflow"
          style={{ width: "30px", height: "37px", "line-height": "19px" }}
        >
          <Tooltip TransitionComponent={Zoom} title={props.rowdata.geography}>
            <span
              className="thirdmainheading memberDataSetCardTooltipAndWidthAndOverflow d-inline-block text-truncate"
              style={{
                "margin-top": "5px",
                "max-width": "50%",
                height: "37px",
                "line-height": "19px",
                "word-break": "break-word",
                maxWidth: "300px",
              }}
            >
              {props.rowdata.geography}
            </span>
          </Tooltip>
        </Col>

        <Col
          className="memberDataSetCardTooltipAndWidthAndOverflow"
          style={{
            width: "30px",
            height: "37px",
            "line-height": "19px",
            "word-break": "break-word",
            // border:"1px solid red"
          }}
        >
          <Tooltip
            TransitionComponent={Zoom}
            title={
              props.rowdata.crop_detail ? props.rowdata.crop_detail : "N/A"
            }
          >
            <span
              style={{ maxWidth: "300px" }}
              className="thirdmainheading memberDataSetCardTooltipAndWidthAndOverflow d-inline-block text-truncate"
            >
              {props.rowdata.crop_detail ? props.rowdata.crop_detail : "N/A"}
            </span>
          </Tooltip>
        </Col>

        <Col>
          <span className="thirdmainheading">
            {props.rowdata.constantly_update ? "Yes" : "No"}
          </span>
        </Col>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "40px",
          "text-align": "left",
        }}
      >
        {/* <Col>
          <span className="secondmainheading">{"Age of actual data"}</span>
        </Col> */}
        <Col>
          <span className="secondmainheading">{"Data capture interval"}</span>
        </Col>
        <Col>
          <span className="secondmainheading">{"Number of Rows"}</span>
        </Col>
        <Col>
          <span className="secondmainheading">{"Connector availablity"}</span>
        </Col>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "5px",
          "text-align": "left",
        }}
      >
        {/* <Col>
          <span className="thirdmainheading">
            {props.rowdata.age_of_date ? props.rowdata.age_of_date : "N/A"}
          </span>
        </Col> */}
        <Col>
          {console.log(!props.rowdata.data_capture_start)}
          {console.log(!props.rowdata.data_capture_end)}
          {console.log(
            !props.rowdata.data_capture_start && !props.rowdata.data_capture_end
          )}

          {!props.rowdata.data_capture_start &&
          !props.rowdata.data_capture_end ? (
            <span className="thirdmainheading"> N/A </span>
          ) : (
            <span className="thirdmainheading">
              {props.rowdata.data_capture_start
                ? dateTimeFormat(props.rowdata.data_capture_start, false) +
                  " - "
                : "N/A - "}
              {props.rowdata.data_capture_end
                ? dateTimeFormat(props.rowdata.data_capture_end, false)
                : "N/A"}
            </span>
          )}
        </Col>
        <Col>
          <span className="thirdmainheading">
            {props.rowdata.dataset_size ? props.rowdata.dataset_size : "N/A"}
          </span>
        </Col>
        <Col>
          <span className="thirdmainheading">
            {props.rowdata.connector_availability
              ? props.rowdata.connector_availability
              : "N/A"}
          </span>
        </Col>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "40px",
          "text-align": "left",
        }}
      >
        <Col>
          <span className="secondmainheading">{"Data visibility"}</span>
        </Col>
        <Col>
          <span className="secondmainheading"></span>
        </Col>
      </Row>
      <Row
        style={{
          "margin-left": "79px",
          "margin-top": "5px",
          "text-align": "left",
        }}
      >
        <Col>
          <span className="thirdmainheading">
            {props.rowdata["is_public"] ? "Public" : "Private"}
          </span>
        </Col>
        <Col>
          <span className="thirdmainheading"></span>
        </Col>
      </Row>
      <Row className="supportViewDeatilsSecondRow"></Row>
      {!props.isAdminView ? (
        <>
          <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
            <span className="mainheading">{"Organization details"}</span>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "30px",
              "text-align": "left",
            }}
          >
            <Col>
              <span className="secondmainheading">
                {"Contact person's name"}
              </span>
            </Col>
            <Col>
              <span className="secondmainheading">{"Organization name"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{"Email id"}</span>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "5px",
              "text-align": "left",
            }}
          >
            <Col className="memberDataSetCardTooltipAndWidthAndOverflow">
              <Tooltip
                TransitionComponent={Zoom}
                title={
                  props.rowdata.user.first_name +
                  " " +
                  props.rowdata.user.last_name
                }
              >
                <span
                  style={{ maxWidth: "300px" }}
                  className="thirdmainheading memberDataSetCardTooltipAndWidthAndOverflow d-inline-block text-truncate"
                >
                  {props.rowdata.user.first_name} {props.rowdata.user.last_name}
                </span>
              </Tooltip>
            </Col>

            <Col>
              <Row className="memberDataSetCardTooltipAndWidthAndOverflow">
                <Col>
                  {props.rowdata.organization.logo ? (
                    <Avatar
                      alt={props.rowdata.organization.name}
                      src={
                        UrlConstants.base_url_without_slash +
                        props.rowdata.organization.logo
                      }
                      sx={{ width: 56, height: 56 }}
                    />
                  ) : (
                    <Avatar
                      sx={{ bgcolor: "#c09507", width: 56, height: 56 }}
                      aria-label="recipe"
                    >
                      {props.rowdata.organization.name.charAt(0)}
                    </Avatar>
                  )}
                </Col>

                <Col style={{ "margin-left": "-63%", "margin-top": "3%" }}>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={props.rowdata.organization.name}
                  >
                    <span
                      style={{ maxWidth: "300px" }}
                      className="thirdmainheading memberDataSetCardTooltipAndWidthAndOverflow d-inline-block text-truncate"
                    >
                      {props.rowdata.organization.name}
                    </span>
                  </Tooltip>
                </Col>
              </Row>
            </Col>

            <Col className="memberDataSetCardTooltipAndWidthAndOverflow">
              <Tooltip
                TransitionComponent={Zoom}
                title={
                  props.rowdata.organization.org_email
                    ? props.rowdata.organization.org_email
                    : "N/A"
                }
              >
                <span
                  style={{ maxWidth: "300px" }}
                  className="thirdmainheading memberDataSetCardTooltipAndWidthAndOverflow d-inline-block text-truncate"
                >
                  {props.rowdata.organization.org_email
                    ? props.rowdata.organization.org_email
                    : "N/A"}
                </span>
              </Tooltip>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "30px",
              "text-align": "left",
            }}
          >
            <Col>
              <span className="secondmainheading">{"Contact number"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{"Address"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{""}</span>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "5px",
              "text-align": "left",
            }}
          >
            <Col className="memberDataSetCardTooltipAndWidthAndOverflow">
              <Tooltip
                TransitionComponent={Zoom}
                title={
                  props.rowdata.organization["name"]
                    ? props.rowdata.organization["name"]
                    : "N/A"
                }
              >
                <span
                  style={{ maxWidth: "300px" }}
                  className="thirdmainheading memberDataSetCardTooltipAndWidthAndOverflow d-inline-block text-truncate"
                >
                  {props.rowdata.organization["name"]
                    ? props.rowdata.organization["name"]
                    : "N/A"}
                </span>
              </Tooltip>
            </Col>

            <Col className="memberDataSetCardTooltipAndWidthAndOverflow">
              <Tooltip
                TransitionComponent={Zoom}
                title={
                  props.rowdata.organization["address"]["address"]
                    ? props.rowdata.organization["address"]["address"]
                    : "N/A"
                }
              >
                <span
                  style={{ maxWidth: "300px" }}
                  className="thirdmainheading memberDataSetCardTooltipAndWidthAndOverflow d-inline-block text-truncate"
                >
                  {props.rowdata.organization["address"]["address"]
                    ? props.rowdata.organization["address"]["address"]
                    : "N/A"}
                </span>
              </Tooltip>
            </Col>

            <Col>
              <span className="secondmainheading">{""}</span>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "30px",
              "text-align": "left",
            }}
          >
            <Col>
              <span className="secondmainheading">{"Country"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{"PIN code"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{""}</span>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "5px",
              "text-align": "left",
            }}
          >
            <Col>
              <Tooltip
                TransitionComponent={Zoom}
                title={
                  props.rowdata.organization["address"]["country"]
                    ? props.rowdata.organization["address"]["country"]
                    : "N/A"
                }
              >
                <span
                  style={{ maxWidth: "300px" }}
                  className="thirdmainheading memberDataSetCardTooltipAndWidthAndOverflow d-inline-block text-truncate"
                >
                  {props.rowdata.organization["address"]["country"]
                    ? props.rowdata.organization["address"]["country"]
                    : "N/A"}
                </span>
              </Tooltip>
            </Col>

            <Col>
              <Tooltip
                TransitionComponent={Zoom}
                title={
                  props.rowdata.organization["address"]["pincode"]
                    ? props.rowdata.organization["address"]["pincode"]
                    : "N/A"
                }
              >
                <span
                  style={{ maxWidth: "300px" }}
                  className="thirdmainheading memberDataSetCardTooltipAndWidthAndOverflow d-inline-block text-truncate"
                >
                  {props.rowdata.organization["address"]["pincode"]
                    ? props.rowdata.organization["address"]["pincode"]
                    : "N/A"}
                </span>
              </Tooltip>
            </Col>

            <Col>
              <span className="secondmainheading">{""}</span>
            </Col>
          </Row>
          <Row className="supportViewDeatilsSecondRow"></Row>
        </>
      ) : (
        <></>
      )}
      {props.rowdata.is_public ? (
        <Row style={{ "margin-top": "20px" }}>
          <Col xs={12} sm={12} md={6} lg={3}></Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Button
              onClick={() => {
                props.downloadAttachment(props.rowdata.sample_dataset);
              }}
              variant="contained"
              className="submitbtn"
            >
              Download Dataset
            </Button>
          </Col>
        </Row>
      ) : (
        <>
          <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
            <span className="mainheading">{"Sample data table"}</span>

            <span
              style={{ "margin-left": "67%", cursor: "pointer" }}
              onClick={() =>
                props.downloadAttachment(props.rowdata.sample_dataset)
              }
            >
              <img src={require("../../Assets/Img/download.svg")} alt="new" />
            </span>
            <span
              className="supportViewDetailsback"
              style={{ "margin-top": "4px", cursor: "pointer" }}
              onClick={() =>
                props.downloadAttachment(props.rowdata.sample_dataset)
              }
            >
              {"Download sample data"}
            </span>
          </Row>
          <Row
            style={{
              "margin-left": "93px",
              "margin-top": "30px",
              "margin-right": "73px",
            }}
          >
            <Stack sx={{ width: "100%", textAlign: "left" }} spacing={2}>
              <Alert severity="warning">
                {/* <AlertTitle style={{ textAlign: "left" }}>Warning</AlertTitle> */}
                {/* This is a warning alert —{" "} */}
                <strong>
                  This table's sample dataset is solely meant to be used as a
                  source of information. Despite the fact that accuracy is a
                  goal, the steward is not accountable for the information.
                  Please let the admin know if you come across any information
                  that you think is inaccurate.
                </strong>
              </Alert>
            </Stack>
          </Row>
          <Row
            style={{
              border: "1px solid #DFDFDF",
              "margin-left": "93px",
              "margin-top": "10px",
              "margin-right": "70px",
              overflow: "scroll",
            }}
          >
            <Col>
              <Table
                aria-label="simple table"
                style={{ overflow: "scroll", width: "1300px" }}
              >
                <TableHead>
                  <TableRow>
                    {props.tabelkeys.map((key) => (
                      <TableCell>{key}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.rowdata.content.map((row) => (
                    <TableRow key={row.name}>
                      {props.tabelkeys.map((key) => (
                        <TableCell>{row[key]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

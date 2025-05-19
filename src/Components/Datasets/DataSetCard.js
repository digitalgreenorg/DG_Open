import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "@mui/material/Button";
import THEME_COLORS from "../../Constants/ColorConstants";
import UrlConstants from "../../Constants/UrlConstants";
import labels from "../../Constants/labels";
import { useState } from "react";

import { dateTimeFormat } from "../../Utils/Common";
import { Tooltip, Zoom } from "@mui/material";
import parse from "html-react-parser";
// import successIcon from "../../Assets/Img/successiconsvg.svg"
import success from "../../Assets/Img/successiconsvg.svg";

const useStyles = {
  btncolor: {
    color: THEME_COLORS.THEME_COLOR,
    "border-color": THEME_COLORS.THEME_COLOR,
    "border-radius": 0,
    "text-transform": "none",
    "font-weight": "400",
    "font-size": "14px",
  },
  cardcolor: {
    border: "1px solid #E4E4E4",
    "box-shadow": "none",
    // cursor: "pointer",
    height: "355px",
    "border-radius": "2px",
    width: "346px",
    "margin-left": "20px",
  },
  togglecardcolor: {
    "box-shadow": "0px 4px 20px rgba(216, 175, 40, 0.28)",
    border: "1px solid #ebd79c",
    // cursor: "pointer",
    height: "355px",
    width: "346px",
    "margin-left": "20px",
  },
  marginrowtop: { "margin-top": "20px" },
  margindescription: { "margin-left": "20px", "margin-right": "20px" },
  cardDataHeading: {
    "font-weight": "600",
    "font-size": "14px",
    color: "#3D4A52",
  },
  cardData: { "font-weight": 400, "font-size": "14px", color: "#3D4A52" },
  datasetdescription: {
    "margin-left": "0px",
    "margin-right": "0px",
    "font-family": "Open Sans",
    "font-style": "normal",
    "font-weight": "400",
    "font-size": "14px",
    "line-height": "19px",
    "-webkit-line-clamp": "2",
    "-webkit-box-orient": "vertical",
    "text-align": "left",
    "max-height": "60px",
    "text-overflow": "ellipsis",
    overflow: "hidden",
    display: "inline-block",
    width: "300px",
  },
};
export default function DataSetCard(props) {
  const [isshowbutton, setisshowbutton] = useState(false);
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  let newimg = document.createElement("img");
  newimg.src = success;
  newimg.alt = "hello";

  return (
    <>
      <Card
        className={props.margingtop}
        style={!isshowbutton ? useStyles.cardcolor : useStyles.togglecardcolor}
        onMouseEnter={() => setisshowbutton(true)}
        onMouseLeave={() => setisshowbutton(false)}
      >
        {/* <Tooltip TransitionComponent={Zoom} title={props.title}> */}
        <div className="cardheaderTitlespecifier text-truncate">
          <CardHeader
            avatar={
              props.orgLogo ? (
                <Avatar
                  alt="Remy Sharp"
                  src={UrlConstants.base_url_without_slash + props.orgLogo}
                  sx={{ width: 54, height: 54 }}
                />
              ) : (
                <Avatar
                  sx={{ bgcolor: "#c09507", width: 54, height: 54 }}
                  aria-label="recipe"
                >
                  {props.orgName?.charAt(0)}
                </Avatar>
              )
            }
            // title={props.data.subject}
            // tooltip={<Tooltip title={props.title}>{props.title}</Tooltip>}
            title={props.title}
            style={{
              "background-color": "#f8f9fa",
              padding: "9px",
              "text-align": "left",
              overflow: "hidden",
              "text-overflow": "ellipsis",
            }}
          />
        </div>
        {/* </Tooltip> */}

        <CardContent>
          <Row style={useStyles.datasetdescription}>
            {/* <Tooltip TransitionComponent={Zoom} title={props.description}> */}
            <p
              className="dataset-description-in-dataset-details"
              style={{ maxWidth: "300px", height: "40px", display: "block" }}
            >
              {props.description ? parse(props.description) : ""}
            </p>
            {/* </Tooltip> */}
          </Row>
          <Row>
            {props.isMemberTab ? (
              <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                {screenlabels.dataset.organisation_name}
              </Col>
            ) : (
              <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                {screenlabels.dataset.geography}
              </Col>
            )}
            <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardsecondcolumn">
              {screenlabels.dataset.published_on}
            </Col>
          </Row>

          <Row className="supportcardmargintop">
            {props.isMemberTab ? (
              <Col className="fontweight400andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                {/* <Tooltip TransitionComponent={Zoom} title={props.orgName}> */}
                <div
                  style={{ maxWidth: "150px" }}
                  className="d-inline-block text-truncate"
                >
                  {props.orgName}
                </div>
                {/* </Tooltip> */}
              </Col>
            ) : (
              <Col
                style={{ zIndex: 10 }}
                className="fontweight400andfontsize14pxandcolor3D4A52 supportcardfirstcolumngeo"
              >
                {/* <Tooltip TransitionComponent={Zoom} title={props.geography}> */}
                <div
                  style={{ maxWidth: "150px" }}
                  className="d-inline-block text-truncate"
                >
                  {props.geography}
                </div>
                {/* </Tooltip> */}
              </Col>
            )}
            {/* <Col style={{ color: "#FF3D00", "text-transform": "capitalize" }} className="fontweight400andfontsize14pxandcolor3D4A52 supportcardsecondcolumndata"> */}
            <Col
              style={{
                "font-size": "14px",
                "font-weight": "400",
                "text-transform": "capitalize",
              }}
              className="fontweight400andfontsize14pxandcolor3D4A52 supportcardsecondcolumn"
            >
              {dateTimeFormat(props.publishedon, true)}
            </Col>
          </Row>
          {/* <Row className="supportcardmargintop">
                    <Col className="fontweight400andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                        {props.data.organization.name}
                        Test Organisation Name 
                    </Col>
                    {props.data.status == 'open' ? 
                    <Col style={{ color: "#FF3D00", "text-transform": "capitalize" }} className="fontweight400andfontsize14pxandcolor3D4A52 supportcardsecondcolumndata">
                        {props.data.status}
                        Sample_status
                    </Col> 
                    : <></>}
                    {props.data.status == 'hold' ?
                     <Col style={{ color: "#D8AF28", "text-transform": "capitalize" }} className="fontweight400andfontsize14pxandcolor3D4A52 supportcardsecondcolumndata">
                        {props.data.status}
                    </Col> 
                    : <></>}
                    {props.data.status == 'closed' ? 
                    <Col style={{ color: "#096D0D", "text-transform": "capitalize" }} className="fontweight400andfontsize14pxandcolor3D4A52 supportcardsecondclosedcolumndata">
                        {props.data.status}
                    </Col> 
                    : <></>}
                </Row> */}
          <Row>
            <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
              {"constantly update"}
            </Col>
            <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardsecondcolumn">
              {/* {screenlabels.dataset.crop_details} */}
            </Col>
          </Row>
          <Row className="supportcardmargintop">
            <Col className="fontweight400andfontsize14pxandcolor3D4A52 supportcardfirstcolumn width173px">
              {/* <Tooltip
              TransitionComponent={Zoom}
              title={props.visiblity ? "Public" : "Private"}
            > */}
              <div
                style={{ maxWidth: "135px" }}
                className="d-inline-block text-truncate"
              >
                {/* {console.log("validdityyy",props.visiblity)} */}
                {props.constantly_update ? "Yes" : "No"}
              </div>
              {/* </Tooltip> */}
            </Col>
            <Col
              style={{
                "padding-right": "4px",
                color: "#3D4A52",
                "text-transform": "capitalize",
              }}
              className="fontweight400andfontsize14pxandcolor3D4A52 supportcardsecondcolumndata"
            >
              {/* <Tooltip TransitionComponent={Zoom} title={""}> */}
              <span
                style={{ maxWidth: "150px" }}
                className="d-inline-block text-truncate"
              >
                {/* {props.cropDetail} */}
              </span>
              {/* </Tooltip> */}
            </Col>
          </Row>
          {/* <Row>
                    <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                    Age of Data
                    </Col>
                    </Row>
                    <Row className="supportcardmargintop">
                    <Col className="fontweight400andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                    {props.data.user.first_name}
                    SampleFirstName
                    </Col>
                    </Row>
                    <Row>
                    <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                    {"Date & Time"}
                    </Col>
                    </Row>
                    <Row className="supportcardmargintop">
                    <Col className="fontweight400andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                    {dateTimeFormat(props.data.updated_at)}
                    DateSample
                    </Col>
                    </Row>
                    <Row>
                    <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                    Category
                    </Col>
                    </Row>
                    <Row className="supportcardmargintop">
                    <Col className="fontweight400andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                    {props.data.category}
                    Sample_Category
                    </Col>
                </Row> */}
          {/* <Row style={{ "margin-top": "-58px" }}> */}
          <Row>
            {props.isMemberTab && (
              <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                {screenlabels.dataset.geography}
              </Col>
            )}
          </Row>
          <Row style={{ width: "150px" }} className="supportcardmargintop">
            {props.isMemberTab ? (
              <Col className="fontweight400andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                <Tooltip
                  onMouseEnter={() => console.log("Hover")}
                  placeholder="top-start"
                  TransitionComponent={Zoom}
                  title={props.geography}
                >
                  <div
                    style={{ maxWidth: "150px" }}
                    className="d-inline-block text-truncate"
                  >
                    {props.geography}
                  </div>
                </Tooltip>
              </Col>
            ) : (
              <Col></Col>
            )}
          </Row>
          <Row
            style={
              !props.isMemberTab
                ? {
                    "margin-top": "30px",
                    width: "150px",
                    marginLeft: "170px",
                    zIndex: "11",
                  }
                : {
                    "margin-top": "-50px",
                    width: "150px",
                    marginLeft: "170px",
                    zIndex: "11",
                  }
            }
          >
            {isshowbutton ? (
              <Col
                lg={12}
                className="fontweight600andfontsize14pxandcolor3D4A52 supportcardsecondcolumn"
              >
                <Button
                  onClick={() => {
                    props.viewCardDetails(" ", props.isMemberTab);
                  }}
                  variant="outlined"
                  style={useStyles.btncolor}
                >
                  View details
                </Button>
              </Col>
            ) : (
              <></>
            )}
          </Row>
        </CardContent>
      </Card>
      {/* {show ? <ViewMetaDatasetDetails 

      isMemberTab = {"props.isMemberTab"}
      /> : " " } */}
    </>
  );
}

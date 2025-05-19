import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "@mui/material/Button";
import THEME_COLORS from "../../Constants/ColorConstants";
import UrlConstants from "../../Constants/UrlConstants";
import { useHistory } from "react-router-dom";
import { Tooltip, Zoom } from "@mui/material";
import "./participantsCards.css"

const useStyles = {
  btncolor: {
    color: THEME_COLORS.THEME_COLOR,
    "border-color": THEME_COLORS.THEME_COLOR,
    "border-radius": 0,
    "text-transform": "capitalize",
    "border-radius": "2px",
    "text-transform": "capitalize",
    width: "116px",
    height: "34px",
    "margin-left": "-25px",
    "font-weight": "400",
    "font-family": "Open Sans",
    "font-style": "normal",
    "font-size": "14px",
  },
  btnPosition: {
    color: THEME_COLORS.THEME_COLOR,
    "border-color": THEME_COLORS.THEME_COLOR,
    "border-radius": 0,
    "text-transform": "capitalize",
    "border-radius": "2px",
    "text-transform": "capitalize",
    width: "116px",
    height: "34px",
    "margin-right": "-20px",
    "font-weight": "400",
    "font-family": "Open Sans",
    "font-style": "normal",
    "font-size": "14px",
  },
  cardcolor: {
    border: "1px solid #E4E4E4",
    "box-shadow": "none",
    cursor: "pointer",
    "min-height": "240px",
    width: "350px",
    "border-radius": "2px",
  },
  togglecardcolor: {
    "box-shadow": "0px 4px 20px rgba(216, 175, 40, 0.28)",
    border: "1px solid #D8AF28",
    cursor: "pointer",
    "min-height": "240px",
    width: "350px",
  },
  marginrowtop: { "margin-top": "30px" },
  cardDataHeading: {
    "font-family": "Open Sans",
    "font-weight": "600",
    "font-size": "14px",
    color: "#3D4A52",
    "text-align": "left",
    "padding-left": "10px",
  },
  cardData: {
    "font-family": "Open Sans",
    "font-weight": "400",
    "font-size": "14px",
    color: "#3D4A52",
    "text-align": "left",
    "margin-top": "10px",
    "padding-left": "0px",
  },
};

export default function ParticipantsCards(props) {
  const [isshowbutton, setisshowbutton] = React.useState(false);
  const history = useHistory();
  return (
    <Card
      className="particaipancard"
      style={!isshowbutton ? useStyles.cardcolor : useStyles.togglecardcolor}
      onMouseEnter={() => setisshowbutton(true)}
      onMouseLeave={() => setisshowbutton(false)}
    >
      <Tooltip
        TransitionComponent={Zoom}
        placement="bottom-start"
        title={
          "Participant's Organisation Name: " +
          props.mainheading +
          ", " +
          "Participant's Name: " +
          props.subheading
        }
      >
        <div className="cardheaderTitlespecifier text-truncate">
          <CardHeader
          className="dataset-card-header"
            avatar={
              props.profilepic ? (
                <Avatar
                  alt="Remy Sharp"
                  src={UrlConstants.base_url + props.profilepic}
                  sx={{ width: 64, height: 64 }}
                />
              ) : (
                <Avatar
                  sx={{ bgcolor: "#c09507", width: 64, height: 64 }}
                  aria-label="recipe"
                >
                  {props.firstname.charAt(0)}
                </Avatar>
              )
            }
            action={<IconButton aria-label="settings"></IconButton>}
            title={props.mainheading}
            subheader={props.subheading}
            style={{
              "background-color": "#F4F4F4",
              padding: "9px",
              height: "84px",
              "text-align": "left",
              "font-family": "Open Sans",
              "font-style": "normal",
              "font-weight": 400,
              "font-size": "14px",
              "line-height": "19px",
              color: "#3D4A52",
            }}
          />
        </div>
      </Tooltip>
      <CardContent>
        <Row style={{ "margin-top": "5px" }}>
          <Col xs={12} sm={12} md={4} lg={4} style={useStyles.cardDataHeading}>
            Dataset <br />
            <Tooltip
              TransitionComponent={Zoom}
              title={props.dataset > 9 ? props.dataset : "0" + props.dataset}
            >
              <div
                className="width100px text_overflow_ellipsis_overflow_hidden"
                style={useStyles.cardData}
              >
                {props.dataset > 9 ? props.dataset : "0" + props.dataset}
              </div>
            </Tooltip>
          </Col>
          <Col xs={12} sm={12} md={4} lg={5} style={useStyles.cardDataHeading}>
            Connectors
            <br />
            <Tooltip
              TransitionComponent={Zoom}
              title={
                props.connector > 9 ? props.connector : "0" + props.connector
              }
            >
              <div
                className="width100px text_overflow_ellipsis_overflow_hidden"
                style={useStyles.cardData}
              >
                {props.connector > 9 ? props.connector : "0" + props.connector}
              </div>
            </Tooltip>
          </Col>
          <Col xs={12} sm={12} md={4} lg={3} style={useStyles.cardDataHeading}>
            Status
            <br />
            <Tooltip TransitionComponent={Zoom} title={props.active}>
              <div
                className="width100px text_overflow_ellipsis_overflow_hidden"
                style={useStyles.cardData}
              >
                {props.active}
              </div>
            </Tooltip>
          </Col>
        </Row>
        {/*
        <Row style={{}}>
          <Col xs={12} sm={12} md={4} lg={4} style={useStyles.cardData}>
            <span>{props.dataset}</span>
          </Col>
          <Col xs={12} sm={12} md={5} lg={5} style={useStyles.cardData}>
            <span>{props.connector}</span>
          </Col>
          <Col xs={12} sm={12} md={3} lg={3} style={useStyles.cardData}>
            <span>{props.active}</span>
          </Col>
        </Row>
      */}
        {isshowbutton ? (
          <Row style={useStyles.marginrowtop}>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() =>
                  history.push(
                    `${
                      props.coStewardTab
                        ? "/datahub/costeward/edit/"
                        : "/datahub/participants/edit/"
                    }` + props.id
                  )
                }
                variant="outlined"
                style={useStyles.btncolor}
                className="buttonremovebackgroundonhover"
              >
                <img src={require("../../Assets/Img/edit.svg")} alt="new" />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Edit
              </Button>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() =>
                  history.push(
                    `${
                      props.coStewardTab
                        ? "/datahub/costeward/view/"
                        : "/datahub/participants/view/"
                    }` + props.id
                  )
                }
                variant="outlined"
                style={useStyles.btnPosition}
                className="buttonremovebackgroundonhover"
              >
                View details
              </Button>
            </Col>
          </Row>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}

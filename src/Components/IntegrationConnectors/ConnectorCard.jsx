import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useHistory } from "react-router-dom";
import { dateTimeFormat } from "../../Utils/Common";
import "./cards.css"

const useStyles = {
  marginrowtop: { "margin-top": "30px" },
  cardDataHeading: {
    "font-family": "Open Sans",
    "font-weight": "400",
    "font-size": "16px",
    color: "#3D4A52",
  },
  cardData: {
    "font-family": "Open Sans",
    "font-weight": "600",
    "font-size": "16px",
    color: "#3D4A52",
    "margin-top": "10px"
  },
  cardDataHead: {
    "color": "#c09507",
    "text-transform": "capitalize",
    'font-family': 'Open Sans',
    "font-weight": "600",
    "font-size": "24px",
    "font-style": "normal",
    "width": "272px",
    "height": "25px",
    "line-height": "19px",
    "text-align": "left",
    "margin-bottom": "20px",
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "white-space": "nowrap",
  },
  cardDataUser: {
    "font-family": "Open Sans",
    "font-weight": "400",
    "font-size": "14px",
    "font-style": "normal",
    color: "#3D4A52",
    "width": "314px",
    "height": "19px",
    "line-height": "19px",
    "text-align": "left",
  },
  header: {
    height: "4px",
    "text-align": "left",
    "font-family": "Open Sans",
    "font-style": "normal",
    "font-weight": 400,
    "font-size": "14px",
    "line-height": "19px",
    "color": "#9BA0A7",

  },
}

export default function ConnectorCard(props) {
  const { click } = props
  const history = useHistory();
  return (
    <Card
      // To add view component of connector when the card is clicked
      onClick={click}
      className="connectorCard"
    >
      <CardHeader
        avatar={
          <Avatar
            src={require('../../Assets/Img/globe.svg')}
            sx={{ width: 15, height: 15, }}
          ></Avatar>
        }
        title={"Last Updated on: " + dateTimeFormat(props.firsttext, true)}
        style={useStyles.header}
      />
      <CardContent>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} style={useStyles.cardDataHead}>
            {props.secondtext}
          </Col>
        </Row>
        <Row
          style={useStyles.cardDataUser}>
          <Col xs={12} sm={12} md={6} lg={6} style={useStyles.cardDataHeading}>
            Used Datasets
            <br />
            <div
              className="width100px text_overflow_ellipsis_overflow_hidden"
              style={useStyles.cardData}
            >
              {props.useddataset > 9 ? props.useddataset : "0" + props.useddataset}
            </div>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} style={useStyles.cardDataHeading}>
            Providers
            <br />
            <div
              className="width100px text_overflow_ellipsis_overflow_hidden"
              style={useStyles.cardData}
            >
              {props.providers > 9 ? props.providers : "0" + props.providers}
            </div>
          </Col>
        </Row>
      </CardContent>
    </Card>
  );
}

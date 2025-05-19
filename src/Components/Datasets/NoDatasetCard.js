import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
const useStyles = {
  cardcolor: {
    background: "#FCFCFC",
    "box-shadow": "none",
    cursor: "pointer",
    height: "355px",
    "border-radius": "2px",
    width: "346px",
    "margin-left": "20px",
    "margin-top": "20px",
    "padding-top": "50px",
  },
  togglecardcolor: {
    "box-shadow": "0px 4px 20px rgba(216, 175, 40, 0.28)",
    border: "1px solid #ebd79c",
    cursor: "pointer",
    height: "355px",
    width: "346px",
    "margin-left": "20px",
    "margin-top": "20px",
    "padding-top": "50px",
  },
  cardtext: {
    color: "#A3B0B8",
    "font-family": "Open Sans",
    "font-style": "normal",
    "font-weight": 400,
    "font-size": "14px",
    "line-height": "19px",
    "text-align": "center",
    color: "#A3B0B8",
  },
  cardHeading: {
    "font-family": "Open Sans",
    "font-style": "normal",
    "font-weight": "400",
    "font-size": "14px",
    "line-height": "19px",
    "text-align": "center",
    color: "#3D4A52",
  },
};
export default function NoDatasetCard(props) {
  // const [isshowbutton, setisshowbutton] = React.useState(true);
  return (
    <Card style={useStyles.cardcolor}>
      <CardContent>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} style={{ "margin-top": "20px" }}>
            <img src={require("../../Assets/Img/no_datasets.svg")} alt="new" />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <span style={useStyles.cardtext}>{props.firstText}</span>
          </Col>
        </Row>
        {props.secondText ? (
          <>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <span style={useStyles.cardtext}>
                  __________________________________
                </span>
              </Col>
            </Row>
            <Row>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{
                  "margin-top": "20px",
                  padding: "0",
                  "padding-left": "35px",
                  "padding-right": "35px",
                }}
              >
                <span style={useStyles.cardtext}>{props.secondText}</span>
              </Col>
              {/*
          <Col xs={12} sm={12} md={12} lg={12}>
          <span style={useStyles.cardtext}>{props.thirdText}</span>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
          <span style={useStyles.cardtext}>{props.fourText}</span>
          </Col>
          */}
            </Row>
          </>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}

import React, { useState, useEffect } from "react";
import ParticipantsCards from "../../Components/Participants/ParticipantsCards";
import AddCard from "../../Components/AddCard/AddCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import labels from "../../Constants/labels";
import Button from "@mui/material/Button";
import THEME_COLORS from "../../Constants/ColorConstants";
import UrlConstants from "../../Constants/UrlConstants";
import { useHistory } from "react-router-dom";
import HTTPService from "../../Services/HTTPService";
import Loader from "../../Components/Loader/Loader";
import { GetErrorHandlingRoute } from "../../Utils/Common";
const useStyles = {
  btncolor: {
    color: "white",
    "text-transform": "capitalize",
    "border-color": THEME_COLORS.THEME_COLOR,
    "background-color": THEME_COLORS.THEME_COLOR,
    float: "right",
    "border-radius": 0,
    "padding-right": "0px",
    "padding-left": "0px",
    width: "200px",
    height: "34px",
    "font-family": "Open Sans",
    "font-style": "normal",
    "font-weight": 700,
    "font-size": "14px",
    "line-height": "19px",
    "margin-bottom": "-20px",
  },
  btn: {
    width: "420px",
    height: "42px",
    "margin-top": "30px",
    background: "#ffffff",
    opacity: "0.5",
    border: "2px solid #c09507",
    color: "black",
  },
  marginrowtop: {
    "padding-top": "50px",
    "margin-left": "70px",
    "margin-right": "70px",
    background: "#FCFCFC",
    "padding-left": "110px",
    "padding-right": "110px",
  },
  marginrowtop10px: { "margin-top": "20px" },
  invbtn: { "padding-right": "50px", "padding-left": "50px" },
};
function Participants(props) {
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const [participantList, setparticipantList] = useState([]);
  const [isShowLoadMoreButton, setisShowLoadMoreButton] = useState(false);
  const [participantUrl, setparticipantUrl] = useState("");
  const [isLoader, setIsLoader] = useState(false);

  const history = useHistory();
  useEffect(() => {
    setIsLoader(true);
    HTTPService(
      "GET",
      UrlConstants.base_url + UrlConstants.participant,
      "",
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("otp valid", response.data);
        if (response.data.next == null) {
          setisShowLoadMoreButton(false);
        } else {
          setisShowLoadMoreButton(true);
          setparticipantUrl(response.data.next);
        }
        setparticipantList(response.data.results);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  }, []);
  const getParticipantList = () => {
    setIsLoader(true);
    HTTPService("GET", participantUrl, "", false, true)
      .then((response) => {
        setIsLoader(false);
        console.log("otp valid", response.data);
        if (response.data.next == null) {
          setisShowLoadMoreButton(false);
        } else {
          setisShowLoadMoreButton(true);
          setparticipantUrl(response.data.next);
        }
        let datalist = participantList;
        let finalDataList = [...datalist, ...response.data.results];
        console.log(datalist);
        setparticipantList(finalDataList);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  return (
    <>
      {isLoader ? <Loader /> : ""}
      <div style={useStyles.marginrowtop}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Button
              onClick={() => history.push("/datahub/participants/invite")}
              style={useStyles.btncolor}>
              + Invite participants
            </Button>
          </Col>
        </Row>
        <Row style={useStyles.marginrowtop10px}>
          <Col xs={12} sm={6} md={4} lg={4} style={useStyles.marginrowtop10px}>
            <AddCard
              firstText={screenlabels.addparticipants.firstText}
              secondText={screenlabels.addparticipants.secondText}
              addevent={() =>
                history.push("/datahub/participants/add")
              }></AddCard>
          </Col>
          {participantList.map((rowData, index) => (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={4}
              style={useStyles.marginrowtop10px}>
              <ParticipantsCards
                dataset={rowData.dataset_count}
                connector={rowData.connector_count}
                active={rowData.user.status ? "Active" : "Inactive"}
                id={rowData.user_id}
                profilepic={rowData.organization.logo}
                firstname={rowData.user.first_name}
                mainheading={rowData.organization.name}
                subheading={
                  rowData.user.first_name + " " + rowData.user.last_name
                }
                index={index}></ParticipantsCards>
            </Col>
          ))}
        </Row>
        <Row style={{ "margin-top": "10px" }}>
          <Col xs={12} sm={12} md={6} lg={3}></Col>
          {isShowLoadMoreButton ? (
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() => getParticipantList()}
                variant="outlined"
                className="cancelbtn"
                style={{ "text-transform": "none" }}>
                Load more
              </Button>
            </Col>
          ) : (
            <></>
          )}
        </Row>
      </div>
    </>
  );
}
export default Participants;

import React, { useState, useMemo, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "@mui/material/Button";
import THEME_COLORS from "../../Constants/ColorConstants";
import { useHistory, useParams } from "react-router-dom";
import labels from "../../Constants/labels";
import { Container } from "react-bootstrap";
import { Nav } from "../Navbar/NavbarElements";
import "./../Navbar/Navbar.css";
import Navbar from "../Navbar/Navbar.js";
import ParticipantNavbar from "../Navbar/ParticipantNavbar";
import GuestUserNavbar from "../Navbar/GuestUserNavbar";
import LocalStorageConstants from "../../Constants/LocalStorageConstants";
import Footer from "../Footer/Footer";
import HTTPService from "../../Services/HTTPService";
import {
  flushLocalstorage,
  getErrorLocal,
  isLoggedInUserAdmin,
  isLoggedInUserParticipant,
  setErrorLocal,
} from "../../Utils/Common";
import axios from "axios";
import global_styles from "../../Assets/CSS/global.module.css";
import NavbarNew from "../Navbar/Navbar_New";
import error401 from "../../Assets/Img/Errors/401.svg";
import error403 from "../../Assets/Img/Errors/403.svg";
import error404 from "../../Assets/Img/Errors/404.svg";
import error500 from "../../Assets/Img/Errors/500.svg";
import { ButtonBase } from "@mui/material";
// import Select from 'react-select'
const useStyles = {
  btncolor: {
    color: THEME_COLORS.THEME_COLOR,
    "border-color": THEME_COLORS.THEME_COLOR,
    "border-radius": 0,
  },
  marginrowtop30: { "margin-top": "30px" },
  marginrowtop35: { "margin-top": "35px" },
  marginrowtop50: { "margin-top": "50px" },
  marginrowtop70: { "margin-top": "70px" },
  marginrowtop20: { "margin-top": "20px" },
  headingbold: { fontWeight: "bold" },
  headingcolorbold: { fontWeight: "bold", color: THEME_COLORS.THEME_COLOR },
};
export default function NewError(props) {
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  let { status } = useParams();
  const history = useHistory();
  useEffect(() => {
    //    flushLocalstorage();
    // setErrorLocal({})
    if (status == 401) {
      // flush local
      localStorage.clear();
    }
  }, []);

  return (
    <div
      classname="center_keeping_conatiner"
      style={{ width: "1440px", margin: "0 auto" }}
    >
      {/* {isLoggedInUserAdmin() ? <Navbar /> : (isLoggedInUserParticipant() ? <ParticipantNavbar /> :
                <GuestUserNavbar />)} */}

      {/* {isLoggedInUserAdmin() ? (
        <NavbarNew loginType={"admin"} />
      ) : isLoggedInUserParticipant() ? (
        <NavbarNew loginType={"participant"} />
      ) : (
        <GuestUserNavbar />
      )} */}
      {/*
            <Nav id="datahubnavbar" style={{border: 'none'}}>                
                <img
                src={require("../../Assets/Img/farmstack.jpg")}
                alt="new"
                style={{ width: "139.35px", height: "18.99px", "margin-top": "26px"}}
                />
            </Nav>) */}
      <Container className="minHeightWithoutFooter">
        <Row style={{ marginTop: "100px" }}>
          <Col lg={6} md={12} sm={12}>
            <div className={global_styles.size40 + " " + global_styles.bold600}>
              {status == 401
                ? "Session Timeout"
                : status == 403
                ? "Forbidden Access"
                : status == 404
                ? "404"
                : status >= 500
                ? "Internal Server Error"
                : ""}
            </div>
            <hr />
            <div
              style={{
                height: "250px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
              }}
            >
              {status == 401
                ? "This error occurs when a user attempts to access a resource that requires authentication or authorization, but fails to provide valid credentials, resulting in unauthorized access"
                : status == 403
                ? "This error occurs when a user is denied access to a resource, typically due to insufficient permissions, authentication credentials, or IP blocking, indicating that the server understands the request but refuses to authorize it."
                : status == 404
                ? "This error occurs when a client requests a resource from a server that cannot be found or does not exist, often due to a broken link, outdated URL, or incorrect website configuration."
                : status >= 500
                ? "Our highly skilled team of engineers is currently working on the issue, armed with nothing but coffee, pizza, and the eternal hope that they'll eventually figure out what went wrong."
                : ""}
            </div>
            <hr />
            <Button
              className={global_styles.primary_button}
              style={{ width: "300px" }}
              onClick={() =>
                history.push(
                  `${
                    status == 401
                      ? "/login"
                      : status == 403
                      ? "/datahub/participants"
                      : status == 404
                      ? ""
                      : status >= 500
                      ? "/datahub/participants"
                      : ""
                  }`
                )
              }
            >
              {status == 401
                ? "Login"
                : status == 403
                ? "Home"
                : status == 404
                ? "Home"
                : status >= 500
                ? "Home"
                : "Home"}
            </Button>
          </Col>
          <Col lg={6} md={12} sm={12}>
            <img
              src={
                status == 401
                  ? error401
                  : status == 403
                  ? error403
                  : status == 404
                  ? error404
                  : status >= 500
                  ? error500
                  : ""
              }
              alt={`${status}`}
            />
          </Col>
        </Row>
      </Container>
      {/* <Footer /> */}
    </div>
  );
}

// let response = await GetErrorHandlingRoute(err);
// if (response.toast) {
//   //callToast(message, type, action)

// This the way you need to pass
//   callToast(
//     response?.message ?? response?.data?.detail ?? "Unknown",
//     response.status == 200 ? "success" : "error",
//     response.toast
//   );
// } else {
//   history.push(response?.path);
// }

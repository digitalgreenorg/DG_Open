import contact from '../../Assets/Img/contact.svg';
import contact_bold from '../../Assets/Img/contact_bold.svg';
import legal from '../../Assets/Img/legal.svg';
import legal_bold from '../../Assets/Img/legal_bold.svg';
import call_icon from '../../Assets/Img/call_icon.png';
import account from '../../Assets/Img/account.svg';
import React, { useState, useEffect } from "react";
import { Nav, NavLink, NavMenu, NavBtn, NavBtnLink } from "./NavbarElements";
import labels from "../../Constants/labels";
import { useHistory } from "react-router-dom";
import HTTPService from "common/services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import "./Navbar.css";
import Loader from "../Loader/Loader";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Farmstack from "../../Assets/Img/farmstack.jpg";
import Toolbar from "@mui/material/Toolbar";

const GuestUserNavBar = (props) => {
  console.log("navguest")
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const [isLoader, setIsLoader] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isadminOnboarded, setIsadminOnboarded] = useState(false);

  useEffect(() => {
    HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.guest_organization_details,
      "",
      false,
      false
    )
      .then((response) => {
        console.log(response)
        setIsLoader(false);
        if (
          response.data.organization &&
          response.data.organization.phone_number
        ) {
          setPhoneNumber(response.data.organization.phone_number);
        }
        if(response?.data?.organization) {
          console.log(response?.data?.organization)
          setIsadminOnboarded(true)
        }

      })
      .catch((e) => {
        setIsLoader(false);
        console.log(e);
      });
  }, []);

  return (
    <>
      {isLoader ? <Loader /> : ""}

      {props.farmstacklogo ? (
        <Nav id="datahubnavbar">
          <>
            <Row>
              <Col xs={8} sm={8} md={8} lg={8} className="navbar_col">
                {/* <Bars /> */}
                <NavMenu>
                  <Toolbar>
                    <img
                      src={Farmstack}
                      alt="FarmStack"
                      style={{
                        "margin-left": "-9px",
                        "margin-top": "9px",
                      }}
                      className="image"
                    />
                  </Toolbar>
                  {/* </AppBar> */}
                </NavMenu>
              </Col>
            </Row>
            <Row>
              <Col xs={16} sm={16} className="navbar_col">
                <NavBtn>
                  <NavBtnLink to="/login">
                    <img  src={account} 
                      alt="new"
                    />
                    &nbsp;&nbsp;{screenlabels.navbar.Login}
                  </NavBtnLink>
                </NavBtn>
              </Col>
            </Row>
          </>
        </Nav>
      ) : (
        <>
          {" "}
          <Row>
            <Col xs={8} sm={8} md={8} lg={8} className="navbar_col">
              {/* <Bars /> */}
              {phoneNumber ? (
                <div>
                  <img className="image"
                     src={call_icon} 
                    alt="call"
                    style={{
                      width: "42px",
                      height: "42px",
                      margin: "9px 0 9px 50px",
                    }}
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="navtext fontweight400andfontsize16pxandcolor3D4A52">
                    Call:&nbsp;
                    <a style={{ color: "black" }} href={"tel: " + phoneNumber}>
                      {phoneNumber}
                    </a>
                    - to register your grievance
                  </span>
                </div>
              ) : (
                <></>
              )}
              <NavMenu>
                <NavLink to={"/legal"} activeStyle>
                  <img className="boldimage"
                     src={legal_bold} 
                    alt="new"
                  />
                  <img className="nonboldimage"
                     src={legal} 
                    alt="new"
                  />
                  &nbsp;&nbsp;{screenlabels.navbar.legal}
                </NavLink>
                <NavLink to={"/contact"} activeStyle>
                  <img className="boldimage"
                     src={contact_bold} 
                    alt="new"
                  />
                  <img className="nonboldimage"
                     src={contact} 
                    alt="new"
                  />
                  &nbsp;&nbsp;{screenlabels.navbar.contact}
                </NavLink>
              </NavMenu>
            </Col>
            {/* <NavBtn>
                <NavBtnLink to="/datahub/login">
                  <img  src={account}  alt="new" />
                  &nbsp;&nbsp;{screenlabels.navbar.SigninAsAdmin}
                </NavBtnLink>
              </NavBtn> */}

            {/* <NavBtn>
                <NavBtnLink to="/participant/login">
                  <img  src={account}  alt="new" />
                  &nbsp;&nbsp;{screenlabels.navbar.SigninAsParticipant}
                </NavBtnLink>
                
              </NavBtn> */}
            <Col xs={4} sm={4} md={4} lg={4} className="navbar_right_col">
              {isadminOnboarded ? 
              <>
              <NavBtn>
                <NavBtnLink to="/participantregistration">
                  <img  src={account} 
                    alt="new"
                  />
                  &nbsp;&nbsp;{"Register"}
                </NavBtnLink>
              </NavBtn>
              </> : "" }
              <NavBtn> 
                <NavBtnLink to="/login">
                  <img  src={account} 
                    alt="new"
                  />
                  &nbsp;&nbsp;{screenlabels.navbar.Login}
                </NavBtnLink>
              </NavBtn>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default GuestUserNavBar;

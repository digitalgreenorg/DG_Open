import account from '../../Assets/Img/account.svg';
import settings from '../../Assets/Img/settings.svg';
import bold_settings from '../../Assets/Img/bold_settings.svg';
import support from '../../Assets/Img/support.svg';
import support_bold from '../../Assets/Img/support_bold.svg';
import connector_non_bold from '../../Assets/Img/connector_non_bold.svg';
import connectors from '../../Assets/Img/connectors.svg';
import datasets from '../../Assets/Img/datasets.svg';
import dataset_bold from '../../Assets/Img/dataset_bold.svg';
import participants from '../../Assets/Img/participants.svg';
import bold_participants from '../../Assets/Img/bold_participants.svg';
import lightdashboard from '../../Assets/Img/lightdashboard.svg';
import bolddashboard from '../../Assets/Img/bolddashboard.svg';
import React, { useState, useEffect } from "react";
import { Nav, NavLink, NavMenu, NavBtn, NavBtnLink } from "./NavbarElements";
import labels from "../../Constants/labels";
import { useHistory } from "react-router-dom";
import HTTPService from "common/services/HTTPService";
import {
  flushLocalstorage,
  getUserLocal,
  isLoggedInUserCoSteward,
} from "common/utils/utils";
import UrlConstant from "../../Constants/UrlConstants";
import Avatar from "@mui/material/Avatar";
import "./Navbar.css";
import Button from "@mui/material/Button";
import Loader from "../Loader/Loader";
import farmstackLogo from "../../Assets/Img/farmstack.jpg";
const Navbar = (props) => {
  const [profile, setprofile] = useState(null);
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const [isLoader, setIsLoader] = useState(false);

  let history = useHistory();

  const getAccountDetails = async () => {
    var id = getUserLocal();
    console.log("user id", id);
    setIsLoader(true);
    await HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.profile + id + "/",
      "",
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log(
          "get request for account settings in navbar",
          response.data
        );
        console.log("picture", response.data.profile_picture);
        setprofile(response.data.profile_picture);
        // setphonenumber(response.data.phone_number);
        // setfirstname(response.data.first_name);
        // setlastname(response.data.last_name);
        // setemail(response.data.email);
        // setFile(response.data.profile_picture);
      })
      .catch((e) => {
        setIsLoader(false);
        console.log(e);
        //history.push(GetErrorHandlingRoute(e));
      });
  };

  useEffect(() => {
    getAccountDetails();
  }, [profile]);

  const handleLogout = (e) => {
    e.preventDefault();
    flushLocalstorage();
    /*
    localStorage.removeItem(LocalStorageConstants.KEYS.JWTToken);
    localStorage.removeItem(LocalStorageConstants.KEYS.user);
    */
    history.push("/login");
  };
  return (
    <>
      {isLoader ? <Loader /> : ""}
      <Nav id="datahubnavbar">
        {/* <Bars /> */}
        <img
          src={farmstackLogo}
          alt="farmstack"
          style={{ width: "139.35px", height: "18.99px", "margin-top": "26px" }}
        />
        <NavMenu>
          <NavLink to="/datahub/dashboard" activeStyle>
            <img className="boldimage"
               src={bolddashboard} 
              alt="new"
            />
            <img className="nonboldimage"
               src={lightdashboard} 
              alt="new"
            />
            &nbsp;&nbsp;{screenlabels.navbar.Dashboard}
          </NavLink>
          <NavLink to="/datahub/participants" activeStyle>
            <img className="boldimage"
               src={bold_participants} 
              alt="new"
            />
            <img className="nonboldimage"
               src={participants} 
              alt="new"
            />
            &nbsp;&nbsp;{screenlabels.navbar.Participants}
          </NavLink>
          <NavLink to="/datahub/datasets" activeStyle>
            <img className="boldimage"
               src={dataset_bold} 
              alt="new"
            />
            <img className="nonboldimage"
               src={datasets} 
              alt="new"
            />
            &nbsp;&nbsp;{screenlabels.navbar.datasets}
          </NavLink>
          <NavLink to="/datahub/connectors" activeStyle>
            <img className="boldimage"
               src={connectors} 
              alt="new"
            />
            <img className="nonboldimage"
               src={connector_non_bold} 
              alt="new"
            />
            &nbsp;&nbsp;{screenlabels.navbar.connectors}
          </NavLink>
          {/* <NavLink to="/datahub/connectors" activeStyle>
            <img className="boldimage"
               src={connectors} 
              alt="new"
            />
            <img className="nonboldimage"
               src={connector_non_bold} 
              alt="new"
            />
            &nbsp;&nbsp;{screenlabels.navbar.connectors}
          </NavLink> */}
          {!isLoggedInUserCoSteward() ? (
            <NavLink to="/datahub/support" activeStyle>
              <img className="boldimage"
                 src={support_bold} 
                alt="new"
              />
              <img className="nonboldimage"
                 src={support} 
                alt="new"
              />
              &nbsp;&nbsp;{screenlabels.navbar.Support}
            </NavLink>
          ) : (
            <></>
          )}
          <NavLink
            to="/datahub/settings"
            activeStyle
            onClick={(e) => {
              e.preventDefault();
              history.push("/datahub/settings/1");
            }}
          >
            <img className="boldimage"
               src={bold_settings} 
              alt="new"
            />
            <img className="nonboldimage"
               src={settings} 
              alt="new"
            />
            &nbsp;&nbsp;{screenlabels.navbar.Settings}
          </NavLink>
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        {profile ? (
          <NavBtn onClick={handleLogout}>
            <Button
              variant="outlined"
              // color="secondary"
              className="signoutbtn-navbar"
              startIcon={<Avatar src={profile} />}
            >
              {screenlabels.navbar.Signout}
            </Button>
            {/* <NavBtnLink to="/signin" className="signoutbtn-navbar">
              <Avatar
                alt="profile img"
                src={profile}
                // sx={{ width: 10, height: 10 }}
              />
              &nbsp;&nbsp;{screenlabels.navbar.Signout}
            </NavBtnLink> */}
          </NavBtn>
        ) : (
          <NavBtn onClick={handleLogout}>
            <NavBtnLink to="/signin">
              <img  src={account}  alt="new" />
              &nbsp;&nbsp;{screenlabels.navbar.Signout}
            </NavBtnLink>
          </NavBtn>
        )}
      </Nav>
    </>
  );
};

export default Navbar;

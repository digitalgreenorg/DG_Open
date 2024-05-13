import account from '../../Assets/Img/account.svg';
import settings from '../../Assets/Img/settings.svg';
import connector_non_bold from '../../Assets/Img/connector_non_bold.svg';
import connectors from '../../Assets/Img/connectors.svg';
import datasets from '../../Assets/Img/datasets.svg';
import dataset_bold from '../../Assets/Img/dataset_bold.svg';
import farmstack from '../../Assets/Img/farmstack.jpg';
import React, { useState, useEffect } from "react";
import { Nav, NavLink, NavMenu, NavBtn, NavBtnLink } from "./NavbarElements";
import labels from "../../Constants/labels";
import { useHistory } from "react-router-dom";
import HTTPService from "common/services/HTTPService";
import { flushLocalstorage, getUserLocal } from "common/utils/utils";
import UrlConstant from "../../Constants/UrlConstants";
import Avatar from "@mui/material/Avatar";
import "./Navbar.css";
import Button from "@mui/material/Button";
import Loader from "../Loader/Loader";

const ParticipantNavbar = (props) => {
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
    /*
    localStorage.removeItem(LocalStorageConstants.KEYS.JWTToken);
    localStorage.removeItem(LocalStorageConstants.KEYS.user);
    */
    flushLocalstorage();
    history.push("/login");
  };
  return (
    <>
      {isLoader ? <Loader /> : ""}
      <Nav id="datahubnavbar">
        {/* <Bars /> */}
        <img  src={farmstack} 
          alt="new"
          style={{ width: "139.35px", height: "18.99px", "margin-top": "26px" }}
        />
        <NavMenu>
          <NavLink to="/participant/datasets" activeStyle>
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
          <NavLink to="/participant/connectors" activeStyle>
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
          {/* <NavLink to="/participant/connectors/list" activeStyle>
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
          <NavLink
            to="/participant/settings"
            activeStyle
            onClick={(e) => {
              e.preventDefault();
              history.push("/participant/settings/1");
            }}
          >
            <img className="boldimage"
               src={settings} 
              alt="new"
            />
            <img className="nonboldimage"
               src={settings} 
              alt="new"
            />
            &nbsp;&nbsp;{screenlabels.navbar.Settings}
          </NavLink>
        </NavMenu>
        {profile ? (
          <NavBtn onClick={handleLogout}>
            <Button
              variant="outlined"
              className="signoutbtn-navbar"
              startIcon={<Avatar src={profile} />}
            >
              {screenlabels.navbar.Signout}
            </Button>
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

export default ParticipantNavbar;

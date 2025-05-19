import React, { useState, useEffect } from "react";
import { Box, Button, Divider, useTheme } from "@mui/material";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import UrlConstant from "../../Constants/UrlConstants";
import moa_kenya_logo from "../../Assets/Img/Farmstack V2.0/moa_kenya_logo.jpg";
import vistaar from "../../Assets/Img/vistaar.svg";
import digitalgreen_logo from "../../Assets/Img/Farmstack V2.0/digitalgreen_logo.jpeg";
import aiep_logo from "../../Assets/Img/AIEP_logo.svg"
import { CiLogout } from "react-icons/ci";

import { PiSignIn } from "react-icons/pi";

import {
  flushLocalstorage,
  getUserLocal,
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserParticipant,
  isLoggedInUserCoSteward,
  getRoleLocal,
  toTitleCase,
} from "../../Utils/Common";
import style from "./Navbar_New.module.css";
import globalStyle from "../../Assets/CSS/global.module.css";
import PopoverNavbar from "./PopoverNavbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import KalroSpecificNavbar from "./KalroSpecificNavbar";
import { Affix, Typography } from "antd";
import labels from "../../Constants/labels";

const navActiveStyle = {
  fontFamily: "Montserrat",
  fontWeight: "600",
  fontSize: "14px",
  lineHeight: "18px",
  // color: "#00A94F",
  marginRight: "20px",
  textDecoration: "none",
  color: "#00a94f",
  // textDecoration: "underline",
  background: "white",
  height: "70%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0px 20px",
  borderRadius: "10px",
};

const navInActiveStyle = {
  fontFamily: "Montserrat",
  fontWeight: "600",
  fontSize: "14px",
  lineHeight: "18px",
  color: "#212B36",
  marginRight: "20px",
  textDecoration: "none",
  padding: "0px 20px",
  borderRadius: "10px",
};
const NavbarNew = ({ loginType, isOnboard }) => {
  console.log(
    "🚀 ~ file: Navbar_New.jsx:55 ~ NavbarNew ~ loginType:",
    loginType
  );
  const { adminData } = React.useContext(FarmStackContext);

  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));

  const containerStyle = {
    marginLeft: mobile || tablet ? "30px" : miniLaptop ? "50px" : "144px",
    marginRight: mobile || tablet ? "30px" : miniLaptop ? "50px" : "144px",
  };

  const isActive = (path) => location.pathname === path;

  const [isSelected, setIsSelected] = useState("");

  const isNavLinkActive = (path) => {
    return location.pathname === path ? true : false;
  };

  const isNavLinkActiveForDot = (itemName) => {
    if (itemName === "datasets") {
      if (loginType === "admin") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/datahub/new_datasets" ||
          location.pathname === "/home/datasets" ||
          location.pathname === "/datahub/new_datasets/view/" + tempId ||
          location.pathname === "/home/datasets/" + tempId ||
          location.pathname === "/datahub/new_datasets/edit/" + tempId ||
          location.pathname === "/datahub/new_datasets/add" ||
          location.pathname === "/datahub/dashboard-api-request/" + tempId
          ? true
          : false;
      }
      if (loginType === "participant") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/participant/new_datasets" ||
          location.pathname === "/home/datasets" ||
          location.pathname === "/participant/new_datasets/view/" + tempId ||
          location.pathname === "/home/datasets/" + tempId ||
          location.pathname === "/participant/new_datasets/edit/" + tempId ||
          location.pathname === "/participant/dashboard-api-request/" + tempId
          ? true
          : false;
      }
      if (loginType === "guest") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/home/datasets" ||
          location.pathname === "/home/datasets/" + tempId
          ? true
          : false;
      }
    }
    if (itemName === "participants") {
      if (loginType === "admin") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/datahub/participants" ||
          location.pathname === "/home/participants" ||
          location.pathname === "/home/participants/view/" + tempId ||
          location.pathname === "/datahub/participants/view/" + tempId ||
          location.pathname === "/datahub/participants/edit/" + tempId ||
          location.pathname === "/datahub/participants/view/approve/" + tempId
          ? true
          : false;
      }
      if (loginType === "participant") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/datahub/participants" ||
          location.pathname === "/home/participants" ||
          location.pathname === "/home/participants/view/" + tempId ||
          location.pathname === "/datahub/participants/view/" + tempId ||
          location.pathname === "/datahub/participants/edit/" + tempId ||
          location.pathname === "/datahub/participants/view/approve/" + tempId
          ? true
          : false;
      }
      if (loginType === "guest") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/home/participants" ||
          location.pathname === "/home/participants/view/" + tempId ||
          location.pathname === "/home/participants/" + tempId
          ? true
          : false;
      }
    }
    if (itemName === "connectors") {
      if (loginType === "admin") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/datahub/connectors" ||
          location.pathname === "/datahub/connectors/edit/" + tempId ||
          location.pathname === "/home/connectors" ||
          location.pathname === "/home/connectors/view/" + tempId
          ? true
          : false;
      }
      if (loginType === "participant") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/participant/connectors" ||
          location.pathname === "/participant/connectors/edit/" + tempId
          ? true
          : false;
      }
      if (loginType === "guest") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/home/connectors" ||
          location.pathname === "/home/connectors/view/" + tempId
          ? true
          : false;
      }
    }
    if (itemName === "resources") {
      if (loginType === "admin") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/datahub/resources" ||
          location.pathname === "/home/resources" ||
          location.pathname === "/datahub/resources/view/" + tempId ||
          location.pathname === "/home/resources/view/" + tempId ||
          location.pathname === "/datahub/resources/edit/" + tempId ||
          location.pathname === "/datahub/resources/add"
          ? true
          : false;
      }
      if (loginType === "participant") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/participant/resources" ||
          // location.pathname === "/home/datasets" ||
          location.pathname === "/participant/resources/view/" + tempId ||
          // location.pathname === "/home/datasets/" + tempId ||
          location.pathname === "/participant/resources/edit/" + tempId
          ? true
          : false;
      }
      console.log("loginType", loginType);
      if (loginType === "guest") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/home/resources" ||
          location.pathname === "/home/resources/view/" + tempId
          ? true
          : false;
      }
    }
  };

  const isNavLinkActiveForCostewardDot = (itemName) => {
    if (itemName === "costeward" && loginType !== "guest") {
      let tempId = location.pathname.slice(
        location.pathname.lastIndexOf("/") + 1
      );
      return location.pathname === "/datahub/costeward/view/" + tempId ||
        location.pathname === "/home/costeward" ||
        location.pathname === "/home/costeward/view/" + tempId ||
        location.pathname === "/datahub/costeward/edit/" + tempId
        ? true
        : false;
    }
    if (itemName === "costeward" && loginType === "guest") {
      let tempId = location.pathname.slice(
        location.pathname.lastIndexOf("/") + 1
      );
      return location.pathname === "/home/costeward/view/" + tempId ||
        location.pathname === "/home/costeward"
        ? true
        : false;
    }
  };

  const isNavLinkActiveForHome = (itemName) => {
    if (itemName === "datasets") {
      if (loginType === "admin") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/home/datasets" ||
          location.pathname === "/home/datasets/" + tempId ||
          location.pathname === "/datahub/dashboard-api-request/" + tempId
          ? true
          : false;
      }
      if (loginType === "participant") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/home/datasets" ||
          location.pathname === "/home/datasets/" + tempId ||
          location.pathname === "/participant/dashboard-api-request/" + tempId
          ? true
          : false;
      }
      if (loginType === "guest") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/home/datasets" ||
          location.pathname === "/home/datasets/" + tempId
          ? true
          : false;
      }
    }
    if (itemName === "connectors") {
      if (loginType === "admin") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/home/connectors" ||
          location.pathname === "/home/connectors/view/" + tempId
          ? true
          : false;
      }
      if (loginType === "participant") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/home/connectors" ||
          location.pathname === "/home/connectors/view/" + tempId
          ? true
          : false;
      }
      if (loginType === "guest") {
        let tempId = location.pathname.slice(
          location.pathname.lastIndexOf("/") + 1
        );
        return location.pathname === "/home/connectors" ||
          location.pathname === "/home/connectors/view" + tempId
          ? true
          : false;
      }
    }
  };

  const handleParticipantLogout = (e) => {
    e.preventDefault();
    flushLocalstorage();
    history.push("/login");
  };

  const handleDatahubLogout = (e) => {
    e.preventDefault();
    flushLocalstorage();
    history.push("/login");
  };

  const handleSignOut = (e) => {
    if (
      (getTokenLocal() && isLoggedInUserAdmin()) ||
      isLoggedInUserCoSteward()
    ) {
      handleDatahubLogout(e);
    } else if (getTokenLocal() && isLoggedInUserParticipant()) {
      handleParticipantLogout(e);
    }
  };
  const handleSelect = (item) => {
    console.log(
      "user role on click of login is admin",
      getRoleLocal() === "datahub_admin"
    );
    setIsSelected(item);
  };

  // FIX: To be removed in upcoming changes
  const isResourceActive = (itemName) => {
    if (itemName === "resources") {
      let tempId = location.pathname.slice(
        location.pathname.lastIndexOf("/") + 1
      );
      return location.pathname === "/home/resources/view/" + tempId;
    }
  };
  if (isOnboard) {
    return (
      <Box
        sx={{
          width: "100%",
          borderBottom: "1px solid #EEE",
          background: "#FFFFFF",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
          }}
        >
          {/* Logo Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={aiep_logo}
              alt="Digital Green"
              height="40px"
              style={{ cursor: "pointer" }}
              onClick={() => history.push("/home")}
            />

            <Typography
              className={`${style.new_navItem} ${
                isActive("/home") || isActive("/") ? style.active_navItem : ""
              }`}
              onClick={() => history.push("/home")}
            >
              Home
            </Typography>
          </Box>
          <Button
            id="add-dataset-submit-btn"
            sx={{
              fontFamily: "Montserrat",
              fontWeight: 700,
              fontSize: "16px",
              width: "fit-content",
              height: "40px",
              background: "#00A94F",
              borderRadius: "8px",
              border: "1px solid #00A94F",
              textTransform: "none",
              // marginLeft: "50px",
              "&:hover": {
                backgroundColor: "#00A94F",
                color: "white",
              },
              color: "white",
            }}
            variant="contained"
            onClick={(e) =>
              getUserLocal() && loginType !== "guest"
                ? handleSignOut(e)
                : history.push("/home/register")
            }
          >
            {getUserLocal() && loginType !== "guest" ? (
              <div>
                {/* <CiLogout /> */}
                <div>Sign out</div>
              </div>
            ) : (
              "Register"
            )}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ width: "100vw" }} className={style.sticky}>
        {mobile || tablet ? (
          <PopoverNavbar
            history={history}
            loginType={loginType}
            isNavLinkActive={isNavLinkActive}
            style={style}
            imgUrl={
              UrlConstant.base_url_without_slash + adminData?.organization?.logo
            }
            isNavLinkActiveForDot={isNavLinkActiveForDot}
            isNavLinkActiveForCostewardDot={isNavLinkActiveForCostewardDot}
            isNavLinkActiveForHome={isNavLinkActiveForHome}
            handleSelect={handleSelect}
            handleSignOut={handleSignOut}
          />
        ) : (
          // <div style={{ display: "flex", flexDirection: "column" }}>
          //   {/* <KalroSpecificNavbar
          //     orgLogo={adminData?.organization?.logo}
          //     showBanner={true}
          //     mobile={mobile}
          //   /> */}
          //   <Affix offsetTop={0}>
          //     <Box
          //       className={`d-flex justify-content-between ${style.navbarContainerForHome} ${globalStyle.white_background}`}
          //     >
          //       <Box
          //         className="d-flex justify-content-between w-100"
          //         sx={containerStyle}
          //       >
          //         {/* <Box className="d-flex align-items-center"></Box> */}

          //         <Box className="d-flex align-items-center justify-content-left">
          //           <Box>
          //            <img
          //               // src={require("../../Assets/Img/footer_logo.svg")}
          //               style={{
          //                 // width: "129px",
          //                 maxHeight: "60px",
          //                 height: "auto",
          //                 marginRight: "30px",
          //               }}
          //               src={vistaar_logo}
          //               alt="HeaderLogo"
          //             />
          //           </Box>
          //           <NavLink
          //             className={style.navbar_each_link}
          //             data-testId="navbar-home-button"
          //             id="navbar-home"
          //             activeStyle={
          //               isNavLinkActive("/home")
          //                 ? navActiveStyle
          //                 : navInActiveStyle
          //             }
          //             style={
          //               isNavLinkActive("/home")
          //                 ? navActiveStyle
          //                 : navInActiveStyle
          //             }
          //             to="/home"
          //             onClick={() => handleSelect("home")}
          //           >
          //             {/* {isNavLinkActive("/home") ? (
          //               <img
          //                 className={style.dotStyle}
          //                 src={require("../../Assets/Img/green_dot.svg")}
          //                 alt="dot"
          //               />
          //             ) : (
          //               <></>
          //             )} */}
          //             Home
          //           </NavLink>
          //           {/* dashboard */}
          //           {loginType === "admin" ? (
          //             // <NavLink
          //             //   className={style.navbar_each_link}
          //             //   data-testId="navbar-dashboard-button"
          //             //   id="navbar-new_dashboard"
          //             //   activeStyle={
          //             //     isNavLinkActive("/datahub/new_dashboard")
          //             //       ? navActiveStyle
          //             //       : navInActiveStyle
          //             //   }
          //             //   style={
          //             //     isNavLinkActive("/datahub/new_dashboard")
          //             //       ? navActiveStyle
          //             //       : navInActiveStyle
          //             //   }
          //             //   to="/datahub/new_dashboard"
          //             //   onClick={() => handleSelect("new_dashboard")}
          //             // >
          //             //   {/* {isNavLinkActive("/datahub/new_dashboard") ? (
          //             //     <img
          //             //       className={style.dotStyle}
          //             //       src={require("../../Assets/Img/green_dot.svg")}
          //             //       alt="dot"
          //             //     />
          //             //   ) : (
          //             //     <></>
          //             //   )} */}
          //             //   Dashboard
          //             // </NavLink>
          //             <></>
          //           ) : loginType === "participant" ? (
          //             // <NavLink
          //             //   className={style.navbar_each_link}
          //             //   data-testId="navbar-dashboard-part-button"
          //             //   id="navbar-new_dashboard"
          //             //   activeStyle={
          //             //     isNavLinkActive("/participant/new_dashboard")
          //             //       ? navActiveStyle
          //             //       : navInActiveStyle
          //             //   }
          //             //   style={
          //             //     isNavLinkActive("/participant/new_dashboard")
          //             //       ? navActiveStyle
          //             //       : navInActiveStyle
          //             //   }
          //             //   to="/participant/new_dashboard"
          //             //   onClick={() => handleSelect("new_dashboard")}
          //             // >
          //             //   {/* {isNavLinkActive("/participant/new_dashboard") ? (
          //             //     <img
          //             //       className={style.dotStyle}
          //             //       src={require("../../Assets/Img/green_dot.svg")}
          //             //       alt="dot"
          //             //     />
          //             //   ) : (
          //             //     <></>
          //             //   )} */}
          //             //   Dashboard
          //             // </NavLink>
          //             <></>
          //           ) : (
          //             ""
          //           )}

          //           {loginType === "admin" ||
          //           loginType === "participant" ||
          //           loginType === "guest" ? (
          //             <NavLink
          //               className={style.navbar_each_link}
          //               data-testId="navbar-datasets-button"
          //               id="navbar-dataset"
          //               activeStyle={navActiveStyle}
          //               style={
          //                 isNavLinkActiveForHome("datasets")
          //                   ? navActiveStyle
          //                   : navInActiveStyle
          //               }
          //               to={
          //                 loginType === "admin"
          //                   ? "/datahub/new_datasets"
          //                   : loginType === "participant"
          //                   ? "/participant/new_datasets"
          //                   : loginType === "guest"
          //                   ? "/home/datasets"
          //                   : "/"
          //               }
          //               onClick={() => handleSelect("datasets")}
          //             >
          //               {/* {isNavLinkActiveForDot("datasets") ? (
          //                 <img
          //                   className={style.dotStyle}
          //                   src={require("../../Assets/Img/green_dot.svg")}
          //                   alt="dot"
          //                 />
          //               ) : (
          //                 <></>
          //               )} */}
          //               FLEW Registry
          //             </NavLink>
          //           ) : (
          //             <></>
          //           )}

          //           {(loginType === "admin" || loginType === "guest") &&
          //           !isLoggedInUserParticipant() ? (
          //             <NavLink
          //               className={style.navbar_each_link}
          //               data-testId="navbar-participants-button"
          //               id="navbar-participants"
          //               activeStyle={navActiveStyle}
          //               style={
          //                 isNavLinkActiveForCostewardDot("costeward") ||
          //                 isNavLinkActiveForDot("participants")
          //                   ? navActiveStyle
          //                   : navInActiveStyle
          //               }
          //               to={
          //                 loginType === "admin"
          //                   ? "/datahub/participants"
          //                   : loginType === "guest"
          //                   ? "/home/participants"
          //                   : ""
          //               }
          //               onClick={() => handleSelect("participants")}
          //             >
          //               {/* {isNavLinkActiveForDot("participants") ||
          //               isNavLinkActiveForCostewardDot("costeward") ? (
          //                 <img
          //                   className={style.dotStyle}
          //                   src={require("../../Assets/Img/green_dot.svg")}
          //                   alt="dot"
          //                 />
          //               ) : (
          //                 <></>
          //               )} */}
          //               Partners
          //             </NavLink>
          //           ) : (
          //             <></>
          //           )}

          //           <NavLink
          //             className={style.navbar_each_link}
          //             activeStyle={navActiveStyle}
          //             style={
          //               isResourceActive("resources")
          //                 ? navActiveStyle
          //                 : navInActiveStyle
          //             }
          //             to={
          //               loginType === "admin"
          //                 ? "/datahub/resources"
          //                 : loginType === "participant"
          //                 ? "/participant/resources"
          //                 : loginType === "guest"
          //                 ? "/home/resources"
          //                 : "/"
          //             }
          //             onClick={() => handleSelect("resources")}
          //           >
          //             {/* {isNavLinkActiveForDot("resources") ? (
          //               <img
          //                 className={style.dotStyle}
          //                 src={require("../../Assets/Img/green_dot.svg")}
          //                 alt="dot"
          //               />
          //             ) : (
          //               <></>
          //             )} */}
          //             {toTitleCase(labels.renaming_modules.resources)}
          //           </NavLink>
          //           {
          //             <NavLink
          //               className={style.navbar_each_link}
          //               activeStyle={navActiveStyle}
          //               style={navInActiveStyle}
          //               to={
          //                 loginType === "guest"
          //                   ? "/home/dashboard"
          //                   : loginType === "admin"
          //                   ? "/datahub/bot_dashboard"
          //                   : loginType === "participant"
          //                   ? "/participant/bot_dashboard"
          //                   : "/"
          //               }
          //               onClick={() => handleSelect("dashboard")}
          //             >
          //               {/* {isNavLinkActiveForDot("resources") ? (
          //               <img
          //                 className={style.dotStyle}
          //                 src={require("../../Assets/Img/green_dot.svg")}
          //                 alt="dot"
          //               />
          //             ) : (
          //               <></>
          //             )} */}
          //               {toTitleCase(labels.renaming_modules.dashboard)}
          //             </NavLink>
          //           }

          //           {loginType === "admin" ||
          //           loginType === "participant" ||
          //           loginType === "guest" ? (
          //             // <NavLink
          //             //   className={style.navbar_each_link}
          //             //   data-testId="navbar-connectors-button"
          //             //   id="navbar-connectors"
          //             //   activeStyle={navActiveStyle}
          //             //   style={
          //             //     isNavLinkActiveForHome("connectors")
          //             //       ? navActiveStyle
          //             //       : navInActiveStyle
          //             //   }
          //             //   to={
          //             //     loginType === "admin"
          //             //       ? "/datahub/connectors"
          //             //       : loginType === "participant"
          //             //       ? "/participant/connectors"
          //             //       : loginType === "guest"
          //             //       ? "/home/connectors"
          //             //       : "/"
          //             //   }
          //             //   onClick={() => handleSelect("connectors")}
          //             // >
          //             //   {/* {isNavLinkActiveForDot("connectors") ? (
          //             //     <img
          //             //       className={style.dotStyle}
          //             //       src={require("../../Assets/Img/green_dot.svg")}
          //             //       alt="dot"
          //             //     />
          //             //   ) : (
          //             //     <></>
          //             //   )} */}
          //             //   Use cases
          //             // </NavLink>
          //             <></>
          //           ) : (
          //             <></>
          //           )}
          //           {loginType === "admin" || loginType === "participant" ? (
          //             <NavLink
          //               className={style.navbar_each_link}
          //               data-testId="navbar-settings-button"
          //               id="navbar-settings"
          //               activeStyle={navActiveStyle}
          //               style={navInActiveStyle}
          //               to={
          //                 loginType === "admin"
          //                   ? "/datahub/feedbacks"
          //                   : loginType === "participant"
          //                   ? "/participant/feedbacks"
          //                   : ""
          //               }
          //               onClick={() => handleSelect("feedbacks")}
          //             >
          //               {labels?.en?.navbar?.feedbacks}
          //             </NavLink>
          //           ) : (
          //             <></>
          //           )}
          //           {loginType === "admin" || loginType === "participant" ? (
          //             <NavLink
          //               className={style.navbar_each_link}
          //               data-testId="navbar-settings-button"
          //               id="navbar-settings"
          //               activeStyle={navActiveStyle}
          //               style={navInActiveStyle}
          //               to={
          //                 loginType === "admin"
          //                   ? "/datahub/settings/1"
          //                   : loginType === "participant"
          //                   ? "/participant/settings/1"
          //                   : ""
          //               }
          //               onClick={() => handleSelect("settings")}
          //             >
          //               {/* {isNavLinkActive(
          //                 loginType === "admin"
          //                   ? "/datahub/settings/1"
          //                   : loginType === "participant"
          //                   ? "/participant/settings/1"
          //                   : ""
          //               ) ? (
          //                 <img
          //                   className={style.dotStyle}
          //                   src={require("../../Assets/Img/green_dot.svg")}
          //                   alt="dot"
          //                 />
          //               ) : (
          //                 <></>
          //               )} */}
          //               Settings
          //             </NavLink>
          //           ) : (
          //             <></>
          //           )}
          //           {/* {getUserLocal() && loginType !== "guest" ? (
          //             <></>
          //           ) : (
          //             <NavLink
          //               data-testId="navbar-login-button"
          //               id="navbar-login"
          //               to={"/login"}
          //               activeStyle={navActiveStyle}
          //               style={navInActiveStyle}
          //               onClick={() => handleSelect("login")}
          //             >
          //               Login
          //             </NavLink>
          //           )} */}
          //         </Box>
          //         <Box className="d-flex align-items-center">
          //           {getUserLocal() && loginType !== "guest" ? (
          //             <></>
          //           ) : (
          //             <NavLink
          //               data-testId="navbar-login-button"
          //               id="navbar-login"
          //               to={"/login"}
          //               activeStyle={navActiveStyle}
          //               style={navInActiveStyle}
          //               onClick={() => handleSelect("login")}
          //             >
          //               {/* {isNavLinkActive("/login") ? (
          //                 <img
          //                   className={style.dotStyle}
          //                   src={require("../../Assets/Img/green_dot.svg")}
          //                   alt="dot"
          //                 />
          //               ) : (
          //                 <></>
          //               )} */}
          //               Login
          //             </NavLink>
          //           )}

          //           {getUserLocal() && loginType !== "guest" ? (
          //             <Button
          //               data-testId="navbar-signout-button"
          //               id="navbar-signout"
          //               sx={{
          //                 fontFamily: "Arial !important",
          //                 fontWeight: "700 !important",
          //                 fontSize: "14px !important",
          //                 width: "94px !important",
          //                 height: "34px !important",
          //                 background: "white !important",
          //                 borderRadius: "8px !important",
          //                 textTransform: "none !important",
          //                 color: "#00A94F !important",
          //                 "&:hover": {
          //                   // backgroundColor: "#fffff !important",
          //                   backgroundColor: "#00A94F !important",
          //                   // color: "#00A94F !important",
          //                   color: "white !important",
          //                   border: "1px solid white !important",
          //                 },
          //               }}
          //               onClick={(e) => handleSignOut(e)}
          //             >
          //               Signout
          //             </Button>
          //           ) : (
          //             <Button
          //               data-testId="navbar-register-button"
          //               id="navbar-register"
          //               sx={{
          //                 fontFamily: "Arial !important",
          //                 fontWeight: 700,
          //                 fontSize: "14px",
          //                 width: "94px",
          //                 height: "34px",
          //                 background: "white",
          //                 borderRadius: "8px",
          //                 textTransform: "none",
          //                 color: "#00A94F",
          //                 "&:hover": {
          //                   backgroundColor: "#00A94F",
          //                   color: "white",
          //                   border: "1px solid white !important",
          //                 },
          //               }}
          //               onClick={() => history.push("/home/register")}
          //             >
          //               Register
          //             </Button>
          //           )}
          //         </Box>
          //       </Box>
          //     </Box>
          //   </Affix>
          // </div>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                height: "90px",
                padding: "0px 25px 0px 25px",
              }}
              className="hidden"
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  width: "73%",
                }}
                // className="hidden"
              >
                <Box className="mr10 hidden" style={{ background: "white" }}>
                  <img
                    src={require("../../Assets/Img/goi.svg")}
                    alt="govt of India"
                    width={"100%"}
                  />
                </Box>
                <Box className="mr10 hidden">
                  <Divider
                    sx={{
                      background: "#E1D0D0",
                      height: "100%",
                    }}
                    flexItem
                    orientation="vertical"
                  />
                </Box>
                <Box className="mr10 hidden">
                  <img
                    src={require("../../Assets/Img/icar.svg")}
                    alt="icar"
                    width={"100%"}
                  />
                </Box>
                <Box className="mr10 hidden">
                  <Divider
                    sx={{
                      background: "#E1D0D0",
                      height: "100%",
                    }}
                    flexItem
                    orientation="vertical"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "10px",
                  }}
                  className="hidden"
                >
                  <img
                    src={require("../../Assets/Img/vistaar_new_logo.svg")}
                    alt="HeaderLogo"
                    width={"100%"}
                  />
                </Box>
                <Box className="mr10 hidden">
                  <Divider
                    sx={{
                      background: "#E1D0D0",
                      height: "100%",
                    }}
                    flexItem
                    orientation="vertical"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "10px",
                  }}
                >
                  <img
                    src={aiep_logo}
                    alt="powered by dg"
                    // width={"100%"}
                    height={"50px"}
                  />{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex" }}>
                {getUserLocal() && loginType !== "guest" ? (
                  <></>
                ) : (
                  <Button
                    id="add-dataset-submit-btn"
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: 700,
                      fontSize: "16px",
                      width: "124px",
                      height: "40px",
                      background: "#00A94F",
                      borderRadius: "8px",
                      textTransform: "none",
                      marginLeft: "50px",
                      "&:hover": {
                        backgroundColor: "#00A94F",
                        color: "#fffff",
                      },
                    }}
                    variant="contained"
                    onClick={(e) => history.push("/login")}
                  >
                    Login
                  </Button>
                )}
                <Button
                  id="add-dataset-submit-btn"
                  sx={{
                    fontFamily: "Montserrat",
                    fontWeight: 700,
                    fontSize: "16px",
                    width: "fit-content",
                    height: "40px",
                    background: "#00A94F",
                    borderRadius: "8px",
                    border: "1px solid #00A94F",
                    textTransform: "none",
                    // marginLeft: "50px",
                    "&:hover": {
                      backgroundColor: "#00A94F",
                      color: "white",
                    },
                    color: "white",
                  }}
                  variant="contained"
                  onClick={(e) =>
                    getUserLocal() && loginType !== "guest"
                      ? handleSignOut(e)
                      : history.push("/home/register")
                  }
                >
                  {getUserLocal() && loginType !== "guest" ? (
                    <div style={{ color: "red", display: "flex", gap: "5px" }}>
                      {/* <CiLogout /> */}
                      <div>Sign out</div>
                    </div>
                  ) : (
                    "Register"
                  )}
                </Button>
              </Box>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#FFFFF",
                padding: "10px",
                borderBottom: "0.5px solid",
                gap: "10px",
                paddingLeft: "50px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  // height: "50px",

                  gap: "20px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "10px",
                    background: "white",
                    // padding: "2px",
                    borderRadius: "5px",
                  }}
                >
                  <img
                    src={aiep_logo}
                    alt="Digital Green"
                    // width={"100%"}
                    height={"50px"}
                  />{" "}
                </Box>

                <Typography
                  className={`${style.new_navItem} ${
                    isActive("/home") || isActive("/")
                      ? style.active_navItem
                      : ""
                  }`}
                  onClick={() => history.push("/home")}
                >
                  Home
                </Typography>
                <Typography
                  className={`${style.new_navItem} ${
                    isActive("/datahub/new_datasets") ||
                    isActive("/participant/new_datasets") ||
                    isActive("/home/datasets")
                      ? style.active_navItem
                      : ""
                  }`}
                  onClick={() => {
                    if (loginType === "admin") {
                      history.push("/datahub/new_datasets");
                    } else if (loginType === "participant") {
                      history.push("/participant/new_datasets");
                    } else if (loginType === "guest") {
                      history.push("/home/datasets");
                    }
                  }}
                >
                  Dataset
                </Typography>
                {(loginType === "admin" || loginType === "guest") &&
                !isLoggedInUserParticipant() ? (
                  <Typography
                    className={`${style.new_navItem} ${
                      isActive("/datahub/participants") ||
                      isActive("/home/participants")
                        ? style.active_navItem
                        : ""
                    }`}
                    onClick={() => {
                      if (loginType === "admin") {
                        history.push("/datahub/participants");
                      } else if (loginType === "guest") {
                        history.push("/home/participants");
                      }
                    }}
                  >
                    Partners
                  </Typography>
                ) : (
                  <></>
                )}

                <Typography
                  className={`${style.new_navItem} ${
                    isActive("/datahub/resources") ||
                    isActive("/participant/resources") ||
                    isActive("/home/resources")
                      ? style.active_navItem
                      : ""
                  }`}
                  onClick={() => {
                    if (loginType === "admin") {
                      history.push("/datahub/resources");
                    } else if (loginType === "participant") {
                      history.push("/participant/resources");
                    } else if (loginType === "guest") {
                      history.push("/home/resources");
                    }
                  }}
                >
                  Content
                </Typography>
                <Typography
                  className={`${style.new_navItem} ${
                    isActive("/datahub/bot_dashboard") ||
                    isActive("/participant/bot_dashboard") ||
                    isActive("/home/dashboard")
                      ? style.active_navItem
                      : ""
                  } hidden`}
                  onClick={() => {
                    if (loginType === "admin") {
                      history.push("/datahub/bot_dashboard");
                    } else if (loginType === "participant") {
                      history.push("/participant/bot_dashboard");
                    } else if (loginType === "guest") {
                      history.push("/home/dashboard");
                    }
                  }}
                >
                  {labels?.en?.navbar?.Dashboard}
                </Typography>
                {loginType === "admin" || loginType === "participant" ? (
                  <Typography
                    className={`${style.new_navItem} ${
                      isActive("/datahub/feedbacks") ||
                      isActive("/participant/feedbacks")
                        ? style.active_navItem
                        : ""
                    }`}
                    onClick={() => {
                      if (loginType === "admin") {
                        history.push("/datahub/feedbacks");
                      } else if (loginType === "participant") {
                        history.push("/participant/feedbacks");
                      }
                    }}
                  >
                    {labels?.en?.navbar?.feedbacks}
                  </Typography>
                ) : (
                  <></>
                )}
                {loginType === "admin" || loginType === "participant" ? (
                  <Typography
                    className={`${style.new_navItem} ${
                      isActive("/datahub/settings/1") ||
                      isActive("/datahub/settings/2") ||
                      isActive("/datahub/settings/3") ||
                      isActive("/datahub/settings/4") ||
                      isActive("/datahub/settings/5") ||
                      isActive("/participant/settings/1") ||
                      isActive("/participant/settings/2") ||
                      isActive("/participant/settings/3") ||
                      isActive("/participant/settings/4") ||
                      isActive("/participant/settings/5")
                        ? style.active_navItem
                        : ""
                    }`}
                    onClick={() => {
                      if (loginType === "admin") {
                        history.push("/datahub/settings/1");
                      } else if (loginType === "participant") {
                        history.push("/participant/settings/1");
                      }
                    }}
                  >
                    {labels?.en?.navbar?.Settings}
                  </Typography>
                ) : (
                  <></>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "auto",
                  paddingRight: "50px",
                  gap: "20px",
                }}
              >
                {getUserLocal() && loginType !== "guest" ? (
                  <></>
                ) : (
                  <Button
                    id="add-dataset-submit-btn"
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: 700,
                      fontSize: "16px",
                      width: "fit-content",
                      height: "40px",
                      background: "#00A94F",
                      borderRadius: "8px",
                      border: "1px solid #00A94F",
                      textTransform: "none",
                      // marginLeft: "50px",
                      "&:hover": {
                        backgroundColor: "#00A94F",
                        color: "white",
                      },
                      color: "white",
                    }}
                    variant="contained"
                    onClick={(e) => history.push("/login")}
                  >
                    Login
                  </Button>
                )}
                <Button
                  id="add-dataset-submit-btn"
                  sx={{
                    fontFamily: "Montserrat",
                    fontWeight: 700,
                    fontSize: "16px",
                    width: "fit-content",
                    height: "40px",
                    background: "#00A94F",
                    borderRadius: "8px",
                    border: "1px solid #00A94F",
                    textTransform: "none",
                    // marginLeft: "50px",
                    "&:hover": {
                      backgroundColor: "#00A94F",
                      color: "white",
                    },
                    color: "white",
                  }}
                  variant="contained"
                  onClick={(e) =>
                    getUserLocal() && loginType !== "guest"
                      ? handleSignOut(e)
                      : history.push("/home/register")
                  }
                >
                  {getUserLocal() && loginType !== "guest" ? (
                    <div
                      sx={{
                        fontFamily: "Montserrat",
                        fontWeight: 700,
                        fontSize: "16px",
                        width: "fit-content",
                        height: "40px",
                        background: "#00A94F",
                        borderRadius: "8px",
                        border: "1px solid #00A94F",
                        textTransform: "none",
                        // marginLeft: "50px",
                        "&:hover": {
                          backgroundColor: "#00A94F",
                          color: "white",
                        },
                        color: "white",
                      }}
                    >
                      {/* <CiLogout /> */}
                      <div>Sign out</div>
                    </div>
                  ) : (
                    "Register"
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default NavbarNew;

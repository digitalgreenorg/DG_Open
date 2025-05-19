import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  TextField,
  createTheme,
  useTheme,
} from "@mui/material";
import style from "./Footer_New.module.css";
import ContainedButton from "../Button/ContainedButton";
import { useHistory } from "react-router-dom";
import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import {
  goToTop,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import useMediaQuery from "@mui/material/useMediaQuery";
import globalStyle from "../../Assets/CSS/global.module.css";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import digital_green_footer_logo from "../../Assets/Img/Farmstack V2.0/technical_partner.svg";
import world_bank_footer_logo from "../../Assets/Img/Frame 1430.svg";
import vistaar from "../../Assets/Img/vistaar.svg";

const FooterNew = () => {
  const handleSubscribe = () => {};
  const history = useHistory();
  // const [adminData, setAdminData] = useState(null);
  const { adminData } = React.useContext(FarmStackContext);
  // const theme = useTheme();
  // const theme = createTheme({
  //   breakpoints: {
  //     values: {
  //       xs: 0,
  //       sm: 600,
  //       md: 900,
  //       lg: 1200,
  //       xl: 1650,
  //       xxl: 1980,
  //     },
  //   },
  // });
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  const laptop = useMediaQuery(theme.breakpoints.down("xl"));
  const desktop = useMediaQuery(theme.breakpoints.down("xl"));
  const largeDesktop = useMediaQuery(theme.breakpoints.up("xxl"));

  console.log(
    mobile,
    tablet,
    miniLaptop,
    laptop,
    desktop,
    largeDesktop,
    "active"
  );

  const containerStyle = {
    padding: mobile || tablet ? "0px 25px" : "40px 144px",
    paddingTop: mobile || tablet ? "40px" : "",
    marginLeft:
      mobile || tablet ? "0px" : desktop ? "0px" : largeDesktop ? "0px" : "0px",
    marginRight:
      mobile || tablet ? "0px" : desktop ? "0px" : largeDesktop ? "0px" : "0px",
    backgroundColor: "#00a94f !important",
    // background: "linear-gradient(to bottom, #fff, rgba(0,0,0,.6))",
    backgroundImage:
      "linear-gradient(to bottom,rgba(0,0,0,0) 25%,rgba(0,0,0,.6))",
  };
  const handleItemClick = (name) => {
    if (name === "datasets") {
      if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
        history.push("/datahub/new_datasets");
      } else if (isLoggedInUserParticipant()) {
        history.push("/participant/new_datasets");
      } else {
        history.push("/home/datasets");
      }
    } else if (name === "participants") {
      if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
        history.push("/datahub/participants");
      } else if (isLoggedInUserParticipant()) {
        history.push("/home/participants");
      } else {
        history.push("/home/participants");
      }
    }
  };

  // useEffect(() => {
  //   let url =
  //     UrlConstant.base_url + UrlConstant.microsite_admin_organization + "/";
  //   let method = "GET";
  //   // let url = UrlConstant.base_url + UrlConstant.microsite_admin_organization
  //   HTTPService(method, url, "", false, false, false, false, false)
  //     .then((response) => {
  //       setAdminData(response.data);
  //     })
  //     .catch((error) => {});
  // }, []);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          gap: mobile ? "26px" : "100px",
          flexDirection: mobile ? "column" : "row",
          padding: "40px 144px",

          // marginLeft: desktop ? "352px" : "0px"
        }}
      >
        <img
          style={{
            height: "auto",
            maxWidth: "172px",
            width: "auto",
            maxHeight: "65px",
          }}
          src={
            UrlConstant.base_url_without_slash + adminData?.organization?.logo
          }
          alt="footerLogo"
        />
        {/* <img
          style={{
            height: "auto",
            maxWidth: "172px",
            width: "auto",
            maxHeight: "65px",
          }}
          src={
            UrlConstant.base_url_without_slash + adminData?.organization?.logo
          }
          alt="footerLogo"
        /> */}
        {/* <img
            style={{
              height: "auto",
              maxWidth: "172px",
              width: "auto",
              maxHeight: "65px",
            }}
            src={world_bank_footer_logo}
            alt="footerLogo"
          /> */}
        <Divider />
        <img
          style={{
            height: "auto",
            maxWidth: "172px",
            width: "auto",
            maxHeight: "65px",
          }}
          src={digital_green_footer_logo}
          alt="footerLogo"
        />
      </div>
      <Box sx={containerStyle}>
        <div
          className={` ${
            mobile
              ? style.footerContentMd
              : tablet
              ? style.footerContent
              : miniLaptop
              ? style.footerContentMd
              : style.footerContent
          } text-left`}
        >
          <Box className="d-flex justify-content-between">
            <div className={style.contact}>
              <div className={`${style.footerTitle}`}>Contacts</div>
              <div className="mb-30 mt-20">
                <div className={`${style.footerLightTextOnly} text-left`}>
                  Email
                </div>
                <div
                  className={`${style.footerDarkText} mt-2 text-left ${globalStyle.break_word}`}
                >
                  {adminData?.user?.email ?? ""}
                </div>
              </div>
              <div className="mb-30">
                <div className={`${style.footerLightTextOnly} text-left`}>
                  Datahub admin phone
                </div>
                <div className={`${style.footerDarkText} mt-2 text-left`}>
                  {adminData?.user?.phone_number ?? ""}
                </div>
              </div>
              <div>
                <div className={`${style.footerLightTextOnly} text-left`}>
                  Organization Website
                </div>
                <div className={`${style.link} mt-2`}>
                  {" "}
                  <a
                    target="_blank"
                    href={adminData?.organization?.website ?? ""}
                  >
                    {adminData?.organization?.website ?? ""}
                  </a>
                </div>
              </div>
            </div>
            <div
              className={`links ${mobile || tablet ? "w-100" : style.w268} ${
                mobile || tablet ? style.ml63 : style.ml50
              }`}
            >
              <div className={`${style.footerTitle}`}>Quick links</div>
              <div className={`footer_link mt-20`}>
                <div
                  className={`${
                    mobile || tablet
                      ? "d-block"
                      : "d-flex justify-content-between"
                  } w-100`}
                >
                  <div
                    className={`${style.footerLightText} ${style.quickLinks}`}
                    onClick={() => {
                      history.push("/home");
                      goToTop(0);
                    }}
                    data-testId="home-button"
                  >
                    Home
                  </div>
                  <div
                    data-testId="contact-us-button"
                    onClick={() => history.push("/home/contact")}
                    className={`${style.footerLightText} ${style.flexWidth} ${
                      style.quickLinks
                    } ${mobile || tablet ? "mt-10" : ""} `}
                  >
                    Contact us
                  </div>
                </div>
                <div
                  className={`${
                    mobile || tablet
                      ? "d-block"
                      : "d-flex justify-content-between"
                  } w-100`}
                >
                  <div
                    className={`${style.footerLightText} ${style.quickLinks} mt-10 ${style.w50} ${globalStyle.break_word}`}
                  >
                    About {adminData?.organization?.name ?? ""}
                  </div>
                  <div
                    className={`${style.footerLightText} ${style.quickLinks} ${style.flexWidth} mt-10`}
                    onClick={() => history.push("/home/legal")}
                    data-testId="legal-button"
                  >
                    Legal
                  </div>
                </div>
                <div
                  className={`${
                    mobile || tablet
                      ? "d-block"
                      : "d-flex justify-content-between"
                  } w-100`}
                >
                  <div
                    className={`${style.footerLightText} ${style.quickLinks} mt-10`}
                    onClick={() => window.open("https://farmstack.co/")}
                    data-testId="about-farmstack-button"
                  >
                    About Farmstack
                  </div>

                  {isLoggedInUserAdmin() ||
                  isLoggedInUserCoSteward() ||
                  isLoggedInUserParticipant() ? (
                    ""
                  ) : (
                    <div
                      className={`${style.footerLightText} ${style.quickLinks} ${style.flexWidth} mt-10`}
                      onClick={() => history.push("/login")}
                      data-testId="login-button"
                    >
                      Login
                    </div>
                  )}
                </div>
                <div
                  className={`${
                    mobile || tablet
                      ? "d-block"
                      : "d-flex justify-content-between"
                  } w-100`}
                >
                  {/* <div
                    className={`${style.footerLightText} ${style.quickLinks} mt-10 `}
                    onClick={() => handleItemClick("datasets")}
                    data-testId="datasets-button"
                  >
                    Datasets
                  </div> */}

                  {isLoggedInUserAdmin() ||
                  isLoggedInUserCoSteward() ||
                  isLoggedInUserParticipant() ? (
                    ""
                  ) : (
                    <div
                      className={`${style.footerLightText} ${style.quickLinks} ${style.flexWidth} mt-10`}
                      onClick={() => history.push("/home/get-started")}
                      data-testId="get-started-button"
                    >
                      Get started
                    </div>
                  )}
                </div>
                <div
                  className={`${
                    mobile || tablet
                      ? "d-block"
                      : "d-flex justify-content-between"
                  } w-100`}
                >
                  <div
                    className={`${style.footerLightText} ${style.quickLinks} mt-10 `}
                    onClick={() => handleItemClick("participants")}
                    data-testId="footer-part-button"
                  >
                    Participants
                  </div>
                </div>
              </div>
            </div>
          </Box>
          <Box>
            <div
              className={`${
                mobile
                  ? style.staytuned_mobile
                  : tablet
                  ? style.staytuned_tablet
                  : style.staytuned
              } ${mobile || tablet || miniLaptop ? "mt-20" : ""}`}
            >
              <div className={`${style.footerTitle}`}>Stay tuned</div>
              <div
                className={`mt-20 ${style.footerLightText}`}
                style={{ cursor: "text" }}
              >
                Subscribe to our newsletter and never miss datasets,
              </div>
              <div
                className={`${style.footerLightText} mb-30`}
                style={{ cursor: "text" }}
              >
                latest news, etc.,
              </div>
              <div
                className={`${style.footerLightText}`}
                style={{ cursor: "text" }}
              >
                Our newsletter is sent once a month every first week.
              </div>
              <div
                className="mt-20 mb-20"
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                        color: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "#6c757d",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                        color: "white",
                      },
                    },
                  }}
                  // className={
                  //   // mobile
                  //   //   ? "input_field_subscribe_sm"
                  //   //   : tablet
                  //   //   ? "input_field_subscribe_md"
                  //   //   : "input_field_subscribe"
                  // }
                  placeholder="Enter your e-mail id"
                  variant="outlined"
                  inputProps={{
                    style: {
                      height: "30px",
                      color: "#00a94f",
                      background: "white",
                      borderRadius: "5px",
                    },
                  }}
                  data-testId={"subscribe-button"}
                />
                <ContainedButton
                  color={"white"}
                  disabled={true}
                  text={"Subscribe"}
                  fontWeight={"700"}
                  fontFamily={"Montserrat"}
                  fontSize={mobile || tablet ? "10px" : "16px"}
                  width={mobile ? "83px" : tablet ? "83px" : "172px"}
                  height={mobile ? "61px" : tablet ? "61px" : "61px"}
                  // padding={"16.5px 14px"}
                  handleClick={handleSubscribe}
                />
              </div>
            </div>

            <div style={{ fontWeight: "600", fontSize: "20px" }}>
              Powered by FarmStack
            </div>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default FooterNew;

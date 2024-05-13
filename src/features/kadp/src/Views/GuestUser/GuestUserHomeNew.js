import fourth_home from "../../Assets/Img/kenya/fourth_home.jpg";
import first_home from "../../Assets/Img/kenya/first_home.jpg";
import two_home from "../../Assets/Img/kenya/two_home.jpg";
import microsite_point4 from "../../Assets/Img/microsite_point4.svg";
import microsite_point3 from "../../Assets/Img/microsite_point3.svg";
import microsite_point2 from "../../Assets/Img/microsite_point2.svg";
import microsite_point1 from "../../Assets/Img/microsite_point1.svg";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { Col, Row } from "react-bootstrap";
import GlobalStyles from "../../Assets/CSS/global.module.css";
import DatasetListNew from "../../Components/Dataset/DatasetListNew";
import ParticipantsCarouselNew from "../../Components/Participants/ParticipantsCarouselNew";
import LocalStyle from "./GuestUserHomeNew.module.css";
import { useHistory } from "react-router-dom";

import { TypeAnimation } from "react-type-animation";
import ScrollToTop from "../../Components/ScrollTop/ScrollToTop";
import Connectors from "../../Components/Connectors_New/Connectors";
import GuestUserLandingResource from "../Resources/Guest/GuestUserLandingResource";
import { checkProjectFor } from "common/utils/utils";
// import { tab } from "@testing-library/user-event/dist/types/convenience";
const GuestUserHome = () => {
  let history = useHistory();
  const theme = useTheme();

  // const theme = createTheme({
  //   breakpoints: {
  //     values: {
  //       xs: 0,
  //       sm: 600,
  //       md: 900,
  //       lg: 1200,
  //       xl: 1620,
  //       xxl: 2560,
  //     },
  //   },
  // });
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  console.log(
    "🚀 ~ file: GuestUserHomeNew.js:36 ~ GuestUserHome ~ mobile:",
    mobile
  );
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  console.log(
    "🚀 ~ file: GuestUserHomeNew.js:43 ~ GuestUserHome ~ tablet:",
    tablet
  );
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  const desktop = useMediaQuery(theme.breakpoints.up("xl"));
  const largeDesktop = useMediaQuery(theme.breakpoints.up("xxl"));

  // const containerStyle = {
  //   marginLeft: mobile || tablet ? "30px" : "144px",
  //   marginRight: mobile || tablet ? "30px" : "144px",
  // };

  const responsive_top_row = {
    padding: mobile || tablet ? "0px 10px" : "0px 144px",
  };
  return (
    <>
      <ScrollToTop />
      <Box
        sx={{ width: "100%" }}
        className={
          (mobile
            ? LocalStyle.container_mobile
            : tablet
            ? LocalStyle.container_tablet
            : desktop
            ? LocalStyle.container_desktop
            : LocalStyle.container_large) + " mainBoxForGuestHome"
        }
      >
        <Row
          className={
            mobile && tablet
              ? LocalStyle.top_row_in_home_mobile
              : LocalStyle.top_row_in_home
          }
          style={responsive_top_row}
        >
          <Col xs={12} sm={12} md={12} xl={6}></Col>
          <Col xs={12} sm={12} md={12} xl={6}>
            <div
              className={`${
                mobile
                  ? LocalStyle.titleContainer_mobile
                  : tablet
                  ? LocalStyle.titleContainer_tablet
                  : LocalStyle.titleContainer
              }`}
            >
              <Typography
                className={`${LocalStyle.title} ${GlobalStyles.bold300} ${
                  mobile ? GlobalStyles.size20 : GlobalStyles.size45
                } ${GlobalStyles.highlighted_text_in_home} ${
                  mobile ? "" : LocalStyle.lineheight_50
                }`}
              >
                Welcome to the Kenya Agricultural Data Sharing Platform (KADP)
                {/* Explore true
                <br />
                power of data */}
              </Typography>
              <Typography
                // style={{ height: "120px" }}
                className={`${
                  mobile || tablet
                    ? LocalStyle.textDescription_mobile
                    : LocalStyle.textDescription
                } ${GlobalStyles.bold400} ${
                  mobile ? GlobalStyles.size14 : GlobalStyles.size22
                } ${GlobalStyles.highlighted_text_in_home}`}
              >
                <b style={{ fontWeight: "bold" }}></b>
                <TypeAnimation
                  sequence={[
                    `Revolutionary approach to data exchange in agriculture by
        fostering collaboration between organisations and harnessing the
        power of collective data.`, // Types 'Three' without deleting 'Two'
                  ]}
                  wrapper="span"
                  cursor={true}
                  repeat={true}
                  style={{
                    // fontSize: mobile ? "14px" : "20px",
                    display: "inline-block",
                    color: "white",
                    minHeight: mobile ? "110px" : "80px",
                  }}
                  className={`${
                    mobile || tablet
                      ? LocalStyle.text_with_typing_mobile
                      : LocalStyle.text_with_typing
                  }`}
                  // className={ LocalStyle.text_with_typing}
                />
                <b style={{ fontWeight: "bold" }}></b>
              </Typography>
            </div>
            <Row
              className={
                mobile
                  ? LocalStyle.buttonContainer_mobile
                  : tablet
                  ? LocalStyle.buttonContainer_tablet
                  : LocalStyle.buttonContainer
              }
            >
              <Button
                onClick={() => history.push("/home/get-started")}
                id="home-get-started-btn"
                data-testid={"home-get-started-btn-test"}
                className={`${
                  mobile || tablet
                    ? LocalStyle.primaryButton_mobile
                    : LocalStyle.primaryButton
                } ${GlobalStyles.primary_button}`}
              >
                Get Started
              </Button>
            </Row>
            <Row>
              <Col
                className={`${
                  mobile || tablet
                    ? LocalStyle.pointContainer_mobile
                    : LocalStyle.pointContainer
                }`}
                xl={6}
              >
                <span className={LocalStyle.greenBox}>
                  <img src={microsite_point1} />
                </span>
                <span
                  style={{
                    color: mobile ? "black" : tablet ? "white" : "white",
                  }}
                >
                  Connect, Share, Discover{" "}
                </span>
              </Col>
              <Col
                className={`${
                  mobile || tablet
                    ? LocalStyle.pointContainer_mobile
                    : LocalStyle.pointContainer
                }`}
                xl={6}
              >
                <span className={LocalStyle.greenBox}>
                  <img src={microsite_point2} />
                </span>
                <span
                  style={{
                    color: mobile ? "black" : tablet ? "white" : "white",
                  }}
                >
                  Unlock data insights
                </span>
              </Col>
            </Row>
            <Row>
              <Col
                className={`${
                  mobile || tablet
                    ? LocalStyle.pointContainer_mobile
                    : LocalStyle.pointContainer
                }`}
                xl={6}
              >
                <span className={LocalStyle.greenBox}>
                  <img src={microsite_point3} />
                </span>
                <span
                  style={{
                    color: mobile ? "black" : tablet ? "white" : "white",
                  }}
                >
                  Derive value from data
                </span>
              </Col>
              <Col
                className={`${
                  mobile || tablet
                    ? LocalStyle.pointContainer_mobile
                    : LocalStyle.pointContainer
                }`}
                xl={6}
              >
                <span className={LocalStyle.greenBox}>
                  <img src={microsite_point4} />
                </span>
                <span
                  style={{
                    color: mobile ? "black" : tablet ? "white" : "white",
                  }}
                >
                  Secured data exchange
                </span>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Dataset list */}
        <Box
          className={
            mobile
              ? LocalStyle.main_box_for_datasets_mobile
              : tablet
              ? LocalStyle.main_box_for_datasets_tablet
              : LocalStyle.main_box_for_datasets
          }
        >
          <Typography
            className={`${LocalStyle.title} ${GlobalStyles.bold600} ${GlobalStyles.size32} ${GlobalStyles.highlighted_text}`}
          >
            Datasets
          </Typography>
          <Typography
            className={`${LocalStyle.textDescription} text-left ${GlobalStyles.bold400} ${GlobalStyles.size22} ${GlobalStyles.highlighted_text}`}
          >
            Discover and explore the potential of data to generate ideal
            datasets with Dataset Explorer.
          </Typography>
          <DatasetListNew user={"guest"} />
        </Box>
      </Box>
      <Box
        className={
          mobile
            ? LocalStyle.main_box_for_connector_mobile
            : tablet
            ? LocalStyle.main_box_for_connector_tablet
            : LocalStyle.main_box_for_connector
        }
        // className={
        //   mobile || tablet
        //     ? LocalStyle.container_marginMd
        //     : LocalStyle.container_margin
        // }
      >
        <Typography
          className={`${LocalStyle.title} ${GlobalStyles.bold600} ${GlobalStyles.size32} ${GlobalStyles.highlighted_text}`}
        >
          Use cases
        </Typography>
        <Typography
          className={`${LocalStyle.textDescription} text-left ${GlobalStyles.bold400} ${GlobalStyles.size22} ${GlobalStyles.highlighted_text}`}
        >
          Integrates two datasets to form a novel dataset with merged
          information.
        </Typography>
      </Box>
      <Box>
        <Connectors isGuestUser={true} />
      </Box>
      <Box
        className={
          mobile
            ? LocalStyle.main_box_for_datasets_mobile
            : tablet
            ? LocalStyle.main_box_for_datasets_tablet
            : LocalStyle.main_box_for_datasets
        }
      >
        <Typography
          className={`${LocalStyle.title} ${GlobalStyles.bold600} ${GlobalStyles.size32} ${GlobalStyles.highlighted_text} text-left`}
        >
          Resources
        </Typography>
        <Typography
          className={`${LocalStyle.textDescription} text-left ${GlobalStyles.bold400} ${GlobalStyles.size22} ${GlobalStyles.highlighted_text}`}
        >
          Resource discovery is the key to unlocking economic growth by
          identifying and efficiently harnessing valuable elements such as
          minerals, energy, and water, benefiting industries like agriculture,
          manufacturing, and technology.
        </Typography>
        <GuestUserLandingResource user={"guest"} />
      </Box>
      <Box
        className={
          mobile
            ? LocalStyle.center_banner_mobile
            : tablet
            ? LocalStyle.center_banner_tablet
            : desktop
            ? LocalStyle.center_banner_desktop
            : LocalStyle.center_banner
        }
        // sx={{
        //   backgroundRepeat: "no-repeat",
        //   width: "100%",
        //   backgroundSize: "cover",
        //   position: "relative",
        //   background: "#00a94f",
        //   backgroundImage:
        //     "linear-gradient(to bottom,rgba(0,0,0,0) 25%,rgba(0,0,0,.6))",
        //   padding: "0px 144px",
        // }}
      >
        {/* <Box
className
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        > */}
        {/* // image */}
        <Box>
          <img
            src={two_home}
            width={mobile ? "152px" : "none"}
            height={"250px"}
            loading="lazy"
          />
        </Box>
        <Box
        // sx={{
        //   display: mobile || tablet || miniLaptop ? "flex" : "flex",
        //   flexDirection: mobile || tablet || miniLaptop ? "column" : "row",
        //   alignItems: mobile ? "baseline" : "center",
        //   flexBasis: desktop ? "80%" : "70%",
        //   padding: mobile ? "10px" : "",
        //   justifyContent: "space-evenly",
        // }}
        >
          <Typography
            className={`${LocalStyle.title} ${GlobalStyles.bold500} ${
              mobile
                ? GlobalStyles.size12
                : tablet || miniLaptop
                ? GlobalStyles.size16
                : largeDesktop
                ? GlobalStyles.size28
                : GlobalStyles.size28
            } ${GlobalStyles.highlighted_text_in_home} ${
              mobile
                ? ""
                : tablet
                ? LocalStyle.lineheight_27
                : LocalStyle.lineheight_39
            } ${mobile ? LocalStyle.mt45 : ""}`}
            sx={{
              width:
                mobile || miniLaptop || desktop || largeDesktop
                  ? "auto !important"
                  : "350px !important",
              marginRight: mobile || tablet || miniLaptop ? "" : "28px",
            }}
          >
            With Data sharing great things will happen
            <br />
            <Button
              style={{
                unset: "all",
              }}
              className={LocalStyle.contact_us_button_home}
              onClick={() => history.push("/home/contact")}
            >
              Contact us
            </Button>
          </Typography>
        </Box>
        <Box>
          <Typography
            style={{ width: "90%" }}
            className={`${
              mobile
                ? LocalStyle.descriptionSm
                : tablet || miniLaptop
                ? LocalStyle.descriptionMd
                : desktop
                ? LocalStyle.descriptionlg
                : largeDesktop
                ? LocalStyle.descriptionXlg
                : LocalStyle.description
            } ${GlobalStyles.bold400} ${
              tablet || miniLaptop ? GlobalStyles.size12 : GlobalStyles.size22
            } ${GlobalStyles.highlighted_text_in_home}`}
          >
            <b style={{ fontWeight: "bold" }}></b>
            We enable seamless data sharing, breaks down silos, and builds trust
            among organisations. The platform consolidates fragmented data,
            standardises data, and aids in better data categorization, enhancing
            its usability and value.
            <b style={{ fontWeight: "bold" }}></b>
          </Typography>
        </Box>
      </Box>
      <Box
        className="mainBoxForGuestHome"
        // className={
        //   mobile
        //     ? LocalStyle.center_banner_mobile
        //     : tablet
        //     ? LocalStyle.center_banner_tablet
        //     : desktop
        //     ? LocalStyle.center_banner_desktop
        //     : LocalStyle.center_banner
        // }
      >
        {!checkProjectFor("kalro") && (
          <div
            style={{
              marginTop: "50px",
              padding: mobile || tablet ? "0px 25px" : "0px 144px",
            }}
          >
            <div className={LocalStyle.participanttitleContainer}>
              <Typography
                style={{ textAlign: "left" }}
                className={`${LocalStyle.title} ${GlobalStyles.bold600} ${GlobalStyles.size32} ${GlobalStyles.highlighted_text}`}
              >
                Co-steward
              </Typography>
              <Typography
                className={`${LocalStyle.textDescription} text-left ${GlobalStyles.bold400} ${GlobalStyles.size22} ${GlobalStyles.highlighted_text}`}
              >
                <b style={{ fontWeight: "bold" }}></b>
                Organisations who facilitate their own private network of
                participants for secured data sharing.
                <b style={{ fontWeight: "bold" }}></b>
              </Typography>
            </div>
            <ParticipantsCarouselNew
              title="Our co-steward network"
              isCosteward={true}
            />
            <Row className={`${LocalStyle.viewDatasetButtonContainer}`}>
              <Button
                className={`${LocalStyle.viewDatasetButton} ${GlobalStyles.primary_button} ${GlobalStyles.homeButtonWidth}`}
                onClick={() => history.push("/home/costeward")}
                id="home-view-all-costeward-btn-id"
              >
                View all co-steward
              </Button>
            </Row>
          </div>
        )}
        <div
          style={{
            padding: mobile || tablet ? "0px 25px" : "0px 144px",
            marginTop: "25px",
          }}
          className={LocalStyle.participanttitleContainer}
        >
          <Typography
            style={{ textAlign: "left" }}
            className={`${LocalStyle.title} ${GlobalStyles.bold600} ${GlobalStyles.size32} ${GlobalStyles.highlighted_text}`}
          >
            Participants
          </Typography>
          <Typography
            className={`${LocalStyle.textDescription} text-left ${GlobalStyles.bold400} ${GlobalStyles.size22} ${GlobalStyles.highlighted_text}`}
          >
            <b style={{ fontWeight: "bold" }}></b>
            Organisations that share our vision and are committed to making a
            positive impact.
            <b style={{ fontWeight: "bold" }}></b>
          </Typography>
        </div>
        <div style={{ padding: mobile || tablet ? "0px 25px" : "0px 144px" }}>
          <ParticipantsCarouselNew title="Our Participants are" />
        </div>
        <Row className={`${LocalStyle.viewDatasetButtonContainer}`}>
          <Button
            style={{ marginBottom: "25px" }}
            className={`${LocalStyle.primaryButton} ${GlobalStyles.homeButtonWidth} ${LocalStyle.centeredButtonContainer}`}
            onClick={() => history.push("/home/participants")}
            id="home-view-all-participants-btn-id"
          >
            View all participants
          </Button>
        </Row>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: mobile || tablet ? "10px 25px" : "0px 144px",
          }}
        >
          <Col xs={12} sm={12} md={12} xl={6} xxl={6}>
            <div className={`${LocalStyle.titleContainer}`}>
              <Typography
                className={`${LocalStyle.lastTitle} line-height-0 text-left ${GlobalStyles.bold600} ${GlobalStyles.size28} ${GlobalStyles.highlighted_text}`}
              >
                Driving Insights, Thriving Community
              </Typography>
              <Typography
                className={`${LocalStyle.textDescription} ${GlobalStyles.bold400} ${GlobalStyles.size22} ${GlobalStyles.highlighted_text}`}
              >
                <b style={{ fontWeight: "bold" }}></b>
                Foster data-driven decisions by collaborating with participants
                to seamlessly share datasets and unlock their true potential by
                integrating datasets.
                <b style={{ fontWeight: "bold" }}></b>
              </Typography>
            </div>
            <Row>
              <Col
                className={`${
                  mobile
                    ? LocalStyle.pointContainer_mobile
                    : LocalStyle.pointContainer
                }`}
                style={{ marginLeft: tablet ? "15px" : "0px" }}
                xl={6}
              >
                <span className={LocalStyle.greenBox}>
                  <img src={microsite_point1} />
                </span>
                <span className="text-left">Strengthen Collaboration </span>
              </Col>
              <Col
                className={`${
                  mobile
                    ? LocalStyle.pointContainer_mobile
                    : LocalStyle.pointContainer
                }`}
                style={{ marginLeft: tablet ? "15px" : "0px" }}
                xl={6}
              >
                <span className={LocalStyle.greenBox}>
                  <img src={microsite_point2} />
                </span>
                <span className="text-left">
                  Unleash the Power of Connectors
                </span>
              </Col>
            </Row>
            <Row>
              <Col
                className={`${
                  mobile
                    ? LocalStyle.pointContainer_mobile
                    : LocalStyle.pointContainer
                }`}
                style={{ marginLeft: tablet ? "15px" : "0px" }}
                xl={6}
              >
                <span className={LocalStyle.greenBox}>
                  <img src={microsite_point3} />
                </span>
                <span className="text-left">Enable Use cases</span>
              </Col>
              <Col
                className={`${
                  mobile
                    ? LocalStyle.pointContainer_mobile
                    : LocalStyle.pointContainer
                }`}
                style={{ marginLeft: tablet ? "15px" : "0px" }}
                xl={6}
              >
                <span className={LocalStyle.greenBox}>
                  <img src={microsite_point4} />
                </span>
                <span className="text-left">Scale-up your impact </span>
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={12} md={12} xl={6} xxl={6}>
            <img
              className={
                mobile
                  ? LocalStyle.micrositeLogo_mobile
                  : LocalStyle.micrositeLogo
              }
              src={first_home}
              loading="lazy"

              // style={{style}}
            />
          </Col>
        </Row>
        <Row className="mt-30">
          <Col style={{ margin: "25px auto" }}>
            <Typography
              className={`${LocalStyle.title} ${LocalStyle.centeredAlignTitle} ${GlobalStyles.bold500} ${GlobalStyles.size32} ${GlobalStyles.highlighted_text} d-block`}
            >
              <b style={{ fontWeight: "bold" }}></b>
              Maximise impact by exploring the ultimate platform for data-driven
              solutions!
              <b style={{ fontWeight: "bold" }}></b>
            </Typography>
          </Col>
        </Row>
        <Row
          className={`${
            mobile || tablet
              ? LocalStyle.buttonContainer_mobile
              : LocalStyle.buttonContainer
          }`}
        >
          <Button
            className={`${GlobalStyles.homeButtonWidth} ${LocalStyle.primaryButton} ${LocalStyle.centeredButtonContainer}  `}
            onClick={() => history.push("/home/get-started")}
            id="home-get-started-btn2-id"
            data-testid={"home-get-started-btn-test2"}
          >
            Get Started
          </Button>
        </Row>
      </Box>
      <Box>
        <div
          className={
            mobile || tablet
              ? LocalStyle.image_container_mobile
              : LocalStyle.image_container
          }
        >
          {console.log(mobile, tablet, desktop, miniLaptop, largeDesktop)}
          <img
            className={
              largeDesktop ? LocalStyle.image_for_big : LocalStyle.image
            }
            src={fourth_home}
            width={"100%"}
            loading="lazy"
          />
        </div>
      </Box>
    </>
  );
};

export default GuestUserHome;

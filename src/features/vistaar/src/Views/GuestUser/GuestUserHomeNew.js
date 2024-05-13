import micro3 from '../../Assets/Img/micro3.jpeg';
import micro2 from '../../Assets/Img/micro2.jpeg';
import micro1 from '../../Assets/Img/micro1.jpeg';
import microsite_point4 from '../../Assets/Img/microsite_point4.svg';
import microsite_point3 from '../../Assets/Img/microsite_point3.svg';
import microsite_point2 from '../../Assets/Img/microsite_point2.svg';
import microsite_point1 from '../../Assets/Img/microsite_point1.svg';
import {
  Box,
  Button,
  Card,
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
import {
  checkProjectFor,
  getTokenLocal,
  toTitleCase,
} from "common/utils/utils";
import labels from "../../Constants/labels";
import modiji from "../../Assets/Img/modiji.svg";
import modi from "../../Assets/Img/modi.png";
import present from "../../Assets/Img/present.svg";
import qrcode from "../../Assets/Img/qrcode.png";
import insight1 from "../../Assets/Img/insight1.svg";
import insight2 from "../../Assets/Img/insight2.svg";
import insight3 from "../../Assets/Img/insight3.svg";
import insight4 from "../../Assets/Img/insight4.svg";
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

  const containerStyle = {
    marginLeft: mobile || tablet ? "30px" : "144px",
    marginRight: mobile || tablet ? "30px" : "144px",
  };

  let resources = labels.renaming_modules.resources;
  let resource = labels.renaming_modules.resource;
  let Resources = toTitleCase(labels.renaming_modules.resources);
  let Resource = toTitleCase(labels.renaming_modules.resource);

  const responsive_top_row = {
    padding: mobile || tablet ? "0px 10px" : "40px 40px 0px 40px",
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
          <Col xs={12} sm={12} md={4} xl={4}>
            <img
              src={modi}
              // className={`${mobile || tablet ? LocalStyle.modijiImg : ""}`}
              style={{ width: "100%", height: "100%" }}
            />
          </Col>
          <Col xs={12} sm={12} md={8} xl={8}>
            <Box
              className={`d-flex ${mobile || tablet ? "flex-column" : ""}`}
              sx={{ marginTop: "70px" }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Montserrat",
                    fontSize: "32px",
                    fontWeight: "700",
                    lineHeight: "44px",
                    letterSpacing: "0px",
                    textAlign: "left",
                    color: "#3D4A52",
                  }}
                >
                  Virtually Integrated Systems to Access Agricultural Resources
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Montserrat",
                    fontSize: "22px",
                    fontWeight: "400",
                    lineHeight: "27px",
                    letterSpacing: "0px",
                    textAlign: "left",
                    color: "#3D4A52",
                    marginTop: "14px",
                  }}
                >
                  Where Technology and Agriculture intertwine, creating a
                  network of Departments, Farmers, and FLEWs.
                </Typography>
              </Box>
              <Box
                sx={{
                  marginTop: mobile ? "5px" : "-21px",
                  textAlign: mobile ? "center" : "",
                }}
              >
                <img src={qrcode} style={{ height: "220px" }} />
              </Box>
            </Box>
            <Box
              className={
                mobile
                  ? LocalStyle.buttonContainer_mobile
                  : tablet
                  ? LocalStyle.buttonContainer_tablet
                  : LocalStyle.cover_btn_container
              }
              sx={{
                display: "flex",
                justifyContent: mobile ? "center" : "end",
                marginRight: mobile ? "0px" : "23px",
              }}
            >
              <Button
                // onClick={() => !getTokenLocal() && history.push("/login")}
                id="home-get-started-btn"
                data-testid={"home-get-started-btn-test"}
                className={`${
                  mobile || tablet
                    ? LocalStyle.primaryButton_mobile
                    : LocalStyle.primaryButton
                } ${LocalStyle.scan_button}`}
                sx={{ color: "#000000 !important" }}
                disabled
              >
                Scan for bot
              </Button>
            </Box>
            {/* <Row>
              <Col
                className={`${
                  mobile || tablet
                    ? LocalStyle.pointContainer_mobile
                    : LocalStyle.pointContainer
                }`}
                xl={6}
              >
                <span className={LocalStyle.greenBox}>
                  <img  src={microsite_point1}  />
                </span>
                <span
                  style={{
                    // color: mobile ? "black" : tablet ? "white" : "white",
                    color: "#1D1D1D",
                  }}
                >
                  Increase efficiency of your Frontline workers
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
                  <img  src={microsite_point2}  />
                </span>
                <span
                  style={{
                    // color: mobile ? "black" : tablet ? "white" : "white",
                    color: "#1D1D1D",
                  }}
                >
                  Host and manage content in one place
                </span>
              </Col>
            </Row> */}
            {/* <Row>
              <Col
                className={`${
                  mobile || tablet
                    ? LocalStyle.pointContainer_mobile
                    : LocalStyle.pointContainer
                }`}
                xl={6}
              >
                <span className={LocalStyle.greenBox}>
                  <img  src={microsite_point3}  />
                </span>
                <span
                  style={{
                    // color: mobile ? "black" : tablet ? "white" : "white",
                    color: "#1D1D1D",
                  }}
                >
                  Create tasks and trainings for your Frontline workers in one
                  place
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
                  <img  src={microsite_point4}  />
                </span>
                <span
                  style={{
                    // color: mobile ? "black" : tablet ? "white" : "white",
                    color: "#1D1D1D",
                  }}
                >
                  Incentivise your Frontline worker by measuring impact created
                </span>
              </Col>
            </Row> */}
          </Col>
        </Row>
        <Box
          sx={{
            margin: mobile ? "20px 20px 0px 10px" : "-45px 40px 0px 40px",
          }}
        >
          <Row
            style={{
              gap: mobile ? "0px" : "0px",
              rowGap: mobile || tablet || miniLaptop ? "20px" : "0px",
              justifyContent: "center",
            }}
          >
            <Col xs={12} sm={12} md={5} xl={3}>
              <Card className={`${LocalStyle.insight_card}`}>
                <Box className={`${LocalStyle.insight_card_child}`}>
                  <Box>
                    <img src={insight1} />
                  </Box>
                  <Typography className={`${LocalStyle.insight_card_text}`}>
                    Increase efficiency of your Frontline workers
                  </Typography>
                </Box>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={5} xl={3}>
              <Card className={`${LocalStyle.insight_card}`}>
                <Box className={`${LocalStyle.insight_card_child}`}>
                  <Box>
                    <img src={insight2} />
                  </Box>
                  <Typography className={`${LocalStyle.insight_card_text}`}>
                    Host and manage content in one place
                  </Typography>
                </Box>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={5} xl={3}>
              <Card className={`${LocalStyle.insight_card}`}>
                <Box className={`${LocalStyle.insight_card_child}`}>
                  <Box>
                    <img src={insight3} />
                  </Box>
                  <Typography className={`${LocalStyle.insight_card_text}`}>
                    Create tasks and trainings for your Frontline workers in one
                    place
                  </Typography>
                </Box>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={5} xl={3}>
              <Card className={`${LocalStyle.insight_card}`}>
                <Box className={`${LocalStyle.insight_card_child}`}>
                  <Box>
                    <img src={insight4} />
                  </Box>
                  <Typography className={`${LocalStyle.insight_card_text}`}>
                    Incentivise your Frontline worker by measuring impact
                    created
                  </Typography>
                </Box>
              </Card>
            </Col>
          </Row>
        </Box>
        {/* Dataset list */}
        {/* <Box
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
        </Box> */}
      </Box>
      {/* <Box
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
      </Box> */}
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
          {Resources}
        </Typography>
        <Typography
          className={`${LocalStyle.textDescription} text-left ${GlobalStyles.bold400} ${GlobalStyles.size22} ${GlobalStyles.highlighted_text}`}
        >
          {Resource} discovery is the key to unlocking awareness and growth by
          identifying unknowns and efficiently delivering valuable information
          about best practices, pests and disease managements, schemes etc
          benefiting farmers.
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
          <img  src={micro1} 
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
            With Content distribution great things will happen
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
            We enable seamless content upload of all formats, and builds unified
            approach. The platforms integrate all data or content across all
            states and departments and effectively delivers to front line
            workers in a conversational format enhancing its usability and
            value.
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
                States (or) Organisations
              </Typography>
              <Typography
                className={`${LocalStyle.textDescription} text-left ${GlobalStyles.bold400} ${GlobalStyles.size22} ${GlobalStyles.highlighted_text}`}
              >
                <b style={{ fontWeight: "bold" }}></b>
                Organisations who facilitate their own partners with content for
                efficient content distribution.
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
                View all States (or) Organisations
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
            Partners
          </Typography>
          <Typography
            className={`${LocalStyle.textDescription} text-left ${GlobalStyles.bold400} ${GlobalStyles.size22} ${GlobalStyles.highlighted_text}`}
          >
            <b style={{ fontWeight: "bold" }}></b>
            Organisations that has the public or private content and can uplod
            into system seamlessly.
            <b style={{ fontWeight: "bold" }}></b>
          </Typography>
        </div>
        <div style={{ padding: mobile || tablet ? "0px 25px" : "0px 144px" }}>
          <ParticipantsCarouselNew title="Our Partners are" />
        </div>
        <Row className={`${LocalStyle.viewDatasetButtonContainer}`}>
          <Button
            style={{ marginBottom: "25px" }}
            className={`${LocalStyle.viewDatasetButton} ${GlobalStyles.primary_button} ${GlobalStyles.homeButtonWidth}`}
            onClick={() => history.push("/home/participants")}
            id="home-view-all-participants-btn-id"
          >
            View all partners
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
                Foster data-driven decisions by unifying all departments and
                organisations to seamlessly share their content repository and
                unlock their true potential by delivering value.
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
                  <img  src={microsite_point1}  />
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
                  <img  src={microsite_point2}  />
                </span>
                <span className="text-left">Unleash the Power of Content</span>
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
                  <img  src={microsite_point3}  />
                </span>
                <span className="text-left">
                  Enable data-driven decision making
                </span>
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
                  <img  src={microsite_point4}  />
                </span>
                <span className="text-left">Scale-up your impact </span>
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={12} md={12} xl={6} xxl={6}>
            <img className={
                mobile
                  ? LocalStyle.micrositeLogo_mobile
                  : LocalStyle.micrositeLogo
              }
               src={micro2} 
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
            className={`${LocalStyle.primaryButton} ${LocalStyle.centeredButtonContainer} ${GlobalStyles.primary_button} ${GlobalStyles.homeButtonWidth}`}
            onClick={() => !getTokenLocal() && history.push("/login")}
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
          <img className={
              largeDesktop ? LocalStyle.image_for_big : LocalStyle.image
            }
             src={micro3} 
            width={"100%"}
            loading="lazy"
          />
        </div>
      </Box>
    </>
  );
};

export default GuestUserHome;

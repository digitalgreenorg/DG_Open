import React from "react";
import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import styles from "./FarmerDemography.module.css"; // Import your module CSS file
import { Col, Row } from "react-bootstrap";

const FarmerDemographics = (props) => {
  const {
    statesOnboarded,
    districtsOnboarded,
    POPUploaded,
    videosUploaded,
    languagesSupported,
    femaleFLEW,
    maleFLEW,
    // showConstituencies,
  } = props;
  console.log(
    "🚀 ~ file: FarmerDemography.js:9 ~ FarmerDemographics ~ props:",
    props
  );
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  console.log("🚀 ~ file: index.js:61 ~ mobile:", mobile);
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  console.log("🚀 ~ file: index.js:63 ~ tablet:", tablet);
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  console.log("🚀 ~ file: index.js:65 ~ miniLaptop:", miniLaptop);
  const laptop = useMediaQuery(theme.breakpoints.down("xl"));
  console.log("🚀 ~ file: index.js:67 ~ laptop:", laptop);
  const desktop = useMediaQuery(theme.breakpoints.down("xl"));
  console.log("🚀 ~ file: index.js:69 ~ desktop:", desktop);
  const largeDesktop = useMediaQuery(theme.breakpoints.up("xxl"));
  console.log("🚀 ~ file: index.js:71 ~ largeDesktop:", largeDesktop);

  return (
    <>
      <Typography
        className={styles.title}
        variant="h4"
        sx={{ textAlign: "left" }}
      >
        Vistaar Metrix
      </Typography>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: mobile
            ? "auto"
            : tablet
            ? "auto auto"
            : miniLaptop
            ? "auto auto auto"
            : "repeat(5, 1fr)",
          gap: 20,
        }}
        className={styles.dashboardCardContainerDiv}
      >
        {/* <Col sm={6} md={3} lg={2} xl={2}> */}
        <Paper
          elevation={3}
          className={`${styles.totalRecords} ${styles.demographyCard}`}
        >
          <Typography variant="h6">States Onboarded</Typography>
          <Typography variant="body1" className={`${styles.valueClass}`}>
            {statesOnboarded}
          </Typography>
        </Paper>
        <Paper
          elevation={3}
          className={`${styles.totalRecords} ${styles.demographyCard}`}
        >
          <Typography variant="h6">Districts Onboarded</Typography>
          <Typography variant="body1" className={`${styles.valueClass}`}>
            {districtsOnboarded}
          </Typography>
        </Paper>
        {/* </Col> */}
        {/* <Col sm={6} md={3} lg={2} xl={2}> */}
        {/* <Paper
          elevation={3}
          className={`${styles.mobileNumber} ${styles.demographyCard}`}
        >
          <Typography variant="h6">KVK’s onboarded</Typography>
          <Typography variant="body1" className={`${styles.valueClass} `}>
            {KVKOnboarded}
          </Typography>
        </Paper> */}
        {/* </Col> */}
        {/* <Col sm={6} md={3} lg={2} xl={2}> */}
        {/* <Paper
          elevation={3}
          className={`${styles.counties} ${styles.demographyCard}`}
        >
          <Typography variant="h6">Departments Onboarded</Typography>
          <Typography variant="body1" className={`${styles.valueClass}`}>
            {departmentsOnboarded}
          </Typography>
        </Paper> */}
        {/* </Col> */}
        {/* <Col sm={6} md={3} lg={2} xl={2}> */}
        <Paper
          elevation={3}
          className={`${styles.subCounties} ${styles.demographyCard}`}
        >
          <Typography variant="h6">POP uploaded</Typography>
          <Typography variant="body1" className={`${styles.valueClass}`}>
            {POPUploaded}
          </Typography>
        </Paper>
        <Paper
          elevation={3}
          className={`${styles.subCounties} ${styles.demographyCard}`}
        >
          <Typography variant="h6">Videos uploaded</Typography>
          <Typography variant="body1" className={`${styles.valueClass}`}>
            {videosUploaded}
          </Typography>
        </Paper>
        <Paper
          elevation={3}
          className={`${styles.subCounties} ${styles.demographyCard}`}
        >
          <Typography variant="h6">Languages supported</Typography>
          <Typography variant="body1" className={`${styles.valueClass}`}>
            {languagesSupported}
          </Typography>
        </Paper>
        <Paper
          elevation={3}
          className={`${styles.subCounties} ${styles.demographyCard}`}
        >
          <Typography variant="h6">Total FLEW</Typography>
          <Typography variant="body1" className={`${styles.valueClass}`}>
            {femaleFLEW + maleFLEW}
          </Typography>
        </Paper>
        <Paper
          elevation={3}
          className={`${styles.subCounties} ${styles.demographyCard}`}
        >
          <Typography variant="h6">Female FLEW</Typography>
          <Typography variant="body1" className={`${styles.valueClass}`}>
            {femaleFLEW}
          </Typography>
        </Paper>
        <Paper
          elevation={3}
          className={`${styles.subCounties} ${styles.demographyCard}`}
        >
          <Typography variant="h6">Male FLEW</Typography>
          <Typography variant="body1" className={`${styles.valueClass}`}>
            {maleFLEW}
          </Typography>
        </Paper>

        {/* </Col> */}
        {/* <Col sm={6} md={3} lg={2} xl={2}> */}
        {/* {constituencies ? (
          <Paper
            elevation={3}
            className={`${styles.counties} ${styles.demographyCard}`}
          >
            <Typography variant="h6">Constituencies</Typography>
            <Typography variant="body1" className={`${styles.valueClass}`}>
              {constituencies}
            </Typography>
          </Paper>
        ) : (
          ""
        )} */}
        {/* </Col> */}
      </div>
    </>
  );
};

export default FarmerDemographics;

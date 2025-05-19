import React from "react";
import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import dg_title from "../../../Assets/Img/dg_title.svg";
import digitalgreen_logo from "../../../Assets/Img/Farmstack V2.0/digitalgreen_logo.jpeg";
import aiep_logo from "../../../Assets/Img/AIEP_logo.svg"
import styles from "./footer.module.css";

const Footer = () => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));

  const containerStyle = {
    marginLeft: mobile || tablet ? "30px" : miniLaptop ? "50px" : "144px",
    marginRight: mobile || tablet ? "30px" : miniLaptop ? "50px" : "144px",
  };

  return (
    <>
      {/* <Divider /> */}
      <Box sx={containerStyle}>
        <Box
          className={`${
            mobile ? "" : "d-flex justify-content-around align-items-center"
          } mt20 ${styles.h88}`}
        >
          <Box>
            {/* <Typography className={styles.title1}>Technical partner</Typography> */}
            <Box>
              <img src={aiep_logo} height={"50px"} />
            </Box>
          </Box>
          <Box className={` ${mobile ? "mt10" : ""} ${styles.title2}`}>
            About AIEP
          </Box>
          <Box className={` ${mobile ? "mt10" : ""} ${styles.title3}`}>
            Contact:{" "}
            <span className={styles.title3_link}>support@digitalgreen.org</span>
          </Box>
          <Box
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
              className={` ${mobile ? "mt10" : ""} ${styles.title3}`}
            >
              <span>Quick Links: </span>
              <Typography>
                <a
                  href="https://evaluate.farmer.chat"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  RLHF
                </a>
              </Typography>
              <Typography >
                <a
                  href="https://sandbox.farmer.chat"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sandbox
                </a>
              </Typography>
            </Box>
        </Box>
      </Box>
    </>
  );
};

export default Footer;

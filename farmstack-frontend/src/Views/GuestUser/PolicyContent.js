import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { downloadAttachment } from "../../Utils/Common";

const PolicyContent = ({ description, url }) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box>
      <Box>{description}</Box>
      <Box
        className={mobile ? "" : "d-flex justify-content-end"}
        sx={{
          marginTop: "50px",
        }}
      >
        <Box sx={{ textAlign: mobile ? "center" : "left" }}>
          <Button
            sx={{
              fontFamily: "Montserrat",
              fontWeight: 700,
              fontSize: "13px",
              height: "48px",
              border: "1px solid rgba(0, 171, 85, 0.48)",
              borderRadius: "8px",
              color: "#00A94F",
              textTransform: "none",
              width: mobile ? "100%" : "auto",
              "&:hover": {
                background: "none",
                border: "1px solid rgba(0, 171, 85, 0.48)",
              },
            }}
            variant="outlined"
            onClick={() => window.open(url, "_blank")}
          >
            <img
              style={{ margin: "0 9px" }}
              src={require("../../Assets/Img/view.svg")}
            />
            View Document
          </Button>
        </Box>
        <Box sx={{ textAlign: mobile ? "center" : "left" }}>
          <Button
            sx={{
              fontFamily: "Montserrat",
              fontWeight: 700,
              fontSize: "13px",
              height: "48px",
              background: "#00A94F",
              borderRadius: "8px",
              textTransform: "none",
              marginLeft: mobile ? "0px" : "50px",
              marginRight: mobile ? "0px" : "32px",
              marginTop: mobile ? "20px" : "0px",
              width: mobile ? "100%" : "auto",
              "&:hover": {
                backgroundColor: "#00A94F",
                color: "#fffff",
              },
            }}
            variant="contained"
            onClick={() => downloadAttachment(url)}
          >
            <img
              style={{ margin: "0 9px" }}
              src={require("../../Assets/Img/new_download.svg")}
            />
            Download Document
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PolicyContent;

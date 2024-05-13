import React from "react";
import { Box, Typography } from "@mui/material";
import style from "./connector.module.css";
import globalStyle from "../../Assets/CSS/global.module.css";
const JoinedBy = ({ left, right, type }) => {
  return (
    <Box className={style.joinedBy}>
      <Typography
        className={`${globalStyle.bold600} ${globalStyle.size18}  ${globalStyle.dark_color} ${style.mt10} mb-20 ml-20 text-left`}
        sx={{
          fontFamily: "Montserrat !important",
          lineHeight: "22px",
        }}
      >
        Joined by
      </Typography>
      <Box className="d-flex">
        <div className={`${style.joinedByLeft} text-left ml-20`}>
          <Typography
            className={`${globalStyle.bold400} ${globalStyle.size16}  ${globalStyle.dark_color}`}
            sx={{
              fontFamily: "Montserrat !important",
              lineHeight: "24px",
            }}
          >
            Left column
          </Typography>
          <Typography
            className={`${globalStyle.bold700} ${globalStyle.size16}  ${globalStyle.dark_color} ${style.textElipsis}`}
            sx={{
              fontFamily: "Montserrat !important",
              lineHeight: "24px",
            }}
          >
            {left}
          </Typography>
        </div>
        <div className={`${style.joinedByRight} text-left`}>
          <Typography
            className={`${globalStyle.bold400} ${globalStyle.size16}  ${globalStyle.dark_color}`}
            sx={{
              fontFamily: "Montserrat !important",
              lineHeight: "24px",
            }}
          >
            Right column
          </Typography>
          <Typography
            className={`${globalStyle.bold700} ${globalStyle.size16}  ${globalStyle.dark_color} ${style.textElipsis}`}
            sx={{
              fontFamily: "Montserrat !important",
              lineHeight: "24px",
            }}
          >
            {right}
          </Typography>
        </div>
        <div className={`text-left`}>
          <Typography
            className={`${globalStyle.bold400} ${globalStyle.size16}  ${globalStyle.dark_color}`}
            sx={{
              fontFamily: "Montserrat !important",
              lineHeight: "24px",
            }}
          >
            Join type
          </Typography>
          <Typography
            className={`${globalStyle.bold700} ${globalStyle.size16}  ${globalStyle.dark_color}`}
            sx={{
              fontFamily: "Montserrat !important",
              lineHeight: "24px",
            }}
          >
            {type}
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default JoinedBy;

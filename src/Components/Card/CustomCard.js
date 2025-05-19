import React from "react";
import LocalStyle from "./CustomCard.module.css";
import Card from "@mui/material/Card";
import UrlConstant from "../../Constants/UrlConstants";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const CustomCard = (props) => {
  const {
    image,
    title,
    subTitle1,
    subTitle2,
    subTitle1Value,
    subTitle2Value,
    index,
  } = props;
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  let imageUrl = image ?? "";

  return (
    <>
      <Card
        id={`${title ? title : "title"}-card-${index ? index : ""}`}
        className={LocalStyle.card}
      >
        <div className={LocalStyle.img_container}>
          {imageUrl ? (
            <img
              className={mobile ? LocalStyle.imgSm : LocalStyle.img}
              id={`${title ? title : "title"}-card-img-${index ? index : ""}`}
              src={imageUrl}
              alt="new"
            />
          ) : (
            <h1 className={LocalStyle.firstLetterOnLogo}>
              {title?.split("")[0]?.toUpperCase()}
            </h1>
          )}
        </div>
        <div
          id={`${title ? title : "title"}-card-title-${index ? index : ""}`}
          className={
            mobile || tablet
              ? LocalStyle.content_title_sm
              : LocalStyle.content_title
          }
        >
          {title ? title : ""}
        </div>
        {/* <div className={LocalStyle.displayFlex}>
          <div className={LocalStyle.content_text}>
            <div
              id={`${title ? title : "subtitle1"}-card-subtitle1-${
                index ? index : ""
              }`}
              className={
                mobile ? LocalStyle.content_text1_sm : LocalStyle.content_text1
              }
            >
              {subTitle1 ? subTitle1 : ""}
            </div>
            <div
              id={`${title ? title : "subtitle2"}-card-subtitle2-${
                index ? index : ""
              }`}
              className={
                mobile ? LocalStyle.content_text2_sm : LocalStyle.content_text2
              }
            >
              {subTitle1Value ? subTitle1Value : 0}
            </div>
          </div>
          <div className={LocalStyle.content_text}>
            <div
              id={`${title ? title : "subtitle3"}-card-subtitle3-${
                index ? index : ""
              }`}
              className={
                mobile ? LocalStyle.content_text1_sm : LocalStyle.content_text1
              }
            >
              {subTitle2 ? subTitle2 : ""}
            </div>
            <div
              id={`${title ? title : "subtitle4"}-card-subtitle4-${
                index ? index : ""
              }`}
              className={
                mobile ? LocalStyle.content_text2_sm : LocalStyle.content_text2
              }
            >
              {subTitle2Value || subTitle2Value == 0 ? subTitle2Value : ""}
            </div>
          </div>
        </div> */}
        <Box
          className="text-left"
          sx={{ marginLeft: "39px", marginRight: "39px" }}
        >
          <Box>
            <Typography>{subTitle1 ? subTitle1 : ""}</Typography>
            <Box>{subTitle1Value ? subTitle1Value : ""}</Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <Typography>{subTitle2 ? subTitle2 : ""}</Typography>
            <Box sx={{ marginTop: "19px" }}>
              {subTitle2Value ? subTitle2Value : ""}
            </Box>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default CustomCard;

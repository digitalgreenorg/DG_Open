import { Card, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import LocalStyle from "./DatasetCard.module.css";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import "../../Components/Datasets_New/DataSets.css";

const DatasetCart = (props) => {
  const { publishDate, title, orgnisationName, geography, category, update } =
    props;
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  let updatedDate = new Date(update);
  console.log("updatedDate", geography);
  let currantDate = new Date();
  let monthDiff = currantDate?.getMonth() - updatedDate?.getMonth();
  let yearDiff = (currantDate?.getFullYear() - updatedDate?.getFullYear()) * 12;
  let finalMonthDiff = yearDiff + monthDiff;

  return (
    <Card
      className={mobile ? LocalStyle.cardContainerSm : LocalStyle.cardContainer}
    >
      <div className="published">
        <img src={require("../../Assets/Img/globe_img.svg")} />
        <span className="published_text">
          Published on:{" "}
          {publishDate?.split("T")[0]
            ? publishDate?.split("T")[0]
            : "Not Available"}
        </span>
      </div>
      <div className="d_content_title">{title}</div>
      <div className={"organisation"}>
        {orgnisationName && (
          <img src={require("../../Assets/Img/apartment.svg")} />
        )}
        {orgnisationName && (
          <span className="organisation_text">{orgnisationName}</span>
        )}
      </div>
      <div className="d_content_text">
        <div className="category">
          <img src={require("../../Assets/Img/category.svg")} alt="category" />
          <span className="category_text">
            {Object.keys(category).length
              ? category?.length > 1
                ? `${category[0]} (+${category.length - 1})`
                : category?.[0]
              : "Not Available"}
          </span>
        </div>
        <div className="location">
          <img src={require("../../Assets/Img/location.svg")} alt="location" />
          <span className="location_text">
            {geography?.country?.name
              ? geography?.country?.name
              : "Not Available"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default DatasetCart;

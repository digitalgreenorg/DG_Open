import location from "../../Assets/Img/location.svg";
import categoryIcon from "../../Assets/Img/category.svg";
import apartment from "../../Assets/Img/apartment.svg";
import globe_img from "../../Assets/Img/globe_img.svg";
import { Card, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import LocalStyle from "./DatasetCard.module.css";
import "../../Components/Datasets_New/DataSets.css";

const DatasetCart = (props) => {
  const { publishDate, title, orgnisationName, geography, category, update } =
    props;
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const tablet = useMediaQuery(theme.breakpoints.down("md"));
  let updatedDate = new Date(update);
  console.log("updatedDate", updatedDate);
  // let currantDate = new Date();
  // let monthDiff = currantDate?.getMonth() - updatedDate?.getMonth();
  // let yearDiff = (currantDate?.getFullYear() - updatedDate?.getFullYear()) * 12;
  // let finalMonthDiff = yearDiff + monthDiff;

  return (
    <Card
      className={mobile ? LocalStyle.cardContainerSm : LocalStyle.cardContainer}
    >
      <div className="published">
        <img src={globe_img} />
        <span className="published_text">
          Published on:{" "}
          {publishDate?.split("T")[0]
            ? publishDate?.split("T")[0]
            : "Not Available"}
        </span>
      </div>
      <div className="d_content_title">{title}</div>
      <div className={"organisation"}>
        {orgnisationName && <img src={apartment} />}
        {orgnisationName && (
          <span className="organisation_text">{orgnisationName}</span>
        )}
      </div>
      <div className="d_content_text">
        <div className="category">
          <img src={categoryIcon} alt="category" />
          <span className="category_text">
            {Object.keys(category).length
              ? category?.length > 1
                ? `${category[0]} (+${category.length - 1})`
                : category?.[0]
              : "Not Available"}
          </span>
        </div>
        <div className="location">
          <img src={location} alt="location" />
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

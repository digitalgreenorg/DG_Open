import calendar_new from '../../Assets/Img/calendar_new.svg';
import location from '../../Assets/Img/location.svg';
import category from '../../Assets/Img/category.svg';
import organisation from '../../Assets/Img/organisation.svg';
import globe from '../../Assets/Img/globe.svg';
import { Card } from "@mui/material";
import React from "react";
import { dateTimeFormat } from "common/utils/utils";

const cardSx = {
  maxWidth: 368,
  height: 190,
  border: "1px solid #C0C7D1",
  borderRadius: "10px",
  cursor: "pointer",
  "&:hover": {
    boxShadow: "-40px 40px 80px rgba(145, 158, 171, 0.16)",
    cursor: "pointer",
    border: "1px solid #2CD37F",
  },
};
const DataSetCardNew = ({
  history,
  item,
  title,
  handleCardClick,
  value,
  index,
}) => {
  const renderCategory = () => {
    if (item?.categories.length === 0) {
      return <span>Not Available</span>;
    } else if (item?.categories.length === 1) {
      return <span>{item?.categories[0].name}</span>;
    } else {
      return (
        <span style={{ color: "#00A94F" }}>
          {item?.categories[0].name} +{item?.categories.length - 1}
        </span>
      );
    }
  };

  return (
    <Card
      className="card"
      sx={cardSx}
      onClick={() =>
        history.push(handleCardClick(item?.id), { data: title, tab: value })
      }
      id={`dataset-card-view-id${index}`}
      data-testid="navigate_dataset_view"
    >
      <div className="published">
        <img  src={globe}  alt="globe" />
        <span className="published_text">
          Published on:{" "}
          {item?.created_at
            ? dateTimeFormat(item?.created_at, false)
            : "Not Available"}
        </span>
      </div>
      <div className="d_content_title">{item?.name}</div>
      <div className="organisation">
        <img  src={organisation} 
          alt="organisation"
        />
        <span className="organisation_text">{item?.organization?.name}</span>
      </div>
      <div className="d_content_text">
        <div className="category">
          <img  src={category}  alt="category" />
          <span className="category_text">{renderCategory()}</span>
        </div>
        <div className="location">
          <img  src={location}  alt="location" />
          <span className="location_text">
            {item?.geography?.country?.name
              ? item?.geography?.country?.name
              : "Not Available"}
          </span>
        </div>
        {/* <div className="calendar">
          <img  src={calendar_new} 
            alt="calendar"
          />
          <span className="calendar_text">
            {item?.updated_at ? dateTimeFormat(item.updated_at, false) : "Not Available"}
          </span>
        </div> */}
      </div>
    </Card>
  );
};

export default DataSetCardNew;

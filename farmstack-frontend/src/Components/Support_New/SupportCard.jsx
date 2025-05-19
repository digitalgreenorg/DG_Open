import { Card } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import LocalStyle from "./Support.module.css";
import GlobalStyle from "../../Assets/CSS/global.module.css";

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
const SupportCard = ({
  date,
  ticketname,
  org,
  category,
  user_name,
  ticketstatus,
  supportId,
  handleSupportViewRoute,
}) => {
  const history = useHistory();
  return (
    <>
      <Card
        className="card"
        sx={cardSx}
        onClick={() => history.push(handleSupportViewRoute(supportId))}
        id={`support-card-id ${supportId}`}
      >
        <div className="published">
          <img src={require("../../Assets/Img/globe.svg")} alt="globe" />
          <span className="published_text">
            Published on: {date ? date : "NA"}
          </span>
        </div>
        <div className="d_content_title">{ticketname ? ticketname : "NA"}</div>
        <div className="organisation">
          <img
            src={require("../../Assets/Img/organisation.svg")}
            alt="organisation"
          />
          <span className="organisation_text">{org ? org : "NA"}</span>
        </div>
        <div className="d_content_text">
          <div className="category">
            <img
              src={require("../../Assets/Img/category.svg")}
              alt="category"
            />
            <span className={`category_text ${LocalStyle.textOverFlow}`}>
              {category ? category : "NA"}
            </span>
          </div>
          <div className="location">
            <img
              src={require("../../Assets/Img/supportName.svg")}
              alt="user_name"
            />
            <span className={`location_text ${LocalStyle.textOverFlow}`}>
              {user_name ? user_name : "NA"}
            </span>
          </div>
          <div className={`${LocalStyle.statusCol}`}>
            <img
              src={require("../../Assets/Img/supportStatus.svg")}
              alt="calendar"
            />
            <span
              className={` ${
                ticketstatus === "closed"
                  ? LocalStyle.greenText
                  : LocalStyle.redText
              } ${LocalStyle.ticket_status_text} ${GlobalStyle.bold600} ${
                GlobalStyle.size16
              }`}
            >
              {ticketstatus ? ticketstatus : "NA"}
            </span>
          </div>
        </div>
      </Card>
    </>
  );
};

export default SupportCard;

import React from "react";
import { Card } from "@mui/material";
import { dateTimeFormat } from "../../Utils/Common";
import style from "./Connector.module.css";
import { Typography } from "antd";

const cardSx = {
  maxWidth: "initial",
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
const ConnectorCardView = ({ item, history, handleEditConnectorRoute }) => {
  return (
    <Card
      className="card"
      sx={cardSx}
      onClick={() => history.push(handleEditConnectorRoute(item.id))}
      id="connector-card"
      data-testid="connector-card"
    >
      <div className={style.published}>
        <img src={require("../../Assets/Img/globe.svg")} alt="globe" />
        <span className={style.publishedText}>
          Published on: {dateTimeFormat(item?.updated_at, false)}
        </span>
      </div>
      <div className={style.contentTitle}>{item?.name}</div>
      <div className={style.contentText}>
        <div>
          <Typography className={style.contentLightText}>
            Used datasets
          </Typography>
          <Typography className={style.contentBoldText}>
            {item?.dataset_count}
          </Typography>
        </div>
        <div className={style.contentText2}>
          <Typography className={style.contentLightText}>Providers</Typography>
          <Typography className={style.contentBoldText}>
            {item?.providers_count}
          </Typography>
        </div>
      </div>
    </Card>
  );
};

export default ConnectorCardView;

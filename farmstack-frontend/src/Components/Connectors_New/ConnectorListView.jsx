import { Box, Divider } from "@mui/material";
import { Typography } from "antd";
import React from "react";
import style from "./Connector.module.css";
import globalStyle from "../../Assets/CSS/global.module.css";
import { dateTimeFormat } from "../../Utils/Common";

const ConnectorListView = ({
  connectors,
  history,
  handleEditConnectorRoute,
}) => {
  return (
    <div>
      <Box className="d-flex justify-content-between mb-20">
        <Typography
          className={`${style.listViewTitle} ${style.firstCol} w-100 text-left ml-20`}
        >
          Use case name
        </Typography>
        <Typography
          className={`${style.listViewTitle} ${style.secondCol} w-100 text-left ml-90`}
        >
          Used datasets
        </Typography>
        <Typography className={`${style.listViewTitle} w-100 text-left`}>
          Providers
        </Typography>
        <Typography
          className={`${style.listViewTitle} ${style.fourthCol} w-100 text-left`}
        >
          Published on
        </Typography>
      </Box>
      <Divider />
      {connectors?.map((item) => (
        <>
          <Box
            className="d-flex justify-content-between mb-20 mt-20 cursor-pointer"
            onClick={() => history.push(handleEditConnectorRoute(item.id))}
          >
            <Typography
              className={`${style.listViewText} ${style.listViewName} ${globalStyle.primary_color} ${style.firstCol} w-100 text-left ml-20`}
            >
              {item?.name}
            </Typography>
            <Typography
              className={`${style.listViewText} ${style.secondCol} w-100 text-left ml-90`}
            >
              {item?.dataset_count}
            </Typography>
            <Typography className={`${style.listViewText} w-100 text-left`}>
              {item?.providers_count}
            </Typography>
            <Typography
              className={`${style.listViewText} ${style.fourthCol} w-100 text-left`}
            >
              {dateTimeFormat(item?.updated_at, false)}
            </Typography>
          </Box>
          <Divider />
        </>
      ))}
    </div>
  );
};

export default ConnectorListView;

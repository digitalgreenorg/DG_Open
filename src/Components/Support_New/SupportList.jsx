import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { dateTimeFormat } from "../../Utils/Common";
import { useHistory } from "react-router-dom";
import LocalStyle from "./Support.module.css";
import GlobalStyle from "../../Assets/CSS/global.module.css";

export default function SupportList({ ticketList, handleSupportViewRoute }) {
  const history = useHistory();
  return (
    <div className="mt-50">
      <Box className="d-flex justify-content-between mb-20">
        <Typography className="datasets_list_view_title w-100 text-left ml-20">
          Title
        </Typography>
        <Typography className="datasets_list_view_title w-100 text-left ml-90">
          <img
            src={require("../../Assets/Img/organisation.svg")}
            alt="organisation"
            className={`${LocalStyle.iconStyle}`}
          />
          Organisation
        </Typography>
        <Typography className="datasets_list_view_title w-100 text-left ml-20">
          <img
            src={require("../../Assets/Img/category.svg")}
            alt="category"
            className={`${LocalStyle.iconStyle}`}
          />
          Category
        </Typography>
        <Typography className="datasets_list_view_title w-100 text-left ml-20">
          <img
            src={require("../../Assets/Img/raised_logo.svg")}
            alt="calendar"
            className={`${LocalStyle.iconStyle}`}
          />
          Raised on
        </Typography>
        <Typography className="datasets_list_view_title w-100 text-center">
          <img
            src={require("../../Assets/Img/status_logo.svg")}
            alt="calendar"
            className={`${LocalStyle.iconStyle}`}
          />
          Status
        </Typography>
      </Box>
      <Divider />
      {ticketList?.map((item, index) => (
        <>
          <Box
            className="d-flex justify-content-between mb-20 mt-20 cursor-pointer"
            onClick={() => history.push(handleSupportViewRoute(item?.id))}
            id={`${item?.ticket_title}-${index}-support-list`}
          >
            <Typography
              className={`datasets_list_view_text datasets_list_view_name green_text w-100 text-left ml-20`}
            >
              <span className={`${GlobalStyle.bold700} ${GlobalStyle.size24}`}>
                {item ? item?.ticket_title : "NA"}
              </span>
            </Typography>
            <Typography className="datasets_list_view_text w-100 text-left ml-90">
              <div
                className={`${GlobalStyle.bold600} ${GlobalStyle.size16} ${GlobalStyle.break_word}`}
              >
                {item ? item?.user_map?.organization?.name : "NA"}
              </div>
              <div
                style={{ marginTop: "10px" }}
                className={`${LocalStyle.textOverFlow}`}
              >
                {item ? item?.user_map?.user?.first_name : "NA"}
              </div>
            </Typography>
            <Typography
              className={`datasets_list_view_text w-100 text-left ml-20 ${GlobalStyle.break_word}`}
            >
              {item ? item?.category : "NA"}
            </Typography>
            <Typography className="datasets_list_view_text w-100 text-left ml-20">
              {item?.created_at
                ? dateTimeFormat(item?.created_at, false)
                : "NA"}
            </Typography>
            <Typography className={`datasets_list_view_text w-100 text-center`}>
              <span
                className={`${
                  item?.status === "closed"
                    ? LocalStyle.greenText
                    : LocalStyle.redText
                } ${GlobalStyle.bold600} ${GlobalStyle.size16}`}
              >
                {item ? item?.status : "NA"}
              </span>
            </Typography>
          </Box>
          <Divider />
        </>
      ))}
    </div>
  );
}

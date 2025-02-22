import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import "./DataSetsListView.css";
import { dateTimeFormat } from "common/utils/utils";

const DataSetsListView = ({
  datasets,
  history,
  title,
  handleCardClick,
  value,
}) => {
  return (
    <div className="mt-50">
      <Box className="d-flex justify-content-between mb-20">
        <Typography className="datasets_list_view_title w-100 text-left ml-20">
          Dataset name
        </Typography>
        <Typography className="datasets_list_view_title w-100 text-left ml-90">
          Organisation
        </Typography>
        <Typography className="datasets_list_view_title w-100 text-left">
          Category
        </Typography>
        <Typography className="datasets_list_view_title w-100 text-left">
          Geography
        </Typography>
        {/* <Typography className='datasets_list_view_title w-100 text-left'>Age of dataset</Typography> */}
        <Typography className="datasets_list_view_title w-100 text-center">
          Published on
        </Typography>
      </Box>
      <Divider />
      {datasets?.map((item) => (
        <>
          <Box
            className="d-flex justify-content-between mb-20 mt-20 cursor-pointer"
            onClick={() =>
              history.push(handleCardClick(item?.id), {
                data: title,
                tab: value,
              })
            }
            id={`${item?.name?.split(" ").join("-")}-dataset-list-view-card`}
          >
            <Typography className="datasets_list_view_text datasets_list_view_name green_text w-100 text-left ml-20">
              {item?.name}
            </Typography>
            <Typography className="datasets_list_view_text w-100 text-left ml-90 datasets_list_view_details_ellipsis">
              {item?.organization?.name}
            </Typography>
            <Typography className="datasets_list_view_text w-100 text-left datasets_list_view_details_ellipsis">
              {Object.keys(item?.category).length ? (
                Object.keys(item?.category).length > 1 ? (
                  <>
                    {Object.keys(item?.category)[0]}
                    <span style={{ color: "#00A94F" }}>
                      {" "}
                      +{String(Object.keys(item?.category).length - 1)}
                    </span>
                  </>
                ) : (
                  Object.keys(item?.category)[0]
                )
              ) : (
                "NA"
              )}
            </Typography>
            <Typography className="datasets_list_view_text w-100 text-left datasets_list_view_details_ellipsis">
              {item?.geography?.country?.name
                ? item?.geography?.country?.name
                : "NA"}
            </Typography>
            {/* <Typography className="datasets_list_view_text w-100 text-left">
              {item?.age_of_date ? item.age_of_date : "NA"}
            </Typography> */}
            <Typography className="datasets_list_view_text w-100 text-center">
              {item?.created_at
                ? dateTimeFormat(item?.created_at, false)
                : "NA"}
            </Typography>
          </Box>
          <Divider />
        </>
      ))}
    </div>
  );
};

export default DataSetsListView;

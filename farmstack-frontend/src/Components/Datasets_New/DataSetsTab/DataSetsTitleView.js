import React from "react";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import GlobalStyle from "../../../Assets/CSS/global.module.css";

const DataSetsTitleView = ({
  title,
  isGrid,
  setIsGrid,
  history,
  addDataset,
  subTitle,
  user,
  categorises,
  geographies,
  dates,
  searchDatasetsName,
  showAllDataset,
}) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div
      className={
        "d-flex justify-content-between " +
        (mobile || tablet ? "flex-column" : "")
      }
    >
      <div className="bold_title_main">
        {title}
        <Typography
          className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
        >
          {" "}
          {subTitle}{" "}
        </Typography>
      </div>
      {console.log(categorises, geographies, dates, user, "here1")}
      {console.log(Object.keys(categorises).length <= 0, "here1")}
      {console.log(!geographies[1], "here1")}
      {console.log(!geographies[2], "here1")}
      {console.log(dates[0]?.toDate, "here1")}
      {console.log(user !== "guest", "here1")}

      {!showAllDataset &&
      Object.keys(categorises).length <= 0 &&
      !geographies[1] &&
      !geographies[2] &&
      !dates[0]?.fromDate &&
      !dates[0]?.toDate &&
      searchDatasetsName?.length < 3 ? (
        <></>
      ) : (
        <div
          className={
            "d-flex align-items-center mt-50 mb-20 " +
            (mobile || tablet ? "justify-content-left" : "")
          }
        >
          {!mobile && !tablet && (
            <div
              className="d-flex mr-30 cursor-pointer"
              onClick={() => setIsGrid(false)}
              id="dataset-list-view-id"
            >
              <img
                className="mr-7"
                src={require(`../../../Assets/Img/${
                  isGrid ? "list_view_gray.svg" : "list_view_green.svg"
                }`)}
              />
              <Typography
                sx={{
                  color: !isGrid ? "#00A94F" : "#3D4A52",
                }}
              >
                List view
              </Typography>
            </div>
          )}
          <div
            className="d-flex cursor-pointer"
            onClick={() => setIsGrid(true)}
            id="dataset-grid-view-id"
          >
            <img
              className="mr-7"
              src={require(`../../../Assets/Img/${
                isGrid ? "grid_view_green.svg" : "grid_view_gray.svg"
              }`)}
            />
            <Typography
              sx={{
                color: isGrid ? "#00A94F" : "#3D4A52",
              }}
            >
              Grid view
            </Typography>
          </div>
          {!isGrid &&
          // user != "guest" &&
          (title === "My organisation datasets" ||
            title === "Co-steward datasets") ? (
            <div className="d-flex">
              <Button
                onClick={() => history.push(addDataset())}
                sx={{
                  fontFamily: "Montserrat !important",
                  fontWeight: 700,
                  fontSize: "15px",
                  width: "149px",
                  height: "48px",
                  border: "1px solid rgba(0, 171, 85, 0.48)",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                  background: "#00A94F",
                  textTransform: "none",
                  marginLeft: mobile || tablet ? "0px" : "52px",
                  "&:hover": {
                    background: "#00A94F",
                  },
                }}
                id="dataset-add-new-dataset"
              >
                + New dataset
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default DataSetsTitleView;

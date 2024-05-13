import React from "react";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import GlobalStyle from "../../Assets/CSS/global.module.css";

const ResourcesTitleView = ({
  title,
  isGrid,
  setIsGrid,
  history,
  addResource,
  user,
  subTitle,
  value,
}) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div className="d-flex justify-content-between">
      <div className="bold_title">
        {title}
        <Typography
          className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
        >
          {subTitle}
        </Typography>
      </div>
      {mobile ? (
        <></>
      ) : (
        <div className="d-flex align-items-center mt-50 mb-20">
          <div
            className="d-flex mr-30 cursor-pointer"
            onClick={() => setIsGrid(false)}
            id="dataset-list-view-id"
          >
            <img
              className="mr-7"
              src={require(`../../Assets/Img/${
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
          <div
            className="d-flex cursor-pointer"
            onClick={() => setIsGrid(true)}
            id="dataset-grid-view-id"
          >
            <img
              className="mr-7"
              src={require(`../../Assets/Img/${
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
          {!isGrid && !user && value === 0 && (
            <div className="d-flex">
              <Button
                onClick={() => history.push(addResource())}
                sx={{
                  fontFamily: "Montserrat !important",
                  fontWeight: 700,
                  fontSize: "15px",
                  width: "160px",
                  height: "48px",
                  border: "1px solid rgba(0, 171, 85, 0.48)",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                  background: "#00A94F",
                  textTransform: "none",
                  marginLeft: "52px",
                  "&:hover": {
                    background: "#00A94F",
                  },
                }}
                id="dataset-add-new-dataset"
              >
                + New Resource
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourcesTitleView;

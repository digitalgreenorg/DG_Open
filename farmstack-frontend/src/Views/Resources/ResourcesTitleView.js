import React from "react";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import { toTitleCase } from "../../Utils/Common";
import labels from "../../Constants/labels";
import { PiGitPullRequestBold } from "react-icons/pi";

const ResourcesTitleView = ({
  title,
  isGrid,
  setIsGrid,
  history,
  addResource,
  user,
  subTitle,
  value,
  handleChange,
}) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div style={{ display: "flex", justifyContent: "right" }}>
      <div className="bold_title hidden">
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
        <div className="d-flex align-items-center">
          {!user && value == 0 && (
            <div className="d-flex">
              <Button
                onClick={() => history.push(addResource())}
                sx={{
                  fontFamily: "Montserrat !important",
                  fontWeight: 700,
                  fontSize: "12px",
                  width: "fit-content",
                  height: "30px", // Increased height for better visibility
                  border: "1px solid rgba(0, 171, 85, 0.48)",
                  borderRadius: "5px",
                  color: "#FFFFFF",
                  background: "#00A94F",
                  textTransform: "none",
                  padding: "0 15px", // Added horizontal padding for a better button shape
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // Soft shadow for 3D effect
                  transition: "background-color 0.3s ease, transform 0.2s ease", // Smooth transition for hover effects
                  "&:hover": {
                    background: "#00873d", // Slightly darker green for hover effect
                    transform: "translateY(-2px)", // Subtle lift effect on hover
                    boxShadow: "0 6px 9px rgba(0,0,0,0.2)", // Increased shadow on hover for depth
                  },
                  "&:active": {
                    transform: "translateY(1px)", // Button presses down on click
                    boxShadow: "0 3px 5px rgba(0,0,0,0.1)", // Less shadow on active to mimic pressing
                  },
                }}
                className="mr-2"
                id="dataset-add-new-dataset"
              >
                + New {toTitleCase(labels.renaming_modules.resources)}
              </Button>
              <Button
                onClick={() => handleChange({}, 2)}
                sx={{
                  fontFamily: "Montserrat !important",
                  fontWeight: 700,
                  fontSize: "12px",
                  width: "fit-content",
                  height: "30px", // Increased height for better visibility
                  border: "1px solid rgba(0, 171, 85, 0.48)",
                  borderRadius: "5px",
                  color: "#00A94F",
                  background: "#FFFFFF",
                  textTransform: "none",
                  padding: "0 15px", // Added horizontal padding for a better button shape
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // Soft shadow for 3D effect
                  transition: "background-color 0.3s ease, transform 0.2s ease", // Smooth transition for hover effects
                  "&:hover": {
                    background: "#FFFFFF", // Slightly darker green for hover effect
                    transform: "translateY(-2px)", // Subtle lift effect on hover
                    boxShadow: "0 6px 9px rgba(0,0,0,0.2)", // Increased shadow on hover for depth
                  },
                  "&:active": {
                    transform: "translateY(1px)", // Button presses down on click
                    boxShadow: "0 3px 5px rgba(0,0,0,0.1)", // Less shadow on active to mimic pressing
                  },
                }}
                className="mr-2"
                id="dataset-add-new-dataset"
              >
                <PiGitPullRequestBold style={{ marginRight: "5px" }} /> Requests
              </Button>
            </div>
          )}
          <div
            className="d-flex mr-2 cursor-pointer"
            onClick={() => setIsGrid(false)}
            id="dataset-list-view-id"
          >
            <img
              className="mr-2"
              src={require(`../../Assets/Img/${
                isGrid ? "list_view_gray.svg" : "list_view_green.svg"
              }`)}
            />
            <Typography
              sx={{
                color: !isGrid ? "#00A94F" : "#3D4A52",
              }}
            ></Typography>
          </div>
          <div
            className="d-flex cursor-pointer"
            onClick={() => setIsGrid(true)}
            id="dataset-grid-view-id"
          >
            <img
              className=""
              src={require(`../../Assets/Img/${
                isGrid ? "grid_view_green.svg" : "grid_view_gray.svg"
              }`)}
            />
            <Typography
              sx={{
                color: isGrid ? "#00A94F" : "#3D4A52",
              }}
            ></Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesTitleView;

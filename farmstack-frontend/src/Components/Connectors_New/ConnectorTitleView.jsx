import React from "react";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import style from "./Connector.module.css";
import ContainedButton from "../Button/ContainedButton";
import { CSSTransition } from "react-transition-group";
const ConnectorTitleView = ({
  title,
  isGrid,
  setIsGrid,
  history,
  addConnector,
  isConnectors,
  user,
}) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div className="d-flex justify-content-between">
      <div className={style.boldTitle}>{title}</div>
      {isConnectors && !mobile ? (
        <div className="d-flex align-items-center mt-50">
          <div
            className="d-flex mr-30 cursor-pointer"
            onClick={() => setIsGrid(false)}
            data-testid="list_view_option_div"
          >
            <img
              className="mr-7"
              src={require(`../../Assets/Img/${
                isGrid ? "list_view_gray.svg" : "list_view_green.svg"
              }`)}
              alt="list_view_image"
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
            data-testid="grid_view_option_div"
          >
            <img
              className="mr-7"
              src={require(`../../Assets/Img/${
                isGrid ? "grid_view_green.svg" : "grid_view_gray.svg"
              }`)}
              alt="grid_view_image"
            />
            <Typography
              sx={{
                color: isGrid ? "#00A94F" : "#3D4A52",
              }}
            >
              Grid view
            </Typography>
          </div>
          {user !== "guest" ? (
            <CSSTransition
              appear={!isGrid}
              in={!isGrid}
              timeout={{
                appear: 600,
                enter: 700,
                exit: 100,
              }}
              classNames="step"
              unmountOnExit
            >
              <div className="d-flex">
                <ContainedButton
                  text={"+ New Use case"}
                  fontWeight={"700"}
                  fontSize={"15px"}
                  width={"166px"}
                  height={"48px"}
                  ml={"52px"}
                  fontFamily={"Montserrat"}
                  handleClick={() => history.push(addConnector())}
                />
              </div>
            </CSSTransition>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ConnectorTitleView;

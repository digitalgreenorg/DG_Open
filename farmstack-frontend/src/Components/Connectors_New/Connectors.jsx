import React, { useState, useEffect, useContext } from "react";
import { Box, Divider, useMediaQuery, useTheme, Button } from "@mui/material";
import AddConnectorCard from "./AddConnectorCard";
import ConnectorCardView from "./ConnectorCardView";
import ConnectorListView from "./ConnectorListView";
import ContainedButton from "../Button/ContainedButton";
import OutlinedButton from "../Button/OutlinedButton";
import style from "./Connector.module.css";
import globalStyle from "../../Assets/CSS/global.module.css";
import ConnectorTitleView from "./ConnectorTitleView";
import { useHistory } from "react-router-dom";
import {
  getTokenLocal,
  getUserLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import { CSSTransition } from "react-transition-group";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Row } from "react-bootstrap";

const Connectors = (props) => {
  const [isGrid, setIsGrid] = useState(true);
  const { callLoader, isLoading } = useContext(FarmStackContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const [connectors, setConnectors] = useState([]);
  const [connectorUrl, setConnectorUrl] = useState("");
  const [showLoadMore, setShowLoadMore] = useState(true);
  const history = useHistory();
  const { isGuestUser, user, breadcrumbFromRoute } = props;

  const addConnector = () => {
    if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      return "/datahub/connectors/add";
    } else if (isLoggedInUserParticipant()) {
      return "/participant/connectors/add";
    }
  };
  const handleEditConnectorRoute = (id) => {
    if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      return `/datahub/connectors/edit/${id}`;
    } else if (isLoggedInUserParticipant()) {
      return `/participant/connectors/edit/${id}`;
    } else {
      return `/home`;
    }
  };
  const handleViewDetailConnectors = (id) => {
    return `/home/connectors/view/${id}`;
  };

  const getConnectors = (isLoadMore) => {
    let url;
    if (!isLoadMore) {
      url =
        UrlConstant.base_url +
        UrlConstant.list_of_connectors +
        "?user=" +
        getUserLocal() +
        "&co_steward=" +
        (isLoggedInUserCoSteward() ? "true" : "false");
    } else {
      url = connectorUrl;
    }

    if (isGuestUser || user == "guest") {
      if (!isLoadMore) {
        url = UrlConstant.base_url + UrlConstant.microsite_list_connectors;
      } else {
        url = connectorUrl;
      }
    }
    let accessToken = isGuestUser ? false : getTokenLocal() ?? false;
    callLoader(true);
    HTTPService("GET", url, "", false, accessToken)
      .then((response) => {
        console.log(response.data.next, "next");
        callLoader(false);
        if (response.data.next == null) {
          setShowLoadMore(false);
        } else {
          setConnectorUrl(response.data.next);
          setShowLoadMore(true);
        }
        let tempArr = [];
        if (isLoadMore) {
          tempArr = [...connectors, ...response.data.results];
        } else {
          tempArr = [...response.data.results];
        }
        setConnectors(tempArr);
      })
      .catch((e) => {
        callLoader(false);
        console.log(e);
      });
  };

  useEffect(() => {
    getConnectors(false);
  }, []);

  return (
    !isLoading && (
      <Box sx={{ maxWidth: "100%" }}>
        <Box
          sx={{
            marginLeft: mobile || tablet ? "30px" : "144px",
            marginRight: mobile || tablet ? "30px" : "144px",
          }}
        >
          {!isGuestUser ? (
            <>
              {user === "guest" ? (
                <div className="text-left">
                  <span
                    className={style.lightTextTitle}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      breadcrumbFromRoute === "Home"
                        ? history.push("/home")
                        : ""
                    }
                  >
                    Home
                  </span>
                  <span className="add_light_text ml-16">
                    <ArrowForwardIosIcon
                      sx={{ fontSize: "14px", fill: "#00A94F" }}
                    />
                  </span>
                  <span className="add_light_text ml-16 fw600">Use cases</span>
                </div>
              ) : (
                <div className="text-left">
                  <span className={style.lightTextTitle}>Use cases</span>
                </div>
              )}
            </>
          ) : (
            ""
          )}
          <Box className="mb-50">
            {!isGuestUser ? (
              <>
                <ConnectorTitleView
                  title={"List of use cases"}
                  isGrid={isGrid}
                  setIsGrid={setIsGrid}
                  history={history}
                  addConnector={addConnector}
                  isConnectors={connectors && connectors?.length > 0}
                  user={user}
                />
                <Divider className="mb-20 mt-24" />
              </>
            ) : (
              ""
            )}

            {connectors && connectors.length > 0 ? (
              <>
                <CSSTransition
                  appear={isGrid}
                  in={isGrid}
                  timeout={{
                    appear: 600,
                    enter: 700,
                    exit: 100,
                  }}
                  classNames="step"
                  unmountOnExit
                >
                  {isGuestUser ? (
                    <div className={style.connectorCard}>
                      {connectors?.map((item) => (
                        <ConnectorCardView
                          history={history}
                          item={item}
                          handleEditConnectorRoute={handleViewDetailConnectors}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className={style.connectorCard}>
                      {user !== "guest" ? (
                        <AddConnectorCard
                          history={history}
                          addConnector={addConnector}
                        />
                      ) : (
                        ""
                      )}
                      {connectors?.map((item) => (
                        <ConnectorCardView
                          history={history}
                          item={item}
                          handleEditConnectorRoute={
                            user === "guest"
                              ? handleViewDetailConnectors
                              : handleEditConnectorRoute
                          }
                        />
                      ))}
                    </div>
                  )}
                </CSSTransition>
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
                  <ConnectorListView
                    connectors={connectors}
                    history={history}
                    handleEditConnectorRoute={handleEditConnectorRoute}
                  />
                </CSSTransition>
                {!isGuestUser && showLoadMore ? (
                  <OutlinedButton
                    text={"Load more"}
                    fontWeight={"700"}
                    fontSize={mobile || tablet ? "14px" : "16px"}
                    width={mobile || tablet ? "162px" : "368px"}
                    height={mobile || tablet ? "36px" : "48px"}
                    mt={"50px"}
                    handleClick={() => getConnectors(true)}
                  />
                ) : (
                  <></>
                )}
                {isGuestUser && showLoadMore && user !== "guest" ? (
                  <Row className={style.buttonContainer}>
                    <Button
                      id={"details-page-load-more-dataset-button"}
                      variant="outlined"
                      className={`${globalStyle.primary_button} ${style.loadMoreButton} ${globalStyle.homeButtonWidth}`}
                      onClick={() => history.push("/home/connectors")}
                    >
                      View all use cases
                    </Button>
                  </Row>
                ) : (
                  ""
                )}
              </>
            ) : (
              <Box>
                <div
                  className={`${globalStyle.bold600} ${globalStyle.size24} ${globalStyle.primary_fontStyle} mt-30`}
                >
                  There are no connectors
                </div>
                <div
                  className={`${globalStyle.bold400} ${globalStyle.size16} ${globalStyle.primary_fontStyle} mt-20`}
                >
                  {!isGuestUser && user !== "guest"
                    ? "As of now there are no connectors, so add new connectors!"
                    : "As of now there are no connectors"}
                </div>
                {!isGuestUser && user !== "guest" ? (
                  <ContainedButton
                    text={"Add New Connector"}
                    fontWeight={"700"}
                    fontSize={"16px"}
                    width={"246px"}
                    height={"48px"}
                    mt={"50px"}
                    handleClick={() => history.push(addConnector())}
                  />
                ) : (
                  ""
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    )
  );
};

export default Connectors;

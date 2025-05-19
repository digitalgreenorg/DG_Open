import { Box, Button, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import ResourcesTitleView from "./ResourcesTitleView";
import { CSSTransition } from "react-transition-group";
import AddDataSetCardNew from "../../Components/Datasets_New/AddDataSetCard";
import { MdExpandMore } from "react-icons/md";
import { RiFileAddLine } from "react-icons/ri";

import {
  GetErrorHandlingRoute,
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
  toTitleCase,
} from "../../Utils/Common";
import ResourceCard from "../../Components/Resources/ResourceCard";
import NoData from "../../Components/NoData/NoData";
import ResourceList from "../../Components/Resources/ResourceList";
import UrlConstant from "../../Constants/UrlConstants";
import labels from "../../Constants/labels";
import ResourceRequestTable from "./TabComponents/ResourceRequestTable";
import HTTPService from "../../Services/HTTPService";
import { FarmStackContext } from "../../Components/Contexts/FarmStackContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const ResourcesTab = ({
  user,
  value,
  setValue,
  history,
  isGrid,
  setIsGrid,
  resources,
  setResources,
  addResource,
  getResources,
  getOtherResources,
  showLoadMoreBtn,
  setResourceUrl,
  setOtherResourceUrl,
  setSearchResourcename,
  searchResourceName,
  debouncedSearchValue,
  handleChatIconClick,
  loader,
}) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const { callLoader, callToast } = useContext(FarmStackContext);

  const handleChange = (event, newValue) => {
    setSearchResourcename("");
    setValue(newValue);
    setResources([]);
    setResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
    setOtherResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
  };

  const handleCardClick = (id) => {
    if (user === "guest") {
      return `/home/resources/view/${id}`;
    } else if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      return `/datahub/resources/view/${id}`;
    } else if (isLoggedInUserParticipant()) {
      return `/participant/resources/view/${id}`;
    }
  };

  const handleDelete = (itemId) => {
    let accessToken = getTokenLocal() ?? false;
    let url =
      UrlConstant.base_url + UrlConstant.resource_endpoint + itemId + "/";
    let isAuthorization = user == "guest" ? false : true;
    callLoader(true);
    HTTPService(
      "DELETE",
      url,
      "",
      false,
      isAuthorization,
      isAuthorization ? accessToken : false
    )
      .then((res) => {
        callLoader(false);
        callToast("Resource deleted successfully!", "success", true);
        getResources(false);
        // if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
        //   history.push(`/datahub/resources`);
        // } else if (isLoggedInUserParticipant()) {
        //   history.push(`/participant/resources`);
        // }
      })
      .catch(async (e) => {
        callLoader(false);

        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong while deleting Resource!",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };

  useEffect(() => {
    if (value === 0 && !searchResourceName) {
      getResources(false);
    }
    if (value === 1 && !searchResourceName) {
      getOtherResources(false);
    }
  }, [value, debouncedSearchValue]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (value == 0 && showLoadMoreBtn) {
      getResources(true);
    } else if (value == 1 && showLoadMoreBtn) {
      getOtherResources(true);
    }
  }, [page]);

  useEffect(() => {
    const options = {
      root: null, // Viewport as the root
      rootMargin: "-100px",
      threshold: 0.5, // Trigger when 10% of the loader is visible
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <>
      <Box className="w-100">
        <Box>
          {user !== "guest" ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: 1,
                borderColor: "#e0e0e0",
                justifyContent: "space-between",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  ".MuiTabs-indicator": {
                    backgroundColor: "#00A94F",
                  },
                  ".MuiTab-root": {
                    textTransform: "none",
                    minWidth: 100,
                    fontWeight: 300,
                    marginRight: "20px",
                    color: "gray",

                    "&:hover": {
                      color: "#00A94F",
                      opacity: 1,
                    },
                    "&.Mui-selected": {
                      color: "#00A94F",
                      fontWeight: "fontWeightMedium",
                    },
                    "&.Mui-focusVisible": {
                      backgroundColor: "rgba(100, 95, 228, 0.32)",
                    },
                  },
                }}
              >
                <Tab
                  sx={{
                    "&.MuiButtonBase-root": {
                      minWidth: "150px",
                    },
                  }}
                  label={
                    <span
                      className={
                        value == 0 ? "tab_header_selected" : "tab_header"
                      }
                      id="dataset-my-orgnanisation-tab"
                    >
                      My {toTitleCase(labels.renaming_modules.resources)}
                    </span>
                  }
                />
                <Tab
                  sx={{
                    "&.MuiButtonBase-root": {
                      minWidth: "200px",
                    },
                  }}
                  label={
                    <span
                      className={
                        value == 1 ? "tab_header_selected" : "tab_header"
                      }
                      id="dataset-other-organisation-tab"
                    >
                      Other Organisations{" "}
                      {toTitleCase(labels.renaming_modules.resources)}
                    </span>
                  }
                />
                {/* <Tab
                sx={{
                  "&.MuiButtonBase-root": {
                    minWidth: "200px",
                  },
                }}
                label={
                  <span
                    className={
                      value == 2 ? "tab_header_selected" : "tab_header"
                    }
                    id="dataset-requests-tab"
                  >
                    Requests
                  </span>
                }
              /> */}
              </Tabs>

              <ResourcesTitleView
                title={
                  user !== "guest"
                    ? `My organisation ${toTitleCase(
                        labels.renaming_modules.resources
                      )}`
                    : `List of ${toTitleCase(
                        labels.renaming_modules.resources
                      )}`
                }
                isGrid={isGrid}
                setIsGrid={setIsGrid}
                addResource={addResource}
                history={history}
                user={user}
                subTitle={
                  user !== "guest"
                    ? `${toTitleCase(
                        labels.renaming_modules.resources
                      )} uploaded by your organization.`
                    : `Browse the list of ${toTitleCase(
                        labels.renaming_modules.resources
                      )} contributed by organizations.`
                }
                value={0}
                handleChange={handleChange}
              />
            </Box>
          ) : (
            ""
          )}
          <TabPanel value={value} index={0}>
            <Box className="mb-100 mt-2" style={{ padding: "50px" }}>
              {/* <ResourcesTitleView
              title={
                user !== "guest"
                  ? `My organisation ${labels.renaming_modules.resources}`
                  : `List of ${labels.renaming_modules.resources}`
              }
              isGrid={isGrid}
              setIsGrid={setIsGrid}
              addResource={addResource}
              history={history}
              user={user}
              subTitle={
                user !== "guest"
                  ? `${toTitleCase(
                      labels.renaming_modules.resources
                    )} uploaded by your organization.`
                  : `Browse the list of ${labels.renaming_modules.resources} contributed by organizations.`
              }
              value={0}
            /> */}
              {resources?.length > 0 ? (
                <>
                  <CSSTransition
                    in={isGrid}
                    timeout={{
                      appear: 600,
                      enter: 700,
                      exit: 100,
                    }}
                    classNames="step"
                    unmountOnExit={true}
                  >
                    <div className="datasets_card">
                      {user !== "guest" && false ? (
                        <AddDataSetCardNew
                          history={history}
                          addDataset={addResource}
                          title={`Create new ${labels.renaming_modules.resource}`}
                          description={`Add details about your ${labels.renaming_modules.resource} and make discoverable to others.`}
                        />
                      ) : (
                        ""
                      )}
                      {resources?.map((item, index) => (
                        <ResourceCard
                          index={index}
                          id="dataset-card-in-dataset"
                          key={item?.id}
                          history={history}
                          item={item}
                          value={0}
                          handleCardClick={handleCardClick}
                          userType={user !== "guest" ? "" : "guest"}
                          handleChatIconClick={handleChatIconClick}
                          handleDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </CSSTransition>
                  <CSSTransition
                    in={!isGrid}
                    timeout={{
                      appear: 600,
                      enter: 700,
                      exit: 100,
                    }}
                    classNames="step"
                    unmountOnExit={true}
                  >
                    <ResourceList
                      resources={resources}
                      history={history}
                      value={0}
                      handleCardClick={handleCardClick}
                      userType={user !== "guest" ? "" : "guest"}
                    />
                  </CSSTransition>
                </>
              ) : (
                <NoData
                  title={`There are no ${labels.renaming_modules.resources}`}
                  subTitle={
                    user === "guest"
                      ? `As of now there are no ${labels.renaming_modules.resources}.`
                      : `As of now there are no ${labels.renaming_modules.resources}, so add new ${labels.renaming_modules.resource}!`
                  }
                  primaryButton={
                    user === "guest" ? (
                      false
                    ) : (
                      <>
                        <RiFileAddLine style={{ marginRight: "5px" }} />{" "}
                        {`Add new 
                      ${toTitleCase(labels.renaming_modules.resource)}`}
                      </>
                    )
                  }
                  primaryButtonOnClick={() => history.push(addResource())}
                />
              )}

              {showLoadMoreBtn ? (
                <Button
                  variant="outlined"
                  sx={{
                    fontFamily: "'Montserrat', sans-serif", // Modern and clean font
                    fontWeight: 500,
                    fontSize: "14px",
                    width: "fit-content",
                    padding: "10px 20px",
                    border: "1px solid #C0C7D1",
                    borderRadius: "10px", // Slightly larger radius for a modern look
                    color: "#424242",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center", // Ensure vertical alignment
                    justifyContent: "center", // Center everything for a neat look
                    margin: "25px auto",
                    transition: "all 0.3s ease", // Smooth transition for hover effects
                    "&:hover": {
                      backgroundColor: "#f4f4f4", // Subtle background change on hover
                      border: "1px solid #00ab55", // Color that pops more
                      color: "#00ab55", // Change text color to match the border on hover
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", // Soft shadow for depth
                    },
                  }}
                  onClick={() => getResources(true)}
                  id="dataset-loadmore-btn"
                  data-testid="load_more_admin"
                >
                  <div>
                    <MdExpandMore />
                  </div>
                  <span>Scroll</span>
                </Button>
              ) : (
                <></>
              )}
              {/* <div ref={loader} /> */}
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Box className="mb-100 mt-2" style={{ padding: "50px" }}>
              {/* <ResourcesTitleView
              title={`Other organisation ${labels.renaming_modules.resources}`}
              isGrid={isGrid}
              setIsGrid={setIsGrid}
              addResource={addResource}
              history={history}
              user={user}
              subTitle={`Explore ${labels.renaming_modules.resources} uploaded by other organizations.`}
              value={1}
            /> */}
              {resources?.length > 0 ? (
                <>
                  <CSSTransition
                    in={isGrid}
                    timeout={{
                      appear: 600,
                      enter: 700,
                      exit: 100,
                    }}
                    classNames="step"
                    unmountOnExit={true}
                  >
                    <div className="datasets_card">
                      {resources?.map((item, index) => (
                        <ResourceCard
                          index={index}
                          id="dataset-card-in-dataset"
                          key={item?.id}
                          history={history}
                          item={item}
                          value={1}
                          handleCardClick={handleCardClick}
                          userType={user !== "guest" ? "" : "guest"}
                          // handleDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </CSSTransition>
                  <CSSTransition
                    in={!isGrid}
                    timeout={{
                      appear: 600,
                      enter: 700,
                      exit: 100,
                    }}
                    classNames="step"
                    unmountOnExit={true}
                  >
                    <ResourceList
                      resources={resources}
                      history={history}
                      value={1}
                      handleCardClick={handleCardClick}
                      userType={user === "guest" ? "" : "guest"}
                    />
                  </CSSTransition>
                </>
              ) : (
                <NoData
                  title={`There are no ${labels.renaming_modules.resources}`}
                  subTitle={`As of now there are no ${labels.renaming_modules.resources}.`}
                />
              )}

              {showLoadMoreBtn ? (
                <Button
                  variant="outlined"
                  sx={{
                    fontFamily: "'Montserrat', sans-serif", // Modern and clean font
                    fontWeight: 500,
                    fontSize: "14px",
                    width: "fit-content",
                    padding: "10px 20px",
                    border: "1px solid #C0C7D1",
                    borderRadius: "10px", // Slightly larger radius for a modern look
                    color: "#424242",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center", // Ensure vertical alignment
                    justifyContent: "center", // Center everything for a neat look
                    margin: "25px auto",
                    transition: "all 0.3s ease", // Smooth transition for hover effects
                    "&:hover": {
                      backgroundColor: "#f4f4f4", // Subtle background change on hover
                      border: "1px solid #00ab55", // Color that pops more
                      color: "#00ab55", // Change text color to match the border on hover
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", // Soft shadow for depth
                    },
                  }}
                  onClick={() => getOtherResources(true)}
                  id="dataset-loadmore-btn"
                  data-testid="load_more_admin"
                >
                  <div>
                    <MdExpandMore />
                  </div>
                  <span>Scroll</span>
                </Button>
              ) : (
                <></>
              )}
            </Box>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ResourceRequestTable />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
};

export default ResourcesTab;

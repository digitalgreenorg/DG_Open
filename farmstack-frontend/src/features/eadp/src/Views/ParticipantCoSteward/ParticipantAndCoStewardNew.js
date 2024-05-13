import dot from '../../Assets/Img/dot.svg';
import React, { useState, useEffect, useContext } from "react";

import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import { Box } from "@mui/system";
import { Col, Row } from "react-bootstrap";
import CustomTabs from "../../Components/Tabs/Tabs";
import NoData from "../../Components/NoData/NoData";
import CoStewardAndParticipantsCard from "../../Components/CoStewardAndParticipants/CostewardAndParticipants.js";
import HTTPService from "common/services/HTTPService";
import { useHistory } from "react-router-dom";
import UrlConstant from "../../Constants/UrlConstants";
import { FarmStackContext } from "common/components/context/EadpContext/FarmStackProvider";
import {
  GetErrorHandlingRoute,
  getUserLocal,
  goToTop,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
} from "common/utils/utils";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useMediaQuery, useTheme } from "@mui/material";
const ParticipantsAndCoStewardNew = () => {
  const { callLoader, callToast, isLoading } = useContext(FarmStackContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  // const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const history = useHistory();
  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const [loadMoreUrl, setLoadMoreUrl] = useState("");
  const [tabValue, setTabValue] = useState(1);
  const [coStewardOrParticipantsList, setCoStewardOrParticipantsList] =
    useState([]);
  const [viewType, setViewType] = useState("grid");
  let [tabLabels, setTabLabels] = useState([
    "Participant",
    "New Participant Requests",
  ]);

  const handleClick = () => {
    console.log("click");
  };

  const handleLoadMoreButton = () => {
    console.log("loadmore clicked");
    getListOnClickOfLoadMore();
  };

  console.log("tab value", tabValue, "tab value");

  const getCoStewardOrParticipantsOnLoad = (
    unApprovedId,
    approval_endpoint
  ) => {
    console.log("in getCoStewardOrParticipantsOnLoad");
    // setIsLoading(true);
    callLoader(true);
    let params = {};
    let url = UrlConstant.base_url + UrlConstant.participant;
    if (tabValue == 0) {
      params = { co_steward: "True" };
    } else if (tabValue == 2) {
      params = { approval_status: "False" };
    }
    // +
    // "?approval_status=False";
    if (approval_endpoint) {
      url = UrlConstant.participant + unApprovedId + "?approval_status=True";
    }
    // if (tabValue != 0 || tabValue != 1) params = { approval_status: "False" };

    if (isLoggedInUserCoSteward()) {
      params = {};

      if (tabValue == 0) {
        params = { on_boarded_by: getUserLocal() };
      } else if (tabValue == 1) {
        params = { approval_status: "False", on_boarded_by: getUserLocal() };
      }

      // params = { on_boarded_by: getUserLocal() };
      // tabValue == 1 ? (params[approval_status] = "False") : "";
    }
    console.log("in api call checking tab", tabValue, params);
    HTTPService("GET", url, params, false, true)
      .then((response) => {
        callLoader(false);
        if (response?.data?.next == null) {
          setLoadMoreButton(false);
        } else {
          setLoadMoreButton(true);
          if (response?.data?.next) setLoadMoreUrl(response.data.next);
        }
        if (response?.data?.results)
          setCoStewardOrParticipantsList(response.data.results);
      })
      .catch(async (e) => {
        callLoader(false);
        // let error = await GetErrorHandlingRoute(e);
        // console.log("Error obj", error);
        // callToast(error?.message,
        //   error?.status === 200 ? "success" : "error",
        //   true);
        // console.log(e);
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };

  const getListOnClickOfLoadMore = () => {
    callLoader(true);
    HTTPService("GET", loadMoreUrl, "", false, true)
      .then((response) => {
        callLoader(false);
        if (response?.data?.next == null) {
          setLoadMoreButton(false);
        } else {
          setLoadMoreButton(true);
          if (response?.data?.next) {
            setLoadMoreUrl(response.data.next);
          }
        }
        let datalist = coStewardOrParticipantsList;
        if (response?.data?.results) {
          let finalDataList = [...datalist, ...response.data.results];
          setCoStewardOrParticipantsList(finalDataList);
        }
      })
      .catch(async (e) => {
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong",
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
    setCoStewardOrParticipantsList([]);
    getCoStewardOrParticipantsOnLoad();

    // localStorage.setItem("participantAndCostewardTabValue", tabValue);
  }, [tabValue]);

  useEffect(() => {
    if (isLoggedInUserAdmin()) {
      setTabLabels(["Co-Steward", "Participant", "New Participant Requests"]);
      // console.log();
    }
    goToTop(0);
    // remove participantAndCostewardTabValue from local on page load
    let tabValue = localStorage.getItem("participantAndCostewardTabValue");
    if (tabValue == 0) {
      localStorage.removeItem("participantAndCostewardTabValue");
    }
  }, []);

  console.log("is login user", isLoggedInUserAdmin());

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/datahub/participants/"
      onClick={handleClick}
    >
      Participant
    </Link>,
    <Typography key="3" color="text.primary">
      Co-Steward
    </Typography>,
  ];

  return (
    <div
      style={{
        marginLeft: mobile || tablet ? "30px" : "144px",
        marginRight: mobile || tablet ? "30px" : "144px",
      }}
      className="pariticipants_list_and_new_request"
    >
      <Row>
        <Col>
          <div className="text-left mt-50">
            <span
              className="add_light_text cursor-pointer breadcrumbItem"
              onClick={() => history.push("/datahub/participants/")}
            >
              Participant
            </span>
            <span className="add_light_text ml-16">
              {/* <img  src={dot}  /> */}
              <ArrowForwardIosIcon sx={{ fontSize: "14px", fill: "#00A94F" }} />
            </span>
            <span className="add_light_text ml-16 fw600">
              {tabValue == 0
                ? isLoggedInUserCoSteward()
                  ? "Participant"
                  : "Co-Steward"
                : tabValue == 1 && isLoggedInUserAdmin()
                ? "Participant"
                : tabValue == 1 && isLoggedInUserCoSteward()
                ? "New Participants requests"
                : "New Participants requests"}
            </span>
          </div>
        </Col>
      </Row>
      <Box className="mt-50" sx={{ borderBottom: 1, borderColor: "divider" }}>
        <CustomTabs
          tabValue={tabValue}
          setTabValue={setTabValue}
          TabLabels={tabLabels}
        />
      </Box>
      {isLoggedInUserAdmin() ? (
        <div>
          {tabValue === 0 &&
            false &&
            (coStewardOrParticipantsList.length === 0 && !isLoading ? (
              <Box p={3}>
                <NoData
                  title={"There are no Co-Stewards"}
                  subTitle={
                    "As of now there are no co-stewards, so add participants and make them co-steward."
                  }
                  primaryButton={"Add participant"}
                  primaryButtonOnClick={() =>
                    history.push("/datahub/participants/add")
                  }
                />
              </Box>
            ) : (
              <CoStewardAndParticipantsCard
                title={"Co-steward"}
                subTitle={
                  "Facilitators of secure data sharing networks and community builders."
                }
                viewType={viewType}
                setViewType={setViewType}
                coStewardOrParticipantsList={coStewardOrParticipantsList}
                loadMoreButton={loadMoreButton}
                handleLoadMoreButton={handleLoadMoreButton}
              />
            ))}
          {tabValue === 1 &&
            (coStewardOrParticipantsList.length === 0 && !isLoading ? (
              <Box p={3}>
                <NoData
                  title={"There are no Participants!"}
                  subTitle={
                    "As of now there are no participants, so add participants or invite participants."
                  }
                  primaryButton={"Add participant"}
                  primaryButtonOnClick={() =>
                    history.push("/datahub/participants/add")
                  }
                  secondaryButton={"+ Invite participants"}
                  secondaryButtonOnClick={() =>
                    history.push("/datahub/participants/invite")
                  }
                />
              </Box>
            ) : (
              <CoStewardAndParticipantsCard
                title={"Participants"}
                subTitle={
                  "Vision-driven organizations committed to making a positive impact."
                }
                viewType={viewType}
                setViewType={setViewType}
                coStewardOrParticipantsList={coStewardOrParticipantsList}
                loadMoreButton={loadMoreButton}
                handleLoadMoreButton={handleLoadMoreButton}
              />
            ))}
          {tabValue === 2 &&
            (coStewardOrParticipantsList.length === 0 && !isLoading ? (
              <Box p={3}>
                <NoData
                  title={"There are no Participant requests!"}
                  subTitle={"As of now there are no participants request!"}
                  // primaryButton={"Add participant"}
                />
              </Box>
            ) : (
              <CoStewardAndParticipantsCard
                title={"New participant requests"}
                subTitle={
                  "Manage requests from organization seeking to join your community."
                }
                viewType={viewType}
                setViewType={setViewType}
                coStewardOrParticipantsList={coStewardOrParticipantsList}
                loadMoreButton={loadMoreButton}
                handleLoadMoreButton={handleLoadMoreButton}
              />
            ))}
        </div>
      ) : (
        <>
          {tabValue === 0 &&
            (coStewardOrParticipantsList.length === 0 && !isLoading ? (
              <Box p={3}>
                <NoData
                  title={"There are no Participants!"}
                  subTitle={
                    "As of now there are no participant, so add participants or invite participants."
                  }
                  primaryButton={"Add participant"}
                  primaryButtonOnClick={() =>
                    history.push("/datahub/participants/add")
                  }
                  secondaryButton={"+ Invite participants"}
                  secondaryButtonOnClick={() =>
                    history.push("/datahub/participants/invite")
                  }
                />
              </Box>
            ) : (
              <CoStewardAndParticipantsCard
                title={"Participants"}
                subTitle={
                  "Vision-driven organizations committed to making a positive impact."
                }
                viewType={viewType}
                setViewType={setViewType}
                coStewardOrParticipantsList={coStewardOrParticipantsList}
                loadMoreButton={loadMoreButton}
                handleLoadMoreButton={handleLoadMoreButton}
              />
            ))}
          {tabValue === 1 &&
            (coStewardOrParticipantsList.length === 0 && !isLoading ? (
              <Box p={3}>
                <NoData
                  title={"There are no Participant requests!"}
                  subTitle={"As of now there are no participant requests!"}
                  // primaryButton={"Add participant"}
                />
              </Box>
            ) : (
              <CoStewardAndParticipantsCard
                title={"New participant requests"}
                subTitle={
                  "Manage requests from organization seeking to join your community."
                }
                viewType={viewType}
                setViewType={setViewType}
                coStewardOrParticipantsList={coStewardOrParticipantsList}
                loadMoreButton={loadMoreButton}
                handleLoadMoreButton={handleLoadMoreButton}
              />
            ))}
        </>
      )}
    </div>
  );
};

export default ParticipantsAndCoStewardNew;

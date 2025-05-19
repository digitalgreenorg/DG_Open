import React, { useState, useEffect, useContext } from "react";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import LocalStyle from "./DatasetListNew.module.css";
import { Col, Row } from "react-bootstrap";
import NoData from "../NoData/NoData";
import DatasetCart from "../DatasetCard/DatasetCard";
import { Box } from "@mui/system";
import UrlConstants from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import {
  GetErrorHandlingRoute,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import { useHistory } from "react-router-dom";
import { Button, Typography } from "@mui/material";

const DatasetListNew = (props) => {
  const { isCosteward, isParticipantRequest, userId, orgId, user } = props;
  const history = useHistory();
  const { callLoader, callToast } = useContext(FarmStackContext);
  const [datasetList, setDatasetList] = useState([]);
  const [loadMoreUrl, setLoadMoreUrl] = useState("");

  const getViewAllRoute = () => {
    if (user === "guest") {
      return `/home/datasets`;
    } else if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      return `/datahub/new_datasets`;
    } else if (isLoggedInUserParticipant()) {
      return `/participant/new_datasets`;
    }
  };

  const handleCardClick = (id) => {
    if (user === "guest") {
      localStorage.setItem("last_route", "/home");
      return `/home/datasets/${id}`;
    } else if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      return `/datahub/new_datasets/${id}`;
    } else if (isLoggedInUserParticipant()) {
      return `/participant/new_datasets/${id}`;
    }
  };

  const getDatasetOfParticipantOrCoSteward = (loadMore, user_id, org_id) => {
    let url = UrlConstants.base_url + UrlConstants.costeward_onboarded_dataset;
    if (loadMore) {
      if (isCosteward) callLoader(true);
      url = loadMoreUrl;
    }
    let payload = {
      //   user_id: user_id,
      //   org_id: org_id,
      others: true,
    };

    if (user === "guest") {
      payload = "";
      url = UrlConstants.base_url + UrlConstants.guest_dataset_filtered_data;
    }

    HTTPService("POST", url, payload, false, false)
      .then((res) => {
        if (isParticipantRequest) {
          callLoader(false);
        }
        console.log("res", res);
        let data = [...datasetList, ...res?.data?.results];
        setDatasetList(data);
        if (res?.data?.next) setLoadMoreUrl(res.data.next);
        else setLoadMoreUrl("");
      })
      .catch(async (e) => {
        callLoader(false);
        // let error = GetErrorHandlingRoute(e);
        // console.log("Error obj", error);
        // callToast(error.message, "error", true);
        // console.log("err", e);
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
    getDatasetOfParticipantOrCoSteward();
  }, []);

  return (
    <>
      {user !== "guest" ? (
        <Row className={LocalStyle.section}>
          <Col xs={12} sm={12} md={6} xl={6}>
            <Typography
              // id={title + "-form-title"}
              className={`${GlobalStyle.size24} ${GlobalStyle.bold600} ${LocalStyle.title}`}
            >
              List of Datasets
            </Typography>
          </Col>
        </Row>
      ) : (
        ""
      )}
      <Box
        className={
          datasetList.length != 0
            ? LocalStyle.datasets_card
            : LocalStyle.dataset_flex
        }
      >
        {datasetList?.map((dataset, index) => {
          console.log("datasets ", dataset);
          return (
            <Box
              onClick={() => history.push(handleCardClick(dataset?.id))}
              id="dataset-view-card"
            >
              <DatasetCart
                publishDate={dataset?.created_at}
                title={dataset?.name}
                orgnisationName={dataset?.organization?.name}
                geography={dataset?.geography}
                category={Object.keys(dataset?.category)}
                update={dataset?.updated_at}
              />
            </Box>
          );
        })}
        {datasetList.length == 0 ? (
          <Box className={LocalStyle.noDataBox} p={3}>
            <NoData
              title={"There are no dataset"}
              subTitle={"As of now there are no dataset"}
              // primaryButton={"Add participant"}
              // primaryButtonOnClick={() =>
              //   history.push("/datahub/participants/add")
              // }
            />
          </Box>
        ) : (
          ""
        )}
      </Box>

      {user === "guest" ? (
        <>
          <Row className={LocalStyle.buttonContainer}>
            {/* <Col xs={0} sm={0} md={2} lg={4}></Col> */}
            {/* <Col  xs={12} sm={12} md={8} lg={4}> */}
            <Button
              id={"details-page-load-more-dataset-button"}
              variant="outlined"
              className={`${GlobalStyle.primary_button} ${LocalStyle.loadMoreButton} ${GlobalStyle.homeButtonWidth} ${LocalStyle.mt_25}`}
              onClick={() => history.push(getViewAllRoute())} // passing true will call loadmore api
              style={{ marginTop: "25px !important" }}
            >
              View all datasets
            </Button>
            {/* </Col> */}
          </Row>
        </>
      ) : loadMoreUrl ? (
        <Row className={LocalStyle.buttonContainer}>
          <Col xs={0} sm={0} md={2} lg={4}></Col>
          <Col xs={12} sm={12} md={8} lg={4}>
            <Button
              id={"details-page-load-more-dataset-button"}
              variant="outlined"
              className={`${GlobalStyle.outlined_button} ${LocalStyle.loadMoreButton}`}
              onClick={() =>
                getDatasetOfParticipantOrCoSteward(true, userId, orgId)
              } // passing true will call loadmore api
            >
              Load more
            </Button>
          </Col>
        </Row>
      ) : (
        ""
      )}
    </>
  );
};

export default DatasetListNew;

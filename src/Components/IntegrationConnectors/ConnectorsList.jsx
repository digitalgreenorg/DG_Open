import React from "react";
import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import ConnectorCard from "../IntegrationConnectors/ConnectorCard";
import { Button } from "@mui/material";
import THEME_COLORS from "../../Constants/ColorConstants";
import Loader from "../Loader/Loader";
import HTTPService from "../../Services/HTTPService";
import {
  GetErrorHandlingRoute,
  getUserLocal,
  isLoggedInUserCoSteward,
} from "../../Utils/Common";
import { useHistory } from "react-router-dom";
import UrlConstant from "../../Constants/UrlConstants";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import NoDataAvailable from "../Dashboard/NoDataAvailable/NoDataAvailable";
import "./cards.css";

export default function ConnectorsList(props) {
  const {
    isEditModeOn,
    setConnectorTimeData,
    setIsEditModeOn,
    setConnectorIdForView,
    setIsDatasetIntegrationListModeOn,
  } = props;
  const [isLoader, setIsLoader] = useState(false);
  const [isShowLoadMoreButton, setisShowLoadMoreButton] = useState(false);
  const [connectorList, setConnectorList] = useState([]);
  const [connectorUrl, setConnectorUrl] = useState("");
  const [gridView, setGridView] = useState(true); //change of list and grid view state

  const history = useHistory();
  const useStyles = {
    marginrowtoptab50px: { "margin-top": "50px" },
    marginrowtop: { "margin-top": "20px" },
    background: {
      "margin-left": "120px",
      "margin-right": "120px",
      background: "#FCFCFC",
    },
    marginrowtop10px: { "margin-top": "30px" },
    marginrowtop50: { "margin-top": "50px" },
    addButton: {
      "border-radius": "8px",
      background: "#c09507",
      width: "176px",
      height: "48px",
      color: "#FFFFFF",
      "font-family": "Open Sans",
      "font-style": "normal",
      "font-weight": "700",
      "font-size": "14px",
      "align-item": "right",
      "border-color": THEME_COLORS.THEME_COLOR,
      "text-transform": "inherit",
    },
    cardtext: {
      color: "#A3B0B8",
      "margin-top": "30px",
      "font-size": "14px",
      "font-family": "Open Sans",
      "font-style": "normal",
      "font-weight": 400,
      "font-size": "14px",
      "line-height": "19px",
      "text-align": "center",
    },
  };

  const getListOfConnectors = () => {
    setIsLoader(true);
    HTTPService(
      "GET",
      UrlConstant.base_url +
        UrlConstant.list_of_connectors +
        "?user=" +
        getUserLocal() +
        "&co_steward=" +
        isLoggedInUserCoSteward()
        ? "true"
        : "false",
      "",
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("connectors list", response.data);
        if (response.data.next == null) {
          setisShowLoadMoreButton(false);
        } else {
          setConnectorUrl(response.data.next);
          setisShowLoadMoreButton(true);
        }
        setConnectorList(response.data.results);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  //list of connectors will display when loadmore button clicks
  const connectorsListOnLoadMore = () => {
    setIsLoader(true);
    HTTPService("GET", connectorUrl, "", false, true)
      .then((response) => {
        setIsLoader(false);
        if (response.data.next == null) {
          setisShowLoadMoreButton(false);
        } else {
          setisShowLoadMoreButton(true);
          setConnectorUrl(response.data.next);
        }
        let initialList = connectorList;
        let totalListOfConnectors = [...initialList, ...response.data.results];
        setConnectorList(totalListOfConnectors);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  useEffect(() => {
    console.log("calling");
    getListOfConnectors();
  }, [isEditModeOn]);

  return (
    <div
      className="minHeight501pxsettingpagemaindiv"
      style={useStyles.background}
    >
      {isLoader ? <Loader /> : ""}
      <Row style={useStyles.marginrowtop50}>
        <Col xs={12} sm={12} md={6} lg={10} style={{ "text-align": "left" }}>
          <span className="mainheading">{"List of Connectors"}</span>
        </Col>
        <Col xs={12} sm={12} md={6} lg={2} style={{ textAlign: "right" }}>
          <Button
            //  Button should render to add new connector component when click
            onClick={() => setIsDatasetIntegrationListModeOn(false)}
            variant="outlined"
            style={useStyles.addButton}
            // class="button-87" role="button"
          >
            + New connector1
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <img
            src={require("../../Assets/Img/line.svg")}
            style={{ width: "100%" }}
            alt="new"
          />
        </Col>
      </Row>
      {connectorList.length > 0 ? (
        <>
          <Row>
            {connectorList.map((list, index) => (
              <Col xs={12} sm={6} md={4} lg={4}>
                <ConnectorCard
                  click={() => {
                    setConnectorTimeData({ last_updated: list.updated_at });
                    setConnectorIdForView(list?.id ? list?.id : "");
                    setIsDatasetIntegrationListModeOn(false);
                    setIsEditModeOn(true);
                  }}
                  firsttext={list.updated_at}
                  secondtext={list?.name}
                  useddataset={list?.dataset_count}
                  providers={list?.providers_count}
                  index={index}
                ></ConnectorCard>
              </Col>
            ))}
          </Row>
          <Row style={{ "margin-top": "10px" }}>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            {isShowLoadMoreButton ? (
              <Col xs={12} sm={12} md={6} lg={6}>
                <Button
                  onClick={() => connectorsListOnLoadMore()}
                  variant="outlined"
                  className="cancelbtn"
                  style={{ "text-transform": "none" }}
                >
                  Load more
                </Button>
              </Col>
            ) : (
              <></>
            )}
          </Row>
        </>
      ) : (
        <>
          {/* If there is no connectors available this component will render */}
          <Row>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <NoDataAvailable />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

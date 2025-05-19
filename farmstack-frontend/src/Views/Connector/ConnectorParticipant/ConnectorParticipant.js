import React, { useEffect, useState } from "react";
import labels from "../../../Constants/labels";
import Loader from "../../../Components/Loader/Loader";
import HTTPService from "../../../Services/HTTPService";
import { getUserLocal } from "../../../Utils/Common";
import { Col, Row } from "react-bootstrap";
import ConnectorFilter from "../ConnectorFilter";
import ConnectorListing from "../ConnectorListing";
import { get } from "jquery";
import UrlConstant from "../../../Constants/UrlConstants";
import {
  GetErrorHandlingRoute,
  getDockerHubURL,
  openLinkInNewTab,
  isRoleName,
} from "../../../Utils/Common";
import "../ConnectorParticipant.css";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import NoDatasetConnectorView from "../NoDatasetConnectorView";
import { FileUploader } from "react-drag-drop-files";
import UploadDataset from "../../../Components/Datasets/UploadDataset";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import ViewConnectorDetails from "../../../Components/Connectors/ViewConnectorDetails";
import PairingRequest from "../../../Components/PairingRequest/PairingRequest";
import Success from "../../../Components/Success/Success";
import Delete from "../../../Components/Delete/Delete";
import UrlConstants from "../../../Constants/UrlConstants";
import { Tooltip } from "@mui/material";
import { useLocation } from "react-router-dom";

const useStyles = {
  datasetdescription: {
    "margin-left": "0px",
    "margin-right": "0px",
    "font-family": "Open Sans",
    "font-style": "normal",
    "font-weight": "400",
    "font-size": "14px",
    "line-height": "19px",
    overflow: "hidden",
    "text-overflow": "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": "1",
    "-webkit-box-orient": "vertical",
    float: "left",
    width: "300px",
  },
};
export default function ConnectorParticipant() {
  const location = useLocation();
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const [isLoader, setIsLoader] = useState(false);
  const history = useHistory();

  //states for api endpoint management
  const [connectorUrl, setConnectorUrl] = useState(
    UrlConstant.base_url + UrlConstant.connector_list
  );
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [isDatasetPresent, setIsDatasetPresent] = useState(false); // to be set to false after backend field is sent in response

  //connector list state which will be set with backend response
  const [connectorList, setConnectorList] = useState([]);

  //filter state management states
  const [isShowAll, setIsShowAll] = useState(true);
  const [deptSearchState, setDeptSearchState] = useState("");
  const [projectSearchState, setProjectSearchState] = useState("");
  const [isDeptSearchFound, setIsDeptSearchFound] = useState(true);
  const [isProjectSearchFound, setIsProjectSearchFound] = useState(true);

  //filter states
  const [departmentFilter, setDepartmentFilter] = useState([
    {
      index: 0,
      name: "Dept1",
      payloadName: "dept1",
      isChecked: false,
      isDisplayed: true,
    },
    {
      index: 1,
      name: "Dept2",
      payloadName: "dept2",
      isChecked: false,
      isDisplayed: true,
    },
  ]);
  const [projectFilter, setProjectFilter] = useState([
    {
      index: 0,
      name: "Project1",
      payloadName: "project1",
      isChecked: false,
      isDisplayed: true,
    },
    {
      index: 1,
      name: "Project2",
      payloadName: "project2",
      isChecked: false,
      isDisplayed: true,
    },
  ]);

  const [connectorTypeFilter, setConnectoprTypeFilter] = useState([
    { index: 0, name: "Provider", payloadName: "Provider", isChecked: false },
    { index: 1, name: "Consumer", payloadName: "Consumer", isChecked: false },
  ]);

  const [statusFilter, setStatusFilter] = useState([
    {
      index: 1,
      name: "Install Certificate",
      payloadName: "install certificate",
      isChecked: false,
    },
    { index: 2, name: "Unpaired", payloadName: "unpaired", isChecked: false },
    {
      index: 3,
      name: "Awaiting Approval",
      payloadName: "awaiting for approval",
      isChecked: false,
    },
    { index: 4, name: "Paired", payloadName: "paired", isChecked: false },
    {
      index: 5,
      name: "Pairing Request Received",
      payloadName: "pairing request received",
      isChecked: false,
    },
    { index: 6, name: "Rejected", payloadName: "rejected", isChecked: false },
  ]);

  const [filterState, setFilterState] = useState({});
  // var payload = {}
  var payload = "";

  useEffect(() => {
    getFilters();
    payload = buildFilterPayLoad(getUserLocal(), "", "", "", "");
    getConnectorList(false);
  }, []);

  const getFilters = () => {
    setIsLoader(true);
    var payloadData = {};
    payloadData["user_id"] = getUserLocal();
    // data['user_id'] = "aaa35022-19a0-454f-9945-a44dca9d061d"
    HTTPService(
      "POST",
      UrlConstant.base_url + UrlConstant.connector_filter,
      payloadData,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("filter response:", response);

        var deptFilterInput = response.data.departments;
        var projectFilterInput = response.data.projects;

        setDepartmentFilter(initFilter(deptFilterInput));
        setProjectFilter(initFilter(projectFilterInput));
        setIsDatasetPresent(response.data.is_dataset_present);

        console.log("deptFilter", departmentFilter);
        console.log("projectFilter", projectFilter);
      })
      .catch((e) => {
        console.log(e);
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  const initFilter = (filterInput) => {
    let filter = [];
    for (var i = 0; i < filterInput.length; i++) {
      var data = {};
      data["index"] = i;
      data["name"] = filterInput[i];
      data["isChecked"] = false;
      data["isDisplayed"] = true;
      filter.push(data);
    }
    return filter;
  };

  const getConnectorList = (isLoadMore) => {
    setIsLoader(true);

    if (!isLoadMore) {
      if (payload == "") {
        payload = buildFilterPayLoad(getUserLocal(), "", "", "", "");
      }
    } else {
      payload = { ...filterState };
    }
    // if (payload == "") {
    //     payload = buildFilterPayLoad(getUserLocal(), "", "", "", "")
    // }
    // if(isLoadMore){
    //     payload = {...filterState}
    // }
    HTTPService(
      "POST",
      isLoadMore
        ? connectorUrl
        : UrlConstant.base_url + UrlConstant.connector_list,
      payload,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("response:", response);
        console.log("connector:", response.data.results);

        if (response.data.next == null) {
          setShowLoadMore(false);
          setConnectorUrl(UrlConstant.base_url + UrlConstant.connector_list);
          setFilterState({});
        } else {
          setConnectorUrl(response.data.next);
          setShowLoadMore(true);
        }
        let finalDataList = [];
        if (isLoadMore) {
          finalDataList = [...connectorList, ...response.data.results];
        } else {
          finalDataList = response.data.results;
        }
        setConnectorList(finalDataList);
      })
      .catch((e) => {
        console.log(e);
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  const handleFilterChange = (index, filterName) => {
    var isAnyFilterChecked = false;
    var tempFilter = [];
    var payloadList = [];

    setIsShowAll(false);

    if (filterName == screenlabels.connector.department) {
      resetFilterState(screenlabels.connector.projects);
      resetFilterState(screenlabels.connector.connector_type);
      resetFilterState(screenlabels.dataset.connector_status);

      tempFilter = [...departmentFilter];
      for (let i = 0; i < tempFilter.length; i++) {
        if (tempFilter[i].index == index) {
          tempFilter[i].isChecked = !tempFilter[i].isChecked;
        }
        if (tempFilter[i].isChecked) {
          payloadList.push(tempFilter[i].name);
          isAnyFilterChecked = true;
        }
      }
      setDepartmentFilter(tempFilter);

      payload = buildFilterPayLoad(getUserLocal(), payloadList, "", "", "");
    } else if (filterName == screenlabels.connector.projects) {
      resetFilterState(screenlabels.connector.department);
      resetFilterState(screenlabels.connector.connector_type);
      resetFilterState(screenlabels.connector.connector_status);

      tempFilter = [...projectFilter];
      for (let i = 0; i < tempFilter.length; i++) {
        if (tempFilter[i].index == index) {
          tempFilter[i].isChecked = !tempFilter[i].isChecked;
        }
        if (tempFilter[i].isChecked) {
          payloadList.push(tempFilter[i].name);
          isAnyFilterChecked = true;
        }
      }
      setProjectFilter(tempFilter);

      payload = buildFilterPayLoad(getUserLocal(), "", payloadList, "", "");
    } else if (filterName == screenlabels.connector.connector_type) {
      resetFilterState(screenlabels.connector.department);
      resetFilterState(screenlabels.connector.projects);
      resetFilterState(screenlabels.connector.connector_status);

      tempFilter = [...connectorTypeFilter];
      for (let i = 0; i < tempFilter.length; i++) {
        if (tempFilter[i].index == index) {
          tempFilter[i].isChecked = !tempFilter[i].isChecked;
        }
        if (tempFilter[i].isChecked) {
          payloadList.push(tempFilter[i].payloadName);
          isAnyFilterChecked = true;
        }
      }
      setConnectoprTypeFilter(tempFilter);
      payload = buildFilterPayLoad(getUserLocal(), "", "", payloadList, "");
    } else if (filterName == screenlabels.connector.connector_status) {
      resetFilterState(screenlabels.connector.department);
      resetFilterState(screenlabels.connector.projects);
      resetFilterState(screenlabels.connector.connector_type);

      tempFilter = [...statusFilter];
      for (let i = 0; i < tempFilter.length; i++) {
        if (tempFilter[i].index == index) {
          tempFilter[i].isChecked = !tempFilter[i].isChecked;
        }
        if (tempFilter[i].isChecked) {
          payloadList.push(tempFilter[i].payloadName);
          isAnyFilterChecked = true;
        }
      }
      setStatusFilter(tempFilter);

      payload = buildFilterPayLoad(getUserLocal(), "", "", "", payloadList);
    }
    if (isAnyFilterChecked) {
      getConnectorList(false);
    } else {
      clearAllFilters();
    }
  };

  const resetFilterState = (filterName) => {
    var tempFilter = [];
    if (filterName == screenlabels.connector.department) {
      tempFilter = [...departmentFilter];
      for (let i = 0; i < tempFilter.length; i++) {
        tempFilter[i].isChecked = false;
        tempFilter[i].isDisplayed = true;
      }
      setDepartmentFilter(tempFilter);
      setDeptSearchState("");
    } else if (filterName == screenlabels.connector.projects) {
      tempFilter = [...projectFilter];
      for (let i = 0; i < tempFilter.length; i++) {
        tempFilter[i].isChecked = false;
        tempFilter[i].isDisplayed = true;
      }
      setProjectFilter(tempFilter);
      setProjectSearchState("");
    } else if (filterName == screenlabels.connector.connector_type) {
      tempFilter = [...connectorTypeFilter];
      for (let i = 0; i < tempFilter.length; i++) {
        tempFilter[i].isChecked = false;
        // tempFilter[i].isDisplayed = true
      }
      setConnectoprTypeFilter(tempFilter);
    } else if (filterName == screenlabels.connector.connector_status) {
      tempFilter = [...statusFilter];
      for (let i = 0; i < tempFilter.length; i++) {
        tempFilter[i].isChecked = false;
        // tempFilter[i].isDisplayed = true
      }
      setStatusFilter(tempFilter);
    }
  };
  const buildFilterPayLoad = (
    userId,
    deptPayload,
    projectPayload,
    typePayload,
    statusPayload
  ) => {
    let data = {};
    setFilterState({});

    data["user_id"] = userId;
    // data['user_id'] = "aaa35022-19a0-454f-9945-a44dca9d061d"
    if (deptPayload !== "") {
      data["department__department_name__in"] = deptPayload;
    }
    if (projectPayload !== "") {
      data["project__project_name__in"] = projectPayload;
    }
    if (typePayload !== "") {
      data["connector_type__in"] = typePayload;
    }
    if (statusPayload !== "") {
      data["connector_status__in"] = statusPayload;
    }

    setFilterState(data);
    return data;
  };

  const clearAllFilters = () => {
    setIsShowAll(true);

    resetFilterState(screenlabels.connector.department);
    resetFilterState(screenlabels.connector.projects);
    resetFilterState(screenlabels.connector.connector_type);
    resetFilterState(screenlabels.connector.connector_status);

    payload = buildFilterPayLoad(getUserLocal(), "", "", "", "");
    getConnectorList(false);
  };

  const handleDeptSearch = (e) => {
    var searchFound = false;
    const searchText = e.target.value;
    setDeptSearchState(searchText);
    var tempList = [...departmentFilter];
    for (let i = 0; i < tempList.length; i++) {
      if (searchText == "") {
        tempList[i].isDisplayed = true;
        searchFound = true;
      } else {
        if (
          !tempList[i].name.toUpperCase().startsWith(searchText.toUpperCase())
        ) {
          tempList[i].isDisplayed = false;
        } else {
          tempList[i].isDisplayed = true;
          searchFound = true;
        }
      }
    }
    setIsDeptSearchFound(searchFound);
    setDepartmentFilter(tempList);
  };

  const handleProjectSearch = (e) => {
    var searchFound = false;
    const searchText = e.target.value;
    setProjectSearchState(searchText);
    var tempList = [...projectFilter];
    for (let i = 0; i < tempList.length; i++) {
      if (searchText == "") {
        tempList[i].isDisplayed = true;
        searchFound = true;
      } else {
        if (
          !tempList[i].name.toUpperCase().startsWith(searchText.toUpperCase())
        ) {
          tempList[i].isDisplayed = false;
        } else {
          tempList[i].isDisplayed = true;
          searchFound = true;
        }
      }
    }
    setIsProjectSearchFound(searchFound);
    setProjectFilter(tempList);
  };

  const getConnectorStatusImageName = (status) => {
    var imageName = "";
    if (status == screenlabels.connector.status_install_certificate) {
      imageName = "status_install_certificate_icon.svg";
    } else if (status == screenlabels.connector.status_unpaired) {
      imageName = "status_unpaired_icon.svg";
    } else if (status == screenlabels.connector.status_awaiting_approval) {
      imageName = "status_awaiting_approval_icon.svg";
    } else if (status == screenlabels.connector.status_paired) {
      imageName = "status_paired_icon.svg";
    } else if (
      status == screenlabels.connector.status_pairing_request_received
    ) {
      imageName = "status_pairing_request_received_icon.svg";
    } else if (status == screenlabels.connector.status_rejected) {
      imageName = "status_rejected_icon.svg";
    }
    return imageName;
  };

  const getConnectorStatusDisplayName = (status) => {
    var displayName = "";
    if (status == screenlabels.connector.status_install_certificate) {
      displayName = "Install Certificate";
    } else if (status == screenlabels.connector.status_unpaired) {
      displayName = "Unpaired";
    } else if (status == screenlabels.connector.status_awaiting_approval) {
      displayName = "Awaiting Approval";
    } else if (status == screenlabels.connector.status_paired) {
      displayName = "Paired";
    } else if (
      status == screenlabels.connector.status_pairing_request_received
    ) {
      displayName = "Pairing Request Received";
    } else if (status == screenlabels.connector.status_rejected) {
      displayName = "Rejected";
    }
    return displayName;
  };

  const [connectorDeatilsData, setconnectorDeatilsData] = useState({});
  const [screenView, setscreenView] = useState({
    isConnectorList: true,
    isConnectorViwDetails: false,
    isDelete: false,
    isDeleSuccess: false,
    isInstallationSuccess: false,
    isPairingRequestSentSuccess: false,
    isUnpair: false,
    isUnpairSuccess: false,
    ispair: false,
    ispairSuccess: false,
    isReject: false,
    isRejectSuccess: false,
  });
  const [accfilesize, setaccfilesize] = useState(true);
  const [providerConectorList, setproviderConectorList] = useState([]);
  const [providerConnector, setproviderConnector] = useState("");
  const [organisationName, setorganisationName] = useState("");
  const [ConsumerID, setConsumerID] = useState("");
  const [ConsumerStatus, setConsumerStatus] = useState("");
  const [providerConnectorDetails, setproviderConnectorDetails] = useState({});
  const [providerViewConnectorDetails, setproviderViewConnectorDetails] =
    useState({});
  const [file, setFile] = useState(null);
  const [fileValid, setfileValid] = useState("");
  const fileTypes = ["p12", "pfx"];

  const changeView = (keyname) => {
    let tempfilterObject = { ...screenView };
    Object.keys(tempfilterObject).forEach(function (key) {
      if (key != keyname) {
        tempfilterObject[key] = false;
      } else {
        tempfilterObject[key] = true;
      }
    });
    setscreenView(tempfilterObject);
  };
  const handleFileChange = (file) => {
    setFile(file);
    console.log(file);
    if (file != null && file.size > 2097152) {
      //   setBrandingnextbutton(false);
      setaccfilesize(true);
    } else {
      setaccfilesize(false);
    }
  };
  const installCretificate = () => {
    var bodyFormData = new FormData();
    bodyFormData.append("certificate", file);
    bodyFormData.append("connector_status", "unpaired");
    setIsLoader(true);
    HTTPService(
      "PUT",
      UrlConstants.base_url +
        UrlConstants.connector +
        connectorDeatilsData["id"] +
        "/",
      bodyFormData,
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        changeView("isInstallationSuccess");
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  const getProviderConnectors = (id) => {
    setIsLoader(true);
    HTTPService(
      "GET",
      UrlConstants.base_url + UrlConstants.provider_connectors + id,
      "",
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log(response.data);
        setproviderConectorList([...response.data]);
        // changeView('isInstallationSuccess')
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  const sendPairingRequest = (id) => {
    var bodyFormData = new FormData();
    let user_map = JSON.parse(localStorage.getItem("user_map"));
    bodyFormData.append("provider", providerConnectorDetails["id"]);
    bodyFormData.append("consumer", connectorDeatilsData["id"]);
    bodyFormData.append("connector_pair_status", "awaiting for approval");
    bodyFormData.append("user_map", user_map);
    setIsLoader(true);
    HTTPService(
      "POST",
      UrlConstants.base_url + UrlConstants.consumer_paring_request,
      bodyFormData,
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        setFile(null);
        setaccfilesize(true);
        setproviderConnectorDetails({});
        setproviderConnector("");
        changeView("isPairingRequestSentSuccess");
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  const getProviderConnectorDeatils = (id) => {
    setIsLoader(true);
    HTTPService(
      "GET",
      UrlConstants.base_url + UrlConstants.connector + id + "/",
      "",
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log(response.data);
        setproviderConnectorDetails({ ...response.data });
        setorganisationName(response.data["organization_details"]["name"]);
        console.log("setproviderConnectorDetails", providerConnectorDetails);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  const viewCardDetails = (id) => {
    console.log("sdsdfdf", id);
    setIsLoader(true);
    HTTPService(
      "GET",
      UrlConstants.base_url + UrlConstants.connector + id + "/",
      "",
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log(response.data);
        setconnectorDeatilsData({ ...response.data });
        changeView("isConnectorViwDetails");
        if (
          response.data["connector_type"] == "Consumer" &&
          (response.data["connector_status"] == "unpaired" ||
            response.data["connector_status"] == "rejected")
        ) {
          getProviderConnectors(response.data["dataset_details"]["id"]);
        }
        if (
          response.data["connector_type"] == "Consumer" &&
          (response.data["connector_status"] == "awaiting for approval" ||
            response.data["connector_status"] == "paired")
        ) {
          for (let i = 0; i < response.data.relation.length; i++) {
            if (
              response.data.relation[i].connector_pair_status ===
                "awaiting for approval" ||
              response.data.relation[i].connector_pair_status === "paired"
            ) {
              let temdata = { ...response.data.relation[i] };
              setproviderViewConnectorDetails(temdata);
            }
          }
        }
        console.log(
          "providerViewConnectorDetails",
          providerViewConnectorDetails
        );
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  const approveReject = (id, status) => {
    console.log("ss", id);
    console.log("status", status);
    setConsumerID(id);
    setConsumerStatus(status);
    if (status == "paired") {
      changeView("ispair");
    }
    if (status == "rejected") {
      changeView("isReject");
    }
    if (status == "unpaired") {
      changeView("isUnpair");
    }
  };
  const approveOrRejectConnector = () => {
    var bodyFormData = new FormData();
    let user_map = JSON.parse(localStorage.getItem("user_map"));
    bodyFormData.append("user_map", user_map);
    bodyFormData.append("connector_pair_status", ConsumerStatus);
    setIsLoader(true);
    HTTPService(
      "PUT",
      UrlConstants.base_url +
        UrlConstants.consumer_paring_request +
        ConsumerID +
        "/",
      bodyFormData,
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        if (ConsumerStatus == "paired") {
          changeView("ispairSuccess");
        }
        if (ConsumerStatus == "rejected") {
          changeView("isRejectSuccess");
        }
        if (ConsumerStatus == "unpaired") {
          changeView("isUnpairSuccess");
        }
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  const deleteConnector = (id) => {
    setIsLoader(true);
    HTTPService(
      "DELETE",
      UrlConstants.base_url +
        UrlConstants.connector +
        connectorDeatilsData["id"] +
        "/",
      "",
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        changeView("isDeleSuccess");
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  return (
    <>
      {isLoader ? <Loader /> : ""}
      {screenView.isConnectorViwDetails ? (
        <>
          <ViewConnectorDetails
            data={connectorDeatilsData}
            providerdata={providerViewConnectorDetails}
            back={() => {
              setFile(null);
              setproviderConnectorDetails({});
              setproviderConnector("");
              setaccfilesize(true);
              changeView("isConnectorList");
            }}
            edit={() => {
              history.push(
                isRoleName(location.pathname) +
                  "connectors/edit/" +
                  connectorDeatilsData["id"]
              );
            }}
            delete={() => changeView("isDelete")}
            cancel={() => changeView("isConnectorList")}
            approveReject={(id, status) =>
              approveReject(id, status)
            }></ViewConnectorDetails>
          {connectorDeatilsData["connector_type"] == "Provider" ? (
            <>
              {connectorDeatilsData["connector_status"] != "paired" &&
              connectorDeatilsData.relation.length > 0 ? (
                <>
                  <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
                    <span className="mainheading">
                      {"Pairing Request Received (" +
                        connectorDeatilsData.relation.length +
                        ")"}
                    </span>
                  </Row>
                </>
              ) : (
                <></>
              )}
              {connectorDeatilsData["connector_status"] == "paired" ? (
                <>
                  <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
                    <span className="mainheading">{"Paired with"}</span>
                  </Row>
                </>
              ) : (
                <></>
              )}
              {connectorDeatilsData.relation.length > 0 ? (
                <>
                  {connectorDeatilsData.relation.map((rowData, index) => (
                    <PairingRequest
                      approveReject={(id, status) => approveReject(id, status)}
                      data={rowData}
                      cancel={() =>
                        changeView("isConnectorList")
                      }></PairingRequest>
                  ))}
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          {connectorDeatilsData["connector_type"] == "Provider" &&
          connectorDeatilsData["connector_status"] == "unpaired" ? (
            <>
              <Row>
                <Col xs={12} sm={12} md={6} lg={3}></Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Button
                    onClick={() => {
                      history.push(
                        isRoleName(location.pathname) +
                          "connectors/edit/" +
                          connectorDeatilsData["id"]
                      );
                    }}
                    variant="outlined"
                    className="submitbtn">
                    Update Connector
                  </Button>
                </Col>
              </Row>
              <Row className="margin">
                <Col xs={12} sm={12} md={6} lg={3}></Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Button
                    onClick={() => changeView("isDelete")}
                    style={{ "margin-top": "0px" }}
                    variant="outlined"
                    className="editbtn">
                    Delete Connector
                  </Button>
                </Col>
              </Row>
              <Row className="marginrowtop8px"></Row>
            </>
          ) : (
            <></>
          )}
          {connectorDeatilsData["connector_type"] == "Consumer" &&
          (connectorDeatilsData["connector_status"] == "unpaired" ||
            connectorDeatilsData["connector_status"] == "rejected") ? (
            <>
              <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
                <span className="mainheading">{"Pair with"}</span>
              </Row>
              {providerConectorList.length > 0 ? (
                <Row style={{ "margin-left": "64px", "margin-top": "30px" }}>
                  <Col>
                    <TextField
                      style={{ width: "95%", textAlign: "left" }}
                      select
                      margin="normal"
                      variant="filled"
                      required
                      hiddenLabel="true"
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      label="Select Provider Connector"
                      value={providerConnector}
                      alignItems="center"
                      onChange={(e) => {
                        setproviderConnector(e.target.value);
                        getProviderConnectorDeatils(e.target.value);
                      }}>
                      {providerConectorList.map((rowData, index) => (
                        <MenuItem value={rowData.id}>
                          {rowData.connector_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Col>
                  <Col></Col>
                  <Col></Col>
                </Row>
              ) : (
                <Row style={{ "margin-left": "64px", "margin-top": "30px" }}>
                  <Col>
                    <span>
                      <img
                        src={require("../../../Assets/Img/Info_icon.svg")}
                        alt="new"
                      />{" "}
                    </span>
                    <span>
                      {"No provider connectors are available for pairing"}
                    </span>
                  </Col>
                </Row>
              )}
              {providerConnectorDetails["connector_type"] ? (
                <>
                  <Row
                    style={{
                      "margin-left": "79px",
                      "margin-top": "30px",
                      "text-align": "left",
                    }}>
                    <Col>
                      <span className="secondmainheading">
                        {"Connector Name"}
                      </span>
                    </Col>
                    <Col>
                      <span className="secondmainheading">
                        {"Connector Type"}
                      </span>
                    </Col>
                    <Col>
                      <span className="secondmainheading">
                        {"Dataset Name"}
                      </span>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      "margin-left": "79px",
                      "margin-top": "5px",
                      "text-align": "left",
                    }}>
                    <Col>
                      <Tooltip
                        title={providerConnectorDetails["connector_name"]}>
                        <Row style={useStyles.datasetdescription}>
                          <span className="thirdmainheading">
                            {providerConnectorDetails["connector_name"]}
                          </span>
                        </Row>
                      </Tooltip>
                    </Col>
                    <Col>
                      <span className="thirdmainheading">
                        {providerConnectorDetails["connector_type"]}
                      </span>
                    </Col>
                    <Col>
                      <Tooltip
                        title={
                          providerConnectorDetails["dataset_details"]
                            ? providerConnectorDetails["dataset_details"][
                                "name"
                              ]
                            : ""
                        }>
                        <Row style={useStyles.datasetdescription}>
                          <span className="thirdmainheading">
                            {providerConnectorDetails["dataset_details"]
                              ? providerConnectorDetails["dataset_details"][
                                  "name"
                                ]
                              : ""}
                          </span>
                        </Row>
                      </Tooltip>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      "margin-left": "79px",
                      "margin-top": "30px",
                      "text-align": "left",
                    }}>
                    <Col>
                      <span className="secondmainheading">
                        {"Department Name"}
                      </span>
                    </Col>
                    <Col>
                      <span className="secondmainheading">
                        {"Project Name"}
                      </span>
                    </Col>
                    <Col>
                      <span className="secondmainheading">
                        {"Certificate Status"}
                        <img
                          style={{ marginLeft: "8px" }}
                          src={require("../../../Assets/Img/donestatusicon.svg")}
                          alt="done"
                        />
                      </span>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      "margin-left": "79px",
                      "margin-top": "5px",
                      "text-align": "left",
                    }}>
                    <Col>
                      <Tooltip
                        title={
                          providerConnectorDetails["department_details"]
                            ? providerConnectorDetails["department_details"][
                                "department_name"
                              ]
                            : ""
                        }>
                        <Row style={useStyles.datasetdescription}>
                          <span className="thirdmainheading">
                            {providerConnectorDetails["department_details"]
                              ? providerConnectorDetails["department_details"][
                                  "department_name"
                                ]
                              : ""}
                          </span>
                        </Row>
                      </Tooltip>
                    </Col>
                    <Col>
                      <Tooltip
                        title={
                          providerConnectorDetails["project_details"]
                            ? providerConnectorDetails["project_details"][
                                "project_name"
                              ]
                            : ""
                        }>
                        <Row style={useStyles.datasetdescription}>
                          <span className="thirdmainheading">
                            {providerConnectorDetails["project_details"]
                              ? providerConnectorDetails["project_details"][
                                  "project_name"
                                ]
                              : ""}
                          </span>
                        </Row>
                      </Tooltip>
                    </Col>
                    <Col>
                      <Tooltip title={providerConnectorDetails["certificate"]}>
                        <Row style={useStyles.datasetdescription}>
                          <span className="thirdmainheading">
                            {providerConnectorDetails["certificate"]}
                          </span>
                        </Row>
                      </Tooltip>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      "margin-left": "79px",
                      "margin-top": "30px",
                      "text-align": "left",
                    }}>
                    <Col>
                      <span className="secondmainheading">
                        {"Docker Image url"}
                      </span>
                    </Col>
                    <Col>
                      <span className="secondmainheading">
                        {"Application Port"}
                      </span>
                    </Col>
                    <Col>
                      <span className="secondmainheading">
                        {"Hash (usage Policy)"}
                      </span>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      "margin-left": "79px",
                      "margin-top": "5px",
                      "text-align": "left",
                    }}>
                    <Col>
                      <Tooltip
                        title={getDockerHubURL(
                          providerConnectorDetails["docker_image_url"]
                        )}>
                        <Row style={useStyles.datasetdescription}>
                          <span
                            className="thirdmainheading dockerImageURL"
                            onClick={() => {
                              openLinkInNewTab(
                                getDockerHubURL(
                                  providerConnectorDetails["docker_image_url"]
                                )
                              );
                            }}>
                            {providerConnectorDetails["docker_image_url"]}
                          </span>
                        </Row>
                      </Tooltip>
                    </Col>
                    <Col>
                      <span className="thirdmainheading">
                        {providerConnectorDetails["application_port"]}
                      </span>
                    </Col>
                    <Col
                      style={{
                        width: "30px",
                        height: "37px",
                        "line-height": "19px",
                        "word-break": "break-word",
                      }}>
                      <Tooltip title={providerConnectorDetails["usage_policy"]}>
                        <Row style={useStyles.datasetdescription}>
                          <span className="thirdmainheading">
                            {providerConnectorDetails["usage_policy"]}
                          </span>
                        </Row>
                      </Tooltip>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      "margin-left": "79px",
                      "margin-top": "30px",
                      "text-align": "left",
                    }}>
                    <Col>
                      <span className="secondmainheading">
                        {"Participant organisation name"}
                      </span>
                    </Col>
                    <Col>
                      <span className="secondmainheading">
                        {"Participant organisation website"}
                      </span>
                    </Col>
                    <Col>
                      <span className="secondmainheading">{""}</span>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      "margin-left": "79px",
                      "margin-top": "5px",
                      "text-align": "left",
                    }}>
                    <Col>
                      <Tooltip
                        title={
                          providerConnectorDetails["organization_details"]
                            ? providerConnectorDetails["organization_details"][
                                "name"
                              ]
                            : ""
                        }>
                        <Row style={useStyles.datasetdescription}>
                          <span className="thirdmainheading">
                            {providerConnectorDetails["organization_details"]
                              ? providerConnectorDetails[
                                  "organization_details"
                                ]["name"]
                              : ""}
                          </span>
                        </Row>
                      </Tooltip>
                    </Col>
                    <Col>
                      <Tooltip
                        title={
                          providerConnectorDetails["organization_details"]
                            ? providerConnectorDetails["organization_details"][
                                "website"
                              ]
                            : ""
                        }>
                        <Row style={useStyles.datasetdescription}>
                          {providerConnectorDetails["organization_details"] ? (
                            <span
                              className="thirdmainheading dockerImageURL"
                              onClick={() => {
                                openLinkInNewTab(
                                  providerConnectorDetails[
                                    "organization_details"
                                  ]["website"]
                                );
                              }}>
                              {providerConnectorDetails["organization_details"]
                                ? providerConnectorDetails[
                                    "organization_details"
                                  ]["website"]
                                : ""}
                            </span>
                          ) : (
                            <span>{""}</span>
                          )}
                        </Row>
                      </Tooltip>
                    </Col>
                    <Col>
                      <span className="thirdmainheading">{""}</span>
                    </Col>
                  </Row>
                  <Row style={{ "margin-top": "15px" }}>
                    <Col xs={12} sm={12} md={6} lg={3}></Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                      <Button
                        onClick={() => sendPairingRequest()}
                        variant="contained"
                        className="submitbtn">
                        {"Send Pairing Request"}
                      </Button>
                    </Col>
                  </Row>
                  <Row className="marginrowtop8px">
                    <Col xs={12} sm={12} md={6} lg={3}></Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                      <Button
                        onClick={() => {
                          setFile(null);
                          setproviderConnectorDetails({});
                          setproviderConnector("");
                          changeView("isConnectorList");
                        }}
                        variant="outlined"
                        className="cancelbtn">
                        {screenlabels.common.cancel}
                      </Button>
                    </Col>
                  </Row>
                </>
              ) : (
                <></>
              )}
              <Row className="supportViewDeatilsSecondRow"></Row>
            </>
          ) : (
            <></>
          )}
          {connectorDeatilsData["connector_status"] == "install certificate" ? (
            <>
              <Row>
                <span style={{ "margin-left": "315px", "margin-top": "50px" }}>
                  Upload Certificate *
                </span>
              </Row>
              <Row style={{ "margin-left": "290px", "margin-right": "300px" }}>
                <Col xs={12} sm={12} md={12} lg={12} className="fileupload">
                  <FileUploader
                    handleChange={handleFileChange}
                    name="file"
                    types={fileTypes}
                    children={
                      <UploadDataset
                        uploaddes="Supports: P12 format only"
                        uploadtitle="Upload Certificate"
                      />
                    }
                    classes="fileUpload"
                  />
                </Col>
              </Row>
              <Row xs={12} sm={12} md={12} lg={12}>
                <p className="uploaddatasetname">
                  {file ? (file.size ? `File name: ${file.name}` : "") : ""}
                </p>
                <p className="oversizemb-uploadimglogo">
                  {file != null && file.size > 2097152
                    ? "File uploaded is more than 2MB!"
                    : ""}
                  {fileValid}
                </p>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={3}></Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                  {!accfilesize ? (
                    <Button
                      onClick={() => installCretificate()}
                      variant="contained"
                      className="submitbtn">
                      {"Install Certificate"}
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      disabled
                      className="disbalesubmitbtn">
                      {"Install Certificate"}
                    </Button>
                  )}
                </Col>
              </Row>
              <Row className="marginrowtop8px">
                <Col xs={12} sm={12} md={6} lg={3}></Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Button
                    onClick={() => {
                      setFile(null);
                      setaccfilesize(true);
                      changeView("isConnectorList");
                    }}
                    variant="outlined"
                    className="cancelbtn">
                    {screenlabels.common.cancel}
                  </Button>
                </Col>
              </Row>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}

      {screenView.isDelete ? (
        <Delete
          route={"login"}
          imagename={"delete"}
          firstbtntext={"Delete"}
          secondbtntext={"Cancel"}
          deleteEvent={() => {
            deleteConnector();
          }}
          cancelEvent={() => {
            setFile(null);
            setproviderConnectorDetails({});
            setproviderConnector("");
            setaccfilesize(true);
            changeView("isConnectorList");
          }}
          heading={"Delete Connector"}
          imageText={"Are you sure you want to delete connector?"}
          firstmsg={"This action will delete the connector from the system."}
          secondmsg={""}></Delete>
      ) : (
        <></>
      )}
      {screenView.isDeleSuccess ? (
        <Success
          okevent={() => {
            setFile(null);
            setproviderConnectorDetails({});
            setproviderConnector("");
            setaccfilesize(true);
            changeView("isConnectorList");
            clearAllFilters();
          }}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Your connetor is deleted successfully !"}
          imageText={"Deleted!"}
          msg={"You deleted a connector."}></Success>
      ) : (
        <></>
      )}
      {screenView.isInstallationSuccess ? (
        <Success
          okevent={() => {
            setFile(null);
            setproviderConnectorDetails({});
            setproviderConnector("");
            setaccfilesize(true);
            changeView("isConnectorList");
            clearAllFilters();
          }}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Installation Done"}
          imageText={"Success!"}
          msg={
            "The certificate has been installed successfully. The connector is ready for pairing and data exchange. "
          }></Success>
      ) : (
        <></>
      )}
      {screenView.isPairingRequestSentSuccess ? (
        <Success
          okevent={() => {
            setFile(null);
            setproviderConnectorDetails({});
            setproviderConnector("");
            setaccfilesize(true);
            changeView("isConnectorList");
            clearAllFilters();
          }}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Pairing request sent"}
          imageText={"Success!"}
          msg={
            "Your pairing request has been sent to the " +
            organisationName +
            " we will update you once any action is taken by them."
          }></Success>
      ) : (
        <></>
      )}
      {screenView.isUnpair ? (
        <Delete
          route={"login"}
          imagename={"unpair"}
          firstbtntext={"Unpair"}
          secondbtntext={"Cancel"}
          deleteEvent={() => {
            approveOrRejectConnector();
          }}
          cancelEvent={() => {
            setFile(null);
            setproviderConnectorDetails({});
            setproviderConnector("");
            setaccfilesize(true);
            changeView("isConnectorList");
          }}
          heading={"Unpair Connector"}
          imageText={"Are you sure you want to unpair connector?"}
          firstmsg={"This action will unpair the connector from the system."}
          secondmsg={""}></Delete>
      ) : (
        <></>
      )}
      {screenView.isUnpairSuccess ? (
        <Success
          okevent={() => {
            setFile(null);
            setproviderConnectorDetails({});
            setproviderConnector("");
            setaccfilesize(true);
            changeView("isConnectorList");
            clearAllFilters();
          }}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Unpaired"}
          imageText={"Success!"}
          msg={"You unpaired the connector."}></Success>
      ) : (
        <></>
      )}
      {screenView.ispair ? (
        <Delete
          route={"login"}
          imagename={"pair"}
          firstbtntext={"Approve"}
          secondbtntext={"Cancel"}
          deleteEvent={() => {
            approveOrRejectConnector();
          }}
          cancelEvent={() => {
            setFile(null);
            setproviderConnectorDetails({});
            setproviderConnector("");
            setaccfilesize(true);
            changeView("isConnectorList");
          }}
          heading={"Approve Connector Request"}
          imageText={"Are you sure you want to approve the connector?"}
          firstmsg={"This action will pair the connector from the system."}
          secondmsg={""}></Delete>
      ) : (
        <></>
      )}
      {screenView.ispairSuccess ? (
        <Success
          okevent={() => {
            setFile(null);
            setproviderConnectorDetails({});
            setproviderConnector("");
            setaccfilesize(true);
            changeView("isConnectorList");
            clearAllFilters();
          }}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Approved"}
          imageText={"Success!"}
          msg={
            "The connectors are paired now and data exchange has started."
          }></Success>
      ) : (
        <></>
      )}
      {screenView.isReject ? (
        <Delete
          route={"login"}
          imagename={"pair"}
          firstbtntext={"Reject"}
          secondbtntext={"Cancel"}
          deleteEvent={() => {
            approveOrRejectConnector();
          }}
          cancelEvent={() => {
            setFile(null);
            setproviderConnectorDetails({});
            setproviderConnector("");
            setaccfilesize(true);
            changeView("isConnectorList");
          }}
          heading={"Reject Connector Request"}
          imageText={"Are you sure you want to reject the connector?"}
          firstmsg={"This action will reject the connector from the system."}
          secondmsg={""}></Delete>
      ) : (
        <></>
      )}
      {screenView.isRejectSuccess ? (
        <Success
          okevent={() => {
            setFile(null);
            setproviderConnectorDetails({});
            setproviderConnector("");
            setaccfilesize(true);
            changeView("isConnectorList");
            clearAllFilters();
          }}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Rejected"}
          imageText={"Success!"}
          msg={
            "You have rejected the pairing request. You will receive a notification if there is a new pairing request."
          }></Success>
      ) : (
        <></>
      )}
      {screenView.isConnectorList ? (
        <div className="connectors">
          {isDatasetPresent ? (
            <Row className="supportfirstmaindiv">
              <Row className="supportmaindiv">
                <Row className="supportfilterRow">
                  <Col className="supportfilterCOlumn">
                    <ConnectorFilter
                      isShowAll={isShowAll}
                      // setIsShowAll={setIsShowAll}
                      // secondrow={secondrow}
                      // fromdate={fromdate}
                      // todate={todate}
                      // setfromdate={setfromdate}
                      // settodate={settodate}
                      // filterByDates={filterByDates}
                      // resetFilterState={resetFilterState}

                      departmentFilter={departmentFilter}
                      projectFilter={projectFilter}
                      connectorTypeFilter={connectorTypeFilter}
                      statusFilter={statusFilter}
                      deptSearchState={deptSearchState}
                      projectSearchState={projectSearchState}
                      isDeptSearchFound={isDeptSearchFound}
                      isProjectSearchFound={isProjectSearchFound}
                      handleDeptSearch={handleDeptSearch}
                      handleProjectSearch={handleProjectSearch}
                      handleFilterChange={handleFilterChange}
                      clearAllFilters={clearAllFilters}
                    />
                  </Col>
                  <Col className="supportSecondCOlumn">
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className="settingsTabs">
                      <ConnectorListing
                        connectorList={connectorList}
                        getConnectorList={getConnectorList}
                        showLoadMore={showLoadMore}
                        getImageName={getConnectorStatusImageName}
                        getStatusDisplayName={getConnectorStatusDisplayName}
                        viewCardDetails={(id) => viewCardDetails(id)}
                      />
                    </Col>
                  </Col>
                </Row>
              </Row>
            </Row>
          ) : (
            <NoDatasetConnectorView />
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

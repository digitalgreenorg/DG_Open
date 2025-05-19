import React, { useEffect, useRef, useState, useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import DatasetSelect from "./DatasetSelect/DatasetSelect";
import Join from "./Join/Join";
import Preview from "./Preview/Preview";
import styles from "./dataset_integration.module.css";
import HTTPService from "../../../Services/HTTPService";
import UrlConstant from "../../../Constants/UrlConstants";
import Loader from "../../Loader/Loader";
import {
  Alert,
  Button,
  Collapse,
  Fab,
  IconButton,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CheckLg } from "react-bootstrap-icons";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  getUserLocal,
  goToTop,
} from "../../../Utils/Common";
import { useHistory } from "react-router-dom";
import { Affix } from "antd";
import { AddIcCallOutlined } from "@material-ui/icons";
import ConnectorsList from "../../IntegrationConnectors/ConnectorsList";
import FileSaver from "file-saver";
import { FarmStackContext } from "../../Contexts/FarmStackContext";
const converter = require("json-2-csv");
const fs = require("fs");

const DatasetIntegration = (props) => {
  const { callToast } = useContext(FarmStackContext);
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [counterForIntegrator, setCounterForIntegration] = useState(2);
  const [isEdited, setIsEdited] = useState(false);

  const [
    isConditionForConnectorDataForSaveMet,
    setIsConditionForConnectorDataForSaveMet,
  ] = useState(false);
  const [isAllConditionForSaveMet, setIsAllConditionForSaveMet] =
    useState(false);
  const [temporaryDeletedCards, setTemporaryDeletedCards] = useState([]);
  const [isDatasetIntegrationListModeOn, setIsDatasetIntegrationListModeOn] =
    useState(true);
  const [top, setTop] = useState(10);
  const [orgList, setOrgList] = useState([]);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const [open, setOpen] = React.useState(false);
  const [connectorId, setConnectorId] = useState("");
  const [connectorTimeData, setConnectorTimeData] = useState({
    create_at: "",
    last_updated: "",
  });
  const [connectorIdForView, setConnectorIdForView] = useState("");

  const [template, setTemplate] = useState({
    org_id: "",
    dataset_list: [],
    file_list: [],
    org_name: "",
    dataset_id: "",
    dataset_name: "",
    file_name: "",
    availabeColumns: [],
    columnsSelected: [],
    left: [],
    right: [],
    left_on: [],
    right_on: [],
    type: "",
    result: [],
  });
  const [empty, setEmptyTemplate] = useState({
    org_id: "",
    dataset_list: [],
    file_list: [],
    org_name: "",
    dataset_id: "",
    dataset_name: "",
    file_name: "",
    availabeColumns: [],
    columnsSelected: [],
    left: [],
    right: [],
    left_on: [],
    right_on: [],
    type: "",
    result: [],
  });

  const [joinType, setJoinType] = useState("");

  //This is main array which will have all the data with the format of template or empty
  const [completeData, setCompleteData] = useState([
    //In dev mode this is the dummy data
    // { org_id: "A", dataset_list: ["d1", "d2", "d3"], file_list: ["f1", "f2", "f3"], org_name: "org_nameA", dataset_id: "id", dataset_name: "dataset_name1", file_name: "file_name1", availabeColumns: ["c1", "c2", "c3"], columnsSelected: [], left: [], right: [], left_on: [], right_on: [], type: "" },
    // { org_id: "B", dataset_list: ["d1", "d2", "d3"], file_list: ["f1", "f2", "f3"], org_name: "org_nameA", dataset_id: "id", dataset_name: "dataset_name1", file_name: "file_name1", availabeColumns: ["c4", "c5", "c6"], columnsSelected: [], left: [], right: [], left_on: [], right_on: [], type: "" },
    // { org_id: "C", dataset_list: ["d1", "d2", "d3"], file_list: ["f1", "f2", "f3"], org_name: "org_nameA", dataset_id: "id", dataset_name: "dataset_name1", file_name: "file_name1", availabeColumns: ["c7", "c8", "c9"], columnsSelected: [], left: [], right: [], left_on: [], right_on: [], type: "" },
  ]);

  // const [listOfDatsetFileAvailableForColumn, setListOfDatsetFileAvailableForColumn] = useState([])
  const [finalDataNeedToBeGenerated, setFinalDataNeedToBeGenerated] = useState(
    {}
  );
  const [integratedFilePath, setIntegratedFilePath] = useState("");
  const [noOfRecords, setNoOfRecords] = useState(0);
  const [finalDatasetAfterIntegration, setFinalDatasetAfterIntegration] =
    useState([]);
  const [finalDatasetAfterSaving, setFinalDatasetAfterSaving] = useState([]);

  //loader for every network request
  const [loader, setLoader] = useState(false);

  //connector data
  const [connectorData, setConnectorData] = useState({
    name: "",
    desc: "",
  });

  const history = useHistory();

  const handleChangeDatasetNameSelector = (event, i, source, name) => {
    if (source == "org") {
      let res = getFilesAssociatedForTheSelectedDatasets(
        source,
        [],
        event.target.value,
        i,
        name
      );
      return;
    } else if (source == "dataset") {
      if (event.target.value) {
        let res = getFilesAssociatedForTheSelectedDatasets(
          source,
          [event.target.value],
          event.target.value,
          i
        );
      }
    } else if (source == "file") {
      if (event.target.value) {
        let res = getFilesAssociatedForTheSelectedDatasets(
          source,
          [event.target.value],
          "",
          i
        );
        res.then((res) => {});
      } else {
      }
    }
  };
  const handleClickSelectDataset = (source) => {
    if (source == "dataset") {
    } else {
    }
  };

  const getDataList = (source, index) => {
    // setLoader(true)
    let url = "";
    let method;
    if (source == "org_names") {
      url = UrlConstant.base_url + UrlConstant.get_org_name_list;
      method = "GET";
    } else if (source == "dataset_names") {
      url = UrlConstant.base_url + UrlConstant.get_dataset_name_list;
      method = "GET";
    }
    HTTPService(method, url, "", false, true, false)
      .then((res) => {
        // if (!isEditModeOn && !connectorIdForView) {
        // setLoader(false)
        // }
        if (source == "org_names") {
          setOrgList([...res.data]);
        } else if (source == "dataset_names") {
          setTemplate({ ...template, dataset_list: [...res.data] });
        }
      })
      .catch((err) => {
        setAlertType("error");
        if (err?.response.status == 401 || err?.response.status == 502) {
          history.push(GetErrorHandlingRoute(err));
        } else {
          setMessage(
            err?.response?.data?.error
              ? err?.response?.data?.error
              : "Error occurred! Dataset could not fetched."
          );
        }
        // setLoader(false)
      });
  };
  const getFilesAssociatedForTheSelectedDatasets = async (
    source,
    list,
    org,
    i
  ) => {
    list = list.filter((item) => item != "");
    setLoader(true);
    let url = "";
    let payload = {};
    let method = "POST";
    if (source == "dataset") {
      url = UrlConstant.base_url + UrlConstant.get_files_for_selected_datasets;
      payload = {
        datasets: [...list],
      };
    } else if (source == "file") {
      url = UrlConstant.base_url + UrlConstant.get_columns_for_selected_files;
      payload = {
        files: [...list],
      };
    } else if (source == "org") {
      method = "GET";
      url =
        UrlConstant.base_url +
        UrlConstant.get_dataset_name_list +
        "?org_id=" +
        org;
      payload = {};
    }
    return await HTTPService(method, url, payload, false, true, false)
      .then((res) => {
        setLoader(false);
        if (source == "dataset") {
          setTemplate({
            ...template,
            availabeColumns: [],
            dataset_name: res.data[0]?.dataset_name
              ? res.data[0].dataset_name
              : "N/A",
            dataset_id: org ? org : "",
            file_name: "",
            availabeColumns: [],
            file_list: [...res.data],
          });
        } else if (source == "file") {
          let name = list[0];
          let resArr = [];
          let fileId = res.data?.id ? res.data.id : "";
          for (var key in res.data) {
            resArr.push(res.data[key]);
          }
          setTemplate({
            ...template,
            file_id: fileId,
            file_name: name,
            availabeColumns: [...res.data[name]],
          });
        } else if (source == "org") {
          console.log(template);
          setTemplate({
            ...template,
            availabeColumns: [],
            dataset_name: "",
            dataset_id: "",
            file_name: "",
            file_list: [],
            dataset_list: [...res.data],
            org_id: org,
            org_name: res?.data?.length > 0 ? res.data[0]?.org_name : "",
          });
        }
        return true;
      })
      .catch((err) => {
        goToTop(0);
        // setOpen(true);
        // setAlertType("error")
        console.log(err?.response?.data);
        setMessage(
          err?.response?.data?.error
            ? err?.response?.data?.error
            : "Some error occurred while generating!"
        );
        // let id = setTimeout(() => {
        //     setOpen(false);
        //     return clearTimeout(id)
        // }, 2500)
        setLoader(false);

        var returnValues = GetErrorKey(err, ["datasets", "files"]);
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            let id;
            switch (errorKeys[i]) {
              case "datasets":
                setOpen(true);
                setLoader(false);
                setAlertType("error");
                setMessage(
                  errorMessages[i]
                    ? errorMessages[i]
                    : "Some error occurred while fetching files for selected dataset!"
                );
                id = setTimeout(() => {
                  setOpen(false);
                  return clearTimeout(id);
                }, 2500);
                return false;
              case "files":
                setOpen(true);
                setLoader(false);
                setAlertType("error");
                setMessage(
                  errorMessages[i]
                    ? errorMessages[i]
                    : "Some error occurred while fetching files for selected dataset!"
                );
                id = setTimeout(() => {
                  setOpen(false);
                  return clearTimeout(id);
                }, 2500);
                return false;
              default:
                if (
                  err?.response?.status == 401 ||
                  err?.response?.status == 502
                ) {
                  history.push(GetErrorHandlingRoute(err));
                } else {
                  setOpen(true);
                  setLoader(false);
                  setAlertType("error");
                  console.log(err?.response?.data);
                  setMessage(
                    err?.response?.data?.error
                      ? err?.response?.data?.error
                      : "Some error occurred while generating!"
                  );
                  let id = setTimeout(() => {
                    setOpen(false);
                    return clearTimeout(id);
                  }, 2500);
                }
                return false;
            }
          }
        } else {
          if (err?.response?.status == 401 || err?.response?.status == 502) {
            history.push(GetErrorHandlingRoute(err));
          } else {
            setOpen(true);
            setLoader(false);
            setAlertType("error");
            console.log(err?.response?.data);
            setMessage(
              err?.response?.data?.error
                ? err.response.data.error
                : "Some error occurred while generating!"
            );
            let id = setTimeout(() => {
              setOpen(false);
              return clearTimeout(id);
            }, 2500);
          }
        }
        return false;
      });
  };
  const resetAll = (main, connector, join, goback, func1, func2) => {
    // goToTop()
    // if (isEditModeOn) {
    setIsConditionForConnectorDataForSaveMet(false);
    setIsAllConditionForSaveMet(false);
    // }
    setTemporaryDeletedCards([]);
    setIntegratedFilePath("");
    setNoOfRecords(0);
    setTemplate({ ...empty });
    setConnectorId("");
    setCounterForIntegration(2);
    setCompleteData([]);
    setFinalDatasetAfterIntegration([]);
    setConnectorData({ name: "", desc: "" });
    setIsEditModeOn(false);
    setIsDatasetIntegrationListModeOn(true);
  };
  const completeDataGenerator = (maps) => {
    // { org_id: "", dataset_list: [], file_list: [], org_name: "", dataset_id: "", dataset_name: "", file_name: "", availabeColumns: [], columnsSelected: [], left: [], right: [], left_on: [], right_on: [], type: "" },

    let arr = [];
    for (let i = 0; i < maps.length; i++) {
      let currentObj = {};
      let nextObj = {};

      //Current obj
      currentObj["file_name"] = maps[i]?.left_dataset_file?.file
        ? maps[i]?.left_dataset_file?.file
        : "N/A";
      currentObj["file_id"] = maps[i]?.left_dataset_file?.id
        ? maps[i]?.left_dataset_file?.id
        : "";
      // currentObj["dataset_id"] = maps[i]?.left_dataset_file?.dataset?. ?  maps[i]?.left_dataset_file?.file.split("/").at(-1) : "N/A"
      currentObj["dataset_name"] = maps[i]?.left_dataset_file?.dataset?.name
        ? maps[i]?.left_dataset_file?.dataset?.name
        : "";
      currentObj["org_name"] = maps[i]?.left_dataset_file?.dataset?.user_map
        ?.organization?.name
        ? maps[i]?.left_dataset_file?.dataset?.user_map?.organization?.name
        : "";
      currentObj["org_id"] = maps[i]?.left_dataset_file?.dataset?.user_map?.id
        ? maps[i]?.left_dataset_file?.dataset?.user_map?.id
        : "";
      currentObj["type"] = maps[i]?.condition?.how
        ? maps[i]?.condition?.how
        : "left";
      currentObj["left_on"] = maps[i]?.condition?.left_on;
      currentObj["right_on"] = maps[i]?.condition?.right_on;
      currentObj["columnsSelected"] = maps[i]?.condition?.left_selected;
      currentObj["left"] =
        maps[i]?.condition?.left?.length > 0 ? maps[i]?.condition?.left : [];
      currentObj["next_left"] =
        maps[i]?.condition?.left?.length > 0 ? maps[i]?.condition?.left : [];
      currentObj["map_id"] = maps[i]?.id ? maps[i]?.id : null;
      currentObj["result"] = maps[i]?.condition?.result
        ? maps[i]?.condition?.result
        : [];
      currentObj["availabeColumns"] =
        maps[i]?.condition?.left_available_columns?.length > 0
          ? maps[i]?.condition?.left_available_columns
          : maps[i]?.condition?.left_selected;
      arr[i] = currentObj;

      //Next obj
      nextObj["left"] =
        maps[i]?.condition?.left?.length > 0 ? maps[i]?.condition?.left : [];
      nextObj["file_name"] = maps[i]?.right_dataset_file?.file
        ? maps[i]?.right_dataset_file?.file
        : "N/A";
      nextObj["file_id"] = maps[i]?.right_dataset_file?.id
        ? maps[i]?.right_dataset_file?.id
        : "";
      nextObj["dataset_name"] = maps[i]?.right_dataset_file?.dataset?.name
        ? maps[i]?.right_dataset_file?.dataset?.name
        : "";
      nextObj["columnsSelected"] =
        maps[i]?.condition?.right_selected.length > 0
          ? maps[i]?.condition?.right_selected
          : [];
      nextObj["availabeColumns"] =
        maps[i]?.condition?.right_available_columns?.length > 0
          ? maps[i]?.condition?.right_available_columns
          : maps[i]?.condition?.left_selected;
      nextObj["org_name"] = maps[i]?.right_dataset_file?.dataset?.user_map
        ?.organization?.name
        ? maps[i]?.right_dataset_file?.dataset?.user_map?.organization?.name
        : "";
      nextObj["org_id"] = maps[i]?.right_dataset_file?.dataset?.user_map?.id
        ? maps[i]?.right_dataset_file?.dataset?.user_map?.id
        : "";
      arr[i + 1] = nextObj;
    }
    // let obj = {}
    // obj["left"] = maps[maps.length - 1]?.next_left
    // arr[arr.length] = { ...obj }
    console.log(arr);
    setCompleteData([...arr]);
    setCounterForIntegration(arr.length >= 2 ? arr.length : 2);
  };

  const setterForPreRender = (dataForRender) => {
    //set name and desc
    setConnectorData({
      ...completeData,
      name: dataForRender?.name ? dataForRender?.name : "",
      desc: dataForRender?.description ? dataForRender?.description : "",
    });
    if (dataForRender?.name && dataForRender?.description) {
      setIsConditionForConnectorDataForSaveMet(true);
    }
    //set connector id for deleting the connector if user wants
    setConnectorId(dataForRender?.id);
    //file path setting
    setIntegratedFilePath(
      dataForRender?.integrated_file?.replace("/media", "")
    );
    setNoOfRecords(
      dataForRender?.data?.no_of_records
        ? dataForRender?.data?.no_of_records
        : 0
    );

    //set already generated data
    setFinalDatasetAfterIntegration([
      ...(dataForRender?.data?.data ? dataForRender?.data?.data : []),
    ]);

    //A function to generate complete Data from maps of dataForRender
    completeDataGenerator(
      dataForRender?.maps?.length > 0 ? dataForRender?.maps : []
    );
  };

  //this function is being used to generate the data at first place, Save the generated data and delete the saved connectors
  const generateData = (index, condition, map_id) => {
    let connector_id = connectorId;
    // let map_id
    if (condition == "view_details") {
      connector_id = connectorIdForView;
    }
    //  else if (condition == "delete_map_card" && isEditModeOn) {
    //     map_id = completeData[index]["map_id"] ? completeData[index]["map_id"] : ""
    //     setTemporaryDeletedCards([...temporaryDeletedCards, map_id])
    //     return
    // }
    //condition can be ===> [integrate, delete, save] any one of the listed elements
    setLoader(true);
    let url = "";

    let payload = [];

    // console.log(index, completeData, condition, "MAIN DATA")
    if (
      condition !== "view_details" &&
      condition != "delete" &&
      condition != "delete_map_card"
    ) {
      for (let i = 0; i < index + 1; i++) {
        //Generating the payload as array of objects each object having data friom completeData and completeJoinData
        let obj = {
          left_dataset_file: completeData[i]?.file_id,
          right_dataset_file: completeData[i + 1]?.file_id,
          left_dataset_file_path: completeData[i]?.file_name,
          right_dataset_file_path: completeData[i + 1]?.file_name,
          condition: {
            result:
              completeData[i]?.result?.length > 0
                ? completeData[i]?.result
                : [],
            left:
              completeData[i]?.next_left?.length > 0
                ? completeData[i].next_left
                : [],
            right:
              completeData[i]?.right?.length > 0 ? completeData[i].right : [],
            left_available_columns:
              completeData[i]?.availabeColumns?.length > 0
                ? [...completeData[i]?.availabeColumns]
                : [],
            right_available_columns:
              completeData[i + 1]?.availabeColumns?.length > 0
                ? [...completeData[i + 1]?.availabeColumns]
                : [],
            right_selected: [...completeData[i + 1]?.columnsSelected],
            left_selected: [...completeData[i]?.columnsSelected],
            how: completeData[i]?.type ? completeData[i]?.type : "left",
            left_on: completeData[i]?.left_on,
            right_on: completeData[i]?.right_on,
          },
        };
        // console.log(temporaryDeletedCards, completeData[i]?.map_id, "completeData[i]?.map_id")
        if (
          isEditModeOn &&
          !temporaryDeletedCards.includes(completeData[i]?.map_id)
        ) {
          obj["id"] = completeData[i]?.map_id ? completeData[i]?.map_id : null;
        }
        payload.push(obj);
      }
    }
    let finalPayload;
    let method;
    if (condition == "save") {
      finalPayload = {
        name: connectorData.name,
        description: connectorData.desc,
        user: getUserLocal(),
        maps: payload,
        integrated_file: integratedFilePath,
      };
      if (isEditModeOn) {
        url =
          UrlConstant.base_url +
          UrlConstant.integration_connectors +
          connector_id +
          "/"; // for saving
        method = "PUT";
      } else {
        url = UrlConstant.base_url + UrlConstant.integration_connectors; // for saving
        method = "POST";
      }
    } else if (condition == "integrate") {
      finalPayload = {
        name: connectorData.name,
        description: connectorData.desc,
        user: getUserLocal(),
        maps: payload,
      };
      if (isEditModeOn) {
        url =
          UrlConstant.base_url + UrlConstant.joining_the_table + "?edit=True"; //for generating
      } else {
        url = UrlConstant.base_url + UrlConstant.joining_the_table; //for generating
      }
      method = "POST";
    } else if (condition == "delete" && connector_id) {
      finalPayload = {};
      url =
        UrlConstant.base_url +
        UrlConstant.integration_connectors +
        connector_id +
        "/";
      method = "DELETE";
    } else if (condition == "view_details") {
      url =
        UrlConstant.base_url +
        UrlConstant.integration_connectors +
        connector_id +
        "/";
      finalPayload = {};
      method = "GET";
    } else if (condition == "delete_map_card" && isEditModeOn && map_id) {
      method = "DELETE";
      url =
        UrlConstant.base_url +
        UrlConstant.integration_connectors +
        map_id +
        "/?maps=True";
    } else {
      setLoader(false);
      return;
    }
    console.table(finalPayload, "PAYLOAD");
    HTTPService(method, url, finalPayload, false, true, false)
      .then((res) => {
        setLoader(false);
        if (condition == "integrate") {
          console.log("inside integrate", res.data, res?.data?.no_of_records);
          setIntegratedFilePath(
            res?.data?.integrated_file ? res?.data?.integrated_file : ""
          );
          setNoOfRecords(
            res?.data?.no_of_records ? res?.data?.no_of_records : 0
          );

          setFinalDatasetAfterIntegration([...res.data?.data?.data]);
          let allKeys =
            res.data?.data?.data?.length > 0
              ? Object.keys(res.data.data.data[0])
              : [];
          if (allKeys.length > 1) {
            let arr = [...completeData];
            let obj = arr[index + 1];
            let first_obj = arr[index];
            first_obj["next_left"] = [...allKeys];
            first_obj["result"] = [...res.data?.data.data];
            obj["left"] = [...allKeys];
            obj["left_on"] = [];
            console.log("HERE IS THE CALL", arr.length, index);
            if (arr.length > 2 && index != arr.length - 2) {
              for (let i = index + 1; i < arr.length; i++) {
                arr[i]["left_on"] = [];
                arr[i]["result"] = [];
              }
              setIsAllConditionForSaveMet(false);
            } else {
              // setIsConditionForConnectorDataForSaveMet(true)
              setIsAllConditionForSaveMet(true);
            }
            arr[index] = { ...first_obj };
            arr[index + 1] = { ...obj };
            setCompleteData([...arr]);
            setOpen(true);
            setAlertType("success");
            setMessage("Data generated successfully!");
            let id = setTimeout(() => {
              setOpen(false);
              return clearTimeout(id);
            }, 2500);
            // document.querySelector('#previewTable').scrollIntoView({ behavior: 'smooth' });
          }
        } else if (condition == "save") {
          console.log("inside save", res.data);
          // setConnectorId(res?.data?.id ? res.data.id : "")
          setOpen(true);
          setAlertType("success");
          setMessage("Data saved successfully!");
          resetAll();
          let id = setTimeout(() => {
            setOpen(false);
            return clearTimeout(id);
          }, 2500);
          // document.querySelector('#previewTable').scrollIntoView({ behavior: 'smooth' });
        } else if (condition == "delete") {
          console.log("inside delete", res);
          resetAll();
          // setOpen(true);
          // setAlertType("success")
          // setMessage("Data deleted successfully!")
          // let id = setTimeout(() => {
          //     setOpen(false);
          //     return clearTimeout(id)
          // }, 2500)
        } else if (condition == "view_details") {
          console.log(res.data, "inside view_details");
          //setter function for pre prendering of the data
          setterForPreRender(res.data);
        }

        // goToTop(2000)
      })
      .catch(async (err) => {
        setLoader(false);
        let error = await GetErrorHandlingRoute(err);
        if (error.status == 401 || error.status == 502) {
          history.push(GetErrorHandlingRoute(err));
        } else if (error.status == 400) {
          callToast(
            error.message ?? "Something went wrong while integration.",
            "error",
            true
          );
        } else {
          if (condition == "integrate") {
            setIsAllConditionForSaveMet(false);
          }
          console.log(err);
          // console.log(Object.values(err?.response?.data)[0])
          setOpen(true);
          setLoader(false);
          setAlertType("error");
          setMessage(
            err?.response?.data
              ? Object.values(err?.response?.data)[0]
              : "Some error occurred while generating!"
          );
          let id = setTimeout(() => {
            setOpen(false);
            return clearTimeout(id);
          }, 2500);
          // if (condition == "view_details") {
          //     setIsEditModeOn(false)
          //     setIsDatasetIntegrationListModeOn(true)
          // }
          goToTop(0);
        }
      });
  };

  //Download functionality
  const downloadDocument = () => {
    // converter.json2csv(finalDatasetAfterIntegration, async (err, csv) => {
    //     if (err) {
    //         throw err
    //     }
    //     // print CSV string
    //     download(csv)
    // })
    let uri;
    if (integratedFilePath[0] === "/") {
      uri = UrlConstant.base_url_without_slash + integratedFilePath;
    } else {
      uri = UrlConstant.base_url + integratedFilePath;
    }
    download(
      uri,
      connectorData.name ? connectorData.name : "Integrated_dataset"
    );
  };

  //number of integration handler
  const integrateMore = (value) => {
    if (counterForIntegrator == completeData.length) {
      setCounterForIntegration((pre) => pre + value);
    }
  };

  const download = (url, connector_name) => {
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", connector_name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const deleteConnector = () => {
    generateData(1, "delete");
    // resetAll()
  };

  useEffect(() => {
    getDataList("org_names");
    if (isEditModeOn && connectorIdForView) {
      generateData(0, "view_details");
    }
  }, [isEditModeOn, connectorIdForView, isDatasetIntegrationListModeOn]);

  return (
    <>
      {loader ? <Loader /> : ""}
      <Container style={{ marginTop: "0px" }}>
        <Row style={{ margin: "0px auto" }}>
          <Col lg={12} sm={12}>
            {open ? (
              <Collapse in={open}>
                <Affix offsetTop={top}>
                  <Alert
                    severity={alertType ? alertType : ""}
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    // sx={{ mb: 1 }}
                  >
                    {message ? message : ""}
                  </Alert>
                </Affix>
              </Collapse>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Container>
      {!isDatasetIntegrationListModeOn && (
        <DatasetSelect
          setIsAllConditionForSaveMet={setIsAllConditionForSaveMet}
          temporaryDeletedCards={temporaryDeletedCards}
          setTemporaryDeletedCards={setTemporaryDeletedCards}
          connectorTimeData={connectorTimeData}
          isEditModeOn={isEditModeOn}
          setIsConditionForConnectorDataForSaveMet={
            setIsConditionForConnectorDataForSaveMet
          }
          isEdited={isEdited}
          setIsEdited={setIsEdited}
          setIsEditModeOn={setIsEditModeOn}
          setIsDatasetIntegrationListModeOn={setIsDatasetIntegrationListModeOn}
          integrateMore={integrateMore}
          empty={empty}
          setTemplate={setTemplate}
          template={template}
          counterForIntegrator={counterForIntegrator}
          resetAll={resetAll}
          generateData={generateData}
          orgList={orgList}
          joinType={joinType}
          setJoinType={setJoinType}
          connectorData={connectorData}
          setConnectorData={setConnectorData}
          setCompleteData={setCompleteData}
          completeData={completeData}
          finalDataNeedToBeGenerated={finalDataNeedToBeGenerated}
          setFinalDataNeedToBeGenerated={setFinalDataNeedToBeGenerated}
          handleClickSelectDataset={handleClickSelectDataset}
          handleChangeDatasetNameSelector={handleChangeDatasetNameSelector}
        />
      )}
      {!isDatasetIntegrationListModeOn &&
        completeData.length > 0 &&
        finalDatasetAfterIntegration?.length > 0 && (
          <Preview
            temporaryDeletedCards={temporaryDeletedCards}
            integratedFilePath={integratedFilePath}
            noOfRecords={noOfRecords}
            isConditionForConnectorDataForSaveMet={
              isConditionForConnectorDataForSaveMet
            }
            isAllConditionForSaveMet={isAllConditionForSaveMet}
            isEdited={isEdited}
            setIsEdited={setIsEdited}
            generateData={generateData}
            setIsDatasetIntegrationListModeOn={
              setIsDatasetIntegrationListModeOn
            }
            deleteConnector={deleteConnector}
            counterForIntegrator={counterForIntegrator}
            completeData={completeData}
            isEditModeOn={isEditModeOn}
            integrateMore={integrateMore}
            resetAll={resetAll}
            connectorData={connectorData}
            downloadDocument={downloadDocument}
            finalDatasetAfterIntegration={finalDatasetAfterIntegration}
          />
        )}
      {isDatasetIntegrationListModeOn && (
        <span>
          <ConnectorsList
            setConnectorTimeData={setConnectorTimeData}
            isEditModeOn={isEditModeOn}
            setIsEditModeOn={setIsEditModeOn}
            setConnectorIdForView={setConnectorIdForView}
            setIsDatasetIntegrationListModeOn={
              setIsDatasetIntegrationListModeOn
            }
          />
        </span>
      )}
    </>
  );
};

export default DatasetIntegration;

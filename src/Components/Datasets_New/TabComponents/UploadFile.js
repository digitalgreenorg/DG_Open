import React, { useContext, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import "./UploadFile.css";
import { FileUploader } from "react-drag-drop-files";
import ControlledAccordion from "../../Accordion/Accordion";
import File from "./File";
import EmptyFile from "./EmptyFile";
import DbConfiguration from "./DbConfiguration";
import TableImport from "./TableImport";
import ApiConfiguration from "./ApiConfiguration";
import HTTPService from "../../../Services/HTTPService";
import UrlConstant from "../../../Constants/UrlConstants";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  getTokenLocal,
} from "../../../Utils/Common";
import { FarmStackContext } from "../../Contexts/FarmStackContext";
import GlobalStyle from "../../../Assets/CSS/global.module.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import FileUploaderTest from "../../Generic/FileUploaderTest";
import DatasetFilerRow from "./DatasetFilterRow";
import { Row, Col } from "react-bootstrap";

const accordionTitleStyle = {
  fontFamily: "'Montserrat' !important",
  fontWeight: "400 !important",
  fontSize: "12px !important",
  lineHeight: "24px !important",
  color: "#212B36 !important",
};

const UploadFile = ({
  files,
  setFiles,
  uploadedFiles,
  setUploadedFiles,
  sqlFiles,
  setSqlFiles,
  postgresFiles,
  setPostgresFiles,
  sqLiteFiles,
  setSqLiteFiles,
  restApifiles,
  setRestApiFiles,
  validator,
  datasetId,
  dataSetName,
  getDatasetForEdit,
}) => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const [selectedUploadType, setSelectedUploadType] = useState("file_upload");
  const [file, setFile] = useState();
  const [isSizeError, setIsSizeError] = useState(false);
  const [mySqlDbName, setMySqlDbName] = useState();
  const [mySqlUserName, setMySqlUserName] = useState();
  const [mySqlPassword, setMySqlPassword] = useState();
  const [mySqlDbUrl, setMySqlDbUrl] = useState();
  const [mySqlPort, setMySqlPort] = useState();
  const [isMySqlSaveCreds, setIsMySqlSaveCreds] = useState(false);

  const [postgresDbName, setPostgresDbName] = useState();
  const [postgresUserName, setPostgresUserName] = useState();
  const [postgresPassword, setPostgresPassword] = useState();
  const [postgresDbUrl, setPostgresDbUrl] = useState();
  const [postgresPort, setPostgresPort] = useState();
  const [isPostgresSaveCreds, setIsPostgresSaveCreds] = useState(false);

  const [sqLiteDbName, setSqLiteDbName] = useState();
  const [sqLiteUserName, setSqLiteUserName] = useState();
  const [sqLitePassword, setSqLitePassword] = useState();
  const [sqLiteDbUrl, setSqLiteDbUrl] = useState();
  const [sqLitePort, setSqLitePort] = useState();
  const [isSqLiteSaveCreds, setIsSqLiteSaveCreds] = useState(false);

  const [api, setApi] = useState();
  const [authType, setAuthType] = useState("");
  const [authTypes, setAuthTypes] = useState(["NO_AUTH", "API_KEY", "BEARER"]);
  const [authToken, setAuthToken] = useState();
  const [authApiKeyName, setAuthApiKeyName] = useState("");
  const [authApiKeyValue, setAuthApiKeyValue] = useState("");
  const [exportFileName, setExportFileName] = useState();
  const [frequency, setFrequency] = useState("weekly");
  const [useSameFile, setUseSameFile] = useState(true);

  const [isMySqlConnected, setIsMySqlConnected] = useState(false);
  const [isPostgresConnected, setIsPostgresConnected] = useState(false);
  const [isSqLiteConnected, setIsSqLiteConnected] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);

  const [mySqlFileName, setMysqlFileName] = useState();
  const [mySqlTableName, setMySqlTableName] = useState();
  const [postgresFileName, setPostgresFileName] = useState();
  const [postgresTableName, setPostgresTableName] = useState();
  const [sqliteTableName, setSqliteTableName] = useState();

  const [sqlTables, setSqlTables] = useState(["1_Person.csv"]);
  const [postgresTables, setPostgresTables] = useState(["1_Cap.csv"]);
  const [sqLiteTables, setSqLiteTables] = useState(["1_User.xlsx"]);
  const [key, setKey] = useState(0);

  const [allColumns, setAllColumns] = useState([]);

  const [fileSizeError, setFileSizeError] = useState("");
  const fileTypes = ["XLS", "XLSX", "CSV", "JPEG", "PNG", "TIFF", "PDF"];

  const [fieldSets, setFieldSets] = useState([{ id: 0 }]);
  const [showDeleteButton, setShowDeleteButton] = useState([false]);

  const history = useHistory();
  const handleFileChange = (file) => {
    setIsSizeError(false);
    setFile(file);
    setKey(key + 1);
    let tempFiles = [...files];
    let s = [...file]?.forEach((f) => {
      if (!(f?.name.length > 85)) {
        tempFiles.push(f);
        return true;
      } else {
        callToast(
          "File name shouldn't be more than 85 characters.",
          "error",
          true
        );
        return false;
      }
    });
    setFiles(tempFiles);
    setFileSizeError("");
  };
  const handleDelete = (index, id, filename, type) => {
    setFileSizeError("");
    let source = "";
    if (type === "file_upload") {
      source = "file";
    } else if (type === "sqlFiles") {
      source = "mysql";
    } else if (type === "postgresFiles") {
      source = "postgresql";
    } else if (type === "sqLiteFiles") {
      source = "sqlite";
    } else if (type === "restApifiles") {
      source = "restapi";
    }
    if (id) {
      let accessToken = getTokenLocal() ?? false;
      HTTPService(
        "DELETE",
        UrlConstant.base_url + UrlConstant.upload_files + id + "/",
        "",
        false,
        true,
        accessToken
      )
        .then((res) => {
          if (res.status === 204) {
            if (type === "file_upload") {
              let filteredElements = uploadedFiles.filter(
                (item, i) => item.id !== id
              );
              setUploadedFiles(filteredElements);
            } else if (type === "sqlFiles") {
              let filteredElements = sqlFiles.filter(
                (item, i) => item.id !== id
              );
              setSqlFiles(filteredElements);
            } else if (type === "postgresFiles") {
              let filteredElements = postgresFiles.filter(
                (item, i) => item.id !== id
              );
              setPostgresFiles(filteredElements);
            } else if (type === "sqLiteFiles") {
              let filteredElements = sqLiteFiles.filter(
                (item, i) => item.id !== id
              );
              setSqLiteFiles(filteredElements);
            } else if (type === "restApifiles") {
              let filteredElements = restApifiles.filter(
                (item, i) => item.id !== id
              );
              setRestApiFiles(filteredElements);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      if (type === "file_upload") {
        let filteredElements = files.filter((item, i) => i !== index);
        setFiles(filteredElements);
      }
    }
    setKey(key + 1);
  };

  const getTotalSizeInMb = (data) => {
    let total = 0;
    data.forEach((element) => {
      total =
        parseFloat(total) +
        parseFloat(element?.file_size / Math.pow(1024, 2)).toFixed(2) * 1;
    });
    return total.toFixed(2);
  };
  const getAccordionData = () => {
    const prepareFile = (data, type) => {
      if (data && type === "file_upload") {
        let arr = data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={tempFileName}
              size={item?.file_size}
              id={item?.id}
              handleDelete={handleDelete}
              type={type}
              showDeleteIcon={true}
            />
          );
        });
        return arr;
      } else if ((data && type === "postgresFiles") || type === "sqlFiles") {
        let arr = data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={tempFileName}
              size={item?.file_size}
              id={item?.id}
              handleDelete={handleDelete}
              type={type}
              showDeleteIcon={true}
            />
          );
        });
        return arr;
      } else if (data && type === "restApifiles") {
        let arr = data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={tempFileName}
              size={item?.file_size}
              id={item?.id}
              handleDelete={handleDelete}
              type={type}
              showDeleteIcon={true}
            />
          );
        });
        return arr;
      } else {
        return [<EmptyFile text={"You have not uploaded any files"} />];
      }
    };
    if (
      uploadedFiles ||
      sqlFiles ||
      postgresFiles ||
      sqLiteFiles ||
      restApifiles
    ) {
      const data = [
        {
          panel: 1,
          title: (
            <>
              Files upload{" "}
              {uploadedFiles?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {uploadedFiles?.length} | Total size:{" "}
                  {getTotalSizeInMb(uploadedFiles)} MB)
                </span>
              ) : (
                <></>
              )}
            </>
          ),
          details:
            uploadedFiles?.length > 0
              ? prepareFile(uploadedFiles, "file_upload")
              : [<EmptyFile text={"You have not uploaded any files"} />],
        },
        {
          panel: 2,
          title: (
            <>
              MySQL{" "}
              {sqlFiles?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {sqlFiles?.length} | Total size:{" "}
                  {getTotalSizeInMb(sqlFiles)} MB)
                </span>
              ) : (
                <></>
              )}
            </>
          ),
          details:
            sqlFiles?.length > 0
              ? prepareFile(sqlFiles, "sqlFiles")
              : [<EmptyFile text={"You have not uploaded any files"} />],
        },
        {
          panel: 3,
          title: (
            <>
              Postgres{" "}
              {postgresFiles?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {postgresFiles?.length} | Total size:{" "}
                  {getTotalSizeInMb(postgresFiles)} MB)
                </span>
              ) : (
                <></>
              )}
            </>
          ),
          details:
            postgresFiles?.length > 0
              ? prepareFile(postgresFiles, "postgresFiles")
              : [<EmptyFile text={"You have not uploaded any files"} />],
        },
        // {
        //     panel: 4,
        //     title: <>
        //         SQLite {sqLiteFiles?.length > 0 ? <span style={{ color: "#ABABAB", marginLeft: '4px' }}>(Total Files: {sqLiteFiles?.length} | Total size: {getTotalSizeInMb(sqLiteFiles)} MB)</span> : <></>}
        //     </>,
        //     details: sqLiteFiles?.length > 0 ? prepareFile(sqLiteFiles, 'sqLiteFiles') : [<EmptyFile />]
        // },
        {
          panel: 4,
          title: (
            <>
              Rest API{" "}
              {restApifiles?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {restApifiles?.length} | Total size:{" "}
                  {getTotalSizeInMb(restApifiles)} MB)
                </span>
              ) : (
                <></>
              )}
            </>
          ),
          details:
            restApifiles?.length > 0
              ? prepareFile(restApifiles, "restApifiles")
              : [<EmptyFile text={"You have not uploaded any files"} />],
        },
      ];
      return data;
    } else {
      return [];
    }
  };

  const getUpdatedFile = async (fileItem) => {
    setFileSizeError("");
    let bodyFormData = new FormData();
    bodyFormData.append("dataset", datasetId);
    bodyFormData.append("source", "file");
    bodyFormData.append("file", "");
    bodyFormData.delete("file");
    bodyFormData.append("file", fileItem);
    let accessToken = getTokenLocal() ? getTokenLocal() : false;
    try {
      const response = await HTTPService(
        "POST",
        UrlConstant.base_url + UrlConstant.upload_files,
        bodyFormData,
        true,
        true,
        accessToken
      );
      setUploadedFiles((prev) => [...prev, response.data]);
      callLoader(false);
      callToast("file uploaded successfully", "success", true);
      return response?.data;
    } catch (error) {
      console.log(error);
      callLoader(false);
      callToast("something went wrong while uploading the file", "error", true);
    }
  };
  const handleUpload = async () => {
    if (selectedUploadType === "file_upload") {
      let tempFiles = [];
      files.map((fileItem) => tempFiles.push(getUpdatedFile(fileItem)));
      callLoader(true);
      Promise.all(tempFiles)
        .then((results) => {
          // results will comes in type of array
          callLoader(false);
          setFiles([]);
          getDatasetForEdit(datasetId, true);
          console.log(results);
        })
        .catch((err) => {
          callLoader(false);
          console.log(err);
        });
    }
  };

  const getPanel = () => {
    if (selectedUploadType === "file_upload") {
      return 1;
    } else if (selectedUploadType === "mysql") {
      return 2;
    } else if (selectedUploadType === "postgres") {
      return 3;
    }
    // else if (selectedUploadType === 'sqlite') {
    //     return 4;
    // }
    else if (selectedUploadType === "rest_api") {
      return 4;
    }
  };

  const handleCheckBox = () => {
    if (selectedUploadType === "mysql") {
      setIsMySqlSaveCreds(!isMySqlSaveCreds);
    } else if (selectedUploadType === "postgres") {
      setIsPostgresSaveCreds(!isPostgresSaveCreds);
    } else if (selectedUploadType === "sqlite") {
      setIsSqLiteSaveCreds(!isSqLiteSaveCreds);
    }
  };

  const handleClearFields = () => {
    if (selectedUploadType === "mysql") {
      setMySqlDbName("");
      setMySqlUserName("");
      setMySqlPassword("");
      setMySqlDbUrl("");
      setMySqlPort("");
      setIsMySqlSaveCreds(false);
    } else if (selectedUploadType === "postgres") {
      setPostgresDbName("");
      setPostgresUserName("");
      setPostgresPassword("");
      setPostgresDbUrl("");
      setPostgresPort("");
      setIsPostgresSaveCreds(false);
    } else if (selectedUploadType === "sqlite") {
      setSqLiteDbName("");
      setSqLiteUserName("");
      setSqLitePassword("");
      setSqLiteDbUrl("");
      setSqLitePort("");
      setIsSqLiteSaveCreds(false);
    } else if (selectedUploadType === "rest_api") {
      setApi("");
      setAuthToken("");
      setExportFileName("");
    }
  };

  const handleConnect = () => {
    callLoader(true);
    if (selectedUploadType === "mysql") {
      let bodyData = {
        database: mySqlDbName.trim(),
        username: mySqlUserName.trim(),
        password: mySqlPassword.trim(),
        host: mySqlDbUrl.trim(),
        port: mySqlPort,
        database_type: "mysql",
      };

      let accessToken = getTokenLocal() ? getTokenLocal() : false;
      HTTPService(
        "POST",
        UrlConstant.base_url + UrlConstant.connection_to_db_end_point,
        bodyData,
        false,
        true,
        accessToken
      )
        .then((res) => {
          callLoader(false);

          setSqlTables([...res.data]);
          setIsMySqlConnected(true);
        })
        .catch(async (err) => {
          callLoader(false);
          console.log(err);
          let returnValues = GetErrorKey(err, [
            "dbname",
            "username",
            "password",
            "host",
            "port",
            "error",
          ]);
          let errorKeys = returnValues[0];
          let errorMessages = returnValues[1];
          if (errorKeys.length > 0) {
            for (let i = 0; i < errorKeys.length; i++) {
              switch (errorKeys[i]) {
                case "dbname":
                  callToast(errorMessages[i], "error", true);
                  break;
                case "username":
                  callToast(errorMessages[i], "error", true);
                  break;
                case "password":
                  callToast(errorMessages[i], "error", true);
                  break;
                case "host":
                  callToast(errorMessages[i], "error", true);
                  break;
                case "port":
                  callToast(errorMessages[i], "error", true);
                  break;
                //if error occurs Alert will be shown as Snackbar
                default:
                  callToast("Connection establishment failed!", "error", true);
                  break;
              }
            }
          } else {
            let error = await GetErrorHandlingRoute(err);
            console.log(err);
            if (error.toast) {
              callToast(
                error?.message,
                error?.status === 200 ? "success" : "error",
                true
              );
            }
            if (error.path && history) {
              history.push(error.path);
            }
          }
        });
    } else if (selectedUploadType === "postgres") {
      let bodyData = {
        dbname: postgresDbName.trim(),
        user: postgresUserName.trim(),
        password: postgresPassword.trim(),
        host: postgresDbUrl.trim(),
        port: postgresPort,
        database_type: "postgresql",
      };
      let accessToken = getTokenLocal() ?? false;
      HTTPService(
        "POST",
        UrlConstant.base_url + UrlConstant.connection_to_db_end_point,
        bodyData,
        false,
        true,
        accessToken
      )
        .then((res) => {
          callLoader(false);
          setPostgresTables([...res.data]);
          setIsPostgresConnected(true);
        })
        .catch(async (err) => {
          callLoader(false);
          console.log(err);
          let returnValues = GetErrorKey(err, [
            "dbname",
            "username",
            "password",
            "host",
            "port",
            "error",
          ]);

          let errorKeys = returnValues[0];
          let errorMessages = returnValues[1];
          if (errorKeys.length > 0) {
            for (let i = 0; i < errorKeys.length; i++) {
              console.log(errorKeys[i]);
              switch (errorKeys[i]) {
                case "dbname":
                  callToast(errorMessages[i], "error", true);
                  break;
                case "username":
                  callToast(errorMessages[i], "error", true);
                  break;
                case "password":
                  callToast(errorMessages[i], "error", true);
                  break;
                case "host":
                  callToast(errorMessages[i], "error", true);
                  break;
                case "port":
                  callToast(errorMessages[i], "error", true);
                  break;
                //if error occurs Alert will be shown as Snackbar
                default:
                  callToast("Connection establishment failed!", "error", true);
                  break;
              }
            }
          } else {
            let error = await GetErrorHandlingRoute(err);

            console.log(err);
            if (error.toast) {
              callToast(
                error?.message,
                error?.status === 200 ? "success" : "error",
                true
              );
            }
            if (error.path && history) {
              history.push(error.path);
            }
          }
        });
    }
  };
  const handleClearField = (index) => {
    const updatedFieldSets = [...fieldSets];
    updatedFieldSets[index] = {
      id: index,
      column_name: "",
      operation: "",
      value: "",
    };
    setFieldSets(updatedFieldSets);
  };
  const handleDisconnect = () => {
    callLoader(true);
    if (selectedUploadType === "mysql") {
      setIsMySqlConnected(false);
      setMySqlTableName("");
      setSqlTables([]);
      setAllColumns([]);
      setMysqlFileName("");
      setIsPostgresConnected(false);
      setPostgresTableName("");
      setPostgresTables([]);
      setAllColumns([]);
      setPostgresFileName("");
      for (let i = 0; i < fieldSets.length; i++) {
        handleClearField(i);
      }
    } else if (selectedUploadType === "postgres") {
      setIsPostgresConnected(false);
      setPostgresTableName("");
      setPostgresTables([]);
      setAllColumns([]);
      setPostgresFileName("");
      setIsMySqlConnected(false);
      setMySqlTableName("");
      setSqlTables([]);
      setAllColumns([]);
      setMysqlFileName("");
      for (let i = 0; i < fieldSets.length; i++) {
        handleClearField(i);
      }
    } else if (selectedUploadType === "sqlite") {
      setIsSqLiteConnected(false);
    } else if (selectedUploadType === "rest_api") {
      setIsApiConnected(false);
    }
    callLoader(false);
  };

  const generateColumns = (data) => {
    let newCol = [];
    for (let i = 0; i < data.length; i++) {
      let eachColumn = { checked: false, value: data[i] };
      newCol.push(eachColumn);
    }
    setAllColumns([...newCol]);
  };

  const handleCheckBoxCheck = (e, eachCol) => {
    let newColObj = { checked: e.target.checked, value: eachCol.value };
    let newAllCol = [];
    for (let i = 0; i < allColumns.length; i++) {
      if (eachCol.value == allColumns[i].value) {
        newAllCol.push(newColObj);
      } else {
        newAllCol.push(allColumns[i]);
      }
    }
    setAllColumns([...newAllCol]);
  };

  const handleTableChange = (event) => {
    let query = event.target.value;
    let accessToken = getTokenLocal() ?? false;
    if (selectedUploadType === "mysql") {
      setMySqlTableName(query);
      HTTPService(
        "POST",
        UrlConstant.base_url + UrlConstant.get_column_from_table_name,
        { table_name: query },
        false,
        true,
        accessToken
      )
        .then((res) => {
          generateColumns([...res.data]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (selectedUploadType === "postgres") {
      setPostgresTableName(query);
      HTTPService(
        "POST",
        UrlConstant.base_url + UrlConstant.get_column_from_table_name,
        { table_name: query },
        false,
        true,
        accessToken
      )
        .then((res) => {
          generateColumns([...res.data]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (selectedUploadType === "sqlite") {
      setSqliteTableName(query);
      HTTPService(
        "POST",
        UrlConstant.base_url + UrlConstant.get_column_from_table_name,
        { table_name: query },
        false,
        true,
        accessToken
      )
        .then((res) => {
          generateColumns([...res.data]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const checkFileAlreadyImported = (
    sourceToCheck,
    fileName,
    alreadyExportedFiles
  ) => {
    const exist = (item) => {
      let fileNameWithExtension = item?.file?.split("/").at(-1);
      if (fileNameWithExtension && fileNameWithExtension.includes(".")) {
        let fileNameWithoutExtension = fileNameWithExtension?.split(".")[0];
        return fileNameWithoutExtension == fileName;
      }
    };
    if (alreadyExportedFiles.some(exist)) {
      callToast(
        "File name already exist. Please give any other name",
        "error",
        true
      );
      return true;
    }
  };

  const handleImport = () => {
    if (selectedUploadType === "mysql") {
      let query = mySqlFileName;
      let present = checkFileAlreadyImported(
        selectedUploadType,
        query,
        sqlFiles
      );
      if (present) {
        return;
      }
      let table_name = mySqlTableName;
      let selectedColumns = [];
      for (let i = 0; i < allColumns.length; i++) {
        if (allColumns[i].checked) selectedColumns.push(allColumns[i].value);
      }
      let filteredCol = fieldSets
        ?.filter(
          (fieldSet) =>
            fieldSet.column_name !== null &&
            fieldSet.column_name !== "" &&
            fieldSet.operation !== null &&
            fieldSet.operation !== "" &&
            fieldSet.value !== null &&
            fieldSet.value !== ""
        )
        .map((fieldSet) => ({
          column_name: fieldSet.column_name,
          operation: fieldSet.operation,
          value: fieldSet.value,
        }));
      let bodyFormData = new FormData();
      bodyFormData.append("col", JSON.stringify(selectedColumns));
      bodyFormData.append("file_name", query);
      bodyFormData.append("dataset_name", dataSetName);
      bodyFormData.append("dataset", datasetId);
      bodyFormData.append("source", "mysql");
      bodyFormData.append("table_name", table_name);
      if (
        JSON.stringify(fieldSets) !== JSON.stringify([{ id: 0 }]) &&
        filteredCol.length > 0
      ) {
        bodyFormData.append("filter_data", JSON.stringify(filteredCol));
      }
      let accessToken = getTokenLocal() ?? false;
      callLoader(true);
      HTTPService(
        "POST",
        UrlConstant.base_url + UrlConstant.send_columns_to_export,
        bodyFormData,
        true,
        true,
        accessToken
      )
        .then((res) => {
          callLoader(false);
          setSqlFiles([...sqlFiles, res.data]);
        })
        .catch((err) => {
          callLoader(false);
          console.log(err);
          if (err.response && err.response.data && err.response.data.data) {
            const responseData = err.response.data.data;
            if (Array.isArray(responseData) && responseData.length > 0) {
              const errorMessage = responseData[0];
              callToast(errorMessage, "error", true);
            } else {
              callToast(
                "Some error occured while exporting the file.",
                "error",
                true
              );
            }
          } else {
            callToast(
              "Some error occured while exporting the file.",
              "error",
              true
            );
          }
        });
    } else if (selectedUploadType === "postgres") {
      let query = postgresFileName;
      let present = checkFileAlreadyImported(
        selectedUploadType,
        query,
        postgresFiles
      );
      if (present) {
        return;
      }
      let table_name = postgresTableName;
      let selectedColumns = [];
      for (let i = 0; i < allColumns.length; i++) {
        if (allColumns[i].checked) selectedColumns.push(allColumns[i].value);
      }
      let filteredCol = fieldSets
        ?.filter(
          (fieldSet) =>
            fieldSet.column_name !== null &&
            fieldSet.column_name !== "" &&
            fieldSet.operation !== null &&
            fieldSet.operation !== "" &&
            fieldSet.value !== null &&
            fieldSet.value !== ""
        )
        .map((fieldSet) => ({
          column_name: fieldSet.column_name,
          operation: fieldSet.operation,
          value: fieldSet.value,
        }));
      let bodyFormData = new FormData();
      bodyFormData.append("col", JSON.stringify(selectedColumns));
      bodyFormData.append("file_name", query);
      bodyFormData.append("dataset_name", dataSetName);
      bodyFormData.append("dataset", datasetId);
      bodyFormData.append("source", "postgresql");
      bodyFormData.append("table_name", table_name);
      if (
        JSON.stringify(fieldSets) !== JSON.stringify([{ id: 0 }]) &&
        filteredCol.length > 0
      ) {
        bodyFormData.append("filter_data", JSON.stringify(filteredCol));
      }
      let accessToken = getTokenLocal() ?? false;
      callLoader(true);
      HTTPService(
        "POST",
        UrlConstant.base_url + UrlConstant.send_columns_to_export,
        bodyFormData,
        true,
        true,
        accessToken
      )
        .then((res) => {
          callLoader(false);
          setPostgresFiles([...postgresFiles, res.data]);
        })
        .catch((err) => {
          callLoader(false);
          console.log(err);
          if (err.response && err.response.data && err.response.data.data) {
            const responseData = err.response.data.data;
            if (Array.isArray(responseData) && responseData.length > 0) {
              const errorMessage = responseData[0];
              callToast(errorMessage, "error", true);
            } else {
              callToast(
                "Some error occured while exporting the file.",
                "error",
                true
              );
            }
          } else {
            callToast(
              "Some error occured while exporting the file.",
              "error",
              true
            );
          }
        });
    }
  };

  const handleExport = () => {
    if (selectedUploadType === "rest_api") {
      let present = checkFileAlreadyImported(
        selectedUploadType,
        exportFileName,
        restApifiles
      );
      if (present) {
        return;
      }

      let body = {
        dataset: datasetId,
        dataset_name: dataSetName,
        url: api.trim(),
        file_name: exportFileName.trim(),
        source: "live_api",
        auth_type: authType,
      };
      if (authType === "NO_AUTH") {
        // do nothing for now
      } else if (authType === "API_KEY" && authApiKeyName && authApiKeyValue) {
        body["api_key_name"] = authApiKeyName.trim();
        body["api_key_value"] = authApiKeyValue.trim();
      } else if (authType === "BEARER") {
        body["token"] = authToken.trim();
      }
      let accessToken = getTokenLocal() ?? false;
      callLoader(true);
      HTTPService(
        "POST",
        UrlConstant.base_url + UrlConstant.live_api,
        body,
        false,
        true,
        accessToken
      )
        .then((res) => {
          callLoader(false);
          setRestApiFiles([...restApifiles, res.data]);
          setIsApiConnected(true);
        })
        .catch((err) => {
          callLoader(false);
          console.log(err);
          callToast(err.response?.data?.message, "error", true);
        });
    }
  };
  return (
    <Row className="mt-20">
      <Col>
        <Typography
          sx={{
            fontFamily: "Montserrat !important",
            fontWeight: "600",
            fontSize: "32px",
            lineHeight: "40px",
            color: "#000000",
            textAlign: "left",
          }}
        >
          Upload or imports
        </Typography>
        <Typography
          className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
        >
          Easily upload data or import from databases and APIs.{" "}
        </Typography>
        <Box className="d-flex" sx={{ marginTop: "30px" }}>
          <Row>
            <Col className="imports_style">
              <Typography
                onClick={() => setSelectedUploadType("file_upload")}
                sx={{
                  fontFamily: "Montserrat !important",
                  fontWeight:
                    selectedUploadType === "file_upload" ? "700" : "500",
                  fontSize: "16px",
                  lineHeight: "26px",
                  color:
                    selectedUploadType === "file_upload"
                      ? "#00A94F"
                      : "#212B36",
                  textAlign: "left",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
                id="add-dataset-file-upload-id"
              >
                File upload
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Montserrat !important",
                  fontWeight: "600",
                  fontSize: "32px",
                  lineHeight: "40px",
                  color: "#000000",
                  textAlign: "left",
                  marginTop: "61px",
                }}
              >
                Imports
              </Typography>
              <Typography
                onClick={() => {
                  setSelectedUploadType("mysql");
                  setIsMySqlConnected(false);
                  setMySqlDbName("");
                  setMySqlUserName("");
                  setMySqlPassword("");
                  setMySqlDbUrl("");
                  setMySqlPort("");
                  setSqlTables([]);
                  setMysqlFileName("");
                  setAllColumns([]);
                  setIsMySqlSaveCreds(false);
                }}
                sx={{
                  fontFamily: "Montserrat !important",
                  fontWeight: selectedUploadType === "mysql" ? "700" : "500",
                  fontSize: "16px",
                  lineHeight: "26px",
                  color: selectedUploadType === "mysql" ? "#00A94F" : "#212B36",
                  textAlign: "left",
                  cursor: "pointer",
                  marginLeft: "10px",
                  marginTop: "31px",
                }}
                id="add-dataset-upload-type-mysql"
                data-testid="add_dataset_upload_type_mysql"
              >
                MySQL
              </Typography>
              <Typography
                onClick={() => {
                  setSelectedUploadType("postgres");
                  setIsPostgresConnected(false);
                  setPostgresDbName("");
                  setPostgresUserName("");
                  setPostgresPassword("");
                  setPostgresDbUrl("");
                  setPostgresPort("");
                  setPostgresTables([]);
                  setPostgresFileName("");
                  setAllColumns([]);
                  setIsPostgresSaveCreds(false);
                }}
                sx={{
                  fontFamily: "Montserrat !important",
                  fontWeight: selectedUploadType === "postgres" ? "700" : "500",
                  fontSize: "16px",
                  lineHeight: "26px",
                  color:
                    selectedUploadType === "postgres" ? "#00A94F" : "#212B36",
                  textAlign: "left",
                  cursor: "pointer",
                  marginLeft: "10px",
                  marginTop: "22px",
                }}
                id="add-dataset-upload-type-postgres"
                data-testid="add_dataset_upload_type_postgres"
              >
                PostgreSQL
              </Typography>
              <Typography
                onClick={() => {
                  setSelectedUploadType("rest_api");
                  setApi("");
                  setAuthType("");
                  setAuthApiKeyName("");
                  setAuthApiKeyValue("");
                  setAuthToken("");
                  setExportFileName("");
                }}
                sx={{
                  fontFamily: "Montserrat !important",
                  fontWeight: selectedUploadType === "rest_api" ? "700" : "500",
                  fontSize: "16px",
                  lineHeight: "26px",
                  color:
                    selectedUploadType === "rest_api" ? "#00A94F" : "#212B36",
                  textAlign: "left",
                  cursor: "pointer",
                  marginLeft: "10px",
                  marginTop: "22px",
                }}
                id="add-dataset-upload-type-rest-api"
                data-testid="add_dataset_upload_type_rest_api"
              >
                Rest API
              </Typography>
            </Col>
            <Col className="browse_style">
              {/* for File Upload */}
              {selectedUploadType === "file_upload" ? (
                <>
                  <div className="cursor-pointer">
                    <FileUploader
                      id="add-dataset-upload-file-id"
                      key={key}
                      name="file"
                      handleChange={handleFileChange}
                      multiple={true}
                      maxSize={500}
                      onSizeError={(file) => setIsSizeError(true)}
                      children={<FileUploaderTest texts={"Drop files here"} />}
                      types={fileTypes}
                    />
                    <span
                      style={{
                        color: "red",
                        fontSize: "14px",
                        textAlign: "left",
                      }}
                    >
                      {fileSizeError}
                    </span>
                  </div>
                  <Typography className="text-danger">
                    {isSizeError
                      ? "File size exceeds the maximum limit, it can't be more than 50 mb."
                      : ""}
                  </Typography>
                  <div className="list_files mt-20">
                    {files?.map((item, index) => (
                      <>
                        <File
                          id={item?.id ?? ""}
                          // id={`add-dataset-uploaded-file${index}`}
                          index={index}
                          name={item.name}
                          size={item.size}
                          handleDelete={handleDelete}
                          type={"file_upload"}
                          showDeleteIcon={true}
                        />
                      </>
                    ))}
                    {files && files.length > 0 ? (
                      <Box sx={{ marginTop: "31px", textAlign: "end" }}>
                        <Button
                          sx={{
                            fontFamily: "Montserrat",
                            fontWeight: 700,
                            fontSize: "16px",
                            width: "44px",
                            height: "48px",
                            border: "none",
                            borderRadius: "8px",
                            color: "#00A94F",
                            textTransform: "none",
                            "&:hover": {
                              background: "none",
                              border: "none",
                            },
                          }}
                          variant="outlined"
                          onClick={() => setFiles([])}
                          id="add-dataset-clear-all-file"
                        >
                          Clear
                        </Button>
                        <Button
                          sx={{
                            fontFamily: "Montserrat",
                            fontWeight: 700,
                            fontSize: "16px",
                            width: "171px",
                            height: "48px",
                            border: "1px solid rgba(0, 171, 85, 0.48)",
                            borderRadius: "8px",
                            color: "#ffffff",
                            textTransform: "none",
                            marginLeft: "60px",
                            background: "#00A94F",
                            "&:hover": {
                              background: "#00A94F",
                              color: "#ffffff",
                            },
                          }}
                          variant="contained"
                          onClick={() => handleUpload()}
                          id="add-dataset-upload-file-btn"
                        >
                          Upload
                        </Button>
                      </Box>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}
              {/* for MySql */}
              {selectedUploadType === "mysql" ? (
                <>
                  {!isMySqlConnected ? (
                    <DbConfiguration
                      dbaseName={mySqlDbName}
                      setDbaseName={setMySqlDbName}
                      userName={mySqlUserName}
                      setUserName={setMySqlUserName}
                      password={mySqlPassword}
                      setPassword={setMySqlPassword}
                      dbUrl={mySqlDbUrl}
                      setDbUrl={setMySqlDbUrl}
                      port={mySqlPort}
                      setPort={setMySqlPort}
                      handleCheckBox={handleCheckBox}
                      handleClearFields={handleClearFields}
                      handleConnect={handleConnect}
                      validator={validator}
                      dbName={"MySQL"}
                    />
                  ) : (
                    <TableImport
                      dbName={"MySQL"}
                      tableName={mySqlTableName}
                      setTableName={setMySqlTableName}
                      handleTableChange={handleTableChange}
                      fileName={mySqlFileName}
                      setFileName={setMysqlFileName}
                      handleDisconnect={handleDisconnect}
                      handleImport={handleImport}
                      validator={validator}
                      menus={sqlTables}
                      allColumns={allColumns}
                      setAllColumns={setAllColumns}
                      handleCheckBoxCheck={handleCheckBoxCheck}
                      fieldSets={fieldSets}
                      setFieldSets={setFieldSets}
                      showDeleteButton={showDeleteButton}
                      setShowDeleteButton={setShowDeleteButton}
                    />
                  )}
                </>
              ) : (
                <></>
              )}
              {/* for Postgres */}
              {selectedUploadType === "postgres" ? (
                <>
                  {!isPostgresConnected ? (
                    <DbConfiguration
                      dbaseName={postgresDbName}
                      setDbaseName={setPostgresDbName}
                      userName={postgresUserName}
                      setUserName={setPostgresUserName}
                      password={postgresPassword}
                      setPassword={setPostgresPassword}
                      dbUrl={postgresDbUrl}
                      setDbUrl={setPostgresDbUrl}
                      port={postgresPort}
                      setPort={setPostgresPort}
                      handleCheckBox={handleCheckBox}
                      handleClearFields={handleClearFields}
                      handleConnect={handleConnect}
                      validator={validator}
                      dbName={"Postgres"}
                    />
                  ) : (
                    <TableImport
                      dbName={"Postgres"}
                      tableName={postgresTableName}
                      setTableName={setPostgresTableName}
                      handleTableChange={handleTableChange}
                      fileName={postgresFileName}
                      setFileName={setPostgresFileName}
                      handleDisconnect={handleDisconnect}
                      handleImport={handleImport}
                      validator={validator}
                      menus={postgresTables}
                      allColumns={allColumns}
                      setAllColumns={setAllColumns}
                      handleCheckBoxCheck={handleCheckBoxCheck}
                      fieldSets={fieldSets}
                      setFieldSets={setFieldSets}
                      showDeleteButton={showDeleteButton}
                      setShowDeleteButton={setShowDeleteButton}
                    />
                  )}
                </>
              ) : (
                <></>
              )}
              {/* for Rest API */}
              {selectedUploadType === "rest_api" ? (
                <>
                  <ApiConfiguration
                    api={api}
                    setApi={setApi}
                    authType={authType}
                    setAuthType={setAuthType}
                    authTypes={authTypes}
                    setAuthTypes={setAuthTypes}
                    authToken={authToken}
                    setAuthToken={setAuthToken}
                    authApiKeyName={authApiKeyName}
                    setAuthApiKeyName={setAuthApiKeyName}
                    authApiKeyValue={authApiKeyValue}
                    setAuthApiKeyValue={setAuthApiKeyValue}
                    exportFileName={exportFileName}
                    setExportFileName={setExportFileName}
                    handleClearFields={handleClearFields}
                    handleConnect={handleConnect}
                    handleDisconnect={handleDisconnect}
                    handleExport={handleExport}
                    validator={validator}
                    frequency={frequency}
                    useSameFile={useSameFile}
                    setFrequency={setFrequency}
                    setUseSameFile={setUseSameFile}
                  />
                </>
              ) : (
                <></>
              )}
            </Col>
            <Col className="list_upload_style">
              <Typography
                sx={{
                  fontFamily: "Montserrat !important",
                  fontWeight: "600",
                  fontSize: "20px",
                  lineHeight: "24px",
                  color: "#000000",
                  textAlign: "left",
                  marginBottom: "20px",
                }}
              >
                List of files
              </Typography>
              <Box>
                <ControlledAccordion
                  data={getAccordionData()}
                  isCustomStyle={true}
                  width={"500px"}
                  titleStyle={accordionTitleStyle}
                  selectedPanelIndex={getPanel()}
                />
              </Box>
            </Col>
          </Row>
        </Box>
      </Col>
    </Row>
  );
};

export default UploadFile;

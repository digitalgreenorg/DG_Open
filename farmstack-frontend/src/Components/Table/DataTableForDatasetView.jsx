import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import EmptyFile from "../Datasets_New/TabComponents/EmptyFile";
import { Table } from "antd";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgressWithLabel from "../Loader/CircularLoader";
import UrlConstant from "../../Constants/UrlConstants";
import {
  getTokenLocal,
  getUserMapId,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
} from "../../Utils/Common";
import axios from "axios";
import HTTPService from "../../Services/HTTPService";
import global_style from "./../../Assets/CSS/global.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { FarmStackContext } from "../Contexts/FarmStackContext";

const DataTableForDatasetView = ({
  datasetId,
  id,
  name,
  selectedFileInfo,
  usagePolicy,
  fileType,
  userType,
  isOther,
  getDataset,
}) => {
  const antIcon = <CircularProgress color="inherit" />;
  const { callLoader, callToast } = useContext(FarmStackContext);
  const location = useLocation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const history = useHistory();
  const [data, setData] = useState();
  const [pages, setPages] = useState({
    current: 1,
    next: false,
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = React.useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 50,
      total: 100,
    },
  });
  const [columns, setColumns] = useState([]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const memoCol = useMemo(() => {
    return columns;
  }, [JSON.stringify(columns)]);

  const datasetDownloader = async (fileUrl, name) => {
    try {
      setShowLoader(true);
      const headers = {
        // Add your custom headers here
        Authorization: getTokenLocal() ?? "",
      };

      const response = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "blob",
        headers, // Pass the headers to the request
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      const url = URL.createObjectURL(response.data);

      const a = document.createElement("a");
      a.href = url;
      a.download = name; // Set the desired file name
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setShowLoader(false);
      setProgress(0);
    }
  };

  const handleDownload = (id, file) => {
    let url = UrlConstant.base_url + UrlConstant.download_file + id;
    datasetDownloader(url, file);
  };

  const isCsvOrExcelFile = (filePath) => {
    if (!filePath) return false;
    const ext = filePath.substring(filePath.lastIndexOf(".") + 1).toLowerCase();
    return ["csv", "xls", "xlsx"].includes(ext);
  };
  const fetchData = (action) => {
    setLoading(true);
    let method = "GET";
    let file_path = selectedFileInfo?.standardised_file;
    const isAllowedFileType = isCsvOrExcelFile(file_path);
    const usagePolicyOk =
    usagePolicy &&
    (!isOther ||
      usagePolicy[0]?.approval_status === "approved" ||
      fileType === "public");
    let url =
      UrlConstant.base_url +
      "/microsite/datasets/get_json_response/" +
      "?page=" +
      `${pages.current + action}` +
      "&&file_path=" +
      encodeURIComponent(file_path);
    // if user does have the access to that particular file or it belongs to his/her own dataset
    if
     (
      isAllowedFileType && usagePolicyOk
    ) 
    {
      HTTPService(method, url, "", false, true)
        .then((response) => {
          setColumns(response?.data?.columns);
          setPages({
            current: response?.data?.current_page,
            next: response?.data?.next,
          });
          setData(response?.data?.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setData(selectedFileInfo?.content);
      let cols = [];
      let first = 0;
      for (let key in selectedFileInfo?.content[0]) {
        let obj = {
          title: key.trim().split("_").join(" "),
          dataIndex: key,
          ellipsis: true,
          width: 200,
        };
        if (first == 0) {
          obj["fixed"] = "left";
          first++;
        }
        cols.push(obj);
      }
      setColumns(cols);
      setLoading(false);
      //returning array of object
    }
  };

  const askToDownload = () => {
    let accessToken = getTokenLocal() ?? false;
    let url = UrlConstant.base_url + UrlConstant.ask_for_permission;
    let body = {
      dataset_file: id,
      user_organization_map: getUserMapId(),
    };
    callLoader(true);
    HTTPService("POST", url, body, false, true, accessToken)
      .then((res) => {
        callLoader(false);
        getDataset();
        callToast(
          "Successfully, sent the request for downloading the file",
          "success",
          true
        );
      })
      .catch((err) => {
        callLoader(false);
        callToast(
          "Something went wrong while asking for the permission.",
          "error",
          true
        );
      });
  };
  const handleDelete = (usagePolicyid) => {
    let accessToken = getTokenLocal() ?? false;
    let url =
      UrlConstant.base_url +
      UrlConstant.ask_for_permission +
      usagePolicyid +
      "/";
    callLoader(true);
    HTTPService("DELETE", url, "", false, true, accessToken)
      .then((res) => {
        callLoader(false);
        getDataset();
      })
      .catch((err) => {
        callLoader(false);
        callToast("Something went wrong while recalling.", "error", true);
      });
  };
  const getButtonName = () => {
    if (usagePolicy?.[0]) {
      if (usagePolicy[0].approval_status === "requested") {
        return "Recall";
      } else if (usagePolicy[0].approval_status === "approved") {
        return "Download";
      } else if (usagePolicy[0].approval_status === "rejected") {
        return "Ask to Download";
      }
    } else {
      return "Recall";
    }
  };
  const isLoggedInUserFromHome = () => {
    if (
      location.pathname === "/home/datasets/" + datasetId &&
      getTokenLocal() &&
      (fileType === "registered" || fileType === "private")
    ) {
      return true;
    } else {
      return false;
    }
  };
  const handleButtonClick = (id, name) => {
    if (userType !== "guest") {
      if (fileType === "public" || fileType === "registered" || !isOther) {
        handleDownload(id, name);
      }
      if (isOther && fileType === "private") {
        if (!Object.keys(usagePolicy)?.length) {
          askToDownload();
        } else {
          if (usagePolicy?.[0]?.approval_status === "requested") {
            handleDelete(usagePolicy?.[0]?.id);
          } else if (usagePolicy?.[0]?.approval_status === "approved") {
            handleDownload(id, name);
          } else if (usagePolicy?.[0]?.approval_status === "rejected") {
            askToDownload(id, name);
          }
        }
      }
    } else {
      if (fileType === "public") {
        handleDownload(id, name);
      } else {
        history.push("/login");
      }
    }
  };
  useEffect(() => {
    fetchData(0);
    setPages({ current: 1, next: false });
  }, [id]);

  if (!selectedFileInfo)
    return (
      <div>
        <EmptyFile text={"No data available."} />
      </div>
    );
  return (
    <Box
      sx={{ width: "90%", margin: "auto" }}
      className="data_table_inside_dataset_details_view"
    >
      <Table
        title={() => (
          <div
            style={{
              fontFamily: "Montserrat !important",
              fontWeight: "600",
              fontSize: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              {name} - Data table
              {usagePolicy &&
              (!isOther ||
                usagePolicy[0]?.approval_status === "approved" ||
                fileType === "public")
                ? ""
                : " (Meta data)"}
            </div>
            <div>
              <Button
                sx={{
                  border: "1px solid #00A94F",
                  color: "#00A94F ",
                  textTransform: "capitalize",
                  size: "20px",
                  display: isLoggedInUserFromHome() ? "none" : "",
                }}
                onClick={() => handleButtonClick(id, name)}
                disabled={showLoader}
              >
                <DownloadIcon
                  fontSize="small"
                  sx={{ color: "#00A94F !important" }}
                />{" "}
                {userType !== "guest"
                  ? fileType === "public" ||
                    fileType === "registered" ||
                    !isOther
                    ? "Download"
                    : isOther && !Object.keys(usagePolicy).length
                    ? "Ask to Download"
                    : getButtonName()
                  : fileType === "public"
                  ? "Download"
                  : "Login to Download"}
                {showLoader && (
                  <span style={{ margin: "5px 2px 0px 9px" }}>
                    <CircularProgressWithLabel
                      value={progress}
                      color="success"
                      size={40}
                    />
                  </span>
                )}
              </Button>
            </div>
            {isLoggedInUserFromHome() ? (
              <Button
                sx={{
                  fontFamily: "Arial",
                  fontWeight: 700,
                  fontSize: mobile ? "11px" : "15px",
                  width: mobile ? "195px" : "220px",
                  height: "48px",
                  border: "1px solid rgba(0, 171, 85, 0.48)",
                  borderRadius: "8px",
                  color: "#00A94F",
                  textTransform: "none",
                  marginLeft: "35px",
                  marginRight: "25px",
                  "&:hover": {
                    background: "none",
                    border: "1px solid rgba(0, 171, 85, 0.48)",
                  },
                }}
                variant="outlined"
                onClick={() =>
                  history.push(
                    isLoggedInUserAdmin() || isLoggedInUserCoSteward()
                      ? "/datahub/new_datasets"
                      : "/participant/new_datasets"
                  )
                }
              >
                Explore Datasets
              </Button>
            ) : (
              <></>
            )}
            {/* <div>
              {usagePolicy &&
              (!isOther ||
                usagePolicy[0]?.approval_status === "approved" ||
                fileType === "public") ? (
                <div>
                  <Button
                    sx={{
                      border: "1px solid #00A94F",
                      color: "#00A94F ",
                      textTransform: "capitalize",
                      size: "20px",
                    }}
                    onClick={() => handleDownload(id, name)}
                    disabled={showLoader}
                  >
                    <DownloadIcon
                      fontSize="small"
                      sx={{ color: "#00A94F !important" }}
                    />{" "}
                    Download
                    {showLoader && (
                      <span style={{ margin: "5px 2px 0px 9px" }}>
                        <CircularProgressWithLabel
                          value={progress}
                          color="success"
                          size={40}
                        />
                      </span>
                    )}
                  </Button>{" "}
                </div>
              ) : (
                ""
              )}
            </div> */}
          </div>
        )}
        columns={memoCol}
        rowKey={(record, index) => {
          return record.id ?? index;
        }}
        dataSource={data}
        pagination={false}
        loading={
          loading ? { size: "large", tip: "Loading", indicator: antIcon } : ""
        }
        onChange={handleTableChange}
        scroll={{ y: 500, x: 1200 }}
        bordered={true}
        rowClassName="row-hover" // Apply the custom row class
        size="dense"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
          gap: "25px",
          marginTop: "10px",
        }}
      >
        <div
          className={global_style.secondary_button}
          style={{
            cursor: "pointer",
            visibility: pages.current <= 1 ? "hidden" : "visible",
          }}
          onClick={() => fetchData(-1)}
        >
          <ArrowBackIosNewIcon />
          Prev
        </div>
        <div
          style={{
            height: "25px",
            width: "25px",
            background: "#00A94F",
            color: "white",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          {pages.current}
        </div>
        <div
          className={global_style.secondary_button}
          style={{
            cursor: "pointer",
            visibility: pages.next ? "visible" : "hidden",
          }}
          onClick={() => fetchData(1)}
        >
          Next <ArrowForwardIosIcon color="#00A94F" />
        </div>
      </div>
    </Box>
  );
};

export default DataTableForDatasetView;

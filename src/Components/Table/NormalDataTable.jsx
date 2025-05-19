import React, { useContext, useEffect, useMemo, useState } from "react";
import { Table, Spin } from "antd";
import HTTPService from "../../Services/HTTPService";
import { Button, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UrlConstant from "../../Constants/UrlConstants";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import { getTokenLocal } from "../../Utils/Common";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import localStyle from "./table_with_filtering_for_api.module.css";
import global_style from "./../../Assets/CSS/global.module.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import CircularProgressWithLabel from "../Loader/CircularLoader";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import NoDataAvailable from "../Dashboard/NoDataAvailable/NoDataAvailable";
import EmptyFile from "../Datasets_New/TabComponents/EmptyFile";

const NormalDataTable = (props) => {
  const antIcon = <CircularProgress color="inherit" />;
  const { selectedFileDetailsForDatasetFileAccess, selectedFileDetails } =
    useContext(FarmStackContext);
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

  const datasetDownloader = async (fileUrl, name, type) => {
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
    const fileName = file.substring(file.lastIndexOf("/") + 1);
    let url = UrlConstant.base_url + UrlConstant.download_file + id;
    // callLoader(true);
    datasetDownloader(url, fileName);
  };

  const [columns, setColumns] = useState([]);
  const fetchData = (action) => {
    console.log(
      selectedFileDetails,
      "selectedFileDetails",
      selectedFileDetailsForDatasetFileAccess,
      "selectedFileDetailsForDatasetFileAccess"
    );
    console.log("calling", Date.now());
    setLoading(true);
    // callLoader(true);
    let method = "GET";
    let file_path = selectedFileDetails?.standardised_file;
    let url =
      UrlConstant.base_url +
      "/microsite/datasets/get_json_response/" +
      "?page=" +
      `${pages.current + action}` +
      "&&file_path=" +
      encodeURIComponent(file_path);
    // if user does have the access to that particular file or it belongs to his/her own dataset
    if (
      selectedFileDetailsForDatasetFileAccess?.usage_policy &&
      (history?.location?.state?.value === "my_organisation" ||
        selectedFileDetailsForDatasetFileAccess?.usage_policy[0]
          ?.approval_status === "approved" ||
        selectedFileDetailsForDatasetFileAccess?.accessibility === "public")
    ) {
      HTTPService(method, url, "", false, true)
        .then((response) => {
          console.log("got response", Date.now());
          setColumns(response?.data?.columns);
          setPages({
            current: response?.data?.current_page,
            next: response?.data?.next,
          });
          setData(response?.data?.data);
          console.log("setting done1", Date.now());
          setLoading(false);
          // callLoader(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setData(selectedFileDetailsForDatasetFileAccess?.content);
      let cols = [];
      let first = 0;
      for (let key in selectedFileDetailsForDatasetFileAccess?.content[0]) {
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

  useEffect(() => {
    fetchData(0);
    setPages({ current: 1, next: false });
  }, [props.selectedFile]);

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
    console.log("inside memo");
    return columns;
  }, [JSON.stringify(columns)]);

  if (!selectedFileDetails)
    return (
      <div>
        <EmptyFile text={"No data available."} />
      </div>
    );

  console.log(
    selectedFileDetailsForDatasetFileAccess,
    "selectedFileDetailsForDatasetFileAccess",
    selectedFileDetailsForDatasetFileAccess?.usage_policy,
    "selectedFileDetailsForDatasetFileAccess?.usage_policy"
  );
  return (
    <>
      <div
        style={{ width: "90%", margin: "auto" }}
        className="data_table_inside_dataset_details_view"
      >
        <Table
          title={() => (
            <div
              style={{
                fontFamily: "Montserrat !important",
                fontWeight: "600",
                fontSize: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                {" "}
                {props.datasetName} - Data table
                {selectedFileDetailsForDatasetFileAccess?.usage_policy &&
                (history?.location?.state?.value === "my_organisation" ||
                  selectedFileDetailsForDatasetFileAccess?.usage_policy[0]
                    ?.approval_status === "approved" ||
                  selectedFileDetailsForDatasetFileAccess?.accessibility ===
                    "public")
                  ? ""
                  : " (Meta data)"}
              </div>
              {selectedFileDetailsForDatasetFileAccess?.usage_policy &&
              (history?.location?.state?.value === "my_organisation" ||
                selectedFileDetailsForDatasetFileAccess?.usage_policy[0]
                  ?.approval_status === "approved" ||
                selectedFileDetailsForDatasetFileAccess?.accessibility ===
                  "public") ? (
                <div>
                  <Button
                    sx={{
                      border: "1px solid #00A94F",
                      color: "#00A94F ",
                      textTransform: "capitalize",
                      size: "20px",
                    }}
                    onClick={() =>
                      handleDownload(
                        selectedFileDetailsForDatasetFileAccess?.id,
                        selectedFileDetailsForDatasetFileAccess?.file
                      )
                    }
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
      </div>
    </>
  );
};

export default NormalDataTable;

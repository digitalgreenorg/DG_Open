import React, { useContext, useEffect, useState } from "react";
import HTTPService from "../../../Services/HTTPService";
import { Button } from "@mui/material";
import GeneratedKeyCopySystem from "./GeneratedKeyCopySystem";
import local_style from "./generate_key_copy_sysytem.module.css";
import { Col, Row } from "react-bootstrap";
import { getUserMapId } from "../../../Utils/Common";
import UrlConstant from "../../../Constants/UrlConstants";
import { FarmStackContext } from "../../Contexts/FarmStackContext";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import ReactJson from "react-json-view";
import SelectionOfColumnForConsuming from "./SelectionOfColumnForConsuming";
import ConsumerApiRequestTable from "../ConsumerApiRequestTable";

const RequestForKey = (props) => {
  const history = useHistory();
  const [refresh, setRefresh] = useState(false);
  const [showConsumableColumns, setShowConsumableColumns] = useState(true);
  const [columnName, setColumnName] = useState([]);
  const { refetcher, setRefetcher, refetchAllRequest, setRefetchAllRequest } =
    props;
  const { callLoader, callToast, selectedFileDetails } =
    useContext(FarmStackContext);
  const [policyIdForSelf, setpolicyIdForSelf] = useState("");
  const { datasetid } = useParams();
  const [listOfAllRequest, setlistOfAllRequest] = useState([]);

  //get the api key status
  const getDetailsOfDataset = () => {
    callLoader(true);
    let method = "GET";
    let url =
      UrlConstant.base_url +
      UrlConstant.datasetview +
      datasetid +
      "/?user_map=" +
      getUserMapId();
    let payload = {
      dataset_file: selectedFileDetails.id,
      user_organization_map: getUserMapId(),
      type: "",
    };
    HTTPService(method, url, "", false, true)
      .then((response) => {
        callLoader(false);
        setlistOfAllRequest(response.data.datasets);
      })
      .catch((error) => {
        callLoader(false);
        callToast("Error in getting usage policy", "error", true);
      });
  };

  //for auto submission if provider itself is a consumer
  const SubmitHandler = (condition, usagePolicyId) => {
    callLoader(true);
    let url =
      UrlConstant.base_url + "datahub/usage_policies/" + usagePolicyId + "/";
    let method = "PATCH";
    let payload;
    if (condition == "approved") {
      let date = null;
      payload = {
        approval_status: condition,
        accessibility_time: date,
        type: "api",
      };
    } else {
      payload = { approval_status: condition };
    }
    HTTPService(method, url, payload, false, true, false, false)
      .then((response) => {
        callLoader(false);
        callToast(
          condition == "approved"
            ? "Request approved successfully"
            : "Request rejected successfully",
          "success",
          true
        );
        setpolicyIdForSelf("");
        // setRefetcher(!refetcher);
        // setRefetchAllRequest(!refetchAllRequest);
        setRefresh(!refresh);
      })
      .catch((error) => {
        callLoader(false);
        callToast("Request unsuccessfull", "error", true);
      });
  };

  const handleClickForRequest = (type, policy_id) => {
    console.log("payload", columnName);
    callLoader(true);
    let url = UrlConstant.base_url + "datahub/usage_policies/";
    let payload = {
      dataset_file: selectedFileDetails.id,
      user_organization_map: getUserMapId(),
      type: "api",
      configs: {
        columns: columnName,
      },
    };
    let method = "POST";

    //if type == "recall" then the url and method has to be changed to delete the entry
    if (type == "recall") {
      url = UrlConstant.base_url + "datahub/usage_policies/" + policy_id + "/";
      payload = "";
      method = "DELETE";
    }
    HTTPService(method, url, payload, false, true)
      .then((res) => {
        callLoader(false);
        if (type == "request") {
          callToast("Request successfully sent!", "success", true);

          if (history.location?.state?.value == "my_organisation") {
            setpolicyIdForSelf(res.data.id);
          } else {
            setRefresh(!refresh);
          }
        } else {
          callToast("Request recalled successfully", "success", true);
          setRefresh(!refresh);
        }
        if (history.location?.state?.value !== "my_organisation") {
          // setRefetcher(!refetcher);
          // setRefetchAllRequest(!refetchAllRequest);
          setRefresh(!refresh);
        }
      })
      .catch((err) => {
        callLoader(false);
        callToast("Request failed", "error", true);
      });
  };

  const fetchData = () => {
    let method = "GET";
    let file_path = selectedFileDetails?.file;
    let url =
      UrlConstant.base_url +
      "/microsite/datasets/get_json_response/" +
      "?page=" +
      1 +
      "&&file_path=" +
      encodeURIComponent(file_path);
    HTTPService(method, url, "", false, true)
      .then((response) => {
        props.setPreviewForJsonFile(response?.data?.data[0]);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    fetchData();
  }, [props.selectedFile]);
  useEffect(() => {
    if (policyIdForSelf) {
      SubmitHandler("approved", policyIdForSelf);
    }
  }, [policyIdForSelf]);
  //get api key status of component mount
  // useEffect(() => {
  //   getDetailsOfDataset();
  // }, [refetcher]);

  return (
    <>
      <Row>
        <Col lg={4}>
          <div style={{ height: "450px", overflow: "auto", marginTop: "50px" }}>
            <ReactJson
              name={false}
              style={{ textAlign: "left" }}
              // theme="twilight"
              enableClipboard={true}
              indentWidth={4}
              // collapseStringsAfterLength={10}
              src={selectedFileDetails?.content[0] ?? {}}
              displayDataTypes={false}
            />
          </div>
        </Col>
        <Col lg={8}>
          <ConsumerApiRequestTable
            setRefresh={setRefresh}
            refresh={refresh}
            handleClickForRequest={handleClickForRequest}
            setColumnName={setColumnName}
            columnName={columnName}
          />
        </Col>

        {/* {console.log(selectedFileDetails, "selectedFileDetails")} */}
        {/* {selectedFileDetails?.usage_policy?.type == "api" ? (
          <Col lg={6}>
            {selectedFileDetails?.usage_policy?.approval_status ==
              "approved" && (
              <GeneratedKeyCopySystem
                data={selectedFileDetails?.usage_policy}
                file={selectedFileDetails?.file}
                url={UrlConstant.base_url + "microsite/datasets_file/api/"}
              />
            )}
            {selectedFileDetails?.usage_policy?.approval_status ==
              "requested" && (
              <div style={{ margin: "50px auto" }}>
                <div style={{ margin: "30px auto" }}>
                  {
                    "If you do not want to access this dataset file api, raise a recall!"
                  }
                </div>

                <Button
                  className={local_style.recall_access}
                  onClick={() =>
                    handleClickForRequest(
                      "recall",
                      selectedFileDetails?.usage_policy?.id
                    )
                  }
                >
                  Recall
                </Button>
              </div>
            )}

            {selectedFileDetails?.usage_policy &&
              (Object.keys(selectedFileDetails?.usage_policy)?.length == 0 ||
                selectedFileDetails?.usage_policy?.approval_status ==
                  "rejected") && (
                <div style={{ margin: "50px auto" }}>
                  <div style={{ margin: "30px auto" }}>
                    {
                      "If you want to access this dataset, raise a access request!"
                    }
                  </div>
                  {showConsumableColumns && (
                    <SelectionOfColumnForConsuming
                      setColumnName={setColumnName}
                      columnName={columnName}
                      columns={selectedFileDetails.content[0] ?? {}}
                    />
                  )}

                  <Button
                    style={{ marginTop: "25px" }}
                    className={local_style.request_access}
                    // onClick={() => setShowConsumableColumns(true)}
                    onClick={() => handleClickForRequest("request")}
                  >
                    Request access
                  </Button>
                </div>
              )}
          </Col>
        ) : (
          <>
            <div style={{ margin: "50px auto" }}>
              <div style={{ margin: "30px auto" }}>
                {"If you want to access this dataset, raise a access request!"}
              </div>

              <Button
                className={local_style.request_access}
                onClick={() => handleClickForRequest("request")}
                // onClick={() => setShowConsumableColumns(true)}
              >
                Request access
              </Button>
            </div>
          </>
        )} */}
      </Row>
    </>
  );
};

export default RequestForKey;

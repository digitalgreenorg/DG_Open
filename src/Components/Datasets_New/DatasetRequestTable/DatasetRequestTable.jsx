import React, { useContext, useEffect, useState } from "react";
import UrlConstant from "../../../Constants/UrlConstants";
import HTTPService from "../../../Services/HTTPService";
import { useHistory } from "react-router-dom";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  findType,
  getUserMapId,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../../Utils/Common";
import { FarmStackContext } from "../../Contexts/FarmStackContext";
import { Col, Container, Row } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import styles from "./dataset_request_table.module.css";
import global_styles from "../../../Assets/CSS/global.module.css";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { CSSTransition } from "react-transition-group";
import { Badge, Popconfirm, Switch } from "antd";
import GlobalStyle from "../../../Assets/CSS/global.module.css";
import NoData from "../../NoData/NoData";
import moment from "moment";
import Loader from "../../Loader/Loader";

const DatasetRequestTable = () => {
  console.log("DatasetRequestTable");
  const { isLoading, toastDetail, callLoader, callToast } =
    useContext(FarmStackContext);
  const [showRequestSent, setShowRequestSent] = useState(false);
  const [allRequestSentList, setAllRequestSentList] = useState([]);
  const [allRequestReceivedList, setAllRequestReceivedList] = useState([]);
  const [confirmIndex, setConfirmIndex] = useState(-1);
  const [requestSentColumns, setRequestSentColumns] = useState([]);
  const [requestReceivedColumns, setRequestReceivedColumns] = useState([]);
  const [toDate, setToDate] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const history = useHistory();
  const [dateError, setDateError] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleToDate = (value) => {
    let currentDate = new Date();
    let formattedDate = moment(value).format("DD/MM/YYYY");

    if (moment(formattedDate, "DD/MM/YYYY", true).isValid()) {
      if (moment(value).isSameOrAfter(currentDate, "day")) {
        setToDate(value);
        setDateError(true);
      } else {
        setDateError(false);
      }
    } else {
      setDateError(false);
    }
  };
  const confirm = (condition, usagePolicyId) => {};

  const showPopconfirm = (index) => {
    setOpen(true);
    setConfirmIndex(index);
  };

  const handleOk = (condition, usagePolicyId) => {
    setConfirmLoading(true);

    SubmitHandler(condition, usagePolicyId);
  };

  const handleCancel = () => {
    setConfirmIndex(-1);
    setOpen(false);
  };
  const [localLoader, setLocalLoader] = useState(false);
  const getAllRequestList = () => {
    setLocalLoader(true);
    let url =
      UrlConstant.base_url + "datahub/new_dataset_v2/requested_datasets/";
    let method = "POST";
    let payload = { user_map: getUserMapId() };
    HTTPService(method, url, payload, false, true, false, false, false)
      .then((response) => {
        // console.log(
        //   "🚀 ~ file: DatasetRequestTable.jsx:99 ~ .then ~ response:",
        //   response
        // );
        setAllRequestSentList(response?.data?.sent);
        setAllRequestReceivedList(response?.data?.recieved);
        setLocalLoader(false);
      })
      .catch(async (error) => {
        setLocalLoader(false);
        let response = await GetErrorHandlingRoute(error);
        console.log(response, "response");
        if (response?.toast) {
          callToast(
            response?.message ?? response?.data?.detail,
            response.status == 200 ? "success" : "error",
            response.toast
          );
        } else {
          history.push(response?.path);
        }
      });
  };

  const SubmitHandler = (condition, usagePolicyId) => {
    let url =
      UrlConstant.base_url + "datahub/usage_policies/" + usagePolicyId + "/";
    console.log(
      "🚀 ~ file: DatasetRequestTable.jsx:127 ~ SubmitHandler ~ url:",
      url
    );
    let method = "PATCH";
    let payload;
    if (condition == "approved") {
      console.log(
        "🚀 ~ file: DatasetRequestTable.jsx:132 ~ SubmitHandler ~ condition:",
        condition
      );
      let date = toDate ? new Date(toDate) : null;
      if (date) {
        let timezoneOffset = date.getTimezoneOffset() * 60 * 1000; // convert to milliseconds
        date = new Date(date.getTime() - timezoneOffset); // adjust for timezone offset
      }
      payload = {
        approval_status: condition,
        accessibility_time: date ? date.toISOString().substring(0, 10) : null,
      };
    } else {
      payload = { approval_status: condition };
    }

    console.log(
      "🚀 ~ file: DatasetRequestTable.jsx:131 ~ SubmitHandler ~ payload:",
      payload
    );
    HTTPService(method, url, payload, false, true, false, false)
      .then((response) => {
        setConfirmLoading(false);
        setOpen(false);
        setConfirmIndex(-1);
        setRefresh(!refresh);
        setToDate(null);
      })
      .catch(async (err) => {
        setConfirmLoading(false);
        setOpen(false);
        setConfirmIndex(-1);
        setRefresh(!refresh);

        var returnValues = GetErrorKey(err, [
          "approval_status",
          "accessibility_time",
        ]);
        var errorKeys = returnValues[0];
        console.log(
          "🚀 ~ file: DatasetRequestTable.jsx:175 ~ SubmitHandler ~ errorKeys:",
          errorKeys,
          returnValues
        );
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "approval_status":
                callToast(errorMessages[i], "error", true);
                break;
              case "accessibility_time":
                callToast(errorMessages[i], "error", true);
                break;
              default:
                let response = await GetErrorHandlingRoute(err);
                if (response.toast) {
                  callToast(
                    response?.message ?? response?.data?.detail ?? "Unknown",
                    response.status == 200 ? "success" : "error",
                    response.toast
                  );
                } else {
                  history.push(response?.path);
                }
                break;
            }
          }
        } else {
          let response = await GetErrorHandlingRoute(err);
          if (response.toast) {
            callToast(
              response?.message ?? response?.data?.detail ?? "Unknown",
              response.status == 200 ? "success" : "error",
              response.toast
            );
          } else {
            history.push(response?.path);
          }
        }
      });
  };
  const handleDetailRoute = (row) => {
    if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      return {
        pathname: "/datahub/new_datasets/view/" + row.dataset_id + "/",
        state: { tab: "my_organisation" },
      };
    } else if (isLoggedInUserParticipant()) {
      return {
        pathname: "/participant" + "/new_datasets/view/" + row.dataset_id + "/",
        state: { tab: "my_organisation" },
      };
    }
  };
  useEffect(() => {
    let columnsForSent = [
      "Dataset name",
      "File name",
      "Organization name",
      "Accessibility time",
      "Approval status",
      "View",
    ];
    let columnsForReceived = [
      "Dataset details",
      "Organization details",
      "Status",
      "Actions",
      "View",
    ];
    setRequestReceivedColumns(columnsForReceived);
    setRequestSentColumns(columnsForSent);
  }, [allRequestReceivedList, allRequestSentList]);
  useEffect(() => {
    console.log("showRequestSent", refresh, showRequestSent);
    getAllRequestList();
  }, [refresh, showRequestSent]);

  if (localLoader) return <Loader />;
  return (
    <>
      {allRequestSentList.length > 0 || allRequestReceivedList.length > 0 ? (
        <>
          <Row>
            <Col
              lg={6}
              sm={12}
              md={12}
              className={
                global_styles.size36 +
                " " +
                global_styles.bold600 +
                " text-left mt-20 mb-20"
              }
            >
              Request {showRequestSent ? "sent" : "received"}
              <Typography
                className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
              >
                {" "}
                {showRequestSent
                  ? "Track the status of your dataset access requests."
                  : "Review requests from organisations seeking access to your dataset."}{" "}
              </Typography>
            </Col>
            <Col
              lg={6}
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "right",
              }}
            >
              <Typography className={global_styles.bold600}>
                Received
              </Typography>
              <Switch
                style={{ background: "#00A94F" }}
                checked={showRequestSent}
                onChange={setShowRequestSent}
                id="dataset-requests-receive-and-sent-toggle"
                data-testid="dataset-requests-receive-and-sent-toggle-test"
              />
              <Typography className={global_styles.bold600}>Sent</Typography>
            </Col>
          </Row>
          <Row>
            <Col lg={12} sm={12} md={12}></Col>
            <TableContainer
              component={Paper}
              style={{}}
              className="requestTableContainer"
            >
              <CSSTransition
                appear={!showRequestSent}
                in={!showRequestSent}
                timeout={{
                  appear: 600,
                  enter: 700,
                  exit: 100,
                }}
                classNames="step"
                unmountOnExit
              >
                <Table
                  sx={{
                    "& .MuiTableCell-root": {
                      borderLeft: "1px solid rgba(224, 224, 224, 1)",
                      fontFamily: "Montserrat",
                    },
                  }}
                >
                  <TableHead
                    sx={{
                      background: "#F8F8F8 !important",
                      fontFamily: "Montserrat",
                    }}
                  >
                    <TableRow
                      sx={{
                        "& .MuiTableCell-root": {
                          fontFamily: "Montserrat",
                        },
                      }}
                    >
                      {requestReceivedColumns.map((eachHead, index) => {
                        let alignItems = index == 1 ? "left" : "center";
                        return (
                          <TableCell
                            sx={{
                              "& .MuiTableCell-root": {
                                fontFamily: "Montserrat",
                              },
                              textAlign: alignItems,
                              alignItems: alignItems,
                            }}
                            className={styles.file_table_column}
                          >
                            {eachHead}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allRequestReceivedList.map((row, index) => {
                      //no api request in the request table outside the dashboard
                      if (row?.type !== "api") {
                        return (
                          <TableRow
                            key={row.id}
                            sx={{
                              textTransform: "capitalize",
                            }}
                            className={global_styles.bold500}
                            style={{ width: "100%" }}
                          >
                            <TableCell
                              style={{ width: "30%", maxWidth: "350px" }}
                              component="th"
                              scope="row"
                            >
                              <div style={{ display: "flex", gap: "20px" }}>
                                <span style={{ width: "50%" }}>
                                  <div
                                    className={
                                      global_styles.bold600 +
                                      " " +
                                      global_styles.size16 +
                                      " " +
                                      global_styles.ellipses
                                    }
                                  >
                                    {row.dataset_name}
                                  </div>
                                  <div>Dataset name</div>
                                </span>
                                <span style={{ width: "50%" }}>
                                  <div
                                    className={
                                      global_styles.bold600 +
                                      " " +
                                      global_styles.size16 +
                                      " " +
                                      global_styles.ellipses
                                    }
                                  >
                                    {" "}
                                    {row.file_name}
                                  </div>
                                  <div>File name</div>
                                </span>
                              </div>
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <div style={{ display: "flex", gap: "20px" }}>
                                <div>
                                  <div
                                    style={{ maxWidth: "150px" }}
                                    className={
                                      global_styles.bold600 +
                                      " " +
                                      global_styles.size16 +
                                      " " +
                                      global_styles.ellipses
                                    }
                                  >
                                    {row.organization_name}
                                  </div>
                                  <div>Organization name</div>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell component="th" scope="row">
                              <div
                                style={{
                                  display: "flex",
                                  gap: "20px",
                                  justifyContent: "left",
                                }}
                              >
                                <div>
                                  <div
                                    className={
                                      global_styles.bold600 +
                                      " " +
                                      global_styles.size16
                                    }
                                  >
                                    <Badge
                                      data-testid="approved_and_reject_test_id"
                                      style={{
                                        backgroundColor:
                                          row.approval_status == "rejected"
                                            ? "#ff5630"
                                            : row.approval_status == "approved"
                                            ? "#00A94F"
                                            : "#faad14",
                                        width: "80px",
                                      }}
                                      className={
                                        global_styles.bold600 +
                                        " " +
                                        global_styles.size16
                                      }
                                      count={row.approval_status}
                                    ></Badge>
                                  </div>

                                  <div
                                    style={{
                                      fontStyle: "italic",
                                      width: "112px",
                                    }}
                                    className={global_styles.ellipses}
                                    data-testid="approved-badge-test"
                                  >
                                    {row.approval_status == "approved"
                                      ? `Till : ${
                                          row.accessibility_time ?? "NA"
                                        }`
                                      : ""}
                                  </div>
                                </div>

                                <div>
                                  <div
                                    className={
                                      global_styles.bold600 +
                                      " " +
                                      global_styles.size16 +
                                      " " +
                                      global_styles.ellipses
                                    }
                                    style={{ maxWidth: "112px" }}
                                  >
                                    {row.updated_at?.substring(0, 10)}
                                  </div>
                                  Last updated
                                </div>
                              </div>
                            </TableCell>

                            <TableCell
                              className={styles.table_cell_for_approve_button}
                            >
                              {row.approval_status !== "approved" &&
                                row.approval_status !== "rejected" && (
                                  <Popconfirm
                                    title={
                                      <span
                                        style={{
                                          color: "#00A94F",
                                          textTransform: "none",
                                          fontFamily: "Montserrat",
                                        }}
                                      >
                                        Please select the accessibility time
                                      </span>
                                    }
                                    description={
                                      <>
                                        <LocalizationProvider
                                          dateAdapter={AdapterDateFns}
                                        >
                                          <DatePicker
                                            disablePast
                                            inputFormat="dd/MM/yyyy"
                                            placeholder="Till"
                                            label="Till"
                                            value={toDate}
                                            onChange={(value) =>
                                              handleToDate(value)
                                            }
                                            PaperProps={{
                                              sx: {
                                                borderRadius: "16px !important",
                                                "& .MuiPickersDay-root": {
                                                  "&.Mui-selected": {
                                                    backgroundColor:
                                                      "#007B55 !important",
                                                  },
                                                },
                                              },
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                id="dataset-request-recevie-data-field"
                                                data-testid="dataset-request-recevie-data-field-test"
                                                disabled
                                                {...params}
                                                variant="outlined"
                                                sx={{
                                                  width: "300px",
                                                  svg: { color: "#00A94F" },
                                                  "& .MuiInputBase-input": {
                                                    height: "20px",
                                                  },
                                                  "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                      borderColor:
                                                        "#919EAB !important",
                                                    },
                                                    "&:hover fieldset": {
                                                      borderColor: "#919EAB",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                      borderColor: "#919EAB",
                                                    },
                                                  },
                                                }}
                                                helperText={
                                                  <Typography
                                                    sx={{
                                                      fontFamily:
                                                        "Montserrat !important",
                                                      fontWeight: "400",
                                                      fontSize: "12px",
                                                      lineHeight: "18px",
                                                      color: "#FF0000",
                                                      textAlign: "left",
                                                    }}
                                                  ></Typography>
                                                }
                                              />
                                            )}
                                          />
                                        </LocalizationProvider>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "right",
                                            alignItems: "center",
                                            gap: "20px",
                                            marginTop: "20px",
                                          }}
                                        >
                                          <Button
                                            className={
                                              global_styles.secondary_button
                                            }
                                            onClick={() => handleCancel()}
                                            id="dataset-request-recevied-cancel-btn"
                                            data-testid="dataset-request-recevied-cancel-btn-test"
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            className={
                                              global_styles.primary_button
                                            }
                                            onClick={() =>
                                              handleOk("approved", row.id)
                                            }
                                            id="dataset-request-recevied-approve-btn"
                                            data-testid="dataset-request-recevied-approve-btn-test"
                                            disabled={!dateError || !toDate}
                                          >
                                            Approve
                                          </Button>
                                        </div>
                                      </>
                                    }
                                    open={open && index == confirmIndex}
                                    onOpenChange={() =>
                                      console.log("open change")
                                    }
                                    okButtonProps={{
                                      ghost: true,
                                      type: "text",
                                      disabled: true,
                                    }}
                                    okText={<></>}
                                    showCancel={false}
                                    className={styles.ant_buttons}
                                  >
                                    <Button
                                      style={{
                                        border: "1px solid #00A94F",
                                        color: "#00A94F",
                                        textTransform: "none",
                                        height: "30px",
                                        fontFamily: "Montserrat",
                                        width: "100px",
                                      }}
                                      onClick={() => showPopconfirm(index)}
                                      id="dataset-request-recevied-approve-btn2"
                                      data-testid="dataset-request-recevied-approve-btn2-test"
                                    >
                                      Approve
                                    </Button>{" "}
                                  </Popconfirm>
                                )}
                              {row.approval_status !== "rejected" && (
                                <Button
                                  style={{
                                    border: "1px solid #ff5630",
                                    color: "#ff5630",
                                    textTransform: "none",
                                    height: "30px",
                                    width: "100px",
                                    fontFamily: "Montserrat",
                                  }}
                                  onClick={() =>
                                    SubmitHandler("rejected", row.id)
                                  }
                                  id="dataset-request-recevied-recall-reject-btn"
                                  data-testid="dataset-request-recevied-recall-reject-btn-test"
                                >
                                  {row.approval_status == "approved"
                                    ? "Recall"
                                    : "Reject"}
                                </Button>
                              )}
                              {row.approval_status === "rejected" && (
                                <div>No Action available</div>
                              )}
                            </TableCell>
                            <TableCell>
                              <span
                                className={global_styles.primary_color}
                                onClick={() =>
                                  history.push(handleDetailRoute(row))
                                }
                                style={{
                                  cursor: "pointer",
                                  fontFamily: "Montserrat",
                                  textAlign: "center",
                                }}
                                id="dataset-request-detail"
                                data-testid="dataset-request-detail-test"
                              >
                                Detail
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    })}
                  </TableBody>
                </Table>
              </CSSTransition>
              <CSSTransition
                appear={showRequestSent}
                in={showRequestSent}
                timeout={{
                  appear: 600,
                  enter: 700,
                  exit: 100,
                }}
                classNames="step"
                unmountOnExit
              >
                <Table
                  sx={{
                    "& .MuiTableCell-root": {
                      borderLeft: "1px solid rgba(224, 224, 224, 1)",
                      fontFamily: "Montserrat",
                    },
                  }}
                >
                  <TableHead
                    sx={{
                      background: "#F8F8F8 !important",
                      fontFamily: "Montserrat",
                    }}
                  >
                    <TableRow>
                      {requestSentColumns.map((eachHead, index) => {
                        //no api request in the request table outside the dashboard
                        return (
                          <TableCell
                            sx={{
                              "& .MuiTableCell-root": {
                                fontFamily: "Montserrat",
                              },
                              alignItems: "center",
                              textAlign: "left",
                            }}
                            className={styles.file_table_column}
                          >
                            {eachHead}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allRequestSentList.map((row) => {
                      if (row.type !== "api") {
                        return (
                          <TableRow
                            key={row.id}
                            sx={{
                              textTransform: "capitalize",
                            }}
                            className={global_styles.bold500}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              style={{ width: "20%", maxWidth: "150px" }}
                              className={global_styles.ellipses}
                            >
                              {row.dataset_name}
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              style={{ width: "20%", maxWidth: "150px" }}
                              className={global_styles.ellipses}
                            >
                              {row.file_name}
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              style={{ width: "15%", maxWidth: "150px" }}
                              className={global_styles.ellipses}
                            >
                              {row.organization_name}
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              style={{ width: "15%", maxWidth: "150px" }}
                              className={global_styles.ellipses}
                            >
                              {row.accessibility_time}
                            </TableCell>

                            <TableCell
                              style={{
                                color:
                                  row.approval_status == "rejected"
                                    ? "#ff5630"
                                    : row.approval_status == "approved"
                                    ? "#00A94F"
                                    : "#c09507",
                                textAlign: "left",
                              }}
                              component="th"
                              scope="row"
                            >
                              <Badge
                                style={{
                                  backgroundColor:
                                    row.approval_status == "rejected" ||
                                    row.approval_status === "recalled"
                                      ? "#ff5630"
                                      : row.approval_status == "approved"
                                      ? "#00A94F"
                                      : "#faad14",
                                  width: "80px",
                                }}
                                count={row.approval_status}
                              ></Badge>

                              <span //this badge for recall the request from requested dataset
                                style={{
                                  cursor:
                                    row.approval_status === "requested"
                                      ? "pointer"
                                      : "default",
                                }}
                                onClick={() => {
                                  if (!row?.id) {
                                    console.error(
                                      "Row ID is undefined, cannot submit:",
                                      row
                                    );
                                    return;
                                  }
                                  handleOk("recalled", row.id);
                                }}
                              >
                                <Badge
                                  style={{
                                    backgroundColor:
                                      row.approval_status === "requested"
                                        ? "#ff3030"
                                        : "",
                                    width: "80px",
                                  }}
                                  count={
                                    row.approval_status === "requested"
                                      ? "Recall"
                                      : ""
                                  }
                                />
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={global_styles.primary_color}
                                onClick={() =>
                                  history.push(
                                    `/${findType()}/new_datasets/view/` +
                                      row.dataset_id +
                                      "/",
                                    {
                                      data: "other",
                                      tab: "other_organisation",
                                    }

                                    // {history?.location?.state?.tab === "other_organisation"}
                                  )
                                }
                                style={{
                                  cursor: "pointer",
                                  fontFamily: "Montserrat",
                                  textAlign: "center",
                                }}
                                id="dataset-request-detail2"
                              >
                                Detail
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    })}
                  </TableBody>
                </Table>
              </CSSTransition>
            </TableContainer>
          </Row>
        </>
      ) : (
        !localLoader && (
          <NoData
            title={"There are no Datasets"}
            subTitle={"As of now there are no request"}
          />
        )
      )}
    </>
  );
};

export default DatasetRequestTable;

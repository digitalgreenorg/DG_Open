import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Checkbox,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import moment from "moment/moment";
import { Badge, Popconfirm, Switch } from "antd";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import global_styles from "../../../Assets/CSS/global.module.css";
import GlobalStyle from "../../../Assets/CSS/global.module.css";
import UrlConstant from "../../../Constants/UrlConstants";
import { GetErrorHandlingRoute, getUserMapId } from "../../../Utils/Common";
import { FarmStackContext } from "../../../Components/Contexts/FarmStackContext";
import { useHistory } from "react-router-dom";
import HTTPService from "../../../Services/HTTPService";
import { Col, Row } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import styles from "../resources.module.css";

const ResourceRequestTable = () => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const history = useHistory();
  const [confirmIndex, setConfirmIndex] = useState(-1);
  const [toDate, setToDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [allRequestSentList, setAllRequestSentList] = useState([]);
  const [allRequestReceivedList, setAllRequestReceivedList] = useState([]);
  const [showRequestSent, setShowRequestSent] = useState(false);
  const [requestSentColumns, setRequestSentColumns] = useState([]);
  const [requestReceivedColumns, setRequestReceivedColumns] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isEmbeddings, setIsEmbeddings] = useState(false);

  const rows = [];

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

  const SubmitHandler = (condition, statusId) => {
    let url =
      UrlConstant.base_url +
      UrlConstant.resource_grant_for_permission +
      statusId +
      "/";
    let payload;
    let method = "PATCH";
    if (condition == "approved") {
      let date = toDate ? new Date(toDate) : null;
      if (date) {
        let timezoneOffset = date.getTimezoneOffset() * 60 * 1000; // convert to milliseconds
        date = new Date(date.getTime() - timezoneOffset); // adjust for timezone offset
      }
      payload = {
        approval_status: condition,
        accessibility_time: date ? date.toISOString().substring(0, 10) : null,
        type: isEmbeddings ? "embeddings" : "resource",
      };
    } else if (condition == "recall") {
      method = "DELETE";
      payload = null;
    } else if (condition == "rejected") {
      payload = { approval_status: condition };
    }
    callLoader(true);
    HTTPService(method, url, payload, false, true, false, false)
      .then((response) => {
        callLoader(false);
        setOpen(false);
        setConfirmIndex(-1);
        setRefresh(!refresh);
        setToDate(null);
      })
      .catch(async (err) => {
        callLoader(false);
        setOpen(false);
        setConfirmIndex(-1);
        setRefresh(!refresh);
      });
  };

  const showPopconfirm = (index) => {
    setOpen(true);
    setConfirmIndex(index);
  };

  const handleOk = (condition, usagePolicyId) => {
    SubmitHandler(condition, usagePolicyId);
  };

  const handleCancel = () => {
    setConfirmIndex(-1);
    setOpen(false);
  };

  function getEmptyMessage() {
    if (!allRequestSentList?.length && !allRequestReceivedList?.length) {
      return "As of now, no request has been sent/recieved.";
    } else if (!allRequestSentList?.length) {
      return "As of now, no request has been sent.";
    } else if (!allRequestReceivedList?.length) {
      return "As of now, no request has been recieved.";
    }
  }

  const getAllRequestList = async () => {
    callLoader(true);
    let url =
      UrlConstant.base_url + "datahub/resource_management/requested_resources/";
    let method = "POST";
    let payload = { user_map: getUserMapId() };
    await HTTPService(method, url, payload, false, true, false, false, false)
      .then((response) => {
        setAllRequestSentList(response?.data?.sent);
        setAllRequestReceivedList(response?.data?.recieved);
        callLoader(false);
      })
      .catch(async (error) => {
        callLoader(false);
        let response = await GetErrorHandlingRoute(error);
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

  useEffect(() => {
    let columnsForSent = [
      "Content name",
      "Organization name",
      "Accessibility time",
      "Approval status",
    ];
    let columnsForReceived = [
      "Content name",
      "Organization name",
      "Status",
      "Actions",
    ];
    setRequestReceivedColumns(columnsForReceived);
    setRequestSentColumns(columnsForSent);
  }, [allRequestReceivedList, allRequestSentList]);

  useEffect(() => {
    getAllRequestList();
  }, [refresh, showRequestSent]);

  return (
    <Box>
      {allRequestSentList.length > 0 || allRequestReceivedList.length > 0 ? (
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
                ? "Track the status of your content access requests."
                : "Review requests from organisations seeking access to your content."}{" "}
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
            <Typography className={global_styles.bold600}>Received</Typography>
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
      ) : (
        <></>
      )}
      <TableContainer
        className="mt-30"
        sx={{
          borderRadius: "12px",
        }}
        component={Paper}
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
          <Table sx={{ minWidth: 650 }} stickyHeader aria-label="simple table">
            <TableHead
              sx={{
                "& .MuiTableCell-head": {
                  backgroundColor: "#F6F6F6",
                },
              }}
            >
              <TableRow>
                {requestReceivedColumns.map((eachHead, index) => {
                  return (
                    <TableCell
                      sx={{
                        "& .MuiTableCell-root": {
                          fontFamily: "Montserrat",
                        },
                      }}
                      align="left"
                      className={styles.file_table_column}
                    >
                      {eachHead}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {allRequestReceivedList?.length > 0 ? (
                allRequestReceivedList.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: "#DEFFF1",
                      },
                    }}
                  >
                    <TableCell align="left">{row.resource_title}</TableCell>
                    <TableCell align="left">{row.organization_name}</TableCell>
                    <TableCell align="left">
                      <div>
                        <div
                          className={
                            global_styles.bold600 + " " + global_styles.size16
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
                              global_styles.bold600 + " " + global_styles.size16
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
                            ? `Till : ${row.accessibility_time ?? "NA"}`
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
                    </TableCell>
                    <TableCell align="left">
                      {
                        <>
                          {row?.approval_status !== "approved" &&
                            row?.approval_status !== "rejected" && (
                              <Popconfirm
                                title={
                                  <span
                                    style={{
                                      color: "#00A94F",
                                      textTransform: "none",
                                      fontFamily: "Montserrat",
                                    }}
                                  >
                                    Select a Time for Content Accessibility
                                  </span>
                                }
                                icon={<></>}
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
                                              marginTop: "15px",
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
                                    <Box
                                      sx={{
                                        marginTop: "10px",
                                      }}
                                    >
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            sx={{
                                              "&.Mui-checked": {
                                                color: "#4759FF !important",
                                              },
                                              "& .MuiSvgIcon-root": {
                                                fill: "#4759FF",
                                              },
                                            }}
                                            defaultChecked={true}
                                            checked={isEmbeddings}
                                            onChange={() =>
                                              setIsEmbeddings(!isEmbeddings)
                                            }
                                          />
                                        }
                                        label={
                                          <span
                                            style={{
                                              color: "#A3B0B8",
                                              fontFamily: `Montserrat`,
                                            }}
                                          >
                                            Embeddings
                                          </span>
                                        }
                                      />
                                    </Box>
                                    <Divider
                                      sx={{
                                        marginTop: "10px",
                                        background: "#E5E7EB",
                                      }}
                                    />
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "left",
                                        alignItems: "center",
                                        gap: "20px",
                                        marginTop: "20px",
                                      }}
                                    >
                                      <Button
                                        sx={{
                                          background: "#01A94F",
                                          color: "#FFF",
                                          textTransform: "none",
                                          height: "30px",
                                          fontFamily: "Montserrat",
                                          width: "100px",
                                          borderRadius: "100px",
                                          ":hover": {
                                            background: "#01A94F",
                                          },
                                        }}
                                        onClick={() =>
                                          handleOk("approved", row.id)
                                        }
                                        id="dataset-request-recevied-approve-btn"
                                        data-testid="dataset-request-recevied-approve-btn-test"
                                        disabled={!dateError || !toDate}
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        sx={{
                                          background: "#FBD5D5",
                                          color: "#E02324",
                                          textTransform: "none",
                                          height: "30px",
                                          width: "100px",
                                          fontFamily: "Montserrat",
                                          borderRadius: "100px",
                                          ":hover": {
                                            background: "#FBD5D5",
                                          },
                                        }}
                                        onClick={() => handleCancel()}
                                        id="dataset-request-recevied-cancel-btn"
                                        data-testid="dataset-request-recevied-cancel-btn-test"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </>
                                }
                                open={open && index == confirmIndex}
                                onOpenChange={() => console.log("open change")}
                                okButtonProps={{
                                  ghost: true,
                                  type: "text",
                                  disabled: true,
                                }}
                                okText={<></>}
                                showCancel={false}
                              >
                                <Button
                                  sx={{
                                    background: "#01A94F",
                                    color: "#FFF",
                                    textTransform: "none",
                                    height: "30px",
                                    fontFamily: "Montserrat",
                                    width: "100px",
                                    borderRadius: "100px",
                                    ":hover": {
                                      background: "#01A94F",
                                    },
                                  }}
                                  onClick={() => showPopconfirm(index)}
                                  id="dataset-request-recevied-approve-btn2"
                                  data-testid="dataset-request-recevied-approve-btn2-test"
                                >
                                  Approve
                                </Button>{" "}
                              </Popconfirm>
                            )}
                          {row?.approval_status !== "rejected" && (
                            <Button
                              sx={{
                                background: "#FBD5D5",
                                color: "#E02324",
                                textTransform: "none",
                                height: "30px",
                                width: "100px",
                                fontFamily: "Montserrat",
                                borderRadius: "100px",
                                ":hover": {
                                  background: "#FBD5D5",
                                },
                              }}
                              onClick={() =>
                                SubmitHandler(
                                  row?.approval_status == "approved"
                                    ? "recall"
                                    : "rejected",
                                  row?.id
                                )
                              }
                              id="dataset-request-recevied-recall-reject-btn"
                              data-testid="dataset-request-recevied-recall-reject-btn-test"
                            >
                              {row?.approval_status == "approved"
                                ? "Recall"
                                : "Reject"}
                            </Button>
                          )}
                          {row.approval_status === "rejected" && (
                            <div>No Action available</div>
                          )}
                        </>
                      }
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "18px",
                      fontWeight: "400",
                      lineHeight: 3,
                    }}
                    colSpan={12}
                  >
                    {getEmptyMessage()}
                  </TableCell>
                </TableRow>
              )}
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
          <Table sx={{ minWidth: 650 }} stickyHeader aria-label="simple table">
            <TableHead
              sx={{
                "& .MuiTableCell-head": {
                  backgroundColor: "#F6F6F6",
                },
              }}
            >
              <TableRow>
                {requestSentColumns.map((eachHead, index) => {
                  return (
                    <TableCell
                      sx={{
                        "& .MuiTableCell-root": {
                          fontFamily: "Montserrat",
                        },
                      }}
                      className={styles.file_table_column}
                      align="left"
                    >
                      {eachHead}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>

            <TableBody>
              {allRequestSentList?.length > 0 ? (
                allRequestSentList.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          backgroundColor: "#DEFFF1",
                        },
                      }}
                    >
                      <TableCell align="left">{row.resource_title}</TableCell>
                      <TableCell align="left">
                        {row.organization_name}
                      </TableCell>
                      <TableCell align="left">
                        {row.accessibility_time ?? "NA"}
                      </TableCell>
                      <TableCell align="left">
                        <Badge
                          style={{
                            backgroundColor:
                              row.approval_status == "rejected"
                                ? "#ff5630"
                                : row.approval_status == "approved"
                                ? "#00A94F"
                                : "#faad14",
                            width: "80px",
                          }}
                          count={row.approval_status}
                        ></Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "18px",
                      fontWeight: "400",
                      lineHeight: 3,
                    }}
                    colSpan={12}
                  >
                    {getEmptyMessage()}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CSSTransition>
      </TableContainer>
    </Box>
  );
};

export default ResourceRequestTable;

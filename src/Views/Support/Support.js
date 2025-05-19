import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import labels from "../../Constants/labels";
import Button from "@mui/material/Button";
import UrlConstants from "../../Constants/UrlConstants";
import { useHistory } from "react-router-dom";
import HTTPService from "../../Services/HTTPService";
import "./Support.css";
import FilterRow from "../../Components/Support/FilterRow";
import SupportCard from "../../Components/Support/SupportCard";
import UploadProfileimg from "../../Components/Settings/accounts/UploadProfileimg";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MenuItem from "@mui/material/MenuItem";
import $ from "jquery";
import { FileUploader } from "react-drag-drop-files";
import Success from "../../Components/Success/Success";
import FileSaver from "file-saver";
import Avatar from "@mui/material/Avatar";
import { GetErrorKey, handleUnwantedSpace } from "../../Utils/Common";
import Loader from "../../Components/Loader/Loader";
import { GetErrorHandlingRoute } from "../../Utils/Common";
import { Tooltip } from "@mui/material";
import { Zoom } from "@material-ui/core";
function Support(props) {
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const [supportList, setsupportList] = useState([]);
  const [isShowLoadMoreButton, setisShowLoadMoreButton] = useState(false);
  const [secondrow, setsecondrow] = useState(false);
  const [supportUrl, setsupportUrl] = useState("");
  const [status, setstatus] = useState("open");
  const [reply, setreply] = useState("");
  const [id, setid] = useState("");
  const [finalPayload, setfinalPayload] = useState("");
  const fileTypes = ["PDF", "DOC"];
  const [file, setFile] = useState(null);
  const [accfilesize, setaccfilesize] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  var payload = "";
  const [filterObject, setfilterObject] = useState({
    all: true,
    open: false,
    hold: false,
    closed: false,
    connectors: false,
    datasets: false,
    others: false,
    user_accounts: false,
    usage_policy: false,
    certificate: false,
  });
  const history = useHistory();
  const [fromdate, setfromdate] = React.useState(null);
  const [todate, settodate] = React.useState(null);
  const [rowdata, setrowdata] = React.useState("");
  const [isShowViewDetails, setisShowViewDetails] = useState(false);
  const [isShowSupport, setisShowSupport] = useState(true);
  const [isShowUpdated, setisShowUpdated] = useState(false);
  const [callGetSupport, setcallGetSupport] = useState(false);

  const [solutionErrorMessage, setSolutionErrorMessage] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      $(".supportcardfromdate input.MuiInputBase-input").attr(
        "disabled",
        "disabled"
      );
      $(".supportcardtodate input.MuiInputBase-input").attr(
        "disabled",
        "disabled"
      );
    }, 100);
    getSupportList("");
  }, []);
  const getSupportList = (payload) => {
    setIsLoader(true);
    setfinalPayload(payload);
    HTTPService(
      "POST",
      UrlConstants.base_url + UrlConstants.support,
      payload,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("otp valid", response.data);
        if (response.data.next == null) {
          setisShowLoadMoreButton(false);
        } else {
          setisShowLoadMoreButton(true);
          setsupportUrl(response.data.next);
        }
        setsupportList(response.data.results);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  const loadMoreSupportList = () => {
    setIsLoader(true);
    HTTPService("POST", supportUrl, finalPayload, false, true)
      .then((response) => {
        setIsLoader(false);
        console.log("otp valid", response.data);
        if (response.data.next == null) {
          setisShowLoadMoreButton(false);
        } else {
          setisShowLoadMoreButton(true);
          setsupportUrl(response.data.next);
        }
        let datalist = supportList;
        let finalDataList = [...datalist, ...response.data.results];
        console.log(datalist);
        setsupportList(finalDataList);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  const filterRow = (row, flag, payloadkey) => {
    if (flag != false) {
      let tempfilterObject = { ...filterObject };
      if (payloadkey != "all") {
        let data = {};
        data[payloadkey] = row;
        payload = data;
      } else {
        payload = "";
      }
      tempfilterObject[row] = flag;
      Object.keys(tempfilterObject).forEach(function (key) {
        if (key != row) {
          tempfilterObject[key] = false;
        }
      });
      setfilterObject(tempfilterObject);
      setsecondrow(false);
      settodate(null);
      setfromdate(null);
      getSupportList(payload);
    }
  };
  const filterByDates = () => {
    let tempfilterObject = { ...filterObject };
    Object.keys(tempfilterObject).forEach(function (key) {
      tempfilterObject[key] = false;
    });
    setfilterObject(tempfilterObject);
    let fromDateandToDate = [];
    fromDateandToDate.push(fromdate);
    fromDateandToDate.push(todate);
    let data = {};
    data["updated_at__range"] = fromDateandToDate;
    payload = data;
    setsecondrow(true);
    getSupportList(payload);
  };

  const viewCardDetails = (data) => {
    console.log("fff", data);
    setrowdata(data);
    setid(data.id);
    setisShowSupport(false);
    setisShowViewDetails(true);
    setisShowUpdated(false);
  };
  const showSuppport = () => {
    setisShowSupport(true);
    setisShowViewDetails(false);
    setisShowUpdated(false);
    setFile(null);
    setstatus("open");
    setreply("");
    if (callGetSupport) {
      setcallGetSupport(false);
      getSupportList(finalPayload);
    }
  };
  const dateTimeFormat = (datetime) => {
    const today = new Date(datetime);
    var y = today.getFullYear();
    var m = (today.getMonth() + 1).toString().padStart(2, "0");
    var d = today.getDate().toString().padStart(2, "0");
    var h = today.getHours();
    var mi = today.getMinutes();
    var s = today.getSeconds();
    let format = d + "/" + m + "/" + y + " | " + h + ":" + mi;
    return format;
  };
  const handleRsolutionFileChange = (file) => {
    setFile(file);
    // setprofile_pic(file);
    console.log(file);
    if (file != null && file.size > 2097152) {
      //   setBrandingnextbutton(false);
      setaccfilesize(true);
    } else {
      setaccfilesize(false);
    }
  };
  const submitResolution = () => {
    setSolutionErrorMessage(null);
    var bodyFormData = new FormData();
    bodyFormData.append("status", status);
    bodyFormData.append("solution_message", reply);
    if (file) {
      bodyFormData.append("solution_attachments", file);
    }
    setIsLoader(true);
    HTTPService(
      "PUT",
      UrlConstants.base_url + UrlConstants.resolution + id + "/",
      bodyFormData,
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("success");
        setcallGetSupport(true);
        setisShowSupport(false);
        setisShowViewDetails(false);
        setisShowUpdated(true);
      })
      .catch((e) => {
        setIsLoader(false);
        var returnValues = GetErrorKey(e, bodyFormData.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "solution_message":
                setSolutionErrorMessage(errorMessages[i]);
                break;
              default:
                history.push(GetErrorHandlingRoute(e));
                break;
            }
          }
        } else {
          history.push(GetErrorHandlingRoute(e));
        }
      });
  };
  const downloadAttachment = (uri, name) => {
    FileSaver.saveAs(UrlConstants.base_url_without_slash + uri);
  };
  return (
    <>
      {isLoader ? <Loader /> : ""}
      {isShowUpdated ? (
        <Success
          okevent={() => showSuppport()}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Ticket updated successfully !"}
          imageText={"Success!"}
          msg={"Your solutions are updated."}
        ></Success>
      ) : (
        <></>
      )}
      {isShowSupport ? (
        <Row className="supportfirstmaindiv">
          <Row className="supportmaindiv">
            <Row className="secondmainheading width100percent">
              {screenlabels.support.heading}
            </Row>
            <Row className="supportfilterRow">
              <Col className="supportfilterCOlumn">
                <Row className="supportfilterfirstrow">
                  <span className="fontweight600andfontsize14pxandcolor3A3A3A supportfiltertext">
                    {screenlabels.support.filter}
                  </span>
                </Row>
                {filterObject.all ? (
                  <Row
                    onClick={() => filterRow("all", false, "all")}
                    className="supportfiltersecondrow"
                  >
                    <span className="supportallicon">
                      <img
                        src={require("../../Assets/Img/filter.svg")}
                        alt="new"
                      />
                    </span>
                    <span className="fontweight600andfontsize14pxandcolorFFFFFF supportalltexticon">
                      {screenlabels.support.all}
                    </span>
                  </Row>
                ) : (
                  <Row
                    onClick={() => filterRow("all", true, "all")}
                    className="supportfiltersecondrowbold"
                  >
                    <span className="supportallicon">
                      <img
                        src={require("../../Assets/Img/filter_bold.svg")}
                        alt="new"
                      />
                    </span>
                    <span className="fontweight600andfontsize14pxandcolor3D4A52 supportalltexticon">
                      {screenlabels.support.all}
                    </span>
                  </Row>
                )}
                <Row
                  className={
                    secondrow
                      ? "supportfilterthirdrowhighlight"
                      : "supportfilterthirdrow"
                  }
                >
                  <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterthirdrowheadingtext">
                    {screenlabels.support.date}
                  </span>
                  <span className="supportcardfromdate">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        inputFormat="dd/MM/yyyy"
                        disableFuture
                        label="From date *"
                        value={fromdate}
                        onChange={(newValue) => {
                          settodate(null);
                          setfromdate(newValue);
                          setTimeout(() => {
                            $(
                              ".supportcardtodate input.MuiInputBase-input"
                            ).attr("disabled", "disabled");
                          }, 100);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </span>
                  <span className="supportcardtodate">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        inputFormat="dd/MM/yyyy"
                        disabled={fromdate ? false : true}
                        disableFuture
                        label="To date *"
                        minDate={fromdate}
                        value={todate}
                        onChange={(newValue) => {
                          settodate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </span>
                  {fromdate && todate ? (
                    <span className="supportsubmitbrn">
                      <Button
                        onClick={() => filterByDates()}
                        variant="contained"
                        className="enabledatesubmitbtn"
                      >
                        Submit
                      </Button>
                    </span>
                  ) : (
                    <span className="supportsubmitbrn">
                      <Button
                        variant="outlined"
                        className="disbaledatesubmitbtn"
                      >
                        Submit
                      </Button>
                    </span>
                  )}
                </Row>
                <Row className="supportfiltersecondrowbold">
                  <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">
                    {screenlabels.support.Status}
                  </span>
                </Row>
                {filterObject.open ? (
                  <FilterRow
                    supportFilter={() => filterRow("open", false, "status")}
                    imgname={"open_status_white"}
                    firstcss={"supportfiltercommorrow"}
                    secondcss={"supportfiltercommontexticon"}
                    thirdcss={"supportfiltercommontext"}
                    label={screenlabels.support.open_status}
                  ></FilterRow>
                ) : (
                  <FilterRow
                    supportFilter={() => filterRow("open", true, "status")}
                    imgname={"open_status"}
                    firstcss={"supportfiltercommorrowbold"}
                    secondcss={"supportfiltercommontexticonbold"}
                    thirdcss={"supportfiltercommontextbold"}
                    label={screenlabels.support.open_status}
                  ></FilterRow>
                )}
                {filterObject.closed ? (
                  <FilterRow
                    supportFilter={() => filterRow("closed", false, "status")}
                    imgname={"cross_white"}
                    firstcss={"supportfiltercommorrow"}
                    secondcss={"supportfiltercommontexticon"}
                    thirdcss={"supportfiltercommontext"}
                    label={screenlabels.support.close_status}
                  ></FilterRow>
                ) : (
                  <FilterRow
                    supportFilter={() => filterRow("closed", true, "status")}
                    imgname={"Cross"}
                    firstcss={"supportfiltercommorrowbold"}
                    secondcss={"supportfiltercommontexticonbold"}
                    thirdcss={"supportfiltercommontextbold"}
                    label={screenlabels.support.close_status}
                  ></FilterRow>
                )}
                {filterObject.hold ? (
                  <FilterRow
                    supportFilter={() => filterRow("hold", false, "status")}
                    imgname={"hold_status_white"}
                    firstcss={"supportfiltercommorrow"}
                    secondcss={"supportfiltercommontexticon"}
                    thirdcss={"supportfiltercommontext"}
                    label={screenlabels.support.hold_status}
                  ></FilterRow>
                ) : (
                  <FilterRow
                    supportFilter={() => filterRow("hold", true, "status")}
                    imgname={"hold_status"}
                    firstcss={"supportfiltercommorrowbold"}
                    secondcss={"supportfiltercommontexticonbold"}
                    thirdcss={"supportfiltercommontextbold"}
                    label={screenlabels.support.hold_status}
                  ></FilterRow>
                )}
                <Row className="supportfiltersecondrowbold">
                  <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">
                    {screenlabels.support.Category}
                  </span>
                </Row>
                {filterObject.user_accounts ? (
                  <FilterRow
                    supportFilter={() =>
                      filterRow("user_accounts", false, "category")
                    }
                    imgname={"account_white"}
                    firstcss={"supportfiltercommorrow"}
                    secondcss={"supportfiltercommontexticon"}
                    thirdcss={"supportfiltercommontext"}
                    label={screenlabels.support.User_Accounts}
                  ></FilterRow>
                ) : (
                  <FilterRow
                    supportFilter={() =>
                      filterRow("user_accounts", true, "category")
                    }
                    imgname={"account_filter"}
                    firstcss={"supportfiltercommorrowbold"}
                    secondcss={"supportfiltercommontexticonbold"}
                    thirdcss={"supportfiltercommontextbold"}
                    label={screenlabels.support.User_Accounts}
                  ></FilterRow>
                )}
                {filterObject.datasets ? (
                  <FilterRow
                    supportFilter={() =>
                      filterRow("datasets", false, "category")
                    }
                    imgname={"dataset_white"}
                    firstcss={"supportfiltercommorrow"}
                    secondcss={"supportfiltercommontexticon"}
                    thirdcss={"supportfiltercommontext"}
                    label={screenlabels.support.Datasets}
                  ></FilterRow>
                ) : (
                  <FilterRow
                    supportFilter={() =>
                      filterRow("datasets", true, "category")
                    }
                    imgname={"dataset"}
                    firstcss={"supportfiltercommorrowbold"}
                    secondcss={"supportfiltercommontexticonbold"}
                    thirdcss={"supportfiltercommontextbold"}
                    label={screenlabels.support.Datasets}
                  ></FilterRow>
                )}
                {filterObject.usage_policy ? (
                  <FilterRow
                    supportFilter={() =>
                      filterRow("usage_policy", false, "category")
                    }
                    imgname={"policy_white"}
                    firstcss={"supportfiltercommorrow"}
                    secondcss={"supportfiltercommontexticon"}
                    thirdcss={"supportfiltercommontext"}
                    label={screenlabels.support.Usage_Policy}
                  ></FilterRow>
                ) : (
                  <FilterRow
                    supportFilter={() =>
                      filterRow("usage_policy", true, "category")
                    }
                    imgname={"usage_policy"}
                    firstcss={"supportfiltercommorrowbold"}
                    secondcss={"supportfiltercommontexticonbold"}
                    thirdcss={"supportfiltercommontextbold"}
                    label={screenlabels.support.Usage_Policy}
                  ></FilterRow>
                )}
                {filterObject.certificate ? (
                  <FilterRow
                    supportFilter={() =>
                      filterRow("certificate", false, "category")
                    }
                    imgname={"open_status_white"}
                    firstcss={"supportfiltercommorrow"}
                    secondcss={"supportfiltercommontexticon"}
                    thirdcss={"supportfiltercommontext"}
                    label={screenlabels.support.Certificate}
                  ></FilterRow>
                ) : (
                  <FilterRow
                    supportFilter={() =>
                      filterRow("certificate", true, "category")
                    }
                    imgname={"open_status"}
                    firstcss={"supportfiltercommorrowbold"}
                    secondcss={"supportfiltercommontexticonbold"}
                    thirdcss={"supportfiltercommontextbold"}
                    label={screenlabels.support.Certificate}
                  ></FilterRow>
                )}
                {filterObject.connectors ? (
                  <FilterRow
                    supportFilter={() =>
                      filterRow("connectors", false, "category")
                    }
                    imgname={"connectors_white"}
                    firstcss={"supportfiltercommorrow"}
                    secondcss={"supportfiltercommontexticon"}
                    thirdcss={"supportfiltercommontext"}
                    label={screenlabels.support.Connectors}
                  ></FilterRow>
                ) : (
                  <FilterRow
                    supportFilter={() =>
                      filterRow("connectors", true, "category")
                    }
                    imgname={"connectors"}
                    firstcss={"supportfiltercommorrowbold"}
                    secondcss={"supportfiltercommontexticonbold"}
                    thirdcss={"supportfiltercommontextbold"}
                    label={screenlabels.support.Connectors}
                  ></FilterRow>
                )}
                {filterObject.others ? (
                  <FilterRow
                    supportFilter={() => filterRow("others", false, "category")}
                    imgname={"others_white"}
                    firstcss={"supportfiltercommorrow"}
                    secondcss={"supportfiltercommontexticon"}
                    thirdcss={"supportfiltercommontext"}
                    label={screenlabels.support.Others}
                  ></FilterRow>
                ) : (
                  <FilterRow
                    supportFilter={() => filterRow("others", true, "category")}
                    imgname={"others"}
                    firstcss={"supportfiltercommorrowbold"}
                    secondcss={"supportfiltercommontexticonbold"}
                    thirdcss={"supportfiltercommontextbold"}
                    label={screenlabels.support.Others}
                  ></FilterRow>
                )}
              </Col>
              <Col className="supportSecondCOlumn">
                {supportList.length > 0 ? (
                  <Row>
                    {supportList.map((rowData, index) => (
                      <>
                        {index <= 1 ? (
                          <SupportCard
                            viewCardDetails={() => viewCardDetails(rowData)}
                            margingtop={"supportcard supportcardmargintop0px"}
                            data={rowData}
                            index={index}
                          ></SupportCard>
                        ) : (
                          <SupportCard
                            viewCardDetails={() => viewCardDetails(rowData)}
                            margingtop={"supportcard supportcardmargintop20px"}
                            data={rowData}
                            index={index}
                          ></SupportCard>
                        )}
                      </>
                    ))}
                  </Row>
                ) : (
                  <Row className="nodataavailable">{"No Data Available"}</Row>
                )}
                <Row className="supportcardmargintop20px"></Row>
                <Row className="marginleft165px">
                  {isShowLoadMoreButton ? (
                    <Button
                      onClick={() => loadMoreSupportList()}
                      variant="outlined"
                      className="cancelbtn"
                    >
                      Load more
                    </Button>
                  ) : (
                    <></>
                  )}
                </Row>
                <Row className="supportcardmargintop20px"></Row>
              </Col>
            </Row>
          </Row>
        </Row>
      ) : (
        <></>
      )}
      {isShowViewDetails ? (
        <>
          <Row>
            <Col className="supportViewDetailsbackimage">
              <span onClick={() => showSuppport()}>
                <img src={require("../../Assets/Img/Vector.svg")} alt="new" />
              </span>
              <span
                className="supportViewDetailsback"
                onClick={() => showSuppport()}
              >
                {"Back"}
              </span>
            </Col>
          </Row>
          <Row className="supportViewDeatilsSecondRow"></Row>
          <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
            <span className="mainheading">{"Ticket details"}</span>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "30px",
              "text-align": "left",
            }}
          >
            <Col>
              <Tooltip title={rowdata.subject}>
                <span className="secondmainheading d-inline-block text-truncate width300px">
                  {rowdata.subject}
                </span>
              </Tooltip>
            </Col>
            <Col>
              <span className="secondmainheading">{"Name of participant"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">
                {"Name of participant user"}
              </span>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "5px",
              "text-align": "left",
            }}
          >
            <Col>
              <Tooltip
                TransitionComponent={Zoom}
                placement="bottom-start"
                title={rowdata.issue_message}
              >
                <div className="messagedescription thirdmainheading">
                  {rowdata.issue_message}
                </div>
              </Tooltip>
            </Col>
            <Col>
              <Row>
                <Col>
                  {rowdata.organization.logo ? (
                    <Avatar
                      alt={rowdata.user.first_name}
                      src={
                        UrlConstants.base_url_without_slash +
                        rowdata.organization.logo
                      }
                      sx={{ width: 56, height: 56 }}
                    />
                  ) : (
                    <Avatar
                      sx={{ bgcolor: "#c09507", width: 56, height: 56 }}
                      aria-label="recipe"
                    >
                      {rowdata.organization.name.charAt(0)}
                    </Avatar>
                  )}
                </Col>
                <Col style={{ "margin-left": "-63%", "margin-top": "3%" }}>
                  <Tooltip
                    TransitionComponent={Zoom}
                    placement="bottom-start"
                    title={rowdata.organization.name}
                  >
                    <span className="thirdmainheading d-inline-block text-truncate width300px">
                      {rowdata.organization.name}
                    </span>
                  </Tooltip>
                </Col>
              </Row>
            </Col>

            <Col>
              <Tooltip
                TransitionComponent={Zoom}
                placement="bottom-start"
                title={rowdata.user.first_name}
              >
                <span className="thirdmainheading d-inline-block text-truncate width300px">
                  {rowdata.user.first_name}
                </span>
              </Tooltip>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "40px",
              "text-align": "left",
            }}
          >
            <Col>
              <span className="secondmainheading">{"Date & Time"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{"Category"}</span>
            </Col>
            <Col>
              <span className="secondmainheading">{"Attachment"}</span>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "5px",
              "text-align": "left",
            }}
          >
            <Col>
              <span className="thirdmainheading">
                {dateTimeFormat(rowdata.updated_at)}
              </span>
            </Col>
            <Col>
              <span className="thirdmainheading">{rowdata.category}</span>
            </Col>
            {rowdata.issue_attachments ? (
              <Col
                onClick={() => downloadAttachment(rowdata.issue_attachments)}
                style={{ cursor: "pointer" }}
              >
                <>
                  <span>
                    <img
                      src={require("../../Assets/Img/download.svg")}
                      alt="new"
                    />
                  </span>
                  <span className="supportViewDetailsback">
                    {"Download Attachment"}
                  </span>
                </>
              </Col>
            ) : (
              <Col>
                <span className="thirdmainheading">{"NA"}</span>
              </Col>
            )}
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "40px",
              "text-align": "left",
            }}
          >
            <Col>
              <span className="secondmainheading">{"Status"}</span>
            </Col>
          </Row>
          <Row
            style={{
              "margin-left": "79px",
              "margin-top": "5px",
              "text-align": "left",
            }}
          >
            {rowdata.status == "open" ? (
              <Col
                style={{ color: "#FF3D00", "text-transform": "capitalize" }}
                className="thirdmainheading"
              >
                {rowdata.status}
              </Col>
            ) : (
              <></>
            )}
            {rowdata.status == "hold" ? (
              <Col
                style={{ color: "#D8AF28", "text-transform": "capitalize" }}
                className="thirdmainheading"
              >
                {rowdata.status}
              </Col>
            ) : (
              <></>
            )}
            {rowdata.status == "closed" ? (
              <Col
                style={{ color: "#096D0D", "text-transform": "capitalize" }}
                className="thirdmainheading"
              >
                {rowdata.status}
              </Col>
            ) : (
              <></>
            )}
          </Row>
          <Row className="supportViewDeatilsSecondRow"></Row>
          <Row
            style={{
              "margin-left": "290px",
              "margin-top": "30px",
              "text-align": "left",
            }}
          >
            <Col>
              <span className="mainheading">{"Resolution"}</span>
            </Col>
          </Row>
          <Row
            className="resolution"
            style={{ "margin-left": "28px", "margin-top": "30px" }}
          >
            <Col>
              <TextField
                id="filled-multiline-static"
                label="Reply"
                multiline
                rows={4}
                variant="filled"
                //defaultValue={reply}
                maxLength={500}
                onKeyDown={(e) => handleUnwantedSpace(reply, e)}
                onChange={(e) => setreply(e.target.value)}
                style={{ width: "420px", "min-height": "50px" }}
                error={solutionErrorMessage ? true : false}
                helperText={setSolutionErrorMessage}
              />
              <TextField
                style={{
                  width: "420px",
                  "margin-left": "20px",
                  textAlign: "left",
                }}
                select
                label="Status"
                variant="filled"
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={status}
                onChange={(e) => setstatus(e.target.value)}
              >
                <MenuItem value={"open"}>Open</MenuItem>
                <MenuItem value={"closed"}>Closed</MenuItem>
                <MenuItem value={"hold"}>Hold</MenuItem>
              </TextField>
            </Col>
          </Row>
          <Row style={{ "margin-left": "33px" }}>
            <Col xs={12} sm={12} md={6} lg={6}>
              <FileUploader
                handleChange={handleRsolutionFileChange}
                name="file"
                types={fileTypes}
                children={
                  <UploadProfileimg
                    uploaddes="Supports:  .doc or .pdf not more than 2MB file size"
                    uploadtitle="Upload reference attachments (optional)"
                  />
                }
                //   maxSize={2}
              />
            </Col>
          </Row>
          <Row style={{ "margin-left": "28px" }}>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <div>
                <p className="uploadimgname">
                  {file ? (file.size ? `File name: ${file.name}` : "") : ""}
                </p>
                <p className="oversizemb-uploadimglogo">
                  {file != null && file.size > 2097152
                    ? "File uploaded is more than 2MB!"
                    : ""}
                </p>
              </div>
            </Col>
          </Row>
          <Row className="supportViewDeatilsSecondRow"></Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              {!accfilesize && reply ? (
                <Button
                  onClick={() => submitResolution()}
                  variant="contained"
                  style={{ textTransform: "none" }}
                  className="submitbtn"
                >
                  {screenlabels.common.submit}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  style={{ textTransform: "none" }}
                  disabled
                  className="disbalesubmitbtn"
                >
                  {screenlabels.common.submit}
                </Button>
              )}
            </Col>
          </Row>
          <Row className="marginrowtop8px">
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() => showSuppport()}
                style={{ textTransform: "none" }}
                variant="outlined"
                className="cancelbtn"
              >
                {screenlabels.common.cancel}
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
export default Support;

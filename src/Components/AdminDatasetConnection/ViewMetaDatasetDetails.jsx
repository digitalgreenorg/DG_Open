import React from "react";
import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import "./LocalMachineUploadDataset.css";
import Loader from "../Loader/Loader";
import HTTPService from "../../Services/HTTPService";
import { useParams, useHistory } from "react-router-dom";
import { GetErrorHandlingRoute, downloadAttachment } from "../../Utils/Common";
import UrlConstant from "../../Constants/UrlConstants";
import { Stack } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Alert from "@mui/material/Alert";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Avatar } from "@mui/material";
import FileDownloadSharpIcon from "@mui/icons-material/FileDownloadSharp";
import parse from "html-react-parser";
import AddDataset from "./AddDataset";

import Delete from "../../Components/Delete/Delete";
import Success from "../../Components/Success/Success";
import { useLocation } from "react-router-dom";

export default function ViewMetaDatasetDetails(props) {
  const { userType, isMemberTab } = props;
  const [datasetdescription, setDatasetDescription] = useState("");
  const [category, setCategory] = useState({});
  const [geography, setGeography] = useState(null);
  const [constantlyupdate, setconstantlyupdate] = useState(null);
  const [fromdate, setFromdate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isFileDataLoaded, setFileDataLoaded] = useState(false);
  const [isLoading, setLoader] = useState(false);
  const { id } = useParams();
  const history = useHistory();
  const [fileData, setfileData] = useState([]);
  const [orgdetail, setOrgDetail] = useState("");
  const [userdetails, setUserDetails] = useState("");
  const [orgdes, setorgdes] = useState("");
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteSuccess, setisDeleteSuccess] = useState(false);
  const [success, setisSuccess] = useState(false);
  const [datasetName, setDatasetName] = useState("");
  const location = useLocation();

  console.log(location.state, "location");
  useEffect(() => {
    getMetaData();
  }, []);

  useEffect(() => {
    setFileDataLoaded(true);
  }, []);
  console.log(isMemberTab, "isMemberTab");

  const getMetaData = () => {
    let url = "";
    if (userType == "guest") {
      url = UrlConstant.base_url + UrlConstant.datasetview_guest + id + "/";
    } else {
      url = UrlConstant.base_url + UrlConstant.datasetview + id + "/";
    }
    setLoader(true);
    HTTPService("GET", url, "", false, userType == "guest" ? false : true)
      .then((response) => {
        setLoader(false);
        console.log(response.data);

        setCategory({ ...response.data.category });
        setGeography(response.data.geography);
        setconstantlyupdate(response.data.constantly_update);
        setFromdate(response.data.data_capture_start?.split("T")[0]);
        setToDate(response.data.data_capture_end?.split("T")[0]);
        setDatasetDescription(response.data.description);
        setfileData(response.data.datasets);
        setOrgDetail(response.data.organization);
        setorgdes(response.data.organization.org_description);
        setUserDetails(response.data.user);
        setDatasetName(response?.data?.name);
      })
      .catch((e) => {
        setLoader(false);
        console.log("error while loading dataset", e);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  const deleteDataset = () => {
    setLoader(true);
    setIsDelete(false);
    setisSuccess(false);
    setisDeleteSuccess(true);
    HTTPService(
      "DELETE",
      UrlConstant.base_url + UrlConstant.datasetview + id + "/",
      "",
      false,
      true
    )
      .then((response) => {
        setLoader(false);
        console.log("otp valid", response.data);
        setisDeleteSuccess(true);
        setisSuccess(false);
        setIsDelete(false);
      })
      .catch((e) => {
        setLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  return (
    <>
      {isLoading ? <Loader /> : ""}
      {isDeleteSuccess ? (
        <Success
          okevent={() => history.push("/datahub/datasets")}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Dataset deleted successfully !"}
          imageText={"Deleted!"}
          msg={"You deleted a dataset."}
        ></Success>
      ) : (
        <>
          {isDelete ? (
            <Delete
              route={"login"}
              imagename={"delete"}
              firstbtntext={"Delete"}
              secondbtntext={"Cancel"}
              deleteEvent={() => deleteDataset()}
              cancelEvent={() => {
                setIsDelete(false);
                setisSuccess(true);
                setisDeleteSuccess(false);
              }}
              heading={"Delete dataset"}
              imageText={"Are you sure you want to delete your dataset?"}
              firstmsg={"This action will delete the dataset from the system."}
              secondmsg={
                "The dataset will no longer be able to use in your datahub account."
              }
            ></Delete>
          ) : (
            <>
              {!isEditModeOn ? (
                <>
                  <Row>
                    <Col className="supportViewDetailsbackimage">
                      <span
                        onClick={() =>
                          history.push(
                            userType != "guest" ? "/datahub/datasets" : "/home"
                          )
                        }
                      >
                        <img
                          src={require("../../Assets/Img/Vector.svg")}
                          alt="new"
                        />
                      </span>
                      <span
                        className="supportViewDetailsback"
                        onClick={() =>
                          history.push(
                            userType != "guest" ? "/datahub/datasets" : "/home"
                          )
                        }
                      >
                        {"Back"}
                      </span>
                    </Col>
                  </Row>
                  <Row className="main_heading_row">
                    <Col
                      lg={3}
                      sm={6}
                      style={{
                        marginLeft: "99px",
                        marginTop: "50px",
                      }}
                    >
                      <span className="Main_heading_add_dataset">
                        Dataset Details
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      className="mainheading"
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{
                        textAlign: "left",
                        paddingLeft: "98px",
                        "margin-top": "50px",
                      }}
                    >
                      <span>{datasetName}</span>
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "96px", "margin-right": "73px" }}>
                    <Col style={{ "margin-top": "40px" }}>
                      <Row className="secondmainheading">Category</Row>
                      {Object.keys(category).map((key) => (
                        <Row
                          className="thirdmainheadingview"
                          style={{
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            border: "1px solid red",
                            alignItems: "center",
                            "margin-top": "10px",
                            "border-radius": "10px",
                            border: "2px solid #83A9C9",
                            background: "#83A9C9",
                            width: "150px",
                            height: "40px",
                          }}
                        >
                          {key}
                        </Row>
                      ))}
                    </Col>

                    <Col style={{ "margin-top": "40px" }}>
                      <Row className="secondmainheading">Sub Category</Row>
                      {Object.keys(category).map((key) =>
                        category[key]?.map((value) => (
                          <Row
                            className="thirdmainheadingview"
                            style={{
                              "margin-top": "10px",
                              display: "flex",
                              justifyContent: "center",
                              "border-radius": "10px",
                              border: "2px solid #8AA7AD",
                              background: "#8AA7AD",
                              width: "150px",
                              height: "40px",
                              "text-align": "center",
                              alignItems: "center",
                            }}
                          >
                            {value.length > 0 ? value : "N/A"}
                          </Row>
                        ))
                      )}
                    </Col>
                    <Col style={{ "margin-top": "40px" }}>
                      <Row className="secondmainheading">Geography</Row>
                      <Row
                        className="thirdmainheadingview"
                        style={{
                          "margin-top": "10px",
                          display: "flex",
                          justifyContent: "center",
                          "border-radius": "10px",
                          border: "2px solid #9ABA8F",
                          background: "#9ABA8F",
                          width: "150px",
                          height: "40px",
                          "text-align": "center",
                          alignItems: "center",
                        }}
                      >
                        {geography}
                      </Row>
                    </Col>
                    <Col style={{ "margin-top": "40px" }}>
                      <Row className="secondmainheading">Freshness of Data</Row>
                      <Row
                        className="thirdmainheadingview"
                        style={{
                          "margin-top": "10px",
                          display: "flex",
                          justifyContent: "center",
                          "border-radius": "10px",
                          border: "2px solid #DFC780",
                          background: "#DFC780",
                          width: "150px",
                          height: "40px",
                          "text-align": "center",
                          alignItems: "center",
                        }}
                      >
                        {constantlyupdate ? "Yes" : "No"}
                      </Row>
                    </Col>
                    <Col style={{ "margin-top": "40px" }}>
                      <Row className="secondmainheading">
                        Data Capture Interval
                      </Row>
                      <Row
                        className="thirdmainheadingview"
                        style={{
                          "margin-top": "10px",
                          display: "flex",
                          justifyContent: "center",
                          "border-radius": "10px",
                          border: "2px solid #D9B082",
                          background: "#D9B082",
                          width: "150px",
                          height: "40px",
                          "text-align": "center",
                          alignItems: "center",
                        }}
                      >
                        <span>{fromdate ? fromdate : "NA"}</span>
                        <span>{toDate}</span>
                      </Row>
                    </Col>
                  </Row>
                  <Row style={{ "margin-left": "32px" }}>
                    <Col>
                      <Row
                        className="mainheading"
                        style={{
                          textAlign: "left",
                          marginLeft: "50px",
                          marginTop: "50px",
                          "margin-right": "73px",
                        }}
                      >
                        Description
                      </Row>
                      <Row
                        className="thirdmainheading"
                        style={{
                          textAlign: "left",
                          marginLeft: "50px",
                          marginTop: "30px",
                          "margin-right": "73px",
                        }}
                      >
                        {datasetdescription
                          ? parse(datasetdescription)
                          : datasetdescription}
                      </Row>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      "margin-left": "93px",
                      "margin-top": "30px",
                      "margin-right": "73px",
                    }}
                  >
                    <span className="mainheading">{"Download Data"}</span>
                  </Row>
                  <Row
                    style={{
                      "margin-left": "93px",
                      "margin-top": "30px",
                      "margin-right": "73px",
                    }}
                  >
                    <Stack
                      sx={{ width: "100%", textAlign: "left" }}
                      spacing={2}
                    >
                      <Alert severity="warning">
                        <strong>
                          This dataset is solely meant to be used as a source of
                          information. Even though accuracy is a goal, the
                          steward is not accountable for the information. Please
                          let the admin know if you have any information you
                          think is inaccurate.
                        </strong>
                      </Alert>
                    </Stack>
                  </Row>
                  <Row
                    style={{
                      border: "1px solid #DFDFDF",
                      "margin-left": "93px",
                      "margin-top": "10px",
                      "margin-right": "70px",
                      // overflow: "scroll",
                      maxHeight: "700px",
                      overflow: "hidden",
                    }}
                  >
                    {/* { 
        //    fileTypes = ["XLS" && "xlsx" && "CSV" ] ?  */}

                    <Col className="viewdetails_table">
                      {isFileDataLoaded &&
                        fileData.map((itm1) => {
                          return (
                            itm1?.content?.length > 0 && (
                              <Row style={{ padding: "10px" }}>
                                {itm1?.file ? (
                                  <label>
                                    {" "}
                                    File name : {itm1?.file?.split("/").pop()}
                                  </label>
                                ) : (
                                  ""
                                )}
                                {itm1?.source ? (
                                  <label
                                    style={{
                                      "padding-left": "10px",
                                      "text-transform": "capitalize",
                                    }}
                                  >
                                    - {itm1?.source}
                                  </label>
                                ) : (
                                  ""
                                )}
                                <span
                                  style={{
                                    maxHeight: "300px",
                                    marginTop: "15px",
                                    padding: "0px 20px",
                                    overflow: "auto",
                                  }}
                                >
                                  <Table
                                    style={{
                                      width: "1300px",
                                      border: "1px solid",
                                    }}
                                  >
                                    <TableHead>
                                      {/* {isFileDataLoaded && fileData.map(itm1 => { */}
                                      {/* console.log('item before tablerow', itm1) */}

                                      {itm1?.content?.map((itm2, i) => {
                                        if (i === 0) {
                                          return (
                                            <TableRow>
                                              {Object.keys(itm2).map(
                                                (itm3, i) => {
                                                  return (
                                                    <TableCell>
                                                      {" "}
                                                      {itm3}{" "}
                                                    </TableCell>
                                                  );
                                                }
                                              )}
                                            </TableRow>
                                          );
                                        }
                                      })}
                                    </TableHead>
                                    <TableBody>
                                      {/* {isFileDataLoaded && fileData.map(itm1 => { */}
                                      {/* return itm1.content.map(itm2 => { */}
                                      {itm1?.content?.map((itm2) => {
                                        return (
                                          <TableRow>
                                            {Object.values(itm2).map(
                                              (itm3, i) => {
                                                console.log(
                                                  itm3,
                                                  "Values in view"
                                                );
                                                return (
                                                  <TableCell>
                                                    {" "}
                                                    {`${itm3}`}{" "}
                                                  </TableCell>
                                                );
                                              }
                                            )}
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </span>
                              </Row>
                            )
                          );
                        })}
                    </Col>
                  </Row>
                  <Row>
                    <span className="downloadfiles">
                      {userType != "guest" ? (
                        <>
                          {fileData.map((downloadfile) => {
                            console.log("downloadfile", downloadfile);
                            let filePathToDownload =
                              downloadfile?.standardised_file
                                ? downloadfile?.standardised_file
                                : "";
                            return (
                              <Row
                                //   className="supportViewDetailsback"
                                className="fontweight600andfontsize14pxandcolor3D4A52 supportcardsecondcolumn"
                                style={{
                                  "margin-top": "10px",
                                  marginLeft: "130px",
                                  cursor: `${
                                    userType != "guest" ? "pointer" : ""
                                  }`,
                                }}
                                onClick={() =>
                                  downloadAttachment(
                                    `${UrlConstant.base_url}${filePathToDownload}`,
                                    ""
                                  )
                                }
                              >
                                <FileDownloadSharpIcon
                                  style={{ marginRight: "20px" }}
                                />
                                <Row>
                                  {downloadfile?.standardised_file
                                    ?.split("/")
                                    .pop()}
                                  {/* <hr className="separatorline" /> */}
                                  {/* m */}
                                </Row>
                              </Row>
                            );
                          })}
                        </>
                      ) : (
                        " "
                      )}
                      {/* <hr className="separatorline" /> */}
                    </span>
                  </Row>
                  <Row style={{ padding: "50px 100px" }}>
                    <Col style={{ maxWidth: "400px" }}>
                      <Row style={{ textAlign: "left", marginBottom: "20px" }}>
                        <Col>ORGANISATION</Col>
                      </Row>
                      <Row>
                        <Col style={{ maxWidth: "50px" }}>
                          <Row>
                            <Avatar
                              alt="Remy Sharp"
                              // className='css-v8h2xp-MuiAvatar-root'

                              src={orgdetail.logo}
                              sx={{ width: 44, height: 44 }}
                            />
                          </Row>
                        </Col>
                        <Col>
                          <Row className="details">{orgdetail.name}</Row>
                          <Row className="details">{orgdetail.org_email}</Row>
                          {/* <Row className='details' >{orgdes ? parse(orgdes) : orgdes}</Row> */}
                          <Row className="details">
                            {orgdetail?.phone_number}
                          </Row>
                          <Row className="details">
                            {orgdetail?.address?.city}
                          </Row>
                          <Row className="details">
                            {orgdetail?.address?.country}
                          </Row>
                          <Row className="details">
                            {orgdetail?.address?.address}
                          </Row>
                          <Row className="details">
                            {orgdetail?.address?.pincode}
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      style={{
                        border: "0.5px solid",
                        maxWidth: "0px",
                        padding: "0px",
                        margin: "0px 50px",
                      }}
                    ></Col>
                    <Col style={{ maxWidth: "400px" }}>
                      <Row style={{ textAlign: "left", marginBottom: "20px" }}>
                        ROOT USER DETAILS
                      </Row>
                      <Col>
                        <Row className="details">{userdetails.first_name}</Row>
                        <Row className="details">{userdetails.last_name}</Row>
                        <Row className="details">{userdetails.email}</Row>
                      </Col>
                    </Col>
                  </Row>
                  <Row className="marginrowtop8px"></Row>
                  {userType != "guest" && (
                    <Row>
                      <Col xs={12} sm={12} md={6} lg={3}></Col>
                      <Col xs={12} sm={12} md={6} lg={6}>
                        {!location?.state?.flag ? (
                          " "
                        ) : (
                          <Button
                            onClick={() => setIsEditModeOn(true)}
                            variant="outlined"
                            className="submitbtn"
                          >
                            Edit
                          </Button>
                        )}
                      </Col>
                    </Row>
                  )}
                  {userType != "guest" && (
                    <Row className="margin">
                      <Col xs={12} sm={12} md={6} lg={3}></Col>
                      <Col xs={12} sm={12} md={6} lg={6}>
                        {!location?.state?.flag ? (
                          " "
                        ) : (
                          <Button
                            onClick={() => {
                              setIsDelete(true);
                              setisSuccess(false);
                              setisDeleteSuccess(false);
                            }}
                            style={{ "margin-top": "0px" }}
                            variant="outlined"
                            className="editbtn"
                          >
                            Delete
                          </Button>
                        )}
                      </Col>
                    </Row>
                  )}
                  <Row className="marginrowtop8px"></Row>
                </>
              ) : (
                <AddDataset isDatasetEditModeOn={isEditModeOn} datasetId={id} />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

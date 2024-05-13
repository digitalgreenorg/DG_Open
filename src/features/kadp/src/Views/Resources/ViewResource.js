import {
  Box,
  Button,
  useMediaQuery,
  useTheme,
  Typography,
  Divider,
  Card,
} from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { FarmStackContext } from "common/components/context/KadpContext/FarmStackProvider";
import { useHistory, useParams } from "react-router-dom";
import {
  GetErrorHandlingRoute,
  dateTimeFormat,
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "common/utils/utils";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import CustomDeletePopper from "../../Components/DeletePopper/CustomDeletePopper";
// import GlobalStyle from "../../Assets/CSS/global.module.css";
import { Col, Row } from "react-bootstrap";
import File from "../../Components/Datasets_New/TabComponents/File";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "common/services/HTTPService";
import ControlledAccordion from "../../Components/Accordion/Accordion";

const ViewResource = (props) => {
  const { userType, breadcrumbFromRoute } = props;
  const { callLoader, callToast, adminData, isLoading } =
    useContext(FarmStackContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const history = useHistory();
  const { id } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);
  const [resourceName, setResourceName] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [publishedOn, setPublishedOn] = useState("");
  const [categories, setCategories] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [open, setOpen] = useState(false);

  // Organisation & User Details
  const [orgDetails, setOrgDetails] = useState();
  const [orgAddress, setOrgAddress] = useState();
  const [userDetails, setUserDetails] = useState();

  const containerStyle = {
    marginLeft: mobile || tablet ? "30px" : "144px",
    marginRight: mobile || tablet ? "30px" : "144px",
  };

  const handleDeletePopper = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const closePopper = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    let accessToken = getTokenLocal() ?? false;
    let url = UrlConstant.base_url + UrlConstant.resource_endpoint + id + "/";
    let isAuthorization = userType == "guest" ? false : true;
    callLoader(true);
    HTTPService(
      "DELETE",
      url,
      "",
      false,
      isAuthorization,
      isAuthorization ? accessToken : false
    )
      .then((res) => {
        callLoader(false);
        callToast("Resource deleted successfully!", "success", true);
        if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
          history.push(`/datahub/resources`);
        } else if (isLoggedInUserParticipant()) {
          history.push(`/participant/resources`);
        }
      })
      .catch(async (e) => {
        callLoader(false);

        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong while deleting Resource!",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };

  const handleEdit = () => {
    if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      history.push(`/datahub/resources/edit/${id}`);
    } else if (isLoggedInUserParticipant()) {
      history.push(`/participant/resources/edit/${id}`);
    }
  };

  const handleClickRoutes = () => {
    if (breadcrumbFromRoute == "Home") {
      history.push("/home");
    } else {
      if (isLoggedInUserParticipant() && getTokenLocal()) {
        return "/participant/resources";
      } else if (
        isLoggedInUserAdmin() ||
        (isLoggedInUserCoSteward() && getTokenLocal())
      ) {
        return "/datahub/resources";
      }
    }
  };
  const handleDownload = (file) => {
    const url = file;
    const fileName = url.substring(url.lastIndexOf("/") + 1);
    console.log(fileName, url, "file");
    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    console.log("link,", link);
    // Simulate a click event on the link to trigger download
    link.click();

    // Clean up
    document.body.removeChild(link);
  };

  const getResource = async () => {
    callLoader(true);

    let url =
      UrlConstant.base_url +
      (userType !== "guest"
        ? UrlConstant.resource_endpoint
        : UrlConstant.microsite_resource_endpoint) +
      id +
      "/";

    await HTTPService(
      "GET",
      url,
      "",
      false,
      userType === "guest" ? false : true
    )
      .then((response) => {
        callLoader(false);
        setResourceName(response.data?.title);
        setResourceDescription(response.data?.description);
        setPublishedOn(response.data?.created_at);
        setUploadedFiles(response?.data?.resources);
        let prepareArr = [];
        for (const [key, value] of Object.entries(response?.data?.category)) {
          let obj = {};
          obj[key] = value;
          prepareArr.push(obj);
        }
        let tempCategories = [];
        prepareArr.forEach((item, index) => {
          let keys = Object.keys(item);
          let prepareCheckbox = item?.[keys[0]]?.map((res, ind) => {
            return res;
          });
          let obj = {
            panel: index + 1,
            title: keys[0],
            details: prepareCheckbox ? prepareCheckbox : [],
          };
          tempCategories.push(obj);
        });
        setCategories(tempCategories);
      })
      .catch(async (e) => {
        callLoader(false);
        console.log(e);
        let error = await GetErrorHandlingRoute(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong while loading resource",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };

  useEffect(() => {
    if (adminData) {
      setUserDetails(adminData.user);
      setOrgDetails(adminData.organization);
      let tempOrgAddress =
        adminData.organization?.address?.address +
        ", " +
        adminData.organization?.address?.country +
        ", " +
        adminData.organization?.address?.pincode;
      setOrgAddress(tempOrgAddress);
    }
    if (id) {
      getResource();
    }
  }, [adminData]);
  return (
    !isLoading && (
      <Box sx={containerStyle}>
        <div className="text-left mt-50">
          <span
            className="add_light_text cursor-pointer breadcrumbItem"
            onClick={() => history.push(handleClickRoutes())}
            id="add-dataset-breadcrum"
            data-testid="goPrevRoute"
          >
            {breadcrumbFromRoute ?? "Resources"}
          </span>
          <span className="add_light_text ml-11">
            <ArrowForwardIosIcon sx={{ fontSize: "14px", fill: "#00A94F" }} />
          </span>
          <span className="add_light_text ml-11 fw600">View Resource</span>
        </div>
        <Box
          className={
            mobile ? "" : "d-flex justify-content-between align-items-baseline"
          }
        >
          <div className="bold_title mt-50">{"Resource Details"}</div>
          {getTokenLocal() &&
          history.location?.state?.tab === 0 &&
          !history.location?.state?.userType ? (
            <Box className={mobile ? "d-flex" : ""}>
              <CustomDeletePopper
                DeleteItem={resourceName}
                anchorEl={anchorEl}
                handleDelete={handleDelete}
                id={id}
                open={open}
                closePopper={closePopper}
              />
              <Button
                sx={{
                  color: "#FF5630",
                  fontFamily: "Public Sans",
                  fontWeight: "700",
                  fontSize: mobile ? "11px" : "15px",
                  border: "1px solid rgba(255, 86, 48, 0.48)",
                  width: "189px",
                  height: "48px",
                  marginRight: "28px",
                  textTransform: "none",
                  "&:hover": {
                    background: "none",
                    border: "1px solid rgba(255, 86, 48, 0.48)",
                  },
                }}
                variant="outlined"
                onClick={handleDeletePopper}
              >
                Delete resource
                <DeleteOutlineIcon
                  sx={{
                    fill: "#FF5630",
                    fontSize: "22px",
                    marginLeft: "4px",
                  }}
                />
              </Button>
              <Button
                sx={{
                  color: "#00A94F",
                  fontFamily: "Public Sans",
                  fontWeight: "700",
                  fontSize: mobile ? "11px" : "15px",
                  border: "1px solid rgba(0, 171, 85, 0.48)",
                  width: "189px",
                  marginRight: "28px",
                  height: "48px",
                  textTransform: "none !important",
                  "&:hover": {
                    background: "none",
                    border: "1px solid rgba(0, 171, 85, 0.48)",
                  },
                }}
                onClick={handleEdit}
                variant="outlined"
              >
                Edit resource
                <EditIcon
                  sx={{
                    fill: "#00A94F",
                    fontSize: "22px",
                    marginLeft: "4px",
                    marginBottom: "2px",
                  }}
                />
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Box>
        <Box className={mobile ? "mt-38" : "d-flex mt-38"}>
          <Box sx={{ width: mobile ? "auto" : "638px" }}>
            <Typography className="view_agriculture_heading text-left ellipsis">
              {resourceName ? resourceName : "NA"}
            </Typography>
            <Typography className="view_datasets_light_text text-left mt-20">
              Description
            </Typography>
            <Typography className="view_datasets_bold_text wordWrap text-left mt-3">
              {resourceDescription ? resourceDescription : "NA"}
            </Typography>
          </Box>
          <Box className={mobile ? "" : "ml-134"}>
            <Typography
              className={`view_datasets_light_text text-left ${
                mobile ? "mt-25" : ""
              }`}
            >
              Published on
            </Typography>
            <Typography className="view_datasets_bold_text text-left mt-3">
              {publishedOn ? dateTimeFormat(publishedOn, false) : "NA"}
            </Typography>
            <Typography className="view_datasets_light_text text-left mt-25">
              No.of files
            </Typography>
            <Typography className="view_datasets_bold_text text-left mt-3">
              {uploadedFiles ? uploadedFiles.length : "1"}
            </Typography>
          </Box>
        </Box>
        <Divider className="mt-50" />
        <Box className="bold_title mt-50">
          {categories && categories.length ? "Resource category" : ""}
        </Box>
        <Box className="mt-20">
          <ControlledAccordion
            data={categories}
            customBorder={true}
            customPadding={true}
            isCustomStyle={true}
            titleStyle={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "900px",
            }}
            isCustomDetailStyle={true}
            customDetailsStyle={{ display: "inline-block", width: "30%" }}
            addHeaderBackground={true}
            headerBackground={"#eafbf3"}
          />
        </Box>
        <Box className="mt-50">
          <Typography
            sx={{
              fontFamily: "Arial !important",
              fontWeight: "600",
              fontSize: "32px",
              lineHeight: "40px",
              color: "#000000",
              textAlign: "left",
            }}
          >
            Resource files
          </Typography>
          <Typography
            sx={{
              textAlign: "left",
              fontWeight: "400",
              fontSize: "16px",
              lineHeight: "22px",
              color: "#212B36",
              marginTop: "10px",
            }}
          >
            <strong>Note:</strong> This resource is solely meant to be used as a
            source of information. Even through accuracy is the goal, the person
            is not accountable for the information. Please let the admin know if
            you have any information you think is inaccurate.
          </Typography>
          {uploadedFiles?.map((item) => {
            const fileNameWithoutExtension = item?.file.substring(
              item?.file.lastIndexOf("/") + 1
            );
            return (
              <>
                <Box
                  className={
                    mobile || tablet
                      ? "w-100 mt-39"
                      : "d-flex justify-content-between w-100 mt-39"
                  }
                >
                  <File
                    index={1}
                    name={fileNameWithoutExtension}
                    size={item?.file_size}
                    showDeleteIcon={false}
                    type={"file_upload"}
                    isTables={true}
                  />
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
                    onClick={() => handleDownload(item?.file)}
                  >
                    Download file
                  </Button>
                </Box>
                <Divider className="mt-20" />
              </>
            );
          })}
        </Box>
        <Box className="mt-50">
          <Typography
            sx={{
              fontFamily: "Arial !important",
              fontWeight: "600",
              fontSize: "32px",
              lineHeight: "40px",
              color: "#000000",
              textAlign: "left",
            }}
          >
            Organisation Details
          </Typography>
          <Card className="organisation_icon_card" sx={{ marginTop: "30px" }}>
            <Box className="d-flex h-100 align-items-center">
              {/* {logoPath ? (
              <img
                src={UrlConstant.base_url_without_slash + logoPath}
                style={{ width: "179px", height: "90px" }}
              />
            ) : (
              <h1 className={LocalStyle.firstLetterOnLogo}>
                {organisationName?.split("")[0]?.toUpperCase()}
              </h1>
            )} */}

              {console.log(orgDetails)}
              {orgDetails?.logo ? (
                <img
                  style={{ width: "100%" }}
                  src={UrlConstant.base_url_without_slash + orgDetails?.logo}
                  alt="org logo"
                />
              ) : (
                <h1 style={{ fontSize: "60px", textAlign: "center" }}>
                  {orgDetails?.name?.split("")[0]?.toUpperCase()}
                </h1>
              )}
            </Box>
          </Card>
          <Row>
            <Col xl={4} lg={4} md={4} sm={6} className="text-left mt-30">
              <Typography className="view_datasets_light_text">
                Organisation name
              </Typography>
              <Typography
                className={
                  mobile
                    ? "view_datasets_bold_text_sm"
                    : "view_datasets_bold_text break_word"
                }
              >
                {orgDetails?.name}
              </Typography>
            </Col>
            <Col xl={4} lg={4} md={4} sm={6} className="text-left mt-30">
              <Typography className="view_datasets_light_text">
                Organisation address
              </Typography>
              <Typography
                className={
                  mobile
                    ? "view_datasets_bold_text_sm"
                    : "view_datasets_bold_text break_word"
                }
              >
                {orgAddress}
              </Typography>
            </Col>
            <Col xl={4} lg={4} md={6} sm={6} className={`text-left mt-30`}>
              <Typography className="view_datasets_light_text">
                Root user details
              </Typography>
              <Typography
                className={
                  mobile
                    ? "view_datasets_bold_text_sm"
                    : "view_datasets_bold_text break_word"
                }
              >
                {userDetails?.first_name + " " + userDetails?.last_name}
              </Typography>
              <Typography
                className={
                  mobile
                    ? "view_datasets_bold_text_sm"
                    : "view_datasets_bold_text break_word"
                }
              >
                {userDetails?.email}
              </Typography>
            </Col>
          </Row>
        </Box>
      </Box>
    )
  );
};

export default ViewResource;

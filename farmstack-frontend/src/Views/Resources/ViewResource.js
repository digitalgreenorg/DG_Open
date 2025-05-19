import {
  Box,
  Button,
  useMediaQuery,
  useTheme,
  Typography,
  Divider,
  Card,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  TableCell,
  TableContainer,
  CardContent,
  IconButton,
  Collapse,
  Avatar,
  Grid,
  Chip,
} from "@mui/material";
import { IoIosListBox } from "react-icons/io";
import { CiCreditCard1 } from "react-icons/ci";
import { FaRegCreditCard } from "react-icons/fa";

import { styled } from "@mui/material/styles";
import React, { useState, useContext, useEffect } from "react";
import { FarmStackContext } from "../../Components/Contexts/FarmStackContext";
import { useHistory, useParams } from "react-router-dom";
import {
  GetErrorHandlingRoute,
  dateTimeFormat,
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
  toTitleCase,
} from "../../Utils/Common";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CustomDeletePopper from "../../Components/DeletePopper/CustomDeletePopper";
import { Col, Row } from "react-bootstrap";
import File from "../../Components/Datasets_New/TabComponents/File";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import ControlledAccordion from "../../Components/Accordion/Accordion";
import labels from "../../Constants/labels";
import RequestTab from "./TabComponents/RequestTab";
import ContentTab from "./TabComponents/ContentTab";
import RetrievalTab from "./TabComponents/RetrievalTab";
import EmptyFile from "../../Components/Datasets_New/TabComponents/EmptyFile";
import StarIcon from "@mui/icons-material/Star";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import {
  TbLayoutDistributeVertical,
  TbLayoutSidebarLeftExpandFilled,
} from "react-icons/tb";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { RiDeleteBin7Line } from "react-icons/ri";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { EditNotifications } from "@mui/icons-material";
import ChipsRenderer from "./Categories";
const rows = [];

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
  const [pdfFiles, setPdfFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [apiLinks, setApiLinks] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [s3Files, setS3Files] = useState([]);
  const [googleDriveFiles, setGoogleDriveFiles] = useState([]);
  const [dropboxFiles, setDropboxFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [usagePolicies, setUsagePolicies] = useState([]);
  const [retrievalData, setRetrievalData] = useState([]);
  // Organisation & User Details
  const [orgDetails, setOrgDetails] = useState();
  const [orgAddress, setOrgAddress] = useState();
  const [userDetails, setUserDetails] = useState();
  const [selectedPanelIndex, setSelectedPanelIndex] = useState(1);

  const containerStyle = {
    marginLeft: mobile || tablet ? "30px" : "144px",
    marginRight: mobile || tablet ? "30px" : "144px",
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }

  const handleDeletePopper = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const closePopper = () => {
    setOpen(false);
  };

  let resources = labels.renaming_modules.resources;
  let resource = labels.renaming_modules.resource;
  let Resources = toTitleCase(labels.renaming_modules.resources);
  let Resource = toTitleCase(labels.renaming_modules.resource);

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
    window.open(file, "_blank");
  };

  const handleChatIconClick = () => {
    if (isLoggedInUserParticipant()) {
      history.push("/participant/resources/chat-with-content/", {
        resourceId: id,
        resourceName: resourceName,
      });
    } else if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      history.push("/datahub/resources/chat-with-content/", {
        resourceId: id,
        resourceName: resourceName,
      });
    }
  };

  const [countriesData, setCountriesData] = useState([]);
  const [subCategoriesData, setSubCategoriesData] = useState([]);
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
        setRetrievalData(response.data?.retrival);
        setResourceName(response.data?.title);
        setResourceDescription(response.data?.description);
        setCountriesData(response.data?.category?.countries);
        setSubCategoriesData(response.data?.category?.sub_categories);
        setPublishedOn(response.data?.created_at);
        let tempFiles = response.data.resources?.filter(
          (resource) => resource.type === "file"
        );
        let tempPdfFiles = response.data.resources?.filter(
          (resource) => resource.type === "pdf"
        );
        let tempVideoFiles = response.data.resources?.filter(
          (resource) => resource.type === "youtube"
        );
        let tempWebsiteFiles = response.data.resources?.filter(
          (resource) => resource.type === "website"
        );
        let tempApiFiles = response.data.resources?.filter(
          (resource) => resource.type === "api"
        );
        let tempS3Files = response.data.resources?.filter(
          (resource) => resource.type === "s3"
        );
        let tempGoogleDriveFiles = response.data.resources?.filter(
          (resource) => resource.type === "google_drive"
        );
        let tempDropBoxFiles = response.data.resources?.filter(
          (resource) => resource.type === "dropbox"
        );

        setUploadedFiles(tempFiles);
        setPdfFiles(tempPdfFiles);
        setVideoFiles(tempVideoFiles);
        setWebsites(tempWebsiteFiles);
        setApiLinks(tempApiFiles);
        setS3Files(tempS3Files);
        setGoogleDriveFiles(tempGoogleDriveFiles);
        setDropboxFiles(tempDropBoxFiles);

        let tempCategories = [];
        let prep = response?.data?.categories?.forEach((item, index) => {
          let prepareCheckbox = item?.subcategories?.map((res, ind) => {
            return res?.name;
          });
          let obj = {
            panel: index + 1,
            title: item?.name,
            details: prepareCheckbox ? prepareCheckbox : [],
          };
          tempCategories = tempCategories.concat(obj);
        });
        setCategories(tempCategories);
        setUserDetails(response?.data?.user);
        setOrgDetails(response?.data?.organization);
        let tempOrgAddress =
          response?.data?.organization?.address?.address +
          ", " +
          response?.data?.organization?.address?.country +
          ", " +
          response?.data?.organization?.address?.pincode;
        setOrgAddress(tempOrgAddress);
        setUsagePolicies(response?.data?.resource_usage_policy);
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

  const RefreshEmbedingStatus = async (fileId, fileType) => {
    console.log(
      "🚀 ~ RefreshEmbedingStatus ~ fileId, fileType:",
      fileId,
      fileType
    );
    let url = `${UrlConstant.base_url}${
      userType === "guest"
        ? "microsite/resource_file/"
        : "datahub/resource_file/"
    }${fileId}/`;
    callLoader(true);
    await HTTPService(
      "GET",
      url,
      "",
      false,
      userType === "guest" ? false : true
    )
      .then((updatedFile) => {
        callLoader(false);

        switch (fileType) {
          case "file":
            setUploadedFiles((prevFiles) =>
              prevFiles.map((file) =>
                file.id === fileId ? updatedFile?.data : file
              )
            );
            break;
          case "pdf":
            setPdfFiles((prevFiles) =>
              prevFiles.map((file) =>
                file.id === fileId ? updatedFile?.data : file
              )
            );
            break;
          case "youtube":
            setVideoFiles((prevFiles) =>
              prevFiles.map((file) =>
                file.id === fileId ? updatedFile?.data : file
              )
            );
            break;
          case "website":
            setWebsites((prevFiles) =>
              prevFiles.map((file) =>
                file.id === fileId ? updatedFile?.data : file
              )
            );
            break;
          case "api":
            setApiLinks((prevFiles) =>
              prevFiles.map((file) =>
                file.id === fileId ? updatedFile?.data : file
              )
            );
            break;
          default:
            console.error("Unsupported file type");
        }
        setSelectedPanelIndex(3); // to open file accordion
        console.log(
          "🚀 ~ RefreshEmbedingStatus ~ updatedFile:",
          fileType,
          updatedFile
        );
        // callToast("Updated successfully!", "success", true);
      })
      .catch(async (e) => {
        callLoader(false);

        console.log(e);
        let error = await GetErrorHandlingRoute(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const getAccordionDataForLinks = () => {
    const prepareFile = (data, type) => {
      // console.log("🚀 ~ prepareFile ~ data, type:284", data, type);
      if (data && type === "file_upload") {
        let arr = data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              // size={null}
              showEmbedding={true}
              collections={item?.collections}
              url={item?.type === "file" ? item?.file : item?.url}
              id={item?.id}
              type={item?.type}
              iconcolor={"#424242"}
              RefreshEmbedingStatus={RefreshEmbedingStatus}
            />
          );
        });
        return arr;
      } else if (data && type === "pdf_file") {
        let arr = data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              // size={null}
              showEmbedding={true}
              collections={item?.collections}
              url={item?.type === "file" ? item?.file : item?.url}
              id={item?.id}
              type={item?.type}
              iconcolor={"#424242"}
              RefreshEmbedingStatus={RefreshEmbedingStatus}
            />
          );
        });
        return arr;
      } else if (data && type === "video_file") {
        let arr = data?.map((item, index) => {
          console.log("🚀 ~ arr ~ item:", item);
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          let videoCode = item?.url?.split("=")?.[1];
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              // size={null}
              showEmbedding={true}
              collections={item?.collections}
              url={item?.type === "file" ? item?.file : item?.url}
              id={item?.id}
              type={item?.type}
              iconcolor={"#424242"}
              embeddingsStatus={item?.embeddings_status}
              RefreshEmbedingStatus={RefreshEmbedingStatus}
              fileImg={`https://img.youtube.com/vi/${videoCode}/0.jpg`}
            />
          );
        });
        return arr;
      } else if (data && type === "websites") {
        let arr = data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              // size={null}
              showEmbedding={true}
              url={item?.type === "file" ? item?.file : item?.url}
              id={item?.id}
              type={item?.type}
              iconcolor={"#424242"}
              embeddingsStatus={item?.embeddings_status}
              RefreshEmbedingStatus={RefreshEmbedingStatus}
            />
          );
        });
        return arr;
      } else if (data && type === "apis") {
        let arr = data?.map((item, index) => {
          // console.log("🚀 ~ arr ~ item:361", item);
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              // size={null}
              showEmbedding={true}
              url={item?.type === "file" ? item?.file : item?.url ?? item?.file}
              id={item?.id}
              type={item?.type}
              iconcolor={"#424242"}
              embeddingsStatus={item?.embeddings_status}
              RefreshEmbedingStatus={RefreshEmbedingStatus}
            />
          );
        });
        return arr;
      } else if (data && type === "s3") {
        let arr = data?.map((item, index) => {
          // console.log("🚀 ~ arr ~ item:361", item);
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              // size={null}
              showEmbedding={true}
              url={item?.type === "file" ? item?.file : item?.url ?? item?.file}
              id={item?.id}
              type={item?.type}
              iconcolor={"#424242"}
              embeddingsStatus={item?.embeddings_status}
              RefreshEmbedingStatus={RefreshEmbedingStatus}
            />
          );
        });
        return arr;
      } else if (data && type === "google_drive") {
        let arr = data?.map((item, index) => {
          // console.log("🚀 ~ arr ~ item:361", item);
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              // size={null}
              showEmbedding={true}
              url={item?.type === "file" ? item?.file : item?.url ?? item?.file}
              id={item?.id}
              type={item?.type}
              iconcolor={"#424242"}
              embeddingsStatus={item?.embeddings_status}
              RefreshEmbedingStatus={RefreshEmbedingStatus}
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
      pdfFiles ||
      videoFiles ||
      websites ||
      apiLinks ||
      s3Files ||
      googleDriveFiles ||
      dropboxFiles
    ) {
      const data = [];
      if (uploadedFiles && uploadedFiles.length > 0) {
        data.push({
          panel: 1,
          title: (
            <>
              Uploaded Files
              <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                (Total Files: {uploadedFiles.length})
              </span>
            </>
          ),
          details: prepareFile(uploadedFiles, "file_upload"),
        });
      }

      if (pdfFiles && pdfFiles.length > 0) {
        data.push({
          panel: 2,
          title: (
            <>
              Urls
              <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                (Total Files: {pdfFiles.length})
              </span>
            </>
          ),
          details: prepareFile(pdfFiles, "pdf_file"),
        });
      }

      if (videoFiles && videoFiles.length > 0) {
        data.push({
          panel: 3,
          title: (
            <>
              Youtube Videos
              <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                (Total Files: {videoFiles.length})
              </span>
            </>
          ),
          details: prepareFile(videoFiles, "video_file"),
        });
      }

      if (apiLinks && apiLinks.length > 0) {
        data.push({
          panel: 4,
          title: (
            <>
              APIs
              <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                (Total Files: {apiLinks.length})
              </span>
            </>
          ),
          details: prepareFile(apiLinks, "apis"),
        });
      }

      if (websites && websites.length > 0) {
        data.push({
          panel: 5,
          title: (
            <>
              Websites
              <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                (Total Files: {websites.length})
              </span>
            </>
          ),
          details: prepareFile(websites, "websites"),
        });
      }
      if (s3Files && s3Files.length > 0) {
        data.push({
          panel: 5,
          title: (
            <>
              S3 Files
              <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                (Total Files: {s3Files.length})
              </span>
            </>
          ),
          details: prepareFile(s3Files, "s3"),
        });
      }
      if (googleDriveFiles && googleDriveFiles.length > 0) {
        data.push({
          panel: 5,
          title: (
            <>
              Google Drive Files
              <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                (Total Files: {googleDriveFiles.length})
              </span>
            </>
          ),
          details: prepareFile(googleDriveFiles, "google_drive"),
        });
      }
      if (dropboxFiles && dropboxFiles.length > 0) {
        data.push({
          panel: 5,
          title: (
            <>
              Dropbox Files
              <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                (Total Files: {dropboxFiles.length})
              </span>
            </>
          ),
          details: prepareFile(dropboxFiles, "google_drive"),
        });
      }
      return data;
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (id) {
      getResource();
    }
  }, [adminData]);

  const [expanded, setExpanded] = useState(false);
  const [topValue, setTopValue] = React.useState(0);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleChange = (event, newValue) => {
    console.log("🚀 ~ handleChange ~ newValue:", newValue);
    setTopValue(newValue);
  };

  // Styling the table header cells
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: "#00a94f",
    color: theme.palette.common.white,
    fontSize: 16,
    fontWeight: "bold",
  }));
  // Styling the table rows for alternate coloring
  const StyledTableRow = styled(TableRow)(({ theme, index }) => ({
    backgroundColor: index % 2 ? theme.palette.action.hover : "inherit",
  }));

  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    !isLoading && (
      <Box sx={containerStyle}>
        <div className="text-left mt-50 hidden">
          <span
            className="add_light_text cursor-pointer breadcrumbItem"
            onClick={() => history.push(handleClickRoutes())}
            id="add-dataset-breadcrum"
            data-testid="goPrevRoute"
          >
            {breadcrumbFromRoute ?? "Content"}
          </span>
          <span className="add_light_text ml-11">
            <ArrowForwardIosIcon sx={{ fontSize: "14px", fill: "#424242" }} />
          </span>
          <span className="add_light_text ml-11 fw600">
            View {Resource} Collection
          </span>
        </div>

        <Box className="hidden" style={{ display: "flex", gap: "25px" }}>
          <div style={{ width: "30%" }}>
            <Card
              raised
              className={mobile ? "my-4" : "d-flex my-4"}
              sx={{ borderRadius: 2, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
            >
              <CardContent>
                <Box
                  className="d-flex justify-content-between"
                  sx={{ flexDirection: mobile ? "column" : "row" }}
                >
                  <Box sx={{ flex: 1, paddingRight: mobile ? 0 : 4 }}>
                    <Typography
                      variant="h5"
                      className="text-left ellipsis"
                      noWrap
                    >
                      {resourceName
                        ? resourceName
                        : "Resource Name Not Available"}
                    </Typography>
                    <Typography
                      className="text-left mt-2"
                      color="textSecondary"
                    >
                      Description
                    </Typography>
                    <Typography
                      className="text-left"
                      variant="body2"
                      sx={{
                        my: 2,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {resourceDescription
                        ? resourceDescription
                        : "No description available."}
                    </Typography>
                    <IconButton
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                      sx={{
                        transform: !expanded
                          ? "rotate(0deg)"
                          : "rotate(180deg)",
                        transition: "transform 0.3s",
                      }}
                    >
                      {/* <ExpandMoreIcon /> */} <FaExpandArrowsAlt />
                    </IconButton>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <Typography variant="body2" className="text-left">
                        {resourceDescription}
                      </Typography>
                    </Collapse>
                  </Box>
                  <Box
                    sx={{
                      minWidth: mobile ? "100%" : "240px",
                      marginTop: mobile ? 2 : 0,
                    }}
                  >
                    <Typography className="text-left" color="textSecondary">
                      Published on
                    </Typography>
                    <Typography
                      className="text-left"
                      variant="body1"
                      sx={{ mt: 1 }}
                    >
                      {publishedOn
                        ? dateTimeFormat(publishedOn, false)
                        : "Date not available"}
                    </Typography>
                    <Typography
                      className="text-left mt-3"
                      color="textSecondary"
                    >
                      No. of files
                    </Typography>
                    <Typography
                      className="text-left"
                      variant="body1"
                      sx={{ mt: 1 }}
                    >
                      {uploadedFiles ? uploadedFiles.length : "1"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </div>
          <div style={{ width: "65%" }}>
            <Box
              className=""
              sx={{
                display: "flex",
              }}
            >
              <Tabs
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#00A94F !important",
                  },
                  "& .MuiTab-root": {
                    color: "#637381 !important",
                    borderLeft: "none !important",
                    borderTop: "none !important",
                    borderRight: "none !important",
                  },
                  "& .Mui-selected": { color: "#00A94F !important" },
                  margin: "auto",
                }}
                variant="scrollable"
                // scrollButtons
                allowScrollButtonsMobile
                value={value}
                onChange={handleTabChange}
                aria-label="basic tabs example"
              >
                <Tab
                  label={
                    <Box>
                      <img
                        src={require("../../Assets/Img/asset_file.svg")}
                        width={"37px"}
                      />
                      <span
                        style={{
                          fontSize: "15px",
                          marginLeft: "15px",
                          fontFamily: "Montserrat",
                          color: "#424242",
                          fontWeight: value === 0 ? 600 : 400,
                          textTransform: "none",
                        }}
                      >
                        Assets
                      </span>
                    </Box>
                  }
                  sx={{
                    width: "200px",
                  }}
                />
                <Tab
                  label={
                    <Box>
                      <img
                        src={require("../../Assets/Img/request.svg")}
                        width={"37px"}
                      />
                      <span
                        style={{
                          fontSize: "15px",
                          marginLeft: "15px",
                          fontFamily: "Montserrat",
                          color: "#424242",
                          fontWeight: value === 1 ? 600 : 400,
                          textTransform: "none",
                        }}
                      >
                        Requests
                      </span>
                    </Box>
                  }
                  sx={{
                    width: "200px",
                  }}
                />
                {getTokenLocal() &&
                  // history.location?.state?.tab === 0 &&
                  !history.location?.state?.userType && (
                    <Tab
                      label={
                        <Box>
                          <img
                            src={require("../../Assets/Img/retrieval.svg")}
                            width={"37px"}
                          />
                          <span
                            style={{
                              fontSize: "15px",
                              marginLeft: "15px",
                              fontFamily: "Montserrat",
                              color: "#424242",
                              fontWeight: value === 2 ? 600 : 400,
                              textTransform: "none",
                            }}
                          >
                            Retrieval
                          </span>
                        </Box>
                      }
                      sx={{
                        width: "200px",
                      }}
                    />
                  )}
              </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
              <ContentTab
                getAccordionDataForLinks={getAccordionDataForLinks}
                selectedPanelIndex={selectedPanelIndex}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <RequestTab
                userType={userType}
                resourceId={id}
                usagePolicies={usagePolicies}
                getResource={getResource}
                isOther={history.location?.state?.tab === 1 ? true : false}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <RetrievalTab id={id} data={retrievalData} />
            </TabPanel>
          </div>
        </Box>

        <Box
          className={mobile ? "" : "d-flex align-items-center"}
          style={{ justifyContent: "space-between" }}
        >
          <Typography
            variant="h5" // You can adjust the variant for different sizes e.g., h4, h5, h6
            component="div"
            sx={{
              mt: 2, // Adjust the top margin
              mb: 1, // Adjust bottom margin if needed
              fontWeight: "bold", // Makes the font bold
              color: "#00a94f", // Uses the primary color from the theme
              textAlign: "left", // Ensures text is aligned to the left
              fontSize: "1.25rem", // Sets the font size to 20px
            }}
          >
            {`${Resource} Collection Details`}
          </Typography>
          {/* <div style={{}} className="mt-10">{`${Resource} Collection Details`}</div> */}
          {getTokenLocal() &&
          history.location?.state?.tab === 0 &&
          !history.location?.state?.userType ? (
            <Box
              className={mobile ? "d-flex" : ""}
              sx={{ justifyContent: "end" }}
            >
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
                  background: "#F20B0B",
                  color: "white",
                  fontFamily: "Montserrat",
                  fontWeight: "700",
                  fontSize: mobile ? "14px" : "18px",
                  border: "1px solid #F20B0B",
                  padding: "5px",
                  marginRight: "20px",
                  textTransform: "none",
                  width: "fit-content",
                  minWidth: "fit-content",
                  textAlign: "center",

                  "&:hover": {
                    background: "#F20B0B",
                    color: "white",
                    border: "1px solid #F20B0B",
                  },
                }}
                variant="outlined"
                onClick={handleDeletePopper}
              >
                <DeleteOutlineIcon
                  sx={{
                    fill: "white",
                    fontSize: "22px",
                    // marginLeft: "4px",
                  }}
                />
              </Button>
              <Button
                sx={{
                  color: "#00a94f",
                  fontFamily: "Montserrat",
                  fontWeight: "700",
                  fontSize: mobile ? "14px" : "18px",
                  border: "1px solid #00a94f",

                  padding: "5px",
                  // marginRight: "20px",
                  textTransform: "none",
                  width: "fit-content",
                  minWidth: "fit-content",
                  textAlign: "center",
                  "&:hover": {
                    background: "white",
                    color: "#00a94f",
                    border: "1px solid #00a94f",
                  },
                }}
                onClick={handleEdit}
                variant="outlined"
              >
                <EditNoteIcon
                  sx={{
                    fill: "#00a94f",
                    fontSize: "22px",
                    // marginLeft: "4px",
                  }}
                />
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Box>
        <Paper sx={{ width: "100%" }}>
          <Tabs
            className="tabs_in_view"
            value={selectedTab}
            onChange={handleChangeTab}
            variant="standard"
            indicatorColor="primary"
            textColor="primary"
            aria-label="icon label tabs example"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#00a94f", // Sets the indicator (gutter) color to green
              },
            }}
          >
            <Tab
              icon={<IoIosListBox color="#00a94f" />}
              aria-label="List view"
            />
            <Tab
              icon={<FaRegCreditCard color="#00a94f" />}
              aria-label="Grid view"
            />
          </Tabs>
          <Box sx={{ p: 3 }}>
            {selectedTab === 0 &&
              (true ? (
                <TableContainer
                  component={Paper}
                  sx={{
                    maxWidth: "100%",
                    boxShadow: "1px 1px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">
                          Attribute
                        </StyledTableCell>
                        <StyledTableCell align="left">Value</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          label: "Name",
                          value: resourceName || "Resource Name Unavailable",
                        },
                        {
                          label: "Published On",
                          value: publishedOn
                            ? dateTimeFormat(publishedOn, false)
                            : "Date not available",
                        },
                        {
                          label: "Files",
                          value: `Uploaded (${
                            uploadedFiles ? uploadedFiles.length : "0"
                          }), PDFs (${
                            pdfFiles ? pdfFiles.length : "0"
                          }), Videos (${
                            videoFiles ? videoFiles.length : "0"
                          }), APIs (${
                            apiLinks ? apiLinks.length : "0"
                          }), Websites (${websites ? websites.length : "0"}),
                               S3 (${
                                 s3Files ? s3Files.length : "0"
                               }), Google Drive (${
                            googleDriveFiles ? googleDriveFiles.length : "0"
                          }),  Dropbox (${
                            dropboxFiles ? dropboxFiles.length : "0"
                          })`,
                        },
                        {
                          label: "Description",
                          value:
                            resourceDescription || "No description provided.",
                        },
                        {
                          label: "Categories",
                          value:
                            categories?.length > 0 ? (
                              <ChipsRenderer data={categories} />
                            ) : (
                              "N/A"
                            ),
                        },
                        {
                          label: "Organization Name",
                          value:
                            orgDetails?.name || "Organisation Name Unavailable",
                        },
                        {
                          label: "Organization Address",
                          value: orgAddress || "Address Unavailable",
                        },
                        {
                          label: "Contact Name",
                          value:
                            `${userDetails?.first_name || ""} ${
                              userDetails?.last_name || ""
                            }`.trim() || "Unavailable",
                        },
                        {
                          label: "Email",
                          value: userDetails?.email || "Email Unavailable",
                        },
                        {
                          label: "Countries",
                          value:
                            countriesData?.length > 0 ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "10px",
                                  justifyContent: "start",
                                }}
                              >
                                {countriesData.map((item, index) => (
                                  <Chip
                                    key={item}
                                    label={item}
                                    sx={{
                                      backgroundColor: "#00a94f",
                                      color: "white",
                                    }}
                                  />
                                  // <React.Fragment key={index}>
                                  //   {/* Map over the details array for each item */}
                                  //   {item.details.map((detail, detailIndex) => (
                                  //   ))}
                                  // </React.Fragment>
                                ))}
                              </div>
                            ) : (
                              "N/A"
                            ),
                        },
                        {
                          label: "Sub Categories",
                          value:
                            subCategoriesData?.length > 0 ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "10px",
                                  justifyContent: "start",
                                }}
                              >
                                {subCategoriesData.map((item, index) => (
                                  <Chip
                                    key={item}
                                    label={item}
                                    sx={{
                                      backgroundColor: "#00a94f",
                                      color: "white",
                                    }}
                                  />
                                  // <React.Fragment key={index}>
                                  //   Map over the details array for each item
                                  //   {item.details.map((detail, detailIndex) => (
                                  //   ))}
                                  // </React.Fragment>
                                ))}
                              </div>
                            ) : (
                              "N/A"
                            ),
                        },
                      ].map((row, index) => (
                        <StyledTableRow key={row.label} index={index}>
                          <TableCell component="th" scope="row">
                            {row.label}
                          </TableCell>
                          <TableCell align="left">{row.value}</TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box>Placeholder for List Component</Box>
              ))}
            {selectedTab === 1 &&
              (true ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "20px", // Adjust spacing between cards
                    flexWrap: "wrap", // Allows cards to wrap on smaller screens
                  }}
                >
                  <Card
                    sx={{
                      p: theme.spacing(2),
                      boxShadow: "0px 6px 18px rgba(0,0,0,0.12)",
                      borderRadius: theme.shape.borderRadius,
                      backgroundColor: theme.palette.background.paper,
                      position: "relative",
                      overflow: "hidden",
                      width: "100%",
                      maxWidth: "48%",
                      flex: "1 0 auto",
                      minHeight: 250, // Ensure the second card matches the first in height
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography
                            variant="overline"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            Title
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "#00a94f" }}
                          >
                            {resourceName || "Resource Name Unavailable"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                          <Typography
                            variant="overline"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            Published on
                          </Typography>
                          <Typography
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {publishedOn
                              ? dateTimeFormat(publishedOn, false)
                              : "Date not available"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2} md={4}>
                          <Typography
                            variant="overline"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            Files
                          </Typography>
                          <Typography
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {uploadedFiles ? uploadedFiles.length : "1"}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Typography
                        variant="overline"
                        sx={{
                          color: theme.palette.text.secondary,
                          textAlign: "left",
                        }}
                      >
                        Description
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          textAlign: "left",
                        }}
                      >
                        {resourceDescription || "No description provided."}
                      </Typography>
                      <Typography
                        variant="overline"
                        sx={{
                          color: theme.palette.text.secondary,
                          textAlign: "left",
                        }}
                      >
                        Categories
                      </Typography>
                      {categories?.length > 0 ? (
                        <ChipsRenderer data={categories} />
                      ) : (
                        <Typography sx={{ textAlign: "left" }}>N/A</Typography>
                      )}
                    </Box>
                  </Card>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 2,
                      boxShadow: "0px 6px 18px rgba(0,0,0,0.15)",
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.paper,
                      overflow: "hidden",
                      width: "100%", // Ensures it fills the container space
                      maxWidth: "48%", // Maintains the layout in a two-column format
                      flex: "1 0 auto", // Flexibility for responsive design
                      // m: 1, // Margin for separation from other elements
                      minHeight: 250, // Set a minimum height to keep cards consistent
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        fontSize: "3rem",
                        bgcolor: theme.palette.secondary.main, // Changed to secondary for variety
                        mt: 2,
                        mb: 2, // Added bottom margin
                      }}
                      src={orgDetails?.logo}
                      alt="Organization Logo"
                    >
                      {!orgDetails?.logo &&
                        orgDetails?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ textAlign: "center", width: "100%" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "#00a94f",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {orgDetails?.name || "Organisation Name Unavailable"}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.text.secondary,
                          mt: 1,
                        }}
                      >
                        {orgAddress || "Address Unavailable"}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.text.secondary,
                          mt: 1,
                        }}
                      >
                        Contact:{" "}
                        {`${userDetails?.first_name || ""} ${
                          userDetails?.last_name || ""
                        }`.trim() || "Unavailable"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.disabled,
                          fontSize: "0.875rem",
                        }}
                      >
                        Email: {userDetails?.email || "Email Unavailable"}
                      </Typography>
                    </Box>
                  </Card>
                </Box>
              ) : (
                <Box>Placeholder for Grid Component</Box>
              ))}
          </Box>
        </Paper>

        <Box className="hidden" sx={{ display: "flex", height: 224 }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={topValue}
            onChange={handleChange}
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            <Tab label="Content Details" />
            <Tab label="Organization Details" />
          </Tabs>

          {/* {topValue === 0 && (
          
          )} */}

          {/* {topValue === 1 && (
           
          )} */}
        </Box>
        {/* <Box className={mobile ? "mt-38" : "d-flex mt-38"}>
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
        </Box> */}
        {/* <Divider className="mt-50" /> */}
        <Box className="bold_title mt-50 hidden">
          {categories && categories.length ? `${Resource} category` : ""}
          {console.log(categories, "categories")}
        </Box>
        <Box className="mt-20 hidden">
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
            isCustomArrowColor={true}
            customDetailsStyle={{ display: "inline-block", width: "30%" }}
            addHeaderBackground={true}
            headerBackground={"#F6F6F6"}
          />
        </Box>
        <Divider className="mt-50 hidden" />
        <Box className="mt-50">
          <Typography
            variant="h5" // You can adjust the variant for different sizes e.g., h4, h5, h6
            component="div"
            sx={{
              mt: 2, // Adjust the top margin
              mb: 1, // Adjust bottom margin if needed
              fontWeight: "bold", // Makes the font bold
              color: "#00a94f", // Uses the primary color from the theme
              textAlign: "left", // Ensures text is aligned to the left
              fontSize: "1.25rem", // Sets the font size to 20px
            }}
          >
            {Resource} Assets Collection
          </Typography>

          <>
            <Typography
              sx={{
                textAlign: "left",
                fontWeight: "bold",
                fontSize: "1rem", // Using rem for responsive font sizing
                lineHeight: "1.5rem",
                color: "#333", // A darker shade for better readability
                mt: 1, // Increased top margin for better visual separation
                fontFamily: "Montserrat", // Switching to Montserrat for a more neutral look
                letterSpacing: "0.5px", // Added letter spacing for a touch of refinement
              }}
            >
              Note:
            </Typography>
            <Typography
              sx={{
                textAlign: "left",
                fontWeight: "normal", // Explicitly setting to 'normal' for contrast
                fontSize: "0.875rem", // Smaller than the heading for hierarchy
                lineHeight: "1.4rem",
                color: "#666", // Lighter grey for the secondary text to reduce intensity
                mt: 1, // Reduced top margin to keep related text closer together
                fontFamily: "Montserrat", // Consistent font family
                letterSpacing: "0.3px", // Slightly less than heading for subtlety
              }}
            >
              This {resource} is solely meant to be used as a source of
              information. Even though accuracy is the goal, the person is not
              accountable for the information. Please let the admin know if you
              have any information you think is inaccurate.
            </Typography>
          </>
        </Box>
        <Box
          className="mt-10"
          sx={{
            // borderBottom: 1,
            // borderColor: "divider",
            // borderBottom: "1px solid #3D4A52 !important",
            display: "flex",
          }}
        >
          <Tabs
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#00A94F !important",
              },
              "& .MuiTab-root": {
                color: "#637381 !important",
                borderLeft: "none !important",
                borderTop: "none !important",
                borderRight: "none !important",
              },
              "& .Mui-selected": { color: "#00A94F !important" },
              margin: "auto",
            }}
            variant="scrollable"
            // scrollButtons
            allowScrollButtonsMobile
            value={value}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab
              label={
                <Box>
                  <img
                    src={require("../../Assets/Img/asset_file.svg")}
                    width={"37px"}
                  />
                  <span
                    style={{
                      fontSize: "15px",
                      marginLeft: "15px",
                      fontFamily: "Montserrat",
                      color: "#424242",
                      fontWeight: value === 0 ? 600 : 400,
                      textTransform: "none",
                    }}
                  >
                    Assets
                  </span>
                </Box>
              }
              sx={{
                width: "200px",
              }}
            />
            <Tab
              label={
                <Box>
                  <img
                    src={require("../../Assets/Img/request.svg")}
                    width={"37px"}
                  />
                  <span
                    style={{
                      fontSize: "15px",
                      marginLeft: "15px",
                      fontFamily: "Montserrat",
                      color: "#424242",
                      fontWeight: value === 1 ? 600 : 400,
                      textTransform: "none",
                    }}
                  >
                    Requests
                  </span>
                </Box>
              }
              sx={{
                width: "200px",
              }}
            />
            {getTokenLocal() &&
              // history.location?.state?.tab === 0 &&
              !history.location?.state?.userType && (
                <Tab
                  label={
                    <Box>
                      <img
                        src={require("../../Assets/Img/retrieval.svg")}
                        width={"37px"}
                      />
                      <span
                        style={{
                          fontSize: "15px",
                          marginLeft: "15px",
                          fontFamily: "Montserrat",
                          color: "#424242",
                          fontWeight: value === 2 ? 600 : 400,
                          textTransform: "none",
                        }}
                      >
                        Retrieval
                      </span>
                    </Box>
                  }
                  sx={{
                    width: "200px",
                  }}
                />
              )}
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ContentTab
            getAccordionDataForLinks={getAccordionDataForLinks}
            selectedPanelIndex={selectedPanelIndex}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <RequestTab
            userType={userType}
            resourceId={id}
            usagePolicies={usagePolicies}
            getResource={getResource}
            isOther={history.location?.state?.tab === 1 ? true : false}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <RetrievalTab id={id} data={retrievalData} />
        </TabPanel>
        <Divider className="mt-50 hidden" style={{ display: "none" }} />
        <Box className="mt-50 hidden" style={{ display: "none" }}>
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
            Feedback Table
          </Typography>
          <TableContainer
            className="mt-30"
            sx={{
              borderRadius: "12px",
            }}
            component={Paper}
          >
            <Table
              sx={{ minWidth: 650 }}
              stickyHeader
              aria-label="simple table"
            >
              <TableHead
                sx={{
                  "& .MuiTableCell-head": {
                    backgroundColor: "#F6F6F6",
                  },
                }}
              >
                <TableRow>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">Flew Questions</TableCell>
                  <TableCell align="left">Bot Replies</TableCell>
                  <TableCell align="left">Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.length > 0 ? (
                  rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          backgroundColor: "#DEFFF1",
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.date}</TableCell>
                      <TableCell align="left">{row.questions}</TableCell>
                      <TableCell align="left">{row.replies}</TableCell>
                      <TableCell align="left">
                        {
                          <>
                            {row.rating}
                            <StarIcon
                              style={{
                                height: "18px",
                                marginTop: "-4px",
                                fill: "#FFB400",
                              }}
                            />
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
                        fontSize: "20px",
                        fontWeight: "400",
                        lineHeight: 3,
                      }}
                      colSpan={12}
                    >
                      Currently, there are no feedbacks available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Divider className="mt-50 hidden" style={{ display: "none" }} />
        <Box className="mt-50 hidden">
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
            Organisation Details
          </Typography>
          <Card className="organisation_icon_card" sx={{ marginTop: "30px" }}>
            <Box className="d-flex h-100 align-items-center">
              {orgDetails?.logo ? (
                <img
                  style={{ width: "100%", padding: "6px" }}
                  src={orgDetails?.logo}
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
        {getTokenLocal() &&
        (isLoggedInUserAdmin() ||
          isLoggedInUserCoSteward() ||
          isLoggedInUserParticipant()) ? (
          <Box
            sx={{
              position: "fixed",
              right: "20px",
              bottom: "20px",
              cursor: "pointer",
              borderRadius: "50%",
              padding: "10px",
              background: "#e6f7f0",
              "&:hover": {
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              },
              display: "none",
            }}
            onClick={() => handleChatIconClick()}
          >
            <QuestionAnswerIcon sx={{ fontSize: "1.7rem" }} />
          </Box>
        ) : null}
      </Box>
    )
  );
};

export default ViewResource;

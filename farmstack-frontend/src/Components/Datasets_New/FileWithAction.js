import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import React, { useContext } from "react";
import {
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
} from "../../Utils/Common";
import File from "./TabComponents/File";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import { getUserMapId } from "../../Utils/Common";
import { Tag } from "antd";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";

const FileWithAction = ({
  index,
  datasetId,
  name,
  id,
  fileType,
  usagePolicy,
  files,
  getDataset,
  isOther,
  userType,
  fileSize,
}) => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));

  const datasetDownloader = (fileUrl, name, type) => {
    let accessToken = getTokenLocal() ?? false;
    fetch(fileUrl, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        callLoader(false);
        callToast("File downloaded successfully!", "success", true);
        // Create a temporary link element
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = name; // Set the desired file name here

        // Simulate a click event to download the file
        link.click();

        // Clean up the object URL
        URL.revokeObjectURL(link.href);
      })
      .catch((error) => {
        callLoader(false);
        callToast(
          "Something went wrong while downloading the file.",
          "error",
          true
        );
      });
  };

  const handleDownload = () => {
    let accessToken = getTokenLocal() ?? false;
    let url = UrlConstant.base_url + UrlConstant.download_file + id;
    callLoader(true);
    datasetDownloader(url, name);

    // HTTPService("GET", url, "", false, true, accessToken)
    //   .then((res) => {
    //     callLoader(false);
    //     console.log(typeof res?.data, res?.data, name, "res?.data, name");
    //     datasetDownloader(url, name);

    //     callToast("File downloaded successfully!", "success", true);
    //   })
    //   .catch((err) => {
    //     callLoader(false);
    //     callToast(
    //       "Something went wrong while downloading the file.",
    //       "error",
    //       true
    //     );
    //   });
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

  const handleButtonClick = () => {
    if (userType !== "guest") {
      if (fileType === "public" || fileType === "registered" || !isOther) {
        handleDownload();
      }
      if (isOther && fileType === "private") {
        if (
          !usagePolicy ||
          typeof usagePolicy !== "object" ||
          Object.keys(usagePolicy).length === 0
        ) {
          askToDownload();
        } else {
          if (usagePolicy?.[0]?.approval_status === "requested") {
            handleDelete(usagePolicy?.[0]?.id);
          } else if (usagePolicy?.[0]?.approval_status === "approved") {
            handleDownload();
          } else if (usagePolicy?.[0]?.approval_status === "rejected") {
            askToDownload();
          } else if (usagePolicy?.[0]?.approval_status === "recalled") {
            askToDownload();
          }
        }
      }
    } else {
      if (fileType === "public") {
        handleDownload();
      } else {
        history.push("/login");
      }
    }
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
      else if (usagePolicy[0].approval_status === "recalled") {
        return "Ask to Download";
      }
    } else {
      return "Recall";
    }
  };

  const getName = () => {
    let filteredItem = usagePolicy?.filter(
      (item) => item.user_organization_map === getUserMapId()
    );
    if (filteredItem?.[0]?.approval_status === "requested") {
      console.log(filteredItem);
      return "Requested";
    } else if (filteredItem?.[0]?.approval_status === "approved") {
      return "Approved";
    } else if (filteredItem?.[0]?.approval_status === "rejected") {
      return "Rejected";
    }else if (filteredItem?.[0]?.approval_status === "recalled") {
      return "Recalled";
    }
  };

  const getColor = () => {
    let filteredItem = usagePolicy.filter(
      (item) => item.user_organization_map === getUserMapId()
    );
    if (filteredItem?.[0]?.approval_status === "requested") {
      return "#2db7f5";
    } else if (filteredItem?.[0]?.approval_status === "approved") {
      return "#108ee9";
    } else if (filteredItem?.[0]?.approval_status === "rejected") {
      return "#f50";
    } else if (filteredItem?.[0]?.approval_status === "recalled") {
      return "#f50";
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
  return (
    <Box
      className={
        mobile || tablet ? "w-100" : "d-flex justify-content-between w-100"
      }
    >
      <Box className="d-flex align-items-center">
        <File
          index={index}
          name={name}
          size={fileSize}
          showDeleteIcon={false}
          type={"file_upload"}
          isTables={true}
        />
        {isOther && usagePolicy?.length ? (
          <Tag
            className="d-flex align-items-center justify-content-center"
            style={{
              height: "30px",
              width: "80px",
              textTransform: "capitalize",
            }}
            color={getColor()}
          >
            {getName()}
          </Tag>
        ) : (
          <></>
        )}
      </Box>

      <Box
        className="d-flex align-items-center"
        sx={{ marginTop: mobile ? "15px" : "" }}
      >
        {/* <div className="type_dataset">{fileType}</div> */}
        <Tag
          className="d-flex align-items-center justify-content-center"
          style={{ height: "30px", width: "80px", textTransform: "capitalize" }}
          color={
            fileType === "public"
              ? "#00a94f"
              : fileType === "registered"
              ? "orange"
              : "magenta"
          }
        >
          {fileType}
        </Tag>
        <Button
          sx={{
            fontFamily: "Montserrat",
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
            display: isLoggedInUserFromHome() ? "none" : "",
            "&:hover": {
              background: "none",
              border: "1px solid rgba(0, 171, 85, 0.48)",
            },
          }}
          variant="outlined"
          onClick={() => handleButtonClick()}
        >
          {userType !== "guest"
            ? fileType === "public" || fileType === "registered" || !isOther
              ? "Download"
              : isOther && !Object.keys(usagePolicy).length
              ? "Ask to Download"
              : getButtonName()
            : fileType === "public"
            ? "Download"
            : "Login to Download"}
        </Button>
        {isLoggedInUserFromHome() ? (
          <Button
            sx={{
              fontFamily: "Montserrat",
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
      </Box>
    </Box>
  );
};

export default FileWithAction;

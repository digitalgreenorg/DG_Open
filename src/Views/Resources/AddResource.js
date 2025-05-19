import {
  Box,
  Button,
  TextField,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
  Checkbox,
  Modal,
  Card,
  Tooltip,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
  toTitleCase,
} from "../../Utils/Common";
import { TbApi } from "react-icons/tb";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import { useHistory, useParams } from "react-router-dom";
import FileUploaderTest from "../../Components/Generic/FileUploaderTest";
import { FileUploader } from "react-drag-drop-files";
import { FarmStackContext } from "../../Components/Contexts/FarmStackContext";
import ControlledAccordion from "../../Components/Accordion/Accordion";
import EmptyFile from "../../Components/Datasets_New/TabComponents/EmptyFile";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import File from "../../Components/Datasets_New/TabComponents/File";

// import { Select } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import labels from "../../Constants/labels";
import CheckBoxWithTypo from "../../Components/Datasets_New/TabComponents/CheckBoxWithTypo";
import style from "./resources.module.css";
import ApiConfiguration from "../../Components/Datasets_New/TabComponents/ApiConfiguration";
import YouTubeEmbed from "../../Components/YouTubeEmbed/YouTubeEmbed";
import CloseIcon from "@mui/icons-material/Close";

import { FaCloud, FaDropbox, FaFilePdf, FaGoogle } from "react-icons/fa6";
import { FaCloudUploadAlt, FaYoutube } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";
import { CgWebsite } from "react-icons/cg";
import { VscGroupByRefType } from "react-icons/vsc";
import { MdOutlinePublish } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";

import S3Form from "./data-sources/S3Form";
import GoogleDriveForm from "./data-sources/GoogleDriveForm";
import DropboxForm from "./data-sources/DropboxForm";
import AzureBlobForm from "./data-sources/AzureBlobForm";
import FileSelectionModal from "./data-sources/FIleSelectionModal";

const accordionTitleStyle = {
  fontFamily: "'Montserrat' !important",
  fontWeight: "400 !important",
  fontSize: "12px !important",
  lineHeight: "24px !important",
  color: "#212B36 !important",
};

const AddResource = (props) => {
  const { id } = useParams();
  const { callLoader, callToast } = useContext(FarmStackContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  // const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  const history = useHistory();
  // let resources = labels.renaming_modules.resources;
  let resource = labels.renaming_modules.resource;
  let Resources = toTitleCase(labels.renaming_modules.resources);
  let Resource = toTitleCase(labels.renaming_modules.resource);
  const containerStyle = {
    marginLeft: mobile || tablet ? "30px" : "144px",
    marginRight: mobile || tablet ? "30px" : "144px",
    padding: "10px",
    // background: "#f6f6f6",
    // border: "0.5px solid",
    borderRadius: "5px",
  };
  const [fileSizeError, setFileSizeError] = useState("");
  const fileTypes = ["DOC", "TEXT", "PDF", "DOCX"];
  const [selectedValue, setSelectedValue] = useState("public");
  const [resourceName, setResourceName] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [apiLinks, setApiLinks] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  const [s3Files, setS3Files] = useState([]);
  const [googleDriveFiles, setGoogleDriveFiles] = useState([]);
  const [dropboxFiles, setDropboxFiles] = useState([]);
  const [azureBlobFiles, setAzureBlobFiles] = useState([]);
  const [cloudModalData, setCloudModalData] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [subCategoryIds, setSubCategoryIds] = useState([]);
  console.log("🚀 ~ AddResource ~ subCategoryIds:", subCategoryIds);
  const [listCategories, setListCategories] = useState([]);
  const [updater, setUpdate] = useState(0);
  const [userType, setUserType] = useState("");
  const [key, setKey] = useState(0);
  const [file, setFile] = useState();

  const [categoriesSelected, setCategoriesSelected] = useState([]);

  // Api configuration
  const [api, setApi] = useState();
  const [authType, setAuthType] = useState("");
  const [authTypes, setAuthTypes] = useState(["NO_AUTH", "API_KEY", "BEARER"]);
  const [authToken, setAuthToken] = useState();
  const [authApiKeyName, setAuthApiKeyName] = useState("");
  const [authApiKeyValue, setAuthApiKeyValue] = useState("");
  const [exportFileName, setExportFileName] = useState();

  //id stored for the add more
  const [tempIdForAddMoreResourceUrl, setTempIdForAddMoreResourceUrl] =
    useState("");
  //states for resource urls
  const [typeSelected, setTypeSelected] = useState("file");
  const [eachFileDetailData, setEachFileDetailData] = useState({
    url: "",
    transcription: "",
    type: typeSelected,
  });
  const [isSizeError, setIsSizeError] = useState(false);
  const [errorResourceName, setErrorResourceName] = useState("");
  const [errorResourceDescription, setErrorResourceDescription] = useState("");

  const limitChar = 500;
  const limitCharDesc = 2000;

  const [selectedSource, setSelectedSource] = useState("");

  console.log("s33files", s3Files);
  console.log("gdrive", googleDriveFiles);

  const getTotalSizeInMb = (data) => {
    let total = 0;
    data.forEach((element) => {
      total =
        parseFloat(total) +
        parseFloat(element?.file_size / Math.pow(1024, 2)).toFixed(2) * 1;
    });
    return total.toFixed(2);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleDelete = (index, id, filename, type) => {
    setFileSizeError("");

    // Count how many files total are in the resource
    const uploadedFilesLength = uploadedFiles?.length ?? 0;
    const pdfFilesLength = pdfFiles?.length ?? 0;
    const videoFilesLength = videoFiles?.length ?? 0;
    const websitesLength = websites?.length ?? 0;
    const apiLinksLength = apiLinks?.length ?? 0;
    const s3FilesLength = s3Files?.length ?? 0;
    const googleDriveFilesLength = googleDriveFiles?.length ?? 0;
    const dropboxFilesLength = dropboxFiles?.length ?? 0;
    const azureBlobFilesLength = azureBlobFiles?.length ?? 0;

    const totalFilesLength =
      uploadedFilesLength +
      pdfFilesLength +
      videoFilesLength +
      websitesLength +
      apiLinksLength +
      s3FilesLength +
      googleDriveFilesLength +
      dropboxFilesLength +
      azureBlobFilesLength;

    // We'll only allow server deletion if after removal there's still >= 1 file
    const allowDeletion = totalFilesLength > 1;

    // 1) If we have a real `id` => the file is from the backend (already saved)
    if (id && id.trim() !== "" && allowDeletion) {
      const accessToken = getTokenLocal() ?? false;
      callLoader(true);

      HTTPService(
        "DELETE",
        UrlConstant.base_url + UrlConstant.file_resource + id + "/",
        "",
        false,
        true,
        accessToken
      )
        .then((res) => {
          if (res.status === 204) {
            callLoader(false);

            if (type === "file") {
              setUploadedFiles((prev) => prev.filter((item) => item.id !== id));
            } else if (type === "youtube") {
              setVideoFiles((prev) => prev.filter((item) => item.id !== id));
            } else if (type === "pdf") {
              setPdfFiles((prev) => prev.filter((item) => item.id !== id));
            } else if (type === "website") {
              setWebsites((prev) => prev.filter((item) => item.id !== id));
            } else if (type === "api") {
              setApiLinks((prev) => prev.filter((item) => item.id !== id));
            } else if (type === "s3") {
              setS3Files((prev) => prev.filter((item) => item.id !== id));
            } else if (type === "google_drive") {
              setGoogleDriveFiles((prev) =>
                prev.filter((item) => item.id !== id)
              );
            } else if (type === "dropbox") {
              setDropboxFiles((prev) => prev.filter((item) => item.id !== id));
            } else if (type === "azure_blob") {
              setAzureBlobFiles((prev) =>
                prev.filter((item) => item.id !== id)
              );
            }
          }
        })
        .catch((e) => {
          console.log(e);
          callLoader(false);
        });
    } else if (id && id.trim() !== "") {
      callToast(
        "File cannot be deleted, a resource must have at least one file",
        "error",
        true
      );
    } else {
      switch (type) {
        case "file":
        case "application/pdf":
          setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
          setKey((prev) => prev + 1);
          break;
        case "youtube":
          setVideoFiles((prev) => prev.filter((_, i) => i !== index));
          setKey((prev) => prev + 1);
          break;
        case "pdf":
          setPdfFiles((prev) => prev.filter((_, i) => i !== index));
          setKey((prev) => prev + 1);
          break;
        case "website":
          setWebsites((prev) => prev.filter((_, i) => i !== index));
          setKey((prev) => prev + 1);
          break;
        case "api":
          setApiLinks((prev) => prev.filter((_, i) => i !== index));
          setKey((prev) => prev + 1);
          break;
        case "s3":
          setS3Files((prev) => prev.filter((_, i) => i !== index));
          setKey((prev) => prev + 1);
          break;
        case "google_drive":
          setGoogleDriveFiles((prev) => prev.filter((_, i) => i !== index));
          setKey((prev) => prev + 1);
          break;
        case "dropbox":
          setDropboxFiles((prev) => prev.filter((_, i) => i !== index));
          setKey((prev) => prev + 1);
          break;
        case "azure_blob":
          setAzureBlobFiles((prev) => prev.filter((_, i) => i !== index));
          setKey((prev) => prev + 1);
          break;
        default:
          break;
      }
    }
  };
  const getAccordionDataForLinks = () => {
    const prepareFile = (data, type) => {
      if (data && type === "file_upload") {
        let arr = data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              // size={null}
              id={item?.id}
              handleDelete={handleDelete}
              type={item?.type}
              showDeleteIcon={true}
              iconcolor={"#424242"}
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
              id={item?.id}
              handleDelete={handleDelete}
              type={item?.type}
              showDeleteIcon={true}
              iconcolor={"#424242"}
            />
          );
        });
        return arr;
      } else if (data && type === "video_file") {
        let arr = data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              // size={null}
              id={item?.id}
              handleDelete={handleDelete}
              type={item?.type}
              showDeleteIcon={true}
              iconcolor={"#424242"}
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
              id={item?.id}
              handleDelete={handleDelete}
              type={item?.type}
              showDeleteIcon={true}
              iconcolor={"#424242"}
            />
          );
        });
        return arr;
      } else if (data && type === "apis") {
        let arr = data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              // size={null}
              id={item?.id}
              handleDelete={handleDelete}
              type={item?.type}
              showDeleteIcon={true}
              iconcolor={"#424242"}
            />
          );
        });
        return arr;
      } else if (data && type === "s3") {
        return data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              id={item?.id}
              handleDelete={handleDelete}
              type={item?.type}
              showDeleteIcon={true}
              iconcolor={"#424242"}
            />
          );
        });
      } else if (data && type === "google_drive") {
        return data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              id={item?.id}
              handleDelete={handleDelete}
              type={item?.type}
              showDeleteIcon={true}
              iconcolor={"#424242"}
            />
          );
        });
      } else if (data && type === "dropbox") {
        return data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              id={item?.id}
              handleDelete={handleDelete}
              type={item?.type}
              showDeleteIcon={true}
              iconcolor={"#424242"}
            />
          );
        });
      } else if (data && type === "azure_blob") {
        return data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={item?.url ? item.url : tempFileName}
              id={item?.id}
              handleDelete={handleDelete}
              type={item?.type}
              showDeleteIcon={true}
              iconcolor={"#424242"}
            />
          );
        });
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
      const data = [
        {
          panel: 1,
          title: (
            <>
              Uploaded Files
              {uploadedFiles?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {uploadedFiles?.length} )
                </span>
              ) : (
                <></>
              )}
            </>
          ),
          details:
            uploadedFiles?.length > 0
              ? prepareFile(uploadedFiles, "file_upload")
              : [<EmptyFile text={"You have not uploaded any file"} />],
        },
        {
          panel: 2,
          title: (
            <>
              Urls
              {pdfFiles?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {pdfFiles?.length} )
                </span>
              ) : (
                <></>
              )}
            </>
          ),
          details:
            pdfFiles?.length > 0
              ? prepareFile(pdfFiles, "pdf_file")
              : [<EmptyFile text={"You have not uploaded any pdf file"} />],
        },
        {
          panel: 3,
          title: (
            <>
              Youtube Videos
              {videoFiles?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {videoFiles?.length} )
                </span>
              ) : (
                <></>
              )}
            </>
          ),
          details:
            videoFiles?.length > 0
              ? prepareFile(videoFiles, "video_file")
              : [<EmptyFile text={"You have not uploaded any video"} />],
        },
        {
          panel: 4,
          title: (
            <>
              APIs
              {apiLinks?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {apiLinks?.length} )
                </span>
              ) : (
                <></>
              )}
            </>
          ),
          details:
            apiLinks?.length > 0
              ? prepareFile(apiLinks, "apis")
              : [<EmptyFile text={"You have not uploaded any api url"} />],
        },
        {
          panel: 5,
          title: (
            <>
              Websites
              {websites?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {websites?.length} )
                </span>
              ) : (
                <></>
              )}
            </>
          ),
          details:
            websites?.length > 0
              ? prepareFile(websites, "websites")
              : [<EmptyFile text={"You have not uploaded any website url"} />],
        },
        {
          panel: 6,
          title: (
            <>
              S3 Files
              {s3Files?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {s3Files?.length})
                </span>
              ) : null}
            </>
          ),
          details:
            s3Files?.length > 0
              ? s3Files.map((file, index) => (
                  <File
                    key={index}
                    index={index}
                    name={file?.file_name ? file.file_name : file.url}
                    id={file?.id ?? ""}
                    url={file?.file_url ? file?.file_url : file.url}
                    type={file.type || "s3"}
                    handleDelete={handleDelete}
                    showDeleteIcon={true}
                    iconcolor={"#424242"}
                  />
                ))
              : [<EmptyFile text={"No S3 files fetched yet."} />],
        },
        {
          panel: 7,
          title: (
            <>
              Google Drive Files
              {googleDriveFiles?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {googleDriveFiles?.length} )
                </span>
              ) : (
                <></>
              )}
            </>
          ),
          details:
            googleDriveFiles?.length > 0
              ? googleDriveFiles.map((file, index) => (
                  <File
                    key={index}
                    index={index}
                    name={file?.file_name ? file.file_name : file.url}
                    id={file?.id ?? ""}
                    url={file?.file_url ? file?.file_url : file.url}
                    type={file.type || "google_drive"}
                    handleDelete={handleDelete}
                    showDeleteIcon={true}
                    iconcolor={"#424242"}
                  />
                ))
              : [
                  <EmptyFile
                    text={"You have not uploaded any Google Drive files"}
                  />,
                ],
        },
        {
          panel: 8,
          title: (
            <>
              Dropbox Files
              {dropboxFiles?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {dropboxFiles?.length})
                </span>
              ) : null}
            </>
          ),
          details:
            dropboxFiles?.length > 0 ? (
              // prepareFile(dropboxFiles, "dropbox")
              dropboxFiles.map((file, index) => (
                <File
                  key={index}
                  index={index}
                  name={file?.file_name ? file.file_name : file.url}
                  id={file?.id ?? ""}
                  url={file?.file_url ? file?.file_url : file.url}
                  type={file.type || "dropbox"}
                  handleDelete={handleDelete}
                  showDeleteIcon={true}
                  iconcolor={"#424242"}
                />
              ))
            ) : (
              <EmptyFile text="You have not uploaded any Dropbox files" />
            ),
        },
        {
          panel: 9,
          title: (
            <>
              Azure Blob Files
              {azureBlobFiles?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {azureBlobFiles?.length} )
                </span>
              ) : (
                <></>
              )}
            </>
          ),
          details:
            azureBlobFiles?.length > 0
              ? prepareFile(azureBlobFiles, "azure_blob")
              : [
                  <EmptyFile
                    text={"You have not uploaded any Azure Blob files"}
                  />,
                ],
        },
      ];

      return data;
    } else {
      return [];
    }
  };

  const isDisabled = () => {
    if (
      resourceName &&
      resourceDescription &&
      (uploadedFiles?.length ||
        pdfFiles?.length ||
        videoFiles?.length ||
        apiLinks?.length ||
        websites?.length ||
        s3Files?.length ||
        googleDriveFiles?.length ||
        dropboxFiles?.length ||
        eachFileDetailData?.url)
      // subCategoryIds?.length
    ) {
      return false;
    } else {
      return true;
    }
  };
  const handleClickRoutes = () => {
    if (isLoggedInUserParticipant() && getTokenLocal()) {
      return "/participant/resources";
    } else if (
      isLoggedInUserAdmin() ||
      (isLoggedInUserCoSteward() && getTokenLocal())
    ) {
      return "/datahub/resources";
    }
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getUpdatedFile = async (fileItem) => {
    let bodyFormData = new FormData();
    let state = checkAnyStateSelected() ?? "";

    let category = {
      district: "",
      country: localStorage.getItem("resource_country") ?? "",
      state: state,
      sub_category_id: subCategoryIds[0] ?? "",
      category_id: categoriesSelected[0] ?? "",
    };
    bodyFormData.append("category", JSON.stringify(category));

    if (typeSelected === "file") {
      bodyFormData.append("resource", props.resourceId);
      bodyFormData.append("file", "");
      bodyFormData.delete("file");
      bodyFormData.append("file", fileItem);
      bodyFormData.append("type", "file");
    } else {
      bodyFormData.append("resource", props.resourceId);
      bodyFormData.append("url", fileItem.url);
      bodyFormData.append("transcription", fileItem?.transcription ?? "");
      bodyFormData.append(
        "type",
        typeSelected === "video" ? "youtube" : typeSelected
      );
    }
    setFileSizeError("");
    let accessToken = getTokenLocal() ? getTokenLocal() : false;

    try {
      const response = await HTTPService(
        "POST",
        UrlConstant.base_url + UrlConstant.file_resource,
        bodyFormData,
        true,
        true,
        accessToken
      );
      if (typeSelected === "file") {
        setUploadedFiles((prev) => [...prev, response.data]);
      } else if (typeSelected === "video") {
        setVideoFiles((prev) => [...prev, response.data]);
      } else if (typeSelected === "pdf") {
        setPdfFiles((prev) => [...prev, response.data]);
      } else if (typeSelected === "website") {
        setWebsites((prev) => [...prev, response.data]);
      } else if (typeSelected === "s3") {
        setS3Files((prev) => [...prev, response.data]);
      } else if (typeSelected === "google_drive") {
        setGoogleDriveFiles((prev) => [...prev, response.data]);
      } else if (typeSelected === "dropbox") {
        setDropboxFiles((prev) => [...prev, response.data]);
      }
      setEachFileDetailData({
        url: "",
        transcription: "",
        type: typeSelected,
      });
      // await sleep(5000);
      callLoader(false);
      callToast("file uploaded successfully", "success", true);
      return response?.data;
    } catch (error) {
      console.log(error);
      callLoader(false);
      callToast("something went wrong while uploading the file", "error", true);
    }
  };

  const handleFileUpdates = async (files) => {
    const tempFiles = [];

    for (const fileItem of files) {
      const updatedFile = await getUpdatedFile(fileItem); // Assuming getUpdatedFile returns a promise
      tempFiles.push(updatedFile);
      await sleep(5000); // Wait for 5 seconds after each call
    }

    // Use tempFiles as needed here
    console.log("Updated files:", tempFiles);
  };
  const handleFileChange = async (file) => {
    callLoader(true);
    setIsSizeError(false);
    setFile(file);
    setKey(key + 1);
    let tempFiles = [...uploadedFiles];
    let s = [...file]?.forEach((f) => {
      if (!(f?.name.length > 85)) {
        f.file = "/" + f?.name;
        f.file_size = f?.size;
        tempFiles.push(f);
        return true;
      } else {
        callToast(
          "File name shouldn't be more than 85 characters.",
          "error",
          true
        );
        return false;
      }
    });
    if (props.resourceId) {
      let tempFiles = [];
      [...file].map((fileItem) => tempFiles.push(getUpdatedFile(fileItem)));

      callLoader(true);
      Promise.all(tempFiles)
        .then((results) => {
          // results will comes in type of array
          callLoader(false);
          getResource();
          console.log(results);
        })
        .catch((err) => {
          callLoader(false);
          console.log(err);
        });
    }
    if (!props.resourceId) {
      setTimeout(() => {
        callLoader(false);
      }, 2000);
    }
    setUploadedFiles(tempFiles);
    setFileSizeError("");
  };

  const handleCheckBox = (categoryId, subCategoryId) => {
    setUpdate((prev) => prev + 1);
    setSubCategoryIds((prevIds) => {
      // Check if the subCategoryId is already in the array
      if (prevIds.includes(subCategoryId)) {
        // Remove the subCategoryId
        return prevIds.filter((id) => id !== subCategoryId);
      } else {
        // Add the subCategoryId
        return [...prevIds, subCategoryId];
      }
    });
  };

  function takeoutAllId(data) {
    const ids = [];
    for (let i = 0; i < data.length; i++) {
      ids.push(data[i].id);
    }
    return ids;
  }

  const getResource = async () => {
    callLoader(true);
    await HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.resource_endpoint + id + "/",
      "",
      false,
      userType == "guest" ? false : true
    )
      .then((response) => {
        callLoader(false);
        setResourceName(response.data?.title);
        setResourceDescription(response.data?.description);
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
        setCategories(response?.data?.categories);
        setCategoriesSelected(takeoutAllId(response?.data?.categories));
        const updateSubCategoryIds = () => {
          const ids = new Set(
            response?.data?.categories?.flatMap((category) =>
              category.subcategories.map((subcategory) => subcategory.id)
            )
          );
          setSubCategoryIds([...ids]);
        };
        updateSubCategoryIds();
      })
      .catch(async (e) => {
        callLoader(false);
        console.log(e);
        let error = await GetErrorHandlingRoute(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong while loading dataset",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };
  // Suppose 'fetchedFiles' is what your API just returned
  function handleFetchComplete(fetchedFiles) {
    // Create a Set of existing file URLs or IDs
    const existingUrls = new Set(googleDriveFiles.map((f) => f.file_url));

    // Filter out any file whose URL is already in `googleDriveFiles`
    const newOnly = fetchedFiles.filter((f) => !existingUrls.has(f.file_url));

    // Then set ONLY new files to your modal data
    setCloudModalData(newOnly);
    setShowCloudModal(true);
  }

  function removeDuplicatesByURLorID(files) {
    const seen = new Set();
    return files.filter((file) => {
      const key = file.id || file.file_url;
      if (!key) return true; // if no unique property, just keep it
      if (seen.has(key)) {
        return false; // already in seen => skip
      } else {
        seen.add(key);
        return true;
      }
    });
  }

  const handleCloudFileSelection = async (selectedFiles, cloudType) => {
    if (props.resourceId) {
      // EDIT scenario: we immediately upload to the backend
      callLoader(true);

      const uploadPromises = selectedFiles.map((fileItem) =>
        getUpdatedFile({
          url: fileItem.file_url,
          type: cloudType, // "s3", "google_drive", or "dropbox"
        })
      );

      try {
        const uploadedResults = await Promise.all(uploadPromises);

        // Now we have brand new file objects from the server (with real IDs).
        // Merge them with what we already have, then deduplicate:

        if (cloudType === "s3") {
          setS3Files((prev) => {
            const merged = [...prev, ...uploadedResults];
            const unique = removeDuplicatesByURLorID(merged);
            return unique;
          });
        } else if (cloudType === "google_drive") {
          setGoogleDriveFiles((prev) => {
            const merged = [...prev, ...uploadedResults];
            const unique = removeDuplicatesByURLorID(merged);
            return unique;
          });
        } else if (cloudType === "dropbox") {
          setDropboxFiles((prev) => {
            const merged = [...prev, ...uploadedResults];
            const unique = removeDuplicatesByURLorID(merged);
            return unique;
          });
        }
      } catch (err) {
        console.error(`Error uploading ${cloudType} files: `, err);
        callToast(`Failed to upload ${cloudType} files`, "error", true);
      } finally {
        callLoader(false);
        setShowCloudModal(false);
      }
    } else {
      // CREATE scenario: just store in local state
      // We'll upload them on final "Publish."

      if (cloudType === "s3") {
        setS3Files((prev) => {
          const merged = [...prev, ...selectedFiles];
          const unique = removeDuplicatesByURLorID(merged);
          return unique;
        });
      } else if (cloudType === "google_drive") {
        setGoogleDriveFiles((prev) => {
          const merged = [...prev, ...selectedFiles];
          const unique = removeDuplicatesByURLorID(merged);
          return unique;
        });
      } else if (cloudType === "dropbox") {
        setDropboxFiles((prev) => {
          const merged = [...prev, ...selectedFiles];
          const unique = removeDuplicatesByURLorID(merged);
          return unique;
        });
      }

      setShowCloudModal(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    handleChangeType({ target: { value: newValue } });
  };

  //type chager for resource types video/pdf
  const handleChangeType = (event) => {
    const newValue = event.target.value;
    setTypeSelected(newValue);
    setEachFileDetailData({
      url: "",
      transcription: "",
      type: newValue,
    });
  };

  const handleClickAddMore = () => {
    if (eachFileDetailData?.type === "youtube" && selectedVideos?.length) {
      let tempVideos = selectedVideos.map((item) => {
        let temp = {
          url: item,
          transcription: "",
          type: "youtube",
        };
        return temp;
      });
      setVideoFiles([...videoFiles, ...tempVideos]);
      // setVideoFiles([...videoFiles, eachFileDetailData]);
    } else if (eachFileDetailData?.type === "pdf") {
      setPdfFiles([...pdfFiles, eachFileDetailData]);
    } else if (eachFileDetailData?.type === "website") {
      setWebsites([...websites, eachFileDetailData]);
    }

    setEachFileDetailData({
      url: "",
      transcription: "",
      type: typeSelected,
    });
  };

  function checkAnyStateSelected() {
    for (let i = 0; i < listCategories?.length; i++) {
      if (
        listCategories[i].name.toLowerCase() === "states" &&
        categoriesSelected.includes(listCategories[i].id)
      ) {
        const foundSubCat = listCategories[i].subcategories?.find(
          (eachSubCat) => subCategoryIds.includes(eachSubCat?.id)
        );
        if (foundSubCat) {
          return foundSubCat?.id; // Return the found ID
        }
      }
    }
    return ""; // Return null if no match is found
  }

  const handleSubmit = async () => {
    let bodyFormData = new FormData();

    bodyFormData.append("title", resourceName);
    bodyFormData.append("description", resourceDescription);
    let state = checkAnyStateSelected() ?? "";
    console.log("🚀 ~ handleSubmit ~ state:", state);
    // let category = '{"district": "", "country": "Kenya", "state": "", "sub_category_id": "dfef488f-539d-4fcf-8e15-660423e9387b", "category_id": "184640cd-3954-4e18-bee3-e0f6e3ff446c"}'
    // bodyFormData.append("category", JSON.stringify(categories));
    let category = {
      district: "",
      country: localStorage.getItem("resource_country") ?? "",
      state: state,
      sub_category_id: "",
      category_id: "",
    };
    bodyFormData.append("category", JSON.stringify(category));

    !props.resourceId &&
      bodyFormData.append("sub_categories_map", JSON.stringify({}));

    let body = {};

    let arr = [];
    console.log(uploadedFiles, "uploaded file");

    if (!props.resourceId || tempIdForAddMoreResourceUrl) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        console.log(uploadedFiles[i], "uploaded file");
        if (uploadedFiles[i]?.file) {
          bodyFormData.append("files", uploadedFiles[i]);
        }
      }
      for (let i = 0; i < videoFiles?.length; i++) {
        if (videoFiles[i]) {
          let obj = {
            type: videoFiles[i]?.type,
            url: videoFiles[i]?.url,
            transcription: videoFiles[i]?.transcription,
          };
          arr.push(obj);
        }
      }
      for (let i = 0; i < pdfFiles?.length; i++) {
        if (pdfFiles[i]) {
          let obj = {
            type: pdfFiles[i]?.type,
            url: pdfFiles[i]?.url,
            transcription: pdfFiles[i]?.transcription,
          };
          arr.push(obj);
        }
      }
      for (let i = 0; i < websites?.length; i++) {
        if (websites[i]) {
          let obj = {
            type: websites[i]?.type,
            url: websites[i]?.url,
          };
          arr.push(obj);
        }
      }
      for (let i = 0; i < apiLinks?.length; i++) {
        if (apiLinks[i]) {
          let obj = {
            type: apiLinks[i]?.type,
            file: apiLinks[i]?.url,
          };
          arr.push(obj);
        }
      }
      // checking for last file which is in input
      if (eachFileDetailData?.url) {
        arr.push({
          type: eachFileDetailData?.type,
          url: eachFileDetailData?.url,
          transcription: eachFileDetailData?.transcription,
        });
      }
    }
    for (let i = 0; i < s3Files?.length; i++) {
      if (s3Files[i]?.file_url) {
        // Ensure file_url exists
        arr.push({
          type: "s3", // Add type for S3 files
          url: s3Files[i].file_url, // Use the correct key for the URL // Default to an empty string if transcription is missing
        });
      } else {
        console.warn(`Missing file_url in s3Files at index ${i}`, s3Files[i]);
      }
    }
    for (let i = 0; i < googleDriveFiles?.length; i++) {
      if (googleDriveFiles[i]?.file_url) {
        arr.push({
          type: "google_drive",
          url: googleDriveFiles[i]?.file_url,
        });
      }
    }
    for (let i = 0; i < dropboxFiles?.length; i++) {
      if (dropboxFiles[i]?.file_url) {
        arr.push({
          type: "dropbox",
          url: dropboxFiles[i]?.file_url,
        });
      }
    }
    const uploadFilesStringfy = JSON.stringify(arr);

    bodyFormData.append("uploaded_files", uploadFilesStringfy);
    bodyFormData.append(
      "country",
      JSON.stringify(localStorage.getItem("resource_country") ?? {})
    );

    let accessToken = getTokenLocal() ?? false;
    callLoader(true);
    let url = props.resourceId
      ? UrlConstant.base_url + UrlConstant.resource_endpoint + id + "/"
      : UrlConstant.base_url + UrlConstant.resource_endpoint;

    HTTPService(
      props.resourceId ? "PUT" : "POST",
      url,
      bodyFormData,
      true,
      true,
      accessToken
    )
      .then((res) => {
        callLoader(false);
        if (props.resourceId) {
          callToast("Resource updated successfully!", "success", true);
        } else {
          callToast("Resource added successfully!", "success", true);
        }
        setEachFileDetailData({
          url: "",
          transcription: "",
          type: typeSelected ?? "pdf",
        });
        history.push(handleClickRoutes());
        // setUploadedFiles([...]);
      })
      .catch((err) => {
        callLoader(false);
        const returnValues = GetErrorKey(err, Object.keys(body));
        console.log(returnValues, "keyss");
        const errorKeys = returnValues[0];
        const errorMessages = returnValues[1];
        console.log(errorKeys, "keyss");
        if (errorKeys.length > 0) {
          for (let i = 0; i < errorKeys.length; i++) {
            console.log(errorKeys, "keyss");
            switch (errorKeys[i]) {
              case "title":
                setErrorResourceName(errorMessages[i]);
                break;
              case "description":
                setErrorResourceDescription(errorMessages[i]);
                break;
              default:
                let response = GetErrorHandlingRoute(err);
                if (response.toast) {
                  //callToast(message, type, action)
                  callToast(
                    response?.message ?? response?.data?.detail ?? "Unknown",
                    response.status == 200 ? "success" : "error",
                    response.toast
                  );
                }
                break;
            }
          }
        } else {
          let response = GetErrorHandlingRoute(err);
          console.log("responce in err", response);
          if (response.toast) {
            callToast(
              response?.message ?? response?.data?.detail ?? "Unknown",
              response.status == 200 ? "success" : "error",
              response.toast
            );
          }
          if (response.path) {
            history.push(response.path);
          }
        }
      });
  };

  const getAllCategoryAndSubCategory = () => {
    let url = UrlConstant.base_url + UrlConstant.list_category;
    let checkforAccess = getTokenLocal() ?? false;
    HTTPService("GET", url, "", true, true, checkforAccess)
      .then((response) => {
        setListCategories(response?.data);
      })
      .catch(async (e) => {
        let error = await GetErrorHandlingRoute(e);
        console.log(e);
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

  const getPanel = () => {
    if (typeSelected === "file") {
      return 1;
    } else if (typeSelected === "pdf") {
      return 2;
    } else if (typeSelected === "video") {
      return 3;
    } else if (typeSelected === "api") {
      return 4;
    } else if (typeSelected === "website") {
      return 5;
    } else if (typeSelected === "s3") {
      return 6;
    } else if (typeSelected === "google_drive") {
      return 7;
    } else if (typeSelected === "dropbox") {
      return 8;
    } else if (typeSelected === "azure_blob") {
      return 9;
    }
  };
  const handleExport = () => {
    let body = {
      title: resourceName,
      url: api.trim(),
      file_name: exportFileName.trim(),
      source: "api",
      auth_type: authType,
    };
    if (props.resourceId) {
      body["resource"] = props.resourceId;
    }
    if (authType === "NO_AUTH") {
      // do nothing for now
    } else if (authType === "API_KEY" && authApiKeyName && authApiKeyValue) {
      body["api_key_name"] = authApiKeyName.trim();
      body["api_key_value"] = authApiKeyValue.trim();
    } else if (authType === "BEARER") {
      body["token"] = authToken.trim();
    }
    let accessToken = getTokenLocal() ?? false;
    callLoader(true);
    HTTPService(
      "POST",
      UrlConstant.base_url + UrlConstant.resource_live_api,
      body,
      false,
      true,
      accessToken
    )
      .then((res) => {
        console.log("🚀 ~ .then ~ res:", res);
        callLoader(false);
        if (props.resourceId) {
          setApiLinks([...apiLinks, res.data]);
        } else {
          if (eachFileDetailData?.type === "api") {
            let temp = {
              url: res?.data,
              transcription: "",
              type: "api",
            };
            setApiLinks([...apiLinks, temp]);
          }
        }
      })
      .catch((err) => {
        callLoader(false);
        console.log(err);
        callToast(err.response?.data?.message, "error", true);
      });
  };

  const fetchVideos = async () => {
    let url =
      UrlConstant.base_url +
      UrlConstant.resource_fetch_videos +
      eachFileDetailData.url;
    let checkforAccess = getTokenLocal() ?? false;
    callLoader(true);
    HTTPService("GET", url, "", true, true, checkforAccess)
      .then((response) => { 
        callLoader(false);
        setAllVideos(response?.data);
        setSelectedVideos(response?.data?.map((video) => video.url));
        setShowModal(true);
      })
      .catch(async (e) => {
        let error = await GetErrorHandlingRoute(e);
        console.log(e);
        callLoader(false);
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

  const handleCheckboxChange = (videoUrl) => {
    if (selectedVideos.includes(videoUrl)) {
      setSelectedVideos(selectedVideos.filter((id) => id !== videoUrl));
    } else {
      setSelectedVideos([...selectedVideos, videoUrl]);
    }
  };
  const handleMasterCheckboxChange = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedVideos(allVideos?.map((video) => video.url));
    } else {
      setSelectedVideos([]);
    }
  };

  const handleVideoUpload = () => {
    let tempFiles = [];
    [...selectedVideos].map((item) => {
      let temp = {
        url: item,
        transcription: "",
        type: "youtube",
      };
      tempFiles.push(getUpdatedFile(temp));
    });
    callLoader(true);
    Promise.all(tempFiles)
      .then((results) => {
        callLoader(false);
        getResource();
        console.log(results);
      })
      .catch((err) => {
        callLoader(false);
        console.log(err);
      });
  };
  useEffect(() => {
    if (id || props.resourceId) {
      getResource();
    }
  }, []);

  useEffect(() => {
    getAllCategoryAndSubCategory();
  }, []);

  // console.log(categoriesSelected, "categoriesSelected");

  // function checkAllSubCatsRemoved() {}

  useEffect(() => {
    const updateCheckBox = () => {
      let tempCategories = [];
      let mainCategoryPresent = false;
      let tempArray = [];
      let temp = listCategories?.forEach((data, index) => {
        let prepareCheckbox = [];

        prepareCheckbox = data?.subcategories?.map((subCategory, ind) => {
          // Find if the subcategory exists in the categories array and its subcategories
          const isPresent = subCategoryIds.includes(subCategory.id);
          if (isPresent) {
            if (!tempArray.includes(data.id)) {
              tempArray.push(data.id);
            }

            // setCategoriesSelected([...categoriesSelected, data.id]);
            mainCategoryPresent = true;
          }
          return (
            <CheckBoxWithTypo
              key={ind}
              text={subCategory?.name}
              keyIndex={ind}
              categoryId={data?.id}
              subCategoryId={subCategory?.id}
              checked={isPresent}
              categoryKeyName={data?.name}
              keyName={subCategory?.name}
              handleCheckBox={handleCheckBox}
              customColor={{
                color: "rgba(0, 0, 0, 0.6) !important",
                checked: "#637381 !important",
              }}
              fontSize={"12px"}
            />
          );
        });

        let obj = {
          panel: index + 1,
          title: data.name,
          details: prepareCheckbox ? prepareCheckbox : [],
        };
        tempCategories = tempCategories.concat(obj);
      });
      setCategoriesSelected(tempArray);
      setAllCategories(tempCategories);
    };
    updateCheckBox();
  }, [listCategories, subCategoryIds]);

  const renderChips = (categories, subCategoryIds) => {
    // Check if categories exist and if not, return an empty array
    if (!categories) return [];

    // Use reduce to accumulate the chips
    return categories.reduce((chips, category) => {
      // Ensure subcategories exist
      if (category?.subcategories) {
        category.subcategories.forEach((subCategory) => {
          if (subCategoryIds.includes(subCategory.id)) {
            chips.push(
              <Chip
                key={subCategory.id}
                label={subCategory.name}
                // sx={{ backgroundColor: "white", color: "00a94f" }}
                variant="outlined"
                color="success"
              />
            );
          }
        });
      }
      return chips;
    }, []); // Initialize the accumulator as an empty array
  };

  const handleSourceSubmit = (sourceType, details) => {
    // Perform logic based on the source type (e.g., S3, Google Drive, etc.)
    // console.log(sourceType, details);
    setCloudModalData([
      {
        id: 1,
        file: "s3_file_1.pdf",
        url: "https://s3.amazonaws.com/s3_file_1.pdf",
        type: "pdf",
      },
      {
        id: 2,
        file: "s3_file_2.pdf",
        url: "https://s3.amazonaws.com/s3_file_2.pdf",
        type: "pdf",
      },
    ]);
    setShowCloudModal(true);
    // For example, you might upload files or save the URL information based on the source
    // You can also push the files or URLs to the corresponding arrays, like `uploadedFiles`, `pdfFiles`, etc.
  };

  const renderSourceForm = () => {
    switch (selectedSource) {
      case "s3":
        return <S3Form onSubmit={handleSourceSubmit} setS3Files={setS3Files} />;
      case "google_drive":
        return (
          <GoogleDriveForm
            onSubmit={handleSourceSubmit}
            setGoogleDriveFiles={setGoogleDriveFiles}
          />
        );
      case "dropbox":
        return (
          <DropboxForm
            onSubmit={handleSourceSubmit}
            setDropboxFiles={setDropboxFiles}
          />
        );
      case "azure_blob":
        return <AzureBlobForm onSubmit={handleSourceSubmit} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={containerStyle}>
      <Box
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "space-between",
          textAlign: "left",

          padding: "10px",
        }}
      >
        <div
          style={{
            width: "50%",
            // border: "0.5px solid",
            borderRadius: "5px",
            padding: "10px",
            background: "white",
          }}
        >
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Tabs
              value={typeSelected}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              aria-label="content type tabs"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#00a94f",
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                },
                "& .Mui-selected": {
                  color: "#00a94f !important", // Selected tab text color
                },
                marginBottom: "10px",
              }}
            >
              <Tab
                label={
                  <div style={{ display: "flex", gap: "5px" }}>
                    <FaUpload />
                    Upload
                  </div>
                }
                value="file"
              />
              <Tab
                label={
                  <div style={{ display: "flex", gap: "5px" }}>
                    <FaFilePdf />
                    Pdf
                  </div>
                }
                value="pdf"
              />

              <Tab
                label={
                  <div style={{ display: "flex", gap: "5px" }}>
                    <FaYoutube />
                    Youtube
                  </div>
                }
                value="video"
              />

              <Tab
                label={
                  <div style={{ display: "flex", gap: "5px" }}>
                    <TbApi />
                    API
                  </div>
                }
                value="api"
              />

              <Tab
                label={
                  <div style={{ display: "flex", gap: "5px" }}>
                    <CgWebsite />
                    Website
                  </div>
                }
                value="website"
              />
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <FaCloud />
                    S3
                  </div>
                }
                value="s3"
              />
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <FaGoogle />
                    Google Drive
                  </div>
                }
                value="google_drive"
              />
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <FaDropbox />
                    Dropbox
                  </div>
                }
                value="dropbox"
              />
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <FaCloudUploadAlt />
                    Azure
                  </div>
                }
                value="azure_blob"
              />
            </Tabs>
          </Box>

          {typeSelected == "file" ? (
            <Box
              className="mt-10 mb-10"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                // width: 300,
                padding: 5,
                boxShadow: 2,
                borderRadius: 2,
                backgroundColor: "background.paper",
                marginBottom: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Montserrat !important",
                  fontWeight: "600",
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#212B36",
                  textAlign: "left",
                }}
              >
                Upload
              </Typography>
              <FileUploader
                sx={{ width: "80%" }}
                id="add-dataset-upload-file-id"
                key={key}
                name="file"
                handleChange={handleFileChange}
                multiple={true}
                maxSize={50}
                onSizeError={(file) => {
                  // console.log(file, "something");
                  setIsSizeError(true);
                }}
                children={<FileUploaderTest texts={"Drop files here"} />}
                types={fileTypes}
              />
            </Box>
          ) : null}
          {typeSelected == "pdf" ||
          typeSelected === "video" ||
          typeSelected === "website" ? (
            <Box
              className="mt-10"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                // width: 300,
                padding: 5,
                boxShadow: 2,
                borderRadius: 2,
                backgroundColor: "background.paper",
                marginBottom: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Montserrat !important",
                  fontWeight: "600",
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#212B36",
                  textAlign: "left",
                }}
              >
                {typeSelected == "pdf"
                  ? "PDF or DOC file details"
                  : typeSelected == "video"
                  ? "Youtube Link"
                  : "Website Link"}
              </Typography>
              <TextField
                // fullWidth
                size="small"
                sx={{
                  marginTop: "10px",
                  borderRadius: "8px",
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#919EAB",
                    },
                    "&:hover fieldset": {
                      borderColor: "#919EAB",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#919EAB",
                    },
                  },
                }}
                placeholder={
                  typeSelected == "pdf"
                    ? "Enter URL for PDF or DOC file"
                    : typeSelected == "video"
                    ? "Enter youtube link here"
                    : "Enter webiste link here"
                }
                label={
                  typeSelected == "pdf"
                    ? "Enter URL for PDF or DOC file"
                    : typeSelected == "video"
                    ? "Enter youtube link here"
                    : "Enter webiste link here"
                }
                value={eachFileDetailData.url}
                required
                onChange={(e) => {
                  // setErrorResourceName("");
                  const inputValue = e.target.value;

                  if (
                    !/\s/.test(inputValue) &&
                    inputValue.length <= limitChar
                  ) {
                    setEachFileDetailData({
                      ...eachFileDetailData,
                      url: inputValue.trim(),
                      type: typeSelected === "video" ? "youtube" : typeSelected,
                    });
                  }
                }}
                id="add-dataset-name"
              />

              {!props.resourceId &&
                typeSelected !== "api" &&
                typeSelected !== "s3" &&
                typeSelected !== "google_drive" &&
                typeSelected !== "dropbox" &&
                typeSelected !== "azure_blob" &&
                typeSelected !== "file" &&
                typeSelected !== "video" && (
                  <Box className="text-left">
                    <Button
                      type="secondary"
                      disabled={eachFileDetailData.url ? false : true}
                      icon={<PoweroffOutlined />}
                      onClick={() => handleClickAddMore()}
                      sx={{
                        fontFamily: "Montserrat",
                        fontWeight: 700,
                        fontSize: "14px",
                        width: "fit-content",
                        height: "40px",
                        background: "#00A94F",
                        borderRadius: "8px",
                        textTransform: "none",
                        // marginLeft: "25px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#008b3d",
                          boxShadow: "0px 4px 15px rgba(0, 171, 85, 0.4)",
                          color: "#ffffff",
                        },
                        "&:disabled": {
                          backgroundColor: "#d0d0d0",
                          color: "#ffffff",
                        },
                        color: "white",
                        border: "00A94F",
                      }}
                      variant="contained"
                    >
                      Add
                    </Button>
                  </Box>
                )}
              {/* {typeSelected !== "pdf" && (
                  <TextField
                    id="add-dataset-description"
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={4}
                    sx={{
                      marginTop: "12px",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#919EAB",
                        },
                        "&:hover fieldset": {
                          borderColor: "#919EAB",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#919EAB",
                        },
                      },
                    }}
                    placeholder={
                      "Enter transcription/description for the video"
                    }
                    label={"Enter transcription/description for the video"}
                    value={eachFileDetailData.transcription}
                    required
                    onChange={(e) => {
                      setErrorResourceDescription("");
                      if (e.target.value.toString().length <= limitCharDesc) {
                        setEachFileDetailData({
                          ...eachFileDetailData,
                          transcription: e.target.value.trimStart(),
                        });
                      }
                    }}
                  />
                )} */}
              {typeSelected === "video" && (
                <Box className="">
                  <Button
                    sx={{
                      color: "white",
                      fontFamily: "Montserrat",
                      fontWeight: 700,
                      fontSize: "14px",
                      width: "fit-content",
                      height: "40px",
                      background: "#00A94F",
                      borderRadius: "8px",
                      textTransform: "none",
                      // marginLeft: "25px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#008b3d",
                        boxShadow: "0px 4px 15px rgba(0, 171, 85, 0.4)",
                        color: "#ffffff",
                      },
                      "&:disabled": {
                        backgroundColor: "#d0d0d0",
                        color: "#ffffff",
                      },
                    }}
                    disabled={!eachFileDetailData.url}
                    onClick={fetchVideos}
                    variant="outlined"
                  >
                    Fetch
                  </Button>
                </Box>
              )}
            </Box>
          ) : null}
          {typeSelected == "api" ? (
            <ApiConfiguration
              api={api}
              setApi={setApi}
              authType={authType}
              setAuthType={setAuthType}
              authTypes={authTypes}
              setAuthTypes={setAuthTypes}
              authToken={authToken}
              setAuthToken={setAuthToken}
              authApiKeyName={authApiKeyName}
              setAuthApiKeyName={setAuthApiKeyName}
              authApiKeyValue={authApiKeyValue}
              setAuthApiKeyValue={setAuthApiKeyValue}
              exportFileName={exportFileName}
              setExportFileName={setExportFileName}
              handleExport={handleExport}
              validator={false}
              isContent={true}
            />
          ) : null}
          <div className="mb-2">
            {typeSelected === "s3" && (
              <S3Form
                onSubmit={handleSourceSubmit}
                onFetchComplete={(fetchedFiles) => {
                  setCloudModalData(fetchedFiles);
                }}
                setShowCloudModal={setShowCloudModal}
              />
            )}
            {typeSelected === "google_drive" && (
              <GoogleDriveForm
                onSubmit={handleSourceSubmit}
                onFetchComplete={(fetchedFiles) => {
                  setCloudModalData(fetchedFiles);
                }}
                setShowCloudModal={setShowCloudModal}
              />
            )}
            {typeSelected === "dropbox" && (
              <DropboxForm
                onSubmit={handleSourceSubmit}
                onFetchComplete={(fetchedFiles) => {
                  setCloudModalData(fetchedFiles);
                }}
                setShowCloudModal={setShowCloudModal}
              />
            )}
            {typeSelected === "azure_blob" && (
              <AzureBlobForm onSubmit={handleSourceSubmit} />
            )}
          </div>

          {props.resourceId &&
            typeSelected !== "api" &&
            typeSelected !== "file" &&
            typeSelected !== "video" && (
              <Button
                sx={{
                  color: "white",
                  fontFamily: "Montserrat",
                  fontWeight: 700,
                  fontSize: "14px",
                  width: "fit-content",
                  height: "40px",
                  background: "#00A94F",
                  borderRadius: "8px",
                  textTransform: "none",
                  margin: "25px 50px !important",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#008b3d",
                    boxShadow: "0px 4px 15px rgba(0, 171, 85, 0.4)",
                    color: "#ffffff",
                  },
                  "&:disabled": {
                    backgroundColor: "#d0d0d0",
                    color: "#ffffff",
                  },
                }}
                className={GlobalStyle.primary_button}
                onClick={() => {
                  getUpdatedFile(eachFileDetailData);
                }}
                disabled={
                  typeSelected && (eachFileDetailData.url || file)
                    ? false
                    : true
                }
              >
                Save
              </Button>
            )}

          <ControlledAccordion
            data={getAccordionDataForLinks()}
            isCustomStyle={true}
            // width={mobile || tablet ? "300px" : "500px"}
            titleStyle={accordionTitleStyle}
            selectedPanelIndex={getPanel()}
            isCustomArrowColor={true}
            addHeaderBackground={true}
            headerBackground={"#F6F6F6"}
            isAddContent={true}
          />
        </div>

        <div
          style={{
            width: "50%",
            // border: "0.5px solid",
            borderRadius: "5px",
            padding: "10px",
            height: "fit-content",
            background: "white",
          }}
        >
          <Box className="">
            <TextField
              size="small"
              fullWidth
              sx={{
                marginTop: "58px",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#919EAB",
                  },
                  "&:hover fieldset": {
                    borderColor: "#919EAB",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#919EAB",
                  },
                },
              }}
              placeholder={`${Resource} name should not be more than 100 character`}
              label={`${Resource} Title`}
              value={resourceName}
              required
              onChange={(e) => {
                setErrorResourceName("");
                if (e.target.value.toString().length <= limitChar) {
                  setResourceName(e.target.value.trimStart());
                }
              }}
              id="add-dataset-name"
              error={errorResourceName ? true : false}
              helperText={
                <Typography
                  sx={{
                    fontFamily: "Montserrat !important",
                    fontWeight: "400",
                    fontSize: "12px",
                    lineHeight: "18px",
                    color: "#FF0000",
                    textAlign: "left",
                  }}
                >
                  {errorResourceName ? errorResourceName : ""}
                </Typography>
              }
            />
            <TextField
              size="small"
              id="add-dataset-description"
              fullWidth
              multiline
              minRows={4}
              maxRows={4}
              sx={{
                marginTop: "12px",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#919EAB",
                  },
                  "&:hover fieldset": {
                    borderColor: "#919EAB",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#919EAB",
                  },
                },
              }}
              placeholder={`${Resource} description should not be more that 250 character`}
              label={`Description`}
              value={resourceDescription}
              required
              onChange={(e) => {
                setErrorResourceDescription("");
                if (e.target.value.toString().length <= limitCharDesc) {
                  setResourceDescription(e.target.value.trimStart());
                }
              }}
              error={errorResourceDescription ? true : false}
              helperText={
                <Typography
                  sx={{
                    fontFamily: "Montserrat !important",
                    fontWeight: "400",
                    fontSize: "12px",
                    lineHeight: "18px",
                    color: "#FF0000",
                    textAlign: "left",
                  }}
                >
                  {errorResourceDescription ? errorResourceDescription : ""}
                </Typography>
              }
            />
          </Box>
          <Box
            style={{
              display: "none",
              justifyContent: "left",
              gap: "5px",
              alignItems: "flex-start",
              marginTop: "20px",
            }}
          >
            <Button
              id="add-dataset-cancel-btn"
              sx={{
                fontFamily: "Montserrat",
                fontWeight: 700,
                fontSize: "14px",
                width: "fit-content",
                height: "40px",
                background: "#00A94F",
                borderRadius: "8px",
                textTransform: "none",
                display: "none",

                // marginLeft: "25px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#008b3d",
                  boxShadow: "0px 4px 15px rgba(0, 171, 85, 0.4)",
                  color: "#ffffff",
                },
                "&:disabled": {
                  backgroundColor: "#d0d0d0",
                  color: "#ffffff",
                },
                color: "white",
                border: "00A94F",
              }}
              variant="outlined"
              onClick={() => setShowCategoryModal(true)}
              // className={GlobalStyle.primary_buttonSupport}
            >
              Categories
              {/* <VscGroupByRefType /> */}
            </Button>
            <span style={{ color: "red", marginBottom: "2px" }}>*</span>
            {/* <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {renderChips(listCategories, subCategoryIds)}
            </Box> */}
          </Box>
          <Box
            className="d-flex justify-content-end"
            sx={{ marginTop: "50px", marginBottom: "50px" }}
          >
            <Button
              id="add-dataset-cancel-btn"
              sx={{
                fontFamily: "Montserrat",
                fontWeight: 700,
                fontSize: "14px",
                width: "fit-content",
                height: "40px",
                border: "1px solid #00a94f",
                borderRadius: "8px",
                color: "#00A94F",
                textTransform: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(0, 171, 85, 0.1)",
                  border: "1px solid #00a94f",
                  boxShadow: "0px 4px 15px rgba(0, 171, 85, 0.4)",
                },
              }}
              variant="outlined"
              onClick={() => history.push(handleClickRoutes())}
            >
              Cancel
              {/* <MdOutlineCancel /> */}
            </Button>
            <Button
              id="add-dataset-submit-btn"
              disabled={isDisabled()}
              sx={{
                fontFamily: "Montserrat",
                fontWeight: 700,
                fontSize: "14px",
                width: "fit-content",
                height: "40px",
                background: "#00A94F",
                borderRadius: "8px",
                textTransform: "none",
                marginLeft: "25px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#008b3d",
                  boxShadow: "0px 4px 15px rgba(0, 171, 85, 0.4)",
                  color: "#ffffff",
                },
                "&:disabled": {
                  backgroundColor: "#d0d0d0",
                  color: "#ffffff",
                },
              }}
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
            >
              Publish
              {/* <MdOutlinePublish /> */}
            </Button>
          </Box>
        </div>
      </Box>

      <div className="text-left mt-50 hidden">
        <span
          className="add_light_text cursor-pointer breadcrumbItem"
          onClick={() => history.push(handleClickRoutes())}
          id="add-dataset-breadcrum"
          data-testid="goPrevRoute"
        >
          {Resources}
        </span>
        <span className="add_light_text ml-11">
          <ArrowForwardIosIcon sx={{ fontSize: "14px", fill: "#00A94F" }} />
        </span>
        <span className="add_light_text ml-11 fw600">
          {props.resourceId ? `Edit ${resource}` : `Add ${resource}`}
        </span>
      </div>
      <Typography
        className="hidden"
        sx={{
          fontFamily: "Montserrat !important",
          fontWeight: "600",
          fontSize: "32px",
          lineHeight: "40px",
          color: "#000000",
          textAlign: "left",
          marginTop: "50px",
        }}
      >
        {props.resourceId ? `Edit ${resource}` : `Create new ${resource}`}
      </Typography>
      <Typography className={style.subtitle} style={{ display: "none" }}>
        Create and contribute your unique agricultural insights here.
      </Typography>
      <Box className="mt-20 hidden">
        <TextField
          fullWidth
          sx={{
            marginTop: "30px",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#919EAB",
              },
              "&:hover fieldset": {
                borderColor: "#919EAB",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#919EAB",
              },
            },
          }}
          placeholder={`${Resource} name should not be more than 100 character`}
          label={`${Resource} Title`}
          value={resourceName}
          required
          onChange={(e) => {
            setErrorResourceName("");
            if (e.target.value.toString().length <= limitChar) {
              setResourceName(e.target.value.trimStart());
            }
          }}
          id="add-dataset-name"
          error={errorResourceName ? true : false}
          helperText={
            <Typography
              sx={{
                fontFamily: "Montserrat !important",
                fontWeight: "400",
                fontSize: "12px",
                lineHeight: "18px",
                color: "#FF0000",
                textAlign: "left",
              }}
            >
              {errorResourceName ? errorResourceName : ""}
            </Typography>
          }
        />
        <TextField
          id="add-dataset-description"
          fullWidth
          multiline
          minRows={4}
          maxRows={4}
          sx={{
            marginTop: "12px",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#919EAB",
              },
              "&:hover fieldset": {
                borderColor: "#919EAB",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#919EAB",
              },
            },
          }}
          placeholder={`${Resource} description should not be more that 250 character`}
          label={`Description`}
          value={resourceDescription}
          required
          onChange={(e) => {
            setErrorResourceDescription("");
            if (e.target.value.toString().length <= limitCharDesc) {
              setResourceDescription(e.target.value.trimStart());
            }
          }}
          error={errorResourceDescription ? true : false}
          helperText={
            <Typography
              sx={{
                fontFamily: "Montserrat !important",
                fontWeight: "400",
                fontSize: "12px",
                lineHeight: "18px",
                color: "#FF0000",
                textAlign: "left",
              }}
            >
              {errorResourceDescription ? errorResourceDescription : ""}
            </Typography>
          }
        />
      </Box>

      <Divider
        className="hidden"
        sx={{ border: "1px solid #ABABAB", marginTop: "59px" }}
      />
      <Box className="bold_title mt-50 hidden">
        {Resource} category{" "}
        <span
          style={{
            color: "red",
            fontSize: "26px",
          }}
        >
          *
        </span>
      </Box>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // width: 400,
            bgcolor: "background.paper",
            // border: "2px solid #000",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            maxHeight: "450px",
          }}
        >
          <>
            <Box className="d-flex justify-content-between align-items-baseline">
              <Typography sx={{ fontWeight: "600" }}>
                <Checkbox
                  checked={selectAll}
                  onChange={handleMasterCheckboxChange}
                  color="primary"
                  sx={{ padding: "0px 4px", marginBottom: "3px" }}
                />
                {`Selected Videos (${selectedVideos?.length})`}
              </Typography>
              <Box
                onClick={() => setShowModal(false)}
                className="text-right cursor-pointer"
              >
                <Button
                  sx={{
                    fontFamily: "Montserrat",
                    fontWeight: 600,
                    fontSize: "14px",
                    height: "25px",
                    border: "1px solid rgba(0, 171, 85, 0.48)",
                    borderRadius: "8px",
                    color: "#00A94F",
                    textTransform: "none",
                    marginRight: "10px",
                    "&:hover": {
                      background: "none",
                      border: "1px solid rgba(0, 171, 85, 0.48)",
                    },
                  }}
                  variant="outlined"
                  disabled={!selectedVideos?.length}
                  onClick={() =>
                    props.resourceId
                      ? handleVideoUpload()
                      : handleClickAddMore()
                  }
                >
                  Upload
                </Button>
                <CloseIcon />
              </Box>
            </Box>
            <Divider className="mt-10" />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridGap: "30px",
                maxHeight: "350px",
                overflow: "scroll",
                marginTop: "20px",
              }}
            >
              {allVideos?.length ? (
                allVideos?.map((video, index) => (
                  <Card
                    key={index}
                    sx={{ background: "#e6f7f0", borderRadius: "8px" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Tooltip title={video?.title}>
                        <Typography
                          sx={{
                            maxWidth: "120px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            padding: "6px",
                          }}
                        >
                          {video?.title}
                        </Typography>
                      </Tooltip>
                      <Checkbox
                        checked={selectedVideos.includes(video.url)}
                        onChange={() => handleCheckboxChange(video.url)}
                      />
                    </Box>
                    <YouTubeEmbed
                      key={index}
                      embedUrl={video?.url}
                      customWidth={"220px"}
                      customHeight={"130px"}
                    />
                  </Card>
                ))
              ) : (
                <Typography>As of now, no video is available.</Typography>
              )}
            </Box>
          </>
        </Box>
      </Modal>
      {/* <Modal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            width: "80%",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              padding: "16px",
              fontWeight: "700",
              borderBottom: "1px solid #ddd",
              backgroundColor: "#f6f6f6",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            Categories
          </Typography>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: "8px",
            }}
          >
            <ControlledAccordion
              data={allCategories}
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
          <Box
            sx={{
              padding: "16px",
              borderTop: "1px solid #ddd",
              backgroundColor: "#f6f6f6",
              display: "flex",
              justifyContent: "flex-end",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
            }}
          >
            <Button
              id="add-dataset-cancel-btn"
              sx={{
                fontFamily: "Montserrat",
                fontWeight: 700,
                fontSize: "14px",
                width: "fit-content",
                height: "40px",
                border: "2px solid rgba(0, 171, 85, 0.48)",
                borderRadius: "8px",
                color: "#00A94F",
                textTransform: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(0, 171, 85, 0.1)",
                  border: "2px solid rgba(0, 171, 85, 0.8)",
                  boxShadow: "0px 4px 15px rgba(0, 171, 85, 0.4)",
                },
              }}
              variant="outlined"
              onClick={() => setShowCategoryModal(false)}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal> */}

      <FileSelectionModal
        showModal={showCloudModal}
        setShowModal={setShowCloudModal}
        key={"cloud_modal"}
        files={cloudModalData}
        handleFileSelection={(selectedFiles) => {
          if (typeSelected === "s3") {
            handleCloudFileSelection(selectedFiles, "s3");
          } else if (typeSelected === "google_drive") {
            handleCloudFileSelection(selectedFiles, "google_drive");
          } else if (typeSelected === "dropbox") {
            handleCloudFileSelection(selectedFiles, "dropbox");
          }
        }}
      />
    </Box>
  );
};

export default AddResource;

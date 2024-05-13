import {
  Box,
  Button,
  TextField,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Modal,
  Card,
  Tooltip,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  createFile,
  fileUpload,
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
  toTitleCase,
} from "common/utils/utils";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import { useHistory, useParams } from "react-router-dom";
import FileUploaderTest from "../../Components/Generic/FileUploaderTest";
import { FileUploader } from "react-drag-drop-files";
import { FarmStackContext } from "common/components/context/VistaarContext/FarmStackProvider";
import ControlledAccordion from "../../Components/Accordion/Accordion";
import EmptyFile from "../../Components/Datasets_New/TabComponents/EmptyFile";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "common/services/HTTPService";
import File from "../../Components/Datasets_New/TabComponents/File";
import CheckBoxWithText from "../../Components/Datasets_New/TabComponents/CheckBoxWithText";
// import { Select } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import labels from "../../Constants/labels";
import CheckBoxWithTypo from "../../Components/Datasets_New/TabComponents/CheckBoxWithTypo";
import style from "./resources.module.css";
import ApiConfiguration from "../../Components/Datasets_New/TabComponents/ApiConfiguration";
import YouTubeEmbed from "../../Components/YouTubeEmbed/YouTubeEmbed";
import CloseIcon from "@mui/icons-material/Close";
import UsagePolicy from "../../Components/Resources/UsagePolicy";

const accordionTitleStyle = {
  fontFamily: "'Arial' !important",
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
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  const history = useHistory();
  let resources = labels.renaming_modules.resources;
  let resource = labels.renaming_modules.resource;
  let Resources = toTitleCase(labels.renaming_modules.resources);
  let Resource = toTitleCase(labels.renaming_modules.resource);
  const containerStyle = {
    marginLeft: mobile || tablet ? "30px" : "144px",
    marginRight: mobile || tablet ? "30px" : "144px",
    padding: "10px",
  };
  const [fileSizeError, setFileSizeError] = useState("");
  const fileTypes = ["DOC", "TEXT", "PDF"];
  const [selectedValue, setSelectedValue] = useState("public");
  const [resourceName, setResourceName] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [apiLinks, setApiLinks] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [subCategoryIds, setSubCategoryIds] = useState([]);
  const [listCategories, setListCategories] = useState([]);
  const [updater, setUpdate] = useState(0);
  const [userType, setUserType] = useState("");
  const [key, setKey] = useState(0);
  const [file, setFile] = useState();

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
  const [typeSelected, setTypeSelected] = useState("");
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
    const uploadedFilesLength = uploadedFiles?.length ?? 0;
    const pdfFilesLength = pdfFiles?.length ?? 0;
    const videoFilesLength = videoFiles?.length ?? 0;
    const websitesLength = websites?.length ?? 0;
    const apiLinksLength = apiLinks?.length ?? 0;

    const totalFilesLength =
      uploadedFilesLength +
      pdfFilesLength +
      videoFilesLength +
      websitesLength +
      apiLinksLength;

    const allowDeletion = totalFilesLength > 1;
    if (id && allowDeletion) {
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
              const filteredFiles = uploadedFiles.filter(
                (item) => item.id !== id
              );
              setUploadedFiles(filteredFiles);
            }
            if (type === "youtube") {
              const filteredFiles = videoFiles.filter((item) => item.id !== id);
              setVideoFiles(filteredFiles);
            }
            if (type === "pdf") {
              const filteredFiles = pdfFiles.filter((item) => item.id !== id);
              setPdfFiles(filteredFiles);
            }
            if (type === "website") {
              const filteredFiles = websites.filter((item) => item.id !== id);
              setWebsites(filteredFiles);
            }
            if (type === "api") {
              const filteredFiles = apiLinks.filter((item) => item.id !== id);
              setApiLinks(filteredFiles);
            }
          }
        })
        .catch((e) => {
          console.log(e);
          callLoader(false);
        });
    } else if (id) {
      callToast(
        "File cannot be deleted, a resource must have at least one file",
        "error",
        true
      );
    } else {
      if (type === "file" || type === "application/pdf") {
        const filteredFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(filteredFiles);
        setKey(key + 1);
      }
      if (type === "youtube") {
        const filteredFiles = videoFiles.filter((_, i) => i !== index);
        setVideoFiles(filteredFiles);
        setKey(key + 1);
      }
      if (type === "pdf") {
        const filteredFiles = pdfFiles.filter((_, i) => i !== index);
        setPdfFiles(filteredFiles);
        setKey(key + 1);
      }
      if (type === "website") {
        const filteredFiles = websites.filter((_, i) => i !== index);
        setWebsites(filteredFiles);
        setKey(key + 1);
      }
      if (type === "api") {
        const filteredFiles = apiLinks.filter((_, i) => i !== index);
        setApiLinks(filteredFiles);
        setKey(key + 1);
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
      } else {
        return [<EmptyFile text={"You have not uploaded any files"} />];
      }
    };
    if (uploadedFiles || pdfFiles || videoFiles || websites || apiLinks) {
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
        eachFileDetailData?.url) &&
      subCategoryIds?.length
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

  const getUpdatedFile = async (fileItem) => {
    let bodyFormData = new FormData();
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
      }
      setEachFileDetailData({
        url: "",
        transcription: "",
        type: typeSelected,
      });
      callLoader(false);
      callToast("file uploaded successfully", "success", true);
      return response?.data;
    } catch (error) {
      console.log(error);
      callLoader(false);
      callToast("something went wrong while uploading the file", "error", true);
    }
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

        setUploadedFiles(tempFiles);
        setPdfFiles(tempPdfFiles);
        setVideoFiles(tempVideoFiles);
        setWebsites(tempWebsiteFiles);
        setApiLinks(tempApiFiles);
        setCategories(response?.data?.categories);
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
  const handleSubmit = async () => {
    let bodyFormData = new FormData();
    bodyFormData.append("title", resourceName);
    bodyFormData.append("description", resourceDescription);
    bodyFormData.append("category", JSON.stringify(categories));
    bodyFormData.append("sub_categories_map", JSON.stringify(subCategoryIds));

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
    const uploadFilesStringfy = JSON.stringify(arr);

    bodyFormData.append("uploaded_files", uploadFilesStringfy);

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

  useEffect(() => {
    const updateCheckBox = () => {
      let tempCategories = [];
      let temp = listCategories?.forEach((data, index) => {
        let prepareCheckbox = [];
        prepareCheckbox = data?.subcategories?.map((subCategory, ind) => {
          // Find if the subcategory exists in the categories array and its subcategories
          const isPresent = subCategoryIds.includes(subCategory.id);
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
      setAllCategories(tempCategories);
    };
    updateCheckBox();
  }, [listCategories, subCategoryIds]);

  return (
    <Box sx={containerStyle}>
      <div className="text-left mt-50">
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
        sx={{
          fontFamily: "Arial !important",
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
      <Typography className={style.subtitle}>
        Create and contribute your unique agricultural insights here.
      </Typography>
      <Box className="mt-20">
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
                fontFamily: "Arial !important",
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
                fontFamily: "Arial !important",
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
      {/* <Divider sx={{ border: "1px solid #ABABAB", marginTop: "59px" }} />
      <Box className="mt-20">
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
          Usage policy{" "}
          <span
            style={{
              color: "red",
              fontSize: "26px",
            }}
          >
            *
          </span>
        </Typography>
        <Typography
          className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
        >
          {" "}
          Define access limitations and permissions for your contents.{" "}
        </Typography>
        <Box className="mt-20">
          <UsagePolicy />
        </Box>
      </Box> */}
      <Divider sx={{ border: "1px solid #ABABAB", marginTop: "59px" }} />
      <Box className="bold_title mt-50">
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
      <Box className="mt-30">
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
      <Divider sx={{ border: "1px solid #ABABAB", marginTop: "59px" }} />
      <Box
        className="mt-50"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: mobile ? "column" : "row",
        }}
      >
        <Box sx={{ marginRight: tablet || miniLaptop ? "25px" : "" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: mobile || tablet || miniLaptop ? "" : "500px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Arial !important",
                fontWeight: "600",
                fontSize: "20px",
                lineHeight: "40px",
                color: "#000000",
                textAlign: "left",
                marginBottom: "10px",
              }}
            >
              Add {Resource}
              <span
                style={{
                  color: "red",
                  fontSize: "26px",
                }}
              >
                *
              </span>
            </Typography>
          </div>
          <Typography className={style.subtitle2}>
            Upload and contribute your unique agricultural insights here.
          </Typography>
          <Box
            className="cursor-pointer d-flex flex-column"
            sx={{ gap: "20px" }}
          >
            <FormControl fullWidth>
              <InputLabel>Select Content Type</InputLabel>
              <Select
                value={typeSelected}
                onChange={handleChangeType}
                sx={{
                  textAlign: "left",
                  "& .MuiSelect-icon": {
                    color: "rgba(0, 0, 0, 0.54) !important",
                  },
                }}
                label="Select Content Type"
                placeholder="Select Content Type"
              >
                <MenuItem value="pdf">Url</MenuItem>
                <MenuItem value="video">Youtube</MenuItem>
                <MenuItem value="file">Upload</MenuItem>
                <MenuItem value="api">API</MenuItem>
                <MenuItem value="website">Website</MenuItem>
              </Select>
            </FormControl>
            {typeSelected == "file" ? (
              <Box className="mt-10">
                <FileUploader
                  id="add-dataset-upload-file-id"
                  key={key}
                  name="file"
                  handleChange={handleFileChange}
                  multiple={true}
                  maxSize={50}
                  onSizeError={(file) => {
                    console.log(file, "something");
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
              <>
                <Box className="mt-10">
                  <TextField
                    // fullWidth
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
                          type:
                            typeSelected === "video" ? "youtube" : typeSelected,
                        });
                      }
                    }}
                    id="add-dataset-name"
                  />
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
                </Box>
                {typeSelected === "video" && (
                  <Box className="mt-10 text-right">
                    <Button
                      sx={{
                        color: "#424242",
                        fontFamily: "Public Sans",
                        fontWeight: "700",
                        fontSize: mobile ? "11px" : "14px",
                        border: "1px solid #424242",
                        padding: "8px 16px",
                        height: "48px",
                        textTransform: "none !important",
                        "&:hover": {
                          background: "none",
                          border: "1px solid #424242",
                        },
                      }}
                      disabled={!eachFileDetailData.url}
                      onClick={fetchVideos}
                      variant="outlined"
                    >
                      Fetch Videos
                    </Button>
                  </Box>
                )}
              </>
            ) : null}
            {typeSelected == "api" ? (
              <Box className="mt-10">
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
                />
              </Box>
            ) : null}
            {/* <FormControlLabel
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
                />
              }
              label="Generate Embeddings"
            /> */}

            {!props.resourceId &&
              typeSelected !== "api" &&
              typeSelected !== "video" && (
                <Box className="text-left">
                  <Button
                    type="secondary"
                    disabled={eachFileDetailData.url ? false : true}
                    icon={<PoweroffOutlined />}
                    onClick={() => handleClickAddMore()}
                    sx={{ padding: 0 }}
                  >
                    + Add more
                  </Button>
                </Box>
              )}
            {props.resourceId &&
              typeSelected !== "api" &&
              typeSelected !== "video" && (
                <Button
                  sx={{ width: "150px" }}
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
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: "Arial !important",
              fontWeight: "600",
              fontSize: "20px",
              lineHeight: "40px",
              color: "#000000",
              textAlign: "left",
              marginBottom: "10px",
            }}
          >
            List of {resources}
          </Typography>
          <Typography className={style.subtitle2}>
            Here are the list of files you uploaded.
          </Typography>
          <ControlledAccordion
            data={getAccordionDataForLinks()}
            isCustomStyle={true}
            width={mobile || tablet ? "300px" : "466px"}
            titleStyle={accordionTitleStyle}
            selectedPanelIndex={getPanel()}
            isCustomArrowColor={true}
            addHeaderBackground={true}
            headerBackground={"#F6F6F6"}
          />
        </Box>
      </Box>
      <Divider sx={{ border: "1px solid #ABABAB", marginTop: "59px" }} />
      <Box
        className="d-flex justify-content-end"
        sx={{ marginTop: "50px", marginBottom: "100px" }}
      >
        <Button
          id="add-dataset-cancel-btn"
          sx={{
            fontFamily: "Arial",
            fontWeight: 700,
            fontSize: "16px",
            width: "171px",
            height: "48px",
            border: "1px solid rgba(0, 171, 85, 0.48)",
            borderRadius: "8px",
            color: "#00A94F",
            textTransform: "none",
            "&:hover": {
              background: "none",
              border: "1px solid rgba(0, 171, 85, 0.48)",
            },
          }}
          variant="outlined"
          onClick={() => history.push(handleClickRoutes())}
        >
          Cancel
        </Button>
        <Button
          id="add-dataset-submit-btn"
          disabled={isDisabled()}
          sx={{
            fontFamily: "Arial",
            fontWeight: 700,
            fontSize: "16px",
            width: "171px",
            height: "48px",
            background: "#00A94F",
            borderRadius: "8px",
            textTransform: "none",
            marginLeft: "50px",
            "&:hover": {
              backgroundColor: "#00A94F",
              color: "#fffff",
            },
          }}
          variant="contained"
          onClick={() => {
            handleSubmit();
          }}
        >
          Publish
        </Button>
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
                    fontFamily: "Arial",
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
    </Box>
  );
};

export default AddResource;

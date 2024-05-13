import {
  Box,
  Button,
  TextField,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  fileUpload,
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "common/utils/utils";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useHistory, useParams } from "react-router-dom";
import FileUploaderTest from "../../Components/Generic/FileUploaderTest";
import { FileUploader } from "react-drag-drop-files";
import { FarmStackContext } from "common/components/context/EadpContext/FarmStackProvider";
import ControlledAccordion from "../../Components/Accordion/Accordion";
import EmptyFile from "../../Components/Datasets_New/TabComponents/EmptyFile";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "common/services/HTTPService";
import File from "../../Components/Datasets_New/TabComponents/File";
import CheckBoxWithText from "../../Components/Datasets_New/TabComponents/CheckBoxWithText";

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
  const history = useHistory();
  const containerStyle = {
    marginLeft: mobile || tablet ? "30px" : "144px",
    marginRight: mobile || tablet ? "30px" : "144px",
    padding: "10px",
  };
  const [fileSizeError, setFileSizeError] = useState("");
  const fileTypes = ["XLS", "XLSX", "CSV", "JPEG", "PNG", "TIFF", "PDF"];

  const [resourceName, setResourceName] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [categories, setCategories] = useState({});
  const [allCategories, setAllCategories] = useState([]);
  const [updater, setUpdate] = useState(0);
  const [userType, setUserType] = useState("");
  const [key, setKey] = useState(0);
  const [file, setFile] = useState();
  const [isSizeError, setIsSizeError] = useState(false);
  const [errorResourceName, setErrorResourceName] = useState("");
  const [errorResourceDescription, setErrorResourceDescription] = useState("");

  const limitChar = 100;
  const limitCharDesc = 250;

  const getTotalSizeInMb = (data) => {
    let total = 0;
    data.forEach((element) => {
      total =
        parseFloat(total) +
        parseFloat(element?.file_size / Math.pow(1024, 2)).toFixed(2) * 1;
    });
    return total.toFixed(2);
  };

  const handleDelete = (index, id, filename, type) => {
    setFileSizeError("");
    let source = "";
    if (type === "file_upload") {
      source = "file";
    }
    const multipleFiles = id && uploadedFiles?.length > 1;
    if (multipleFiles) {
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
            const filteredFiles = uploadedFiles.filter(
              (item) => item.id !== id
            );
            setUploadedFiles(filteredFiles);
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
      const filteredFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(filteredFiles);
      setKey(key + 1);
    }
  };

  const getAccordionData = () => {
    const prepareFile = (data, type) => {
      if (data && type === "file_upload") {
        let arr = data?.map((item, index) => {
          let ind = item?.file?.lastIndexOf("/");
          let tempFileName = item?.file?.slice(ind + 1);
          return (
            <File
              index={index}
              name={tempFileName}
              size={item?.file_size}
              id={item?.id}
              handleDelete={handleDelete}
              type={type}
              showDeleteIcon={true}
            />
          );
        });
        return arr;
      } else {
        return [<EmptyFile text={"You have not uploaded any files"} />];
      }
    };
    if (uploadedFiles) {
      const data = [
        {
          panel: 1,
          title: (
            <>
              Files upload{" "}
              {uploadedFiles?.length > 0 ? (
                <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
                  (Total Files: {uploadedFiles?.length} | Total size:{" "}
                  {getTotalSizeInMb(uploadedFiles)} MB)
                </span>
              ) : (
                <></>
              )}
            </>
          ),
          details:
            uploadedFiles?.length > 0
              ? prepareFile(uploadedFiles, "file_upload")
              : [<EmptyFile text={"You have not uploaded any files"} />],
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
      uploadedFiles?.length &&
      Object.keys(categories)?.length
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
    setFileSizeError("");
    let bodyFormData = new FormData();
    bodyFormData.append("resource", props.resourceId);
    bodyFormData.append("file", "");
    bodyFormData.delete("file");
    bodyFormData.append("file", fileItem);
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
      setUploadedFiles((prev) => [...prev, response.data]);
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

  const handleCheckBox = (keyName, value) => {
    setUpdate((prev) => prev + 1);
    let tempCategories = { ...categories };
    let tempJson = Object.keys(categories);
    if (tempJson.includes(keyName)) {
      if (tempCategories[keyName].includes(value)) {
        if (tempCategories[keyName]?.length === 1) {
          delete tempCategories[keyName];
        } else {
          let index = tempCategories[keyName].indexOf(value);
          tempCategories[keyName].splice(index, 1);
        }
      } else {
        tempCategories[keyName].push(value);
      }
      setCategories({ ...tempCategories });
    } else {
      setCategories((currentState) => {
        return { ...currentState, [keyName]: [value] };
      });
    }
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
        setUploadedFiles(response?.data?.resources);
        // preparing categories for accordion
        let prepareArr = [];
        let tempcategoryJson = response?.data?.category;
        for (const [key, value] of Object.entries(tempcategoryJson)) {
          let obj = {};
          obj[key] = value;
          prepareArr.push(obj);
        }
        setCategories(tempcategoryJson);
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

  const handleSubmit = async () => {
    let bodyFormData = new FormData();
    bodyFormData.append("title", resourceName);
    bodyFormData.append("description", resourceDescription);
    bodyFormData.append("category", JSON.stringify(categories));
    let body = {};
    for (let [key, value] of bodyFormData.entries()) {
      body[key] = value;
    }
    if (!props.resourceId) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        fileUpload(bodyFormData, uploadedFiles[i], "uploaded_files");
      }
    }
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
        history.push(handleClickRoutes());
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
    let url = UrlConstant.base_url + UrlConstant.add_category_edit_category;
    let checkforAccess = getTokenLocal() ?? false;
    HTTPService("GET", url, "", true, true, checkforAccess)
      .then((response) => {
        let prepareArr = [];
        for (const [key, value] of Object.entries(response.data)) {
          let obj = {};
          obj[key] = value;
          prepareArr.push(Object.keys(value).length ? obj : []);
        }
        let tempCategories = [];
        prepareArr.forEach((item, index) => {
          let keys = Object.keys(item);
          let prepareCheckbox = [];
          if (keys.length) {
            let tCategory = categories?.[keys];
            prepareCheckbox = item?.[keys[0]]?.map((res, ind) => {
              return (
                <CheckBoxWithText
                  key={ind}
                  text={res}
                  keyIndex={ind}
                  checked={tCategory?.includes(res) ? true : false}
                  categoryKeyName={keys[0]}
                  keyName={res}
                  handleCheckBox={handleCheckBox}
                  fontSize={"12px"}
                />
              );
            });
            let obj = {
              panel: index + 1,
              title: keys[0],
              details: prepareCheckbox ? prepareCheckbox : [],
            };
            tempCategories = tempCategories.concat(obj);
          }
        });
        setAllCategories(tempCategories);
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
  useEffect(() => {
    if (id || props.resourceId) {
      getResource();
    }
  }, []);

  useEffect(() => {
    getAllCategoryAndSubCategory();
  }, [categories]);
  return (
    <Box sx={containerStyle}>
      <div className="text-left mt-50">
        <span
          className="add_light_text cursor-pointer breadcrumbItem"
          onClick={() => history.push(handleClickRoutes())}
          id="add-dataset-breadcrum"
          data-testid="goPrevRoute"
        >
          Resources
        </span>
        <span className="add_light_text ml-11">
          <ArrowForwardIosIcon sx={{ fontSize: "14px", fill: "#00A94F" }} />
        </span>
        <span className="add_light_text ml-11 fw600">
          {props.resourceId ? "Edit resource" : "Add resource"}
        </span>
      </div>
      <Typography
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
        {props.resourceId ? "Edit resource" : "Create new resource"}
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
          placeholder="Resource name should not be more than 100 character"
          label="Resource name"
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
          placeholder="Resource description should not be more that 250 character "
          label="Resource description should not be more that 250 character "
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
      <Divider sx={{ border: "1px solid #ABABAB", marginTop: "59px" }} />
      <Box className="bold_title mt-50">
        Resource category{" "}
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
          customDetailsStyle={{ display: "inline-block", width: "30%" }}
          addHeaderBackground={true}
          headerBackground={"#eafbf3"}
        />
      </Box>
      <Box
        className="mt-50"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: mobile ? "column" : "row",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: "600",
              fontSize: "20px",
              lineHeight: "40px",
              color: "#000000",
              textAlign: "left",
              marginBottom: "10px",
            }}
          >
            Upload file{" "}
            <span
              style={{
                color: "red",
                fontSize: "26px",
              }}
            >
              *
            </span>
          </Typography>
          <Box className="cursor-pointer">
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
            <span style={{ color: "red", fontSize: "14px", textAlign: "left" }}>
              {isSizeError && (
                <div>
                  <p>File size exceeds the limit of 50MB.</p>
                  <p>Please choose a smaller file or reduce the file size.</p>
                </div>
              )}
            </span>
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: "600",
              fontSize: "20px",
              lineHeight: "40px",
              color: "#000000",
              textAlign: "left",
              marginBottom: "10px",
            }}
          >
            List of files upload
          </Typography>
          <ControlledAccordion
            data={getAccordionData()}
            isCustomStyle={true}
            width={mobile ? "300px" : "466px"}
            titleStyle={accordionTitleStyle}
            selectedPanelIndex={1}
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
            fontFamily: "Montserrat",
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
            fontFamily: "Montserrat",
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
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AddResource;

import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Admin_upload_dataset from "./UploadDatasetComponent";
import "./admin-add-dataset.css";
import { TextField } from "@material-ui/core";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  getUserMapId,
  handleUnwantedSpace,
  validateInputField,
  getTokenLocal,
  isLoggedInUserParticipant,
  getRoleLocal,
} from "../../Utils/Common";
import RegexConstants from "../../Constants/RegexConstants";
import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import RichTextEditor from "react-rte";
import AddMetadata from "./AddMetadata";
import $ from "jquery";
import Loader from "../Loader/Loader";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Snackbar, Alert } from "@mui/material";
import Success from "../Success/Success";
import DataStandardizationInAddDataset from "./DataStandardizationInAddDataset.js";

//stepper steps label
const steps = [
  "Dataset name",
  "Create or upload dataset",
  "Data standardization",
  "Create a metadata",
];

const AddDataset = (props) => {
  const {
    isDatasetEditModeOn,
    datasetId,
    isaccesstoken,
    setOnBoardedTrue,
    cancelAction,
    setTokenLocal,
    onBoardingPage,
  } = props;

  const [uploadFile, setFile] = useState([]);
  const [progress, setProgress] = useState(0);
  const [value, setValue] = React.useState("1");
  const [datasetname, setdatasetname] = useState("");
  const [localUploaded, setLocalUploaded] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [mysqlFileList, setMysqlFileList] = useState([]);
  const [postgresFileList, setPostgresFileList] = useState([]);
  const [LiveApiFileList, setLiveApiFileList] = useState([]);
  const [isLoading, setIsLoader] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const history = useHistory();
  const [listOfFilesExistInDbForEdit, setListOfFilesExistInDbForEdit] =
    useState([]);
  const [key, setKey] = useState("");

  const [lengthOfSubCat, setLengthOfSubCat] = useState(0);
  const [SubCatList, setSubCatList] = React.useState([]);

  const [newSelectedCategory, setNewSelectedCategory] = useState([]);
  const [newSelectedSubCategory, setNewSelectedSubCategory] = useState([]);
  const [allStandardisedFile, setAllStandardisedFile] = useState({});
  const [standardisedFileLink, setStandardisedFileLink] = useState({});

  const handleChangeSubCatList = (value) => {
    console.log("Value1212121", value);

    setSubCatList(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    setNewSelectedSubCategory(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    addSubCatInMainObj(value);
  };
  function addSubCatInMainObj(value) {
    let mainObj = {};
    for (let i = 0; i < newSelectedCategory.length; i++) {
      mainObj[newSelectedCategory[i]] = [];
    }
    console.log(value, newSelectedCategory, mainObj);
    for (let i = 0; i < value.length; i++) {
      // console.log(newSelectedSubCategory[i].split("-"))
      let parent = value[i].split("-")[0]; //parent == category
      let child = value[i].split("-")[1]; // child == sub category
      if (mainObj[parent]) {
        mainObj[parent] = [...mainObj[parent], child];
      }
    }
    setMainJson({ ...mainObj });
  }

  const [allCatFetched, setAllCatFetched] = useState({});
  const [selectedCat, setSelectedCat] = useState({});
  const [selectedSubCat, setSelectedSubCat] = useState([]);
  //states for the alert if any error occurs at any point in the form of snackbar
  const [messageForSnackBar, setMessageForSnackBar] = useState("");
  const [errorOrSuccess, setErrorOrSuccess] = useState("error"); //options --> "error", "info", "success", "warning"
  const [finalJson, setMainJson] = useState({});

  //error states for the variable during the complete add dataset flow
  const [errorDatasetName, seteErrorDatasetName] = useState("");
  const [errorDatasetDescription, setDescriptionErrorMessage] = useState("");

  //tab changer from upload dataset to add metadata
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //dataset name handler
  const handleChangedatasetname = (e) => {
    seteErrorDatasetName("");
    validateInputField(e.target.value, RegexConstants.connector_name)
      ? setdatasetname(e.target.value)
      : e.preventDefault();
  };
  //datasetname no space handler
  const handledatasetnameKeydown = (e) => {
    handleUnwantedSpace(datasetname, e);
  };

  async function deleteHandlerForFile(datasetname, source, filename) {
    let payload = new FormData();
    payload.append("source", source);
    payload.append("file_name", filename);
    payload.append("dataset_name", datasetname);
    console.log("PAYLOAD CREATED", payload);
    let checkforAccess = isaccesstoken ? isaccesstoken : false;
    HTTPService(
      "DELETE",
      UrlConstant.base_url + UrlConstant.dataseteth,
      payload,
      true,
      true,
      checkforAccess
    )
      .then((response) => {
        console.log("RESPONSE", response);
        if (source == "file") {
          let filteredArray = localUploaded.filter((item) => item != filename);
          setLocalUploaded([...filteredArray]);
          let updatedArray = uploadFile.filter(
            (item) => item.name !== filename
          );
          setFile(updatedArray);
        } else if (source == "mysql") {
          let filteredArray = mysqlFileList.filter((item) => item != filename);
          setMysqlFileList([...filteredArray]);
        } else if (source == "postgresql") {
          let filteredArray = postgresFileList.filter(
            (item) => item != filename
          );
          setPostgresFileList([...filteredArray]);
        } else if (source == "live_api") {
          let filteredArray = LiveApiFileList.filter(
            (item) => item != filename
          );
          setLiveApiFileList([...filteredArray]);
        }
        // var filteredArray = uploadFile.filter((item) => item.name !== filename)
        // setFile(filteredArray)
        // setKey(Math.random())
      })
      .catch((e) => {
        var returnValues = GetErrorKey(e, payload.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "dataset_name":
                // setDatasetNameError(errorMessages[i]);
                setMessageForSnackBar("Dataset deletion failed");
                setErrorOrSuccess("error");
                handleClick();
                break;
              case "file_name":
                // setDataSetFileError(errorMessages[i]);
                setMessageForSnackBar("Dataset deletion failed");
                setErrorOrSuccess("error");
                handleClick();
                break;
              default:
                if (e?.response?.status == 401) {
                  history.push(GetErrorHandlingRoute(e));
                } else {
                  setMessageForSnackBar("Dataset deletion failed");
                  setErrorOrSuccess("error");
                  handleClick();
                }
                break;
            }
          }
        } else {
          if (e?.response?.status == 401) {
            history.push(GetErrorHandlingRoute(e));
          } else {
            setMessageForSnackBar("Dataset deletion failed");
            setErrorOrSuccess("error");
            handleClick();
          }
        }
      });
  }

  //stepper code added
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const checkDatasetNameExistInDatabase = () => {
    var bodyFormData = new FormData();
    bodyFormData.append("dataset_name", datasetname);
    bodyFormData.append("description", govLawDesc);

    let checkforAccess = isaccesstoken ? isaccesstoken : false;

    let url = "";
    if (isDatasetEditModeOn) {
      url =
        UrlConstant.base_url +
        UrlConstant.check_dataset_name_and_description_in_database +
        "?dataset_exists=True";
    } else {
      url =
        UrlConstant.base_url +
        UrlConstant.check_dataset_name_and_description_in_database;
    }
    console.log("checkDatasetNameExistInDatabase", activeStep, bodyFormData);
    HTTPService("POST", url, bodyFormData, false, true, checkforAccess)
      .then((response) => {
        setIsLoader(false);
        // setisSuccess(true);
        // setIsSubmitted(true)
        // console.log("dataset uploaded!");

        // //if error occurs Success message will be shown as Snackbar
        // setMessageForSnackBar("Dataset uploaded successfully")
        // setErrorOrSuccess("success")
        // handleClick()
      })
      .catch((e) => {
        setIsSubmitted(false);
        setIsLoader(false);
        //if error occurs Alert will be shown as Snackbar

        console.log(e);
        //console.log(e.response.data.sample_dataset[0]);
        var returnValues = GetErrorKey(e, bodyFormData.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "dataset_name":
                seteErrorDatasetName(errorMessages[i]);
                setActiveStep(0);
                // setnameErrorMessage(errorMessages[i]);
                break;
              case "description":
                setDescriptionErrorMessage(errorMessages[i]);
                setActiveStep(0);
                break;
              case "category":
                // setCategoryErrorMessage(errorMessages[i]);
                break;
              case "geography":
                // setGeographyErrorMessage(errorMessages[i]);
                break;
              case "crop_detail":
                // setCropDetailErrorMessage(errorMessages[i]);
                break;
              case "age_of_date":
                // setAgeErrorMessage(errorMessages[i]);
                break;
              case "data_capture_start":
                // setDataCaptureStartErrorMessage(errorMessages[i]);
                break;
              case "data_capture_end":
                // setDataCaptureEndErrorMessage(errorMessages[i]);
                break;
              case "sample_dataset":
                // setfileValid(errorMessages[i]);
                break;
              default:
                if (e?.response?.status == 401) {
                  history.push(GetErrorHandlingRoute(e));
                } else {
                  setMessageForSnackBar("Dataset with this name already exist");
                  setErrorOrSuccess("error");
                  handleClick();
                }
            }
          }
        } else {
          if (e?.response?.status == 401) {
            history.push(GetErrorHandlingRoute(e));
          } else {
            setMessageForSnackBar("Dataset with this name already exist");
            setErrorOrSuccess("error");
            handleClick();
          }
        }
        //setfileValid(e.response.data.sample_dataset[0]);
        // history.push(GetErrorHandlingRoute(e));
      });
  };

  const handleNext = () => {
    console.log("onclick of next active step", activeStep);

    if (activeStep == 0) {
      checkDatasetNameExistInDatabase();
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  //Cancelling and deleteing the files temp stored in server
  const handleResetForm = () => {
    // setdatasetname("")
    var bodyFormData = new FormData();
    bodyFormData.append("dataset_name", datasetname);
    let checkforAccess = isaccesstoken ? isaccesstoken : false;
    HTTPService(
      "DELETE",
      UrlConstant.base_url + UrlConstant.datasetethcancel,
      bodyFormData,
      true,
      true,
      checkforAccess
    )
      .then((response) => {
        console.log("FILE DELETED!");
        if (response.status === 204) {
          //   setFile(response.data)
          setLocalUploaded([]);
          setMysqlFileList([]);
          setPostgresFileList([]);
          setdatasetname("");
          if (isLoggedInUserParticipant() && isaccesstoken) {
            cancelAction();
          } else {
            history.push("/datahub/datasets");
          }
        }
        // setFile(null)
      })
      .catch((e) => {
        // setloader(false);
        console.log(e);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  //rich text editor
  const [govLawDesc, setgovLawDesc] = useState("");

  const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: [
      "INLINE_STYLE_BUTTONS",
      "BLOCK_TYPE_BUTTONS",
      //   "LINK_BUTTONS",
      "BLOCK_TYPE_DROPDOWN",
      //   "HISTORY_BUTTONS",
    ],
    INLINE_STYLE_BUTTONS: [
      { label: "Bold", style: "BOLD", className: "custom-css-class" },
      { label: "Italic", style: "ITALIC" },
      { label: "Underline", style: "UNDERLINE" },
    ],
    BLOCK_TYPE_DROPDOWN: [
      { label: "Normal", style: "unstyled" },
      { label: "Heading Large", style: "header-one" },
      { label: "Heading Medium", style: "header-two" },
      { label: "Heading Small", style: "header-three" },
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" },
    ],
  };

  const [editorGovLawValue, setEditorGovLawValue] = React.useState(
    RichTextEditor.createValueFromString(govLawDesc, "html")
  );
  const isValidURL = (string) => {
    var res = string.match(RegexConstants.connector_name);
    return res !== null;
  };
  const handlegovLawChange = (value) => {
    setDescriptionErrorMessage("");
    setEditorGovLawValue(value);
    setgovLawDesc(value.toString("html"));
    console.log(value.toString("html"));
    console.log(govLawDesc);
  };

  // category and sub cat
  const [category, setCategory] = useState([]);

  const handleChangeCategory = (event) => {
    console.log(event, "CHANGE CAT");
    // setMainJson({})
    const value = event;
    // const {
    //     target: { value },
    // } = event;
    setCategory(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    setNewSelectedCategory(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    console.log(value);
    handleChangeCategoryForSubCategory(value);
  };

  const [categoryNameList, setCategoryNameList] = useState([]);
  const [mainCategoryList, setMainCategoryList] = useState([]);

  const [subCategory, setSubCategory] = useState([]);

  const handleSubCategory = (event, parent) => {
    const {
      target: { value },
    } = event;
    setSubCategory(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const [subCategoryNameList, setSubCategoryNameList] = useState([]);

  async function getAllCategoryAndSubCategory(datasetname, source, filename) {
    let checkforAccess = isaccesstoken ? isaccesstoken : false;

    HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.add_category_edit_category,
      "",
      true,
      true,
      checkforAccess
    )
      .then((response) => {
        // categoryCreator(response.data)

        setAllCatFetched({ ...response.data });
        let arr = Object.keys(response.data);
        setCategoryNameList([...arr]);
        setMainCategoryList([...arr]);
        console.log(arr, "ARR");
      })
      .catch((e) => {
        console.log(e);
        // var returnValues = GetErrorKey(e, payload.keys());
        // var errorKeys = returnValues[0];
        // var errorMessages = returnValues[1];
        // if (errorKeys.length > 0) {
        //   for (var i = 0; i < errorKeys.length; i++) {
        //     switch (errorKeys[i]) {
        //       case "dataset_name":
        //         setDatasetNameError(errorMessages[i]);
        //         break;
        //       case "datasets":
        //         setDataSetFileError(errorMessages[i]);
        //         break;
        //       default:
        //         history.push(GetErrorHandlingRoute(e));
        //         break;
        //     }
        //   }
        // } else {
        //   history.push(GetErrorHandlingRoute(e));
        // }
      });
  }

  const categoryCreator = (data) => {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      arr.push(data[i].category);
    }
    setCategoryNameList([...arr]);
  };

  function handleChangeCategoryForSubCategory(selectectedCatList) {
    console.log(selectectedCatList, "selectectedCatList");
    let selectedMainObject = { ...finalJson };
    let finalJsonsArr = Object.keys(selectedMainObject);
    for (let i = 0; i < finalJsonsArr.length; i++) {
      if (!selectectedCatList.includes(finalJsonsArr[i])) {
        delete selectedMainObject[finalJsonsArr[i]];
      }
    }
    for (let i = 0; i < selectectedCatList.length; i++) {
      if (!finalJsonsArr.includes(selectectedCatList[i])) {
        selectedMainObject[selectectedCatList[i]] = [];
      }
    }
    console.log(selectedMainObject);
    setMainJson({ ...selectedMainObject });
    // allCatFetched
    // let obj = {}
    // // setNewSelectedSubCategory([])
    // for (let i = 0; i < selectectedCatList.length; i++) {
    //     console.log(selectectedCatList[i])
    //     if(finalJson.hasOwnProperty(selectectedCatList[i])){
    //         obj[selectectedCatList[i]] = []
    //     }else{

    //     }
    //     obj[selectectedCatList[i]] = []
    // }
    // console.log(selectectedCatList)

    // setSelectedCat(obj)
    // setMainJson({ ...obj })
    // let subCatList = []

    // for (let i = 0; i < selectectedCatList?.length; i++) {
    //     // let obj = {}
    //     // parent: selectectedCatList[i]
    //     subCatList = [...subCatList, ...allCatFetched[selectectedCatList[i]] ? allCatFetched[selectectedCatList[i]] : []]
    // }
    // let subCategoryValueAfterDeletingCategory = []

    // forEach will remove all sub category which is not sub category of selcted category
    // subCatList.forEach((item) => {
    //     for (let i of newSelectedSubCategory) {
    //         console.log('newSelectedSubCategory i', i, subCatList, i.split('-')[1], item, newSelectedSubCategory)
    //         // i value is category name + "-" + sub category name or sub category name
    //         i = i.split('-')[1] || i.split('-')[0]
    //         if (i == item) {
    //             subCategoryValueAfterDeletingCategory.push(i)
    //         }
    //     }
    // })
    // setNewSelectedSubCategory(subCategoryValueAfterDeletingCategory)

    // for (let i = 0; i < mainCategoryList.length; i++) {
    // for (let j = 0; j < selectectedCatList.length; j++) {
    //     console.log(selectectedCatList[j], mainCategoryList[i])
    //     if (selectectedCatList[j] == mainCategoryList[i].category) {
    //         subCatList.push(...mainCategoryList[i].children);
    //         break;
    //     }
    // }
    // }
    // let subCatListForSetting = []

    // for (let i = 0; i < subCatList.length; i++) {
    //     console.log(subCatList.sub_category)
    //     subCatListForSetting.push(subCatList[i].sub_category)
    // }
    // console.log(subCatList)
    // setSubCategoryNameList([...subCatList])
  }

  //handle geography
  const [geography, setGeography] = React.useState("");

  const handleChangeGeography = (value) => {
    console.log(value);
    setGeography(value);
    // validateInputField(value, RegexConstants.connector_name)
    //     ? setGeography(value) : ""
    //     ;
  };

  const [fromdate, setfromdate] = React.useState(null);
  const [todate, settodate] = React.useState(null);
  const [CheckEndDate, setCheckEndDate] = useState(false);

  const handleChangeFromDate = (newValue) => {
    console.log(newValue);
    settodate(null);
    setfromdate(newValue);
    setTimeout(() => {
      $(".addDatasetTodate input.MuiInputBase-input").attr(
        "disabled",
        "disabled"
      );
    }, 100);
    setCheckEndDate(true);
  };

  const handleChangeToDate = (newValue) => {
    console.log(newValue);
    settodate(newValue);
    setCheckEndDate(false);
  };

  const [Switchchecked, setSwitchchecked] = React.useState(false);

  const handleChangeSwitch = (event) => {
    console.log("switch", event.target.checked);
    setSwitchchecked(event.target.checked);
    settodate(null);
    setfromdate(null);
  };

  const [conscent, setConscent] = useState(false);

  function generateCategoryAndSubCat() {
    let cat = category;
    let sub_cat = subCategory;
    let main_list = mainCategoryList;
    console.log(cat, sub_cat, main_list);
    for (let i = 0; i < main_list.length; i++) {
      // console.log(main_list[i].category, cat, cat.includes[main_list[i].category])
      if (cat.includes(main_list[i].category)) {
        for (let j = 0; j < main_list[i].children.length; j++) {
          if (sub_cat.includes(main_list[i].children[j].sub_category)) {
            main_list[i].children[j].status = true;
            main_list[i].status = true;
          }
        }
      }
    }
    setMainCategoryList([...main_list]);
    return main_list;
  }

  console.log("allStandardisedFile", allStandardisedFile, standardisedFileLink);

  const handleAddDatasetSubmit = (e) => {
    console.log(finalJson, "Main");
    e.preventDefault();
    // let selectedCategory = generateCategoryAndSubCat()
    // let objForFinalSend = { ...finalJson }
    let mainObj = { ...finalJson };
    // for (let i = 0; i < newSelectedCategory.length; i++) {
    //     mainObj[newSelectedCategory[i]] = []
    // }
    // console.log(newSelectedSubCategory, newSelectedCategory)
    // for (let i = 0; i < newSelectedSubCategory.length; i++) {
    //     // console.log(newSelectedSubCategory[i].split("-"))
    //     let parent = newSelectedSubCategory[i].split("-")[0] //parent == category
    //     let child = newSelectedSubCategory[i].split("-")[1] // child == sub category
    //     if (mainObj[parent]) {
    //         mainObj[parent] = [...mainObj[parent], child]
    //     }
    // }

    console.log("clicked on add dataset submit btn11");
    var id = getUserMapId();
    console.log("user id", id);
    console.log("CHekckmkmc", fromdate, todate);
    // setnameErrorMessage(null);
    // setDescriptionErrorMessage(null);
    // setCategoryErrorMessage(null);
    // setGeographyErrorMessage(null);
    // setCropDetailErrorMessage(null);
    // setAgeErrorMessage(null);
    // setDataCaptureStartErrorMessage(null);
    // setDataCaptureEndErrorMessage(null);
    // setfileValid(null);
    console.log(mainObj, "FINAL CATEGORY");
    var bodyFormData = new FormData();
    bodyFormData.append("name", datasetname);
    bodyFormData.append("description", govLawDesc);
    bodyFormData.append("category", JSON.stringify(mainObj));
    bodyFormData.append("user_map", id);
    bodyFormData.append("geography", geography);

    //if edit mode is on then one extra key has to be apended so that they can delete the mentioned file as per the id
    if (isDatasetEditModeOn) {
      bodyFormData.append("deleted", JSON.stringify(idsForFilesDeleted));
    }
    bodyFormData.append("constantly_update", Switchchecked);
    bodyFormData.append(
      "data_capture_start",
      fromdate ? fromdate.toISOString() : ""
    );
    bodyFormData.append("data_capture_end", todate ? todate.toISOString() : "");
    console.log(
      "allStandardisedFile",
      allStandardisedFile,
      standardisedFileLink
    );
    bodyFormData.append(
      "standardisation_template",
      JSON.stringify(standardisedFileLink)
    );
    bodyFormData.append(
      "standardisation_config",
      JSON.stringify(allStandardisedFile)
    );

    let obj = {
      name: datasetname,
      description: govLawDesc,
      category: JSON.stringify(finalJson),
      user_map: id,
      geography: geography,
      deleted: JSON.stringify(idsForFilesDeleted),
      constantly_update: Switchchecked,
      data_capture_start: fromdate ? fromdate.toISOString() : "",
      data_capture_end: todate ? todate.toISOString() : "",
    };
    let accesstoken = getTokenLocal();
    let usermapid = getUserMapId();
    let url = "";
    let method = "";
    if (isDatasetEditModeOn) {
      method = "PUT";
      url = UrlConstant.base_url + UrlConstant.datasetview + datasetId + "/";
    } else {
      method = "POST";
      url = UrlConstant.base_url + UrlConstant.datasetview;
    }
    let checkforAcess = isaccesstoken ? isaccesstoken : false;
    setIsLoader(true);

    HTTPService(method, url, bodyFormData, false, true, checkforAcess)
      .then((response) => {
        if (isLoggedInUserParticipant() && isaccesstoken) {
          setIsLoader(false);
          setOnBoardedTrue();
          setTokenLocal(isaccesstoken);
          setIsSubmitted(true);
          history.push("/participant/datasets/");
        } else {
          setIsLoader(false);
          // setisSuccess(true);
          setIsSubmitted(true);
          console.log("dataset uploaded!");

          //if error occurs Success message will be shown as Snackbar
          setMessageForSnackBar("Dataset uploaded successfully");
          setErrorOrSuccess("success");
          handleClick();
        }
      })
      .catch((e) => {
        setIsSubmitted(false);
        setIsLoader(false);
        //if error occurs Alert will be shown as Snackbar

        console.log(e);
        //console.log(e.response.data.sample_dataset[0]);
        var returnValues = GetErrorKey(e, bodyFormData.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "name":
                seteErrorDatasetName(errorMessages[i]);
                setActiveStep(0);
                // setnameErrorMessage(errorMessages[i]);
                break;
              case "description":
                setDescriptionErrorMessage(errorMessages[i]);
                setActiveStep(0);
                break;
              default:
                setMessageForSnackBar("Something went wrong");
                setErrorOrSuccess("error");
                handleClick();
                break;
            }
          }
        } else {
          setMessageForSnackBar("Dataset uploaded failed");
          setErrorOrSuccess("error");
          handleClick();
        }
        //setfileValid(e.response.data.sample_dataset[0]);
        // history.push(GetErrorHandlingRoute(e));
      });
  };

  //toast for error
  const [open, setOpen] = React.useState(false);
  //handling toast
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  //action for toast
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleSubCategoryListForFinal = (checked, value, parent) => {
    console.log(checked, value, parent);
    // console.log(selectedCat[parent], "Selected")
    let arr = [...selectedCat[parent]];
    if (checked) {
      setLengthOfSubCat((prev) => prev + 1);
      console.log(arr);
      arr.push(value);
    } else {
      const index = arr.indexOf(value);
      if (index > -1) {
        // only splice array when item is found
        setLengthOfSubCat((prev) => prev - 1);
        arr.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    setSelectedCat({ ...selectedCat, [parent]: arr });
    setMainJson({ ...selectedCat, [parent]: arr });
    console.log(finalJson, "FINAL JSON");
  };

  //Get datasetDetails to pre populate so that user can delete
  function getAllDataForTheDataset(datasetId) {
    let url = UrlConstant.base_url + UrlConstant.datasetview + datasetId + "/";
    let method = "GET";
    HTTPService(method, url, "", false, true)
      .then((response) => {
        console.log(response.data);
        let data = response.data;
        setdatasetname(data.name);
        setgovLawDesc(data.description ? data.description : "");
        setEditorGovLawValue(
          RichTextEditor.createValueFromString(
            data.description ? data.description : "",
            "html"
          )
        );
        console.log(data.data_capture_start, data.data_capture_end, "Dates");
        setSwitchchecked(data.constantly_update);
        if (data.data_capture_end) {
          setfromdate(
            data.data_capture_end ? new Date(data.data_capture_end) : null
          );
        }
        if (data.data_capture_start) {
          settodate(
            data.data_capture_start ? new Date(data.data_capture_start) : null
          );
        }
        setGeography(data.geography);
        let completeCategoryAndSub = data.category;
        let arr = Object.keys(completeCategoryAndSub);
        setMainJson({ ...completeCategoryAndSub });
        setCategory([...arr]);
        setNewSelectedCategory([...arr]);
        console.log(data.datasets, "DATASETS");
        setListOfFilesExistInDbForEdit([...data.datasets]);

        // setconstantlyupdate(response.data.constantly_update)s
        // setCategory({ ...response.data.category })
        // setGeography(response.data.geography)
        // setFromdate(response.data.data_capture_start)
        // setToDate(response.data.data_capture_end)
        // setDatasetDescription(response.data.description)
        // setfileData(response.data.datasets)
        // setOrgDetail(response.data.organization)
        // setorgdes(response.data.organization.org_description)
        // setUserDetails(response.data.user)
      })
      .catch((e) => {
        // setLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  }

  //
  const [idsForFilesDeleted, setIdsForFilesDeleted] = useState([]);
  function handleDeleteDatasetFileInFrontend(e, id) {
    console.log(id);
    let newArr = [...listOfFilesExistInDbForEdit];

    // if (id > -1) { // only splice array when item is found
    //     newArr.splice(id, 1); // 2nd parameter means remove one item only
    // }
    newArr = newArr.filter((item) => {
      return item.id != id;
    });

    setIdsForFilesDeleted([...idsForFilesDeleted, id]);
    setListOfFilesExistInDbForEdit([...newArr]);
  }

  useEffect(() => {
    getAllCategoryAndSubCategory();
    if (isDatasetEditModeOn) {
      getAllDataForTheDataset(datasetId);
    }
  }, []);

  return (
    <Container id="admin_add_dataset_main_container">
      {isLoading ? <Loader /> : ""}
      {isSubmitted ? (
        <Success
          okevent={() =>
            isLoggedInUserParticipant()
              ? history.push("/participant/datasets/")
              : history.push("/datahub/datasets")
          }
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Dataset updated Successfully"}
          imageText={"Success!"}
          msg={"Your dataset are updated."}
        ></Success>
      ) : (
        <>
          <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            action={action}
          >
            <Alert
              autoHideDuration={4000}
              onClose={handleClose}
              sx={{ width: "100%" }}
              severity={errorOrSuccess}
            >
              {messageForSnackBar}
            </Alert>
          </Snackbar>
          <Row className="main_heading_row">
            <Col lg={3} sm={6}>
              <span className="Main_heading_add_dataset">Add dataset</span>
            </Col>
          </Row>
          <Row style={{ margin: "20px 0px", padding: "0px" }}>
            {/* <Col style={{ margin: "0px", padding: "0px" }} lg={3} sm={6}>
                    <TextField
                        value={datasetname}
                        onKeyDown={handledatasetnameKeydown}
                        onChange={handleChangedatasetname}
                        error={nameErrorMessage ? true : false}
                        helperText={nameErrorMessage}
                        label="Dataset name" variant='standard' className='dataset_name_class' id='dataset_name' placeholder='Enter the dataset name' />
                </Col> */}
          </Row>
          <Row>
            <Col lg={12} sm={12}>
              <Box>
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                      labelProps.optional = (
                        <Typography variant="caption">
                          {" "}
                          <div> Atleast one is required </div>{" "}
                        </Typography>
                      );
                    }
                    if (isStepSkipped(index)) {
                      stepProps.completed = false;
                    }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>{" "}
                {activeStep === steps.length ? (
                  <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleReset}>Reset</Button>
                    </Box>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {/* <Typography sx={{ mt: 2, mb: 1 }}> {activeStep == 0 ? "Please provide the dataset name to enable the further steps" : ""}</Typography> */}
                    {activeStep == 0 ? (
                      <Col
                        style={{
                          margin: "50px auto 50px auto",
                          padding: "0px",
                        }}
                        lg={12}
                        sm={12}
                      >
                        <TextField
                          disabled={isDatasetEditModeOn ? true : false}
                          style={{ marginBottom: "20px" }}
                          value={datasetname}
                          onKeyDown={handledatasetnameKeydown}
                          onChange={handleChangedatasetname}
                          error={errorDatasetName ? true : false}
                          helperText={errorDatasetName ? errorDatasetName : ""}
                          label="Dataset name"
                          variant="filled"
                          className="dataset_name_class"
                          id="dataset_name"
                          placeholder="Enter the dataset name"
                        />

                        <div className="invite-participant-text-editor policyrte">
                          <RichTextEditor
                            placeholder="Dataset description"
                            toolbarConfig={toolbarConfig}
                            value={editorGovLawValue}
                            onKeyDown={handledatasetnameKeydown}
                            onChange={handlegovLawChange}
                            required
                            id="body-text"
                            name="bodyText"
                            type="string"
                            multiline
                            variant="filled"
                            style={{
                              minHeight: 410,
                              //   width: 420,
                              border: "1px solid black",
                              //   zIndex: 4,
                            }}
                          />
                          <span
                            style={{
                              color: "red",
                              fontSize: "10px",
                              display: "flex",
                              textAlign: "left",
                            }}
                          >
                            {errorDatasetDescription
                              ? errorDatasetDescription
                              : ""}
                          </span>
                        </div>
                      </Col>
                    ) : (
                      ""
                    )}

                    {activeStep == 1 ? (
                      <TabContext value={value}>
                        <Box>
                          <TabList
                            style={{ display: "none" }}
                            aria-label="lab API tabs example"
                          >
                            <Tab
                              onClick={(e) => handleChange(e, "1")}
                              label="Upload dataset"
                              value="1"
                            />
                            <Tab disabled label="Add metadata" value="2" />
                          </TabList>
                        </Box>
                        <TabPanel value="1">
                          <Admin_upload_dataset
                            isaccesstoken={isaccesstoken}
                            handleTab={setActiveStep}
                            seteErrorDatasetName={seteErrorDatasetName}
                            uploadFile={uploadFile}
                            setFile={setFile}
                            progress={progress}
                            setProgress={setProgress}
                            setMessageForSnackBar={setMessageForSnackBar}
                            setErrorOrSuccess={setErrorOrSuccess}
                            handleClick={handleClick}
                            isDatasetEditModeOn={isDatasetEditModeOn}
                            handleDeleteDatasetFileInFrontend={
                              handleDeleteDatasetFileInFrontend
                            }
                            listOfFilesExistInDbForEdit={
                              listOfFilesExistInDbForEdit
                            }
                            cancelForm={handleResetForm}
                            deleteFunc={deleteHandlerForFile}
                            mysqlFileList={mysqlFileList}
                            setMysqlFileList={setMysqlFileList}
                            postgresFileList={postgresFileList}
                            setPostgresFileList={setPostgresFileList}
                            setdatasetname={setdatasetname}
                            datasetname={datasetname}
                            setAllFiles={setAllFiles}
                            allFiles={allFiles}
                            localUploaded={localUploaded}
                            setLocalUploaded={setLocalUploaded}
                            handleMetadata={handleChange}
                            key={key}
                            setKey={setKey}
                            LiveApiFileList={LiveApiFileList}
                            setLiveApiFileList={setLiveApiFileList}
                          />
                        </TabPanel>
                        <TabPanel value="2"></TabPanel>
                      </TabContext>
                    ) : (
                      ""
                    )}

                    {activeStep == 2 ? (
                      <DataStandardizationInAddDataset
                        isaccesstoken={isaccesstoken}
                        allStandardisedFile={allStandardisedFile}
                        setAllStandardisedFile={setAllStandardisedFile}
                        standardisedFileLink={standardisedFileLink}
                        setStandardisedFileLink={setStandardisedFileLink}
                        datasetname={datasetname}
                        listOfFilesExistInDbForEdit={
                          listOfFilesExistInDbForEdit
                        }
                        isDatasetEditModeOn={isDatasetEditModeOn}
                      />
                    ) : (
                      ""
                    )}

                    {activeStep == 3 ? (
                      <AddMetadata
                        isaccesstoken={isaccesstoken}
                        setNewSelectedSubCategory={setNewSelectedSubCategory}
                        newSelectedCategory={newSelectedCategory}
                        newSelectedSubCategory={newSelectedSubCategory}
                        listOfFilesExistInDbForEdit={
                          listOfFilesExistInDbForEdit
                        }
                        handleDeleteDatasetFileInFrontend={
                          handleDeleteDatasetFileInFrontend
                        }
                        geography={geography}
                        datasetname={datasetname}
                        selectedCat={selectedCat}
                        setSelectedCat={setSelectedCat}
                        selectedSubCat={selectedSubCat}
                        setSelectedSubCat={setSelectedSubCat}
                        allCatFetched={allCatFetched}
                        SubCatList={SubCatList}
                        handleSubCategoryListForFinal={
                          handleSubCategoryListForFinal
                        }
                        finalJson={finalJson}
                        lengthOfSubCat={lengthOfSubCat}
                        isSubmitted={isSubmitted}
                        handleChangeGeography={handleChangeGeography}
                        handleAddDatasetSubmit={handleAddDatasetSubmit}
                        conscent={conscent}
                        setConscent={setConscent}
                        handleChangeSwitch={handleChangeSwitch}
                        Switchchecked={Switchchecked}
                        handleChangedatasetname={handleChangedatasetname}
                        fromdate={fromdate}
                        handleChangeFromDate={handleChangeFromDate}
                        todate={todate}
                        handleChangeToDate={handleChangeToDate}
                        handleChangeSubCatList={handleChangeSubCatList}
                        categoryNameList={categoryNameList}
                        handleChangeCategory={handleChangeCategory}
                        category={category}
                        subCategoryNameList={subCategoryNameList}
                        handleSubCategory={handleSubCategory}
                        subCategory={subCategory}
                      />
                    ) : (
                      ""
                    )}
                    {/* {activeStep == 2 ?
                                    <AddMetadata
                                        isSubmitted={isSubmitted}
                                        handleChangeGeography={handleChangeGeography}
                                        handleAddDatasetSubmit={handleAddDatasetSubmit}
                                        conscent={conscent}
                                        setConscent={setConscent}
                                        handleChangeSwitch={handleChangeSwitch}
                                        Switchchecked={Switchchecked}
                                        handleChangedatasetname={handleChangedatasetname}
                                        fromdate={fromdate}
                                        handleChangeFromDate={handleChangeFromDate}
                                        todate={todate}
                                        handleChangeToDate={handleChangeToDate}
                                        
                                        categoryNameList={categoryNameList} handleChangeCategory={handleChangeCategory} category={category} subCategoryNameList={subCategoryNameList} handleSubCategory={handleSubCategory} subCategory={subCategory} />
                                    : ""} */}
                    <Box
                      className="button_main_box"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        padding: "10px 80px",
                      }}
                    >
                      <Button
                        id="back_button"
                        className="back_btn"
                        // disabled={activeStep === 0}
                        onClick={
                          activeStep == 0 &&
                          onBoardingPage &&
                          getRoleLocal() == "datahub_participant_root"
                            ? () => history.push("/login")
                            : activeStep == 0
                            ? () => history.push("/datahub/datasets")
                            : handleBack
                        }
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      {isLoggedInUserParticipant() && isaccesstoken ? (
                        <Button
                          style={{ marginLeft: "400px" }}
                          id="back_button"
                          color="inherit"
                          onClick={cancelAction}
                          sx={{ mr: 1 }}
                        >
                          Finish Later
                        </Button>
                      ) : (
                        " "
                      )}
                      <Box sx={{ flex: "1 1 auto" }} />
                      {!onBoardingPage && activeStep != 0 && !isSubmitted ? (
                        <Button
                          id="cancel_button"
                          className="cancel_btn"
                          onClick={handleResetForm}
                        >
                          Cancel
                        </Button>
                      ) : (
                        ""
                      )}
                      <Box sx={{ flex: "1 1 auto" }} />
                      {/* {(isStepOptional(activeStep) && (localUploaded.length > 0 || mysqlFileList.length > 0 || postgresFileList.length > 0)) && (
                                        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                            Add metadata
                                        </Button>
                                    )} */}

                      {activeStep == 3 ? (
                        <Button disabled></Button>
                      ) : (
                        <Button
                          className="next_btn"
                          id="next_button"
                          disabled={
                            activeStep == 0 &&
                            datasetname != "" &&
                            editorGovLawValue
                              .getEditorState()
                              .getCurrentContent()
                              .hasText()
                              ? false
                              : activeStep == 1 &&
                                (localUploaded.length > 0 ||
                                  mysqlFileList.length > 0 ||
                                  postgresFileList.length > 0 ||
                                  LiveApiFileList.length > 0 ||
                                  listOfFilesExistInDbForEdit.length > 0)
                              ? false
                              : isSubmitted
                              ? false
                              : activeStep == 2
                              ? false
                              : true
                          }
                          onClick={
                            activeStep == 3
                              ? () => history.push("/datahub/datasets")
                              : handleNext
                          }
                        >
                          {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                      )}
                    </Box>
                  </React.Fragment>
                )}
              </Box>
            </Col>
          </Row>
          <Row></Row>
          {/* <CategorySelectorList /> */}
        </>
      )}
    </Container>
  );
};

export default AddDataset;

import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  GetErrorHandlingRoute,
  getUserMapId,
  GetErrorKey,
  validateInputField,
  handleUnwantedSpace,
  getTokenLocal
} from "../../Utils/Common";
import THEME_COLORS from "../../Constants/ColorConstants";
import RegexConstants from "../../Constants/RegexConstants";
import { useHistory } from "react-router-dom";
import labels from "../../Constants/labels";
import { Button } from 'react-bootstrap'
import HTTPService from "../../Services/HTTPService";
import UrlConstants from "../../Constants/UrlConstants";
import Loader from "../../Components/Loader/Loader"
import Success from "../../Components/Success/Success";
import "./LocalMachineUploadDataset.css"
import "./admin-add-dataset.css"
import CancelIcon from "@mui/icons-material/Cancel";
import { TextField } from "@mui/material";
import UploadDataset from "../Datasets/UploadDataset"
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import { TabContext } from "@mui/lab";
import { FileUploader } from "react-drag-drop-files";
import ConnectionProgressGif from "./ConnectionProgressGif";
import axios from "axios";
import { LinearProgress } from "@mui/material";
import { IconButton } from "@mui/material";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Accordion } from "@mui/material";
import { style } from "@mui/system";

const useStyles = {
  btncolor: {
    color: "white",
    "border-color": THEME_COLORS.THEME_COLOR,
    "background-color": THEME_COLORS.THEME_COLOR,
    float: "right",
    "border-radius": 0,
  },
  marginrowtop: { "margin-top": "20px" },
  marginrowtop8px: { "margin-top": "0px" },
};

export default function LocalMachineUploadDataset(props) {
  const { setMessageForSnackBar, handleTab, source, isaccesstoken,
    setErrorOrSuccess, progress, seteErrorDatasetName, setProgress, uploadFile, setFile, key, setKey,
    handleClick, isDatasetEditModeOn, datasetname, setdatasetname, handleMetadata, setLocalUploaded, localUploaded, postgresFileList, mysqlFileList, deleteFunc, cancelForm, LiveApiFileList, setLiveApiFileList } = props

  const history = useHistory();
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  // const [datasetname, setdatasetname] = useState("");
  // const [uploadFile, setFile] = useState([]);
  const [sizeismore, setSizeIsMore] = useState(false)
  const [fileValid, setfileValid] = useState("")
  const [datasetNameError, setDatasetNameError] = useState(null);
  const [datasetFileError, setDataSetFileError] = useState("");
  //   loader
  const [isLoader, setIsLoader] = useState(false);
  // const [progress, setProgress] = useState([])
  //   success screen
  const [isSuccess, setisSuccess] = useState(false);
  const fileTypes = ["XLS", "xlsx", "CSV", "PDF", "JPEG", "JPG", "PNG", "TIFF"]
  const [value, setValue] = useState("1");
  // const [key, setKey] = useState("")

  // useEffect(() => {
  //   // setdatasetname(datasetname);
  //   // setFile(uploadFile)
  // }, [datasetname, uploadFile])

  // useEffect(() => {

  // }, [datasetFileError])


  const handleAddDatasetFile = (currentFileList) => {
    console.log("clicked on add dataset submit btn11");
    setIsLoader(true)
    setfileValid(null);
    let url = ""
    if (isDatasetEditModeOn) {
      url = UrlConstants.base_url + UrlConstants.dataseteth + "?dataset_exists=True"
    } else {
      url = UrlConstants.base_url + UrlConstants.dataseteth
    }
    var bodyFormData = new FormData();
    let accesstoken =  isaccesstoken || getTokenLocal();
    const isValidFile = currentFileList.every(item => item.size < 52428800);
    console.log('currentFileList before upload dataset api call', currentFileList)

    for(let index = currentFileList.length-1; index>=0; index--){
      
      let item = currentFileList[index]
      console.log('index and item before reverse loop call',item, index)

      ApiCallToUploadAllDataset(item,index)

    }

      async function ApiCallToUploadAllDataset (item, index) {
        bodyFormData.append("datasets", item)
        bodyFormData.append("source", "file")
        bodyFormData.append("dataset_name", datasetname)
        console.log('dataset name in payload',datasetname,item, bodyFormData)
        const options = {
          onUploadProgress: (progressEvent) => {
            console.log(progressEvent.loaded);
            const { loaded, total } = progressEvent;
            let percent = Math.floor((loaded * 100) / total);
            console.log(`${loaded}kb of ${total}kb | ${percent}%`);
              setProgress(percent)
            currentFileList[index].progress = percent;
            setFile(currentFileList)
            setKey(Math.random())
  
          },
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${accesstoken}`,
          },
        };
     
      if (item) {
        await axios
          .post(url, bodyFormData, options)
          .then((response) => {
            console.log(response)
            setIsLoader(false)
            setLocalUploaded([...localUploaded, ...response.data.datasets])
            console.log("files uploaded");
            setMessageForSnackBar("Dataset file uploaded successfuly!")
            setErrorOrSuccess("success")
            handleClick()
            setSizeIsMore(false)

          }).catch((e) => {
            setIsLoader(false);
            console.log(e);
            var returnValues = GetErrorKey(e, bodyFormData.keys());
            var errorKeys = returnValues[0];
            var errorMessages = returnValues[1];
            console.log("errorkey", errorKeys)
            if (errorKeys.length > 0) {
              // setDataSetFileError("file is biggggg")
              for (var i = 0; i < errorKeys.length; i++) {
                console.log(errorMessages[i], errorKeys[i], "errormsg")
                switch (errorKeys[i].trim()) {
                  case "dataset_name":
                    seteErrorDatasetName(errorMessages[i]);
                    // setMessageForSnackBar(errorMessages[i])
                    handleTab(0)
                    break;
                  case "datasets":
                    // alert(errorMessages[i])
                    console.log(errorMessages[i], datasetFileError, "casecheck")
                    //setDataSetFileError(errorMessages[i]) //not printing the message in UI, to fix this
                    // setMessageForSnackBar(errorMessages[i])
                    break;
                  default:
                    setMessageForSnackBar("Some error occurred during uploading!")
                    handleClick()
                    break;
                }
              }
            } else {
              history.push(GetErrorHandlingRoute(e));
            }
          });
      
    };
  }
}

  const handleDeleteDatasetList = (filename, item) => {
    var bodyFormData = new FormData();

    bodyFormData.append("file_name", filename)
    bodyFormData.append("dataset_name", datasetname)
    bodyFormData.append("source", "file")
    HTTPService(
      "DELETE",
      UrlConstants.base_url + UrlConstants.dataseteth,
      bodyFormData,
      true,
      true
    )
      .then((response) => {
        console.log("FILE DELETED!");
        if (response.status === 204) {
          console.log("file deleted")
          var filteredArray = uploadFile.filter((item) => item.name !== filename)
          setFile(filteredArray)
          // setLocalUploaded(filteredArray)
        }
        // setFile(null)
      })
      .catch((e) => {
        setIsLoader(false);
        console.log(e);
        history.push(GetErrorHandlingRoute(e));
      }
      );
  };

  const handleFileChange = (fileIncoming) => {
    console.log("chnegsing", fileIncoming)
    
    let isInCommingFileDuplicate = false
    
    uploadFile.forEach(file => {
      // console.log('in for each',file.name,incomi)
      if(file.name==fileIncoming[0].name){
        isInCommingFileDuplicate = true
        console.log("File is duplicate")
      }
    });

    if(isInCommingFileDuplicate) return
    
    var currentFileList = [...uploadFile, ...fileIncoming]

    if (datasetname != null) {
       setFile(currentFileList)
      handleAddDatasetFile(currentFileList)
      // setSizeIsMore(false)
      console.log(currentFileList);
      
    } else {
      console.log("no dataset name given")
      setMessageForSnackBar("Some error occurred during uploading!")
    };
    // setFile(uploadFile)
    setfileValid("");

  };
  // const handleResetForm = () => {
  //   setdatasetname("")
  //   var bodyFormData = new FormData();
  //   bodyFormData.append("dataset_name", datasetname)
  //   HTTPService(
  //     "DELETE",
  //     UrlConstants.base_url + UrlConstants.datasetethcancel,
  //     bodyFormData,
  //     true,
  //     true
  //   )
  //     .then((response) => {
  //       console.log("FILE DELETED!");
  //       if (response.status === 204) {
  //         setFile(response.data)
  //         setdatasetname("")
  //         history.push("/datahub/datasets")
  //       }
  //       // setFile(null)
  //     })
  //     .catch((e) => {
  //       setIsLoader(false);
  //       console.log(e);
  //       history.push(GetErrorHandlingRoute(e));
  //     }
  //     );
  // };
  return (
    <>
      {isSuccess ? (
        <Success
          okevent={() => history.push("/datahub/datasets")}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"You added a new dataset"}
          imageText={"Added Successfully!"}
          msg={"Your dataset added in database."}
        ></Success>
      ) : (
        <div noValidate autoComplete="off">
          <Row style={{ height: "236px", marginBottom: "50px" }}>
            <Col xs={12} sm={12} md={12} lg={6}>
              <span className="AddDatasetmainheading">{props.title}</span>
              <FileUploader
                id="file_uploader_locally"
                disabled={!datasetname}
                name="file"
                multiple={true}
                maxSize={50}
                onSizeError={() => setDataSetFileError("Maximum file size allowed is 50MB")}       
                handleChange={(e) => handleFileChange(e)}
                types={fileTypes}
                children={
                  <UploadDataset
                    uploaddes={`Supports
                XLS, XLSX, CSV, PDF, JPEG, JPG, PNG, TIFF file formats up to 50MB per file
                  `}
                    uploadtitle="Upload Dataset"
                  />
                }
                classes="fileUpload"
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={6}>
              <ConnectionProgressGif loader={isLoader} datasetname={datasetname} deleteFunc={deleteFunc} postgresFileList={postgresFileList} mysqlFileList={mysqlFileList} localUploaded={localUploaded}
                progress={progress} setProgress={setProgress} uploadFile={uploadFile} setFile={setFile} key={key} LiveApiFileList={LiveApiFileList} setLiveApiFileList={setLiveApiFileList} 
                sizeismore={sizeismore} setSizeIsMore={setSizeIsMore}/>
            </Col>
          </Row>
          {/* {uploadFile ? 
           <Row style={{"margin-top": "10px"}}>
            {uploadFile.map((item) => {
               console.log("item", item.size)
              return (
              <p style={{color: "red", marginLeft: "30px"}}>{item != null && sizeismore && item.size > 52428800 ? "file size is more than 50MB" : " "}</p>)
            })}
          </Row>  : " "} */}
          {console.log("errormsg", datasetFileError)}
              <Row style={{ color: "red", fontSize: "14px", textAlign: "left", marginTop: "-50px", marginLeft: "0PX"}}>{datasetFileError}</Row>
        </div>
     )} 
    </>
  );
}


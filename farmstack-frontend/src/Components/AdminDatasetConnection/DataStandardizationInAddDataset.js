import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./DataStandardizationInAddDataset.css";
import Checkbox from "@mui/material/Checkbox";
import { FormGroup, FormHelperText, Button } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import { useHistory } from "react-router-dom";
import { GetErrorHandlingRoute } from "../../Utils/Common";
import { message } from "antd";

const DataStandardizationInAddDataset = (props) => {
  const {
    datasetname,
    setAllStandardisedFile,
    allStandardisedFile,
    standardisedFileLink,
    setStandardisedFileLink,
    listOfFilesExistInDbForEdit,
    isDatasetEditModeOn,
    isaccesstoken,
  } = props;

  console.log("type of ", typeof listOfFilesExistInDbForEdit);

  const [keysInUploadedDataset, setKeysInUploadedDataset] = useState([]);
  const [allFileNames, setAllFileNames] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileNameError, setFileNameError] = useState("");
  const [allStandardisedTempleteCategory, setAllStandardisedTempleteCategory] =
    useState([]);
  const [standardisedTempleteCategory, setStandardisedTempleteCategory] =
    useState([]);
  const [standardisedTempleteAttribute, setStandardisedTempleteAttribute] =
    useState([]);
  const [standardisedColum, setStandardisedColumn] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [maskedColumns, setMaskedColumns] = useState([]);
  const [standardisedFiles, setStandardisedFiles] = useState([]);
  const [alreadyStanddardizedFiles, setAlreadyStanddardizedFiles] = useState(
    []
  );

  const history = useHistory();
  const [messageApi, contextHolder] = message.useMessage();

  const success = (text, type) => {
    messageApi.open({
      type: type,
      content: text,
      duration: 5,
    });
  };

  const datapointCategoryChange = (value, index) => {
    console.log("value on change datapointCategoryChange", value);

    // first removing value of selected column
    let tmpStandardisedColum = [...standardisedColum];
    tmpStandardisedColum[index] = "";
    setStandardisedColumn(tmpStandardisedColum);

    let tmpArr = [...standardisedTempleteCategory];
    tmpArr[index] = value;
    setStandardisedTempleteCategory(tmpArr);
    console.log(
      "standardisedTempleteCategory",
      standardisedTempleteCategory,
      tmpArr
    );

    let tmpColumn = [...standardisedTempleteAttribute];
    tmpArr.forEach((attribute, index) => {
      console.log("attribute in for each", attribute);
      if (attribute?.datapoint_attributes) {
        tmpColumn[index] = Object.keys(attribute.datapoint_attributes);
      } else {
        tmpColumn[index] = [];
      }
    });
    setStandardisedTempleteAttribute(tmpColumn);
    console.log("standardisedTempleteColumn", tmpColumn);
  };

  const handleMaskedColumClicked = (columnName) => {
    let tmpMaskedColumns = [...maskedColumns];
    if (!tmpMaskedColumns.includes(columnName)) {
      tmpMaskedColumns.push(columnName);
    } else {
      const index = tmpMaskedColumns.indexOf(columnName);
      if (index > -1) {
        tmpMaskedColumns.splice(index, 1);
      }
    }
    setMaskedColumns(tmpMaskedColumns);
    console.log("masked colums ", tmpMaskedColumns);
  };

  const getAllFileNames = () => {
    // console.log("filename in getAllFileNames api call 1",allFileNames)
    let url =
      UrlConstant.base_url +
      UrlConstant.standardization_get_all_file_name +
      datasetname;
    setIsLoading(true);
    let checkforAccess = isaccesstoken ? isaccesstoken : false;

    HTTPService("GET", url, false, false, true, checkforAccess)
      .then((response) => {
        // console.log("filename in getAllFileNames api call 2",allFileNames)
        setIsLoading(false);
        console.log("response", response);
        let tmpAllFileName = [...allFileNames, ...response.data];
        // console.log("filename in getAllFileNames api call 3", allFileNames,tmpAllFileName)
        setAllFileNames(tmpAllFileName);
        if (isDatasetEditModeOn) {
          handleExistingStandardizedFiles(tmpAllFileName);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        //   success('Standardization template created successfully')
        console.log(e);
        if (
          e.response != null &&
          e.response != undefined &&
          e.response.status === 401
        ) {
          setError(true);
          history.push(GetErrorHandlingRoute(e));
        } else {
          setError(false);
          success(
            e.response.data && e.response.data.message
              ? e.response.data.message
              : "Something went wrong while getting file names.",
            "error"
          );
        }
      });
  };

  const getStandardiziedTemplate = () => {
    let url = UrlConstant.base_url + UrlConstant.standardization_get_data;
    let checkforAccess = isaccesstoken ? isaccesstoken : false;
    console.log("checkforAccess", checkforAccess);

    setIsLoading(true);
    HTTPService("GET", url, false, false, true, checkforAccess)
      .then((response) => {
        setIsLoading(false);
        console.log("response", response);
        if (response.status == 200) {
          setAllStandardisedTempleteCategory(response?.data);
          let tmpArr = new Array(response?.data.length);
          tmpArr.fill({});
          setStandardisedTempleteCategory(tmpArr);

          let tmpStandardisedColum = [...standardisedColum];
          tmpStandardisedColum.fill("");
          setStandardisedColumn(tmpStandardisedColum);

          // let tmp = { ...allAttributes };
          // let tmpDes = { ...allAttributesDes };
          // response.data.forEach((item, index) => {
          //   tmp[index] = Object.keys(item.datapoint_attributes);
          //   tmp[index].push(tmp[index]?.[0]);
          //   tmp[index][0] = "";

          //   tmpDes[index] = Object.values(item.datapoint_attributes);
          //   tmpDes[index].push(tmpDes[index]?.[0]);
          //   tmpDes[index][0] = "";
          // });
          // setAllAttributes(tmp);
          // setAllAttributesDes(tmpDes);
          // console.log("tmp in get call attributes", tmp,tmpDes, allAttributes);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        //   success('Standardization template created successfully')
        console.log(e);
        if (
          e.response != null &&
          e.response != undefined &&
          e.response.status === 401
        ) {
          setError(true);
          // success(
          //   e.response.data && e.response.data.message
          //     ? e.response.data.message
          //     : "User not registered", "error"
          // );
          history.push(GetErrorHandlingRoute(e));
        } else {
          setError(false);
          success(
            e.response.data && e.response.data.message
              ? e.response.data.message
              : "Something went wrong.",
            "error"
          );
        }
      });
  };

  const getFileColumnNames = () => {
    let url =
      UrlConstant.base_url + UrlConstant.standardization_get_file_columns;
    if (!fileName) {
      setFileNameError("Please select file name");
      return;
    }

    let payload = {
      file_path: fileName,
      // is_standardised: true,
    };
    let checkforAccess = isaccesstoken ? isaccesstoken : false;
    if (alreadyStanddardizedFiles.includes(fileName))
      payload["is_standardised"] = true;

    console.log("filename", fileName);
    setIsLoading(true);
    HTTPService("POST", url, payload, false, true, checkforAccess)
      .then((response) => {
        setIsLoading(false);
        console.log("response", response);
        setKeysInUploadedDataset(response.data);
      })
      .catch((e) => {
        setIsLoading(false);
        //   success('Standardization template created successfully')
        console.log(e);
        if (
          e.response != null &&
          e.response != undefined &&
          e.response.status === 401
        ) {
          setError(true);
          history.push(GetErrorHandlingRoute(e));
        } else {
          setError(false);
          success(
            e?.response?.data && e.response?.data?.message
              ? e.response.data.message
              : "Something went wrong while getting file column names.",
            "error"
          );
        }
      });
  };

  const handleStandaiseFile = () => {
    // saving standardised config

    let tmpAllStandardisedFile = { ...allStandardisedFile };
    console.log(
      "tmpAllStandardisedFile without update",
      tmpAllStandardisedFile
    );

    tmpAllStandardisedFile[fileName] = {
      standardised_templete_category: standardisedTempleteCategory,
      standardised_column: standardisedColum,
      masked_columns: maskedColumns,
    };

    setAllStandardisedFile(tmpAllStandardisedFile);
    console.log("tmpAllStandardisedFile", tmpAllStandardisedFile);

    // preparing payload

    let standardisationConfiguration = {};

    keysInUploadedDataset.forEach((column, index) => {
      if (standardisedColum[index]) {
        standardisationConfiguration[column] = standardisedColum[index];
      }
    });

    let payload = {
      mask_columns: maskedColumns,
      standardisation_configuration: standardisationConfiguration,
      file_path: fileName,
    };

    if (alreadyStanddardizedFiles.includes(fileName))
      payload["is_standardised"] = true;

    let url = UrlConstant.base_url + UrlConstant.standardise_file;
    setIsLoading(true);
    let checkforAccess = isaccesstoken ? isaccesstoken : false;
    HTTPService("POST", url, payload, false, true, checkforAccess)
      .then((response) => {
        setIsLoading(false);
        console.log("response", response);
        let tmpStandardisedFileLink = { ...standardisedFileLink };
        tmpStandardisedFileLink[fileName] =
          response?.data?.standardised_file_path;
        setStandardisedFileLink(tmpStandardisedFileLink);
        success("File standardised successfully!", "success");
      })
      .catch((e) => {
        setIsLoading(false);
        //   success('Standardization template created successfully')
        console.log(e);
        if (
          e.response != null &&
          e.response != undefined &&
          e.response.status === 401
        ) {
          setError(true);
          history.push(GetErrorHandlingRoute(e));
        } else {
          setError(false);
          success(
            e.response.data && e.response.data.message
              ? e.response.data.message
              : "Something went wrong while getting file column names.",
            "error"
          );
        }
      });
  };

  const handleExistingStandardizedFiles = (fileNames) => {
    let tmpAllFileName = [...fileNames];
    let tmpAlreadyStanddardizedFiles = [...alreadyStanddardizedFiles];
    console.log(
      "filename in handleExistingStandardizedFiles",
      allFileNames,
      tmpAllFileName
    );
    let tmpStandardized = { ...allStandardisedFile };

    listOfFilesExistInDbForEdit.forEach((dataset, index) => {
      tmpAllFileName.push(dataset.file);

      // console.log("tmpAllFileName in handleExistingStandardizedFiles", tmpAllFileName)
      if (Object.keys(dataset.standardisation_config).length) {
        tmpAlreadyStanddardizedFiles.push(dataset.file);

        // if tmpStandardized[dataset.file] donsn't exist then create
        if (!tmpStandardized[dataset.file])
          tmpStandardized[dataset.file] = dataset.standardisation_config;
      }
      // console.log("tmpStandardized in handleExistingStandardizedFiles",tmpStandardized)
    });
    setAllStandardisedFile(tmpStandardized);
    console.log("tmpStandardized1", tmpStandardized);
    setAllFileNames(tmpAllFileName);
    setAlreadyStanddardizedFiles(tmpAlreadyStanddardizedFiles);
  };

  useEffect(() => {
    getAllFileNames();
    getStandardiziedTemplate();
    console.log("isDatasetEditModeOn in standardistion", isDatasetEditModeOn);
    // if(isDatasetEditModeOn){
    //   handleExistingStandardizedFiles()
    // }
  }, []);

  useEffect(() => {
    getFileColumnNames();
    setStandardisedTempleteCategory([]);
    setStandardisedColumn([]);
    setMaskedColumns([]);
    if (allStandardisedFile[fileName]) {
      console.log(
        "allStandardisedFile[fileName]",
        allStandardisedFile[fileName],
        standardisedFileLink
      );
      setStandardisedTempleteCategory(
        allStandardisedFile[fileName]?.standardised_templete_category
      );
      setMaskedColumns(allStandardisedFile[fileName]?.masked_columns);

      // Chnage object reference
      // if(isDatasetEditModeOn){
      let tmpArr = [
        ...allStandardisedFile[fileName]?.standardised_templete_category,
      ];
      tmpArr.forEach((attribute, index) => {
        allStandardisedTempleteCategory.forEach((tmpAttribute) => {
          if (attribute?.id == tmpAttribute?.id) {
            tmpArr[index] = tmpAttribute;
          }
          // console.log("checking true of false in useeffect",attribute.id==tmpAttribute.id,attribute.id,tmpAttribute.id,attribute)
        });
      });
      // tmpArr[index] = value;
      setStandardisedTempleteCategory(tmpArr);
      setStandardisedColumn(allStandardisedFile[fileName]?.standardised_column);

      // getting attribute keys to show on render
      let tmpColumn = [...standardisedTempleteAttribute];
      tmpArr.forEach((attribute, index) => {
        console.log("attribute in for each", attribute);
        if (attribute?.datapoint_attributes)
          tmpColumn[index] = Object.keys(attribute.datapoint_attributes);
      });
      setStandardisedTempleteAttribute(tmpColumn);
      // }

      // if(!isDatasetEditModeOn) setStandardisedColumn(allStandardisedFile[fileName]?.standardised_column)
    }
  }, [fileName]);
  console.log("allFileNames", allFileNames);
  console.log(
    "all",
    allStandardisedTempleteCategory,
    standardisedTempleteAttribute,
    allFileNames
  );

  console.log("allStandardisedFile", allStandardisedFile);
  console.log(
    "all data",
    keysInUploadedDataset,
    standardisedTempleteCategory,
    standardisedColum,
    maskedColumns
  );
  console.log("listOfFilesExistInDbForEdit", listOfFilesExistInDbForEdit);
  return (
    <div className="data-standardization-in-add-dataset-container">
      {contextHolder}
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <FormControl
            sx={{ m: 1, minWidth: 1100, maxWidth: 1100 }}
            size="small"
          >
            <InputLabel id="select-file-name-label-small">
              Select file name
            </InputLabel>

            <Select
              labelId="demo-select-small"
              id="select-file-name-small"
              label="Select file name"
              value={fileName}
              error={fileNameError ? fileNameError : null}
              onChange={(e) => {
                setFileName(e.target.value);
                setFileNameError("");
                console.log("file on chnage", fileName, e.target);
              }}
            >
              {allFileNames?.map((item, index) => {
                console.log("file name in loop", item);
                let fileName = item.split("/");
                return (
                  <MenuItem key={item} value={item}>
                    {fileName[fileName.length - 1]}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText sx={{ color: "error.main" }}>
              {fileNameError}
            </FormHelperText>
          </FormControl>
        </Col>
      </Row>
      {keysInUploadedDataset.length ? (
        <Row className="data_standardization_title">
          {/* <div > */}
          <Col
            className="uploaded-data-column-names"
            xs={4}
            sm={4}
            md={4}
            lg={4}
          >
            <span>Uploaded Data Column Name</span>
          </Col>
          <Col xs={3} sm={3} md={3} lg={3}>
            <span>Standard Data Category</span>
          </Col>
          <Col xs={3} sm={3} md={3} lg={3}>
            <span>Standard Data Attribute</span>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1}>
            <span>Mask</span>
          </Col>

          {/* </div> */}
        </Row>
      ) : null}
      <div className="data_standardization_column">
        {keysInUploadedDataset?.map((keyNames, index) => {
          return (
            <div key={index}>
              <Row className="data_standardization_cloumn_container">
                <Col
                  xs={4}
                  sm={4}
                  md={4}
                  lg={4}
                  className="uploaded_data_column_name_title_container"
                >
                  <span className="uploaded_data_column_name_title">
                    {keyNames}
                  </span>
                </Col>
                <Col xs={3} sm={3} md={3} lg={3}>
                  <FormControl
                    sx={{ m: 1, minWidth: 200, maxWidth: 250 }}
                    size="small"
                  >
                    <InputLabel id="demo-select-small">
                      Select datapoint category
                    </InputLabel>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      label="Select datapoint category"
                      value={
                        standardisedTempleteCategory?.[index]
                          ? standardisedTempleteCategory?.[index]
                          : ""
                      }
                      onChange={(e) =>
                        datapointCategoryChange(e.target.value, index)
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {/* { console.log(standardisedTempleteCategory?.[index],allStandardisedTempleteCategory, "THIS IS THE VVALUENBASBAHUSB")} */}
                      {allStandardisedTempleteCategory?.map((item) => {
                        console.log(
                          "This is to check value of object reff",
                          standardisedTempleteCategory?.[index] === item,
                          standardisedTempleteCategory?.[index],
                          item
                        );
                        return (
                          <MenuItem key={item.datapoint_category} value={item}>
                            {item.datapoint_category}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Col>

                <Col xs={3} sm={3} md={3} lg={3}>
                  <FormControl
                    sx={{ m: 1, minWidth: 200, maxWidth: 250 }}
                    size="small"
                  >
                    <InputLabel id="demo-select-small">
                      Select column/key
                    </InputLabel>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      label="Select column/key"
                      value={
                        standardisedColum[index] ? standardisedColum[index] : ""
                      }
                      onChange={(e) => {
                        let tmpArr = [...standardisedColum];
                        tmpArr[index] = e.target.value;
                        setStandardisedColumn(tmpArr);
                      }}
                    >
                      {console.log(
                        "standardisedColum[index]",
                        standardisedColum[index],
                        standardisedTempleteAttribute[index]
                      )}
                      {standardisedTempleteAttribute[index]?.map(
                        (item, index) => {
                          return (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          );
                        }
                      )}
                    </Select>
                  </FormControl>
                </Col>

                <Col xs={1} sm={1} md={1} lg={1}>
                  <FormGroup>
                    <Checkbox
                      checked={maskedColumns.includes(keyNames)}
                      onClick={(e) => handleMaskedColumClicked(keyNames)}
                    />
                    {/* <FormControlLabel
                    control={<Checkbox onChange={() => setCheckBox(true)} />}
                  /> */}
                  </FormGroup>
                </Col>
              </Row>
              <hr />
            </div>
          );
        })}
      </div>
      {keysInUploadedDataset.length ? (
        <Row>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            className="standardization-button-container"
          >
            <Button
              onClick={handleStandaiseFile}
              id="standardise-file-button"
              style={{ color: "white", background: "#c09507" }}
            >
              Standardise
            </Button>
          </Col>
        </Row>
      ) : null}
    </div>
  );
};

export default DataStandardizationInAddDataset;

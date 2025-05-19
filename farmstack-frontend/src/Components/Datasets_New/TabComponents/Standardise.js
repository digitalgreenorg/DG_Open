import React, { useState, useEffect, useContext } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Standardise.css";
import EmptyFile from "./EmptyFile";
import StandardiseRow from "./StandardiseRow";
import UrlConstant from "../../../Constants/UrlConstants";
import HTTPService from "../../../Services/HTTPService";
import { getTokenLocal } from "../../../Utils/Common";
import { FarmStackContext } from "../../Contexts/FarmStackContext";
import GlobalStyle from "../../../Assets/CSS/global.module.css";

// const detailsStyle = {
//   fontFamily: "'Montserrat' !important",
//   fontWeight: "400 !important",
//   fontSize: "16px !important",
//   lineHeight: "22px !important",
//   color: "#212B36 !important",
//   textAlign: "left",
//   marginBottom: "24px !important",
// };

const accordionTitleStyle = {
  fontFamily: "'Montserrat' !important",
  fontWeight: "600 !important",
  fontSize: "16px !important",
  lineHeight: "24px !important",
  color: "#212B36 !important",
};

const Standardise = ({
  datasetId,
  isEditModeOn,
  standardisedUpcomingFiles,
  standardisedFileLink,
  setStandardisedFileLink,
  getDatasetForEdit,
}) => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [standardisedColum, setStandardisedColumn] = useState([]);
  const [maskedColumns, setMaskedColumns] = useState([]);
  const [standardiseFiles, setStandardiseFiles] = useState([]);
  const [standardiseFile, setStandardiseFile] = useState("");
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState();
  const [keysInUploadedDataset, setKeysInUploadedDataset] = useState([]);
  const [datapointCategories, setDatapointCategories] = useState([]);
  const [datapointCategory, setDatapointCategory] = useState([]);
  const [datapointAttributes, setDatapointAttributes] = useState([]);
  const [standardiseNames, setStandardiseNames] = useState([]);
  const [standardiseName, setStandardiseName] = useState();
  const [isFetchedData, setIsFetchedData] = useState(false);
  const fileExt = ["xlsx", "xls", "csv"];

  const handleChange = () => (event, isExpanded) => {
    setExpanded(isExpanded ? true : false);
  };

  const getAllFileNames = () => {
    let url = UrlConstant.base_url + UrlConstant.list_of_files + datasetId;
    let accessToken = getTokenLocal() ?? false;
    callLoader(true);
    HTTPService("GET", url, false, false, accessToken)
      .then((response) => {
        callLoader(false);
        let arr = [];
        let tempArr = response?.data?.forEach((r) => {
          let obj = {
            id: r.id,
            file: r.file,
            label: r.file?.slice(r.file?.lastIndexOf("/") + 1),
          };
          if (
            fileExt.includes(obj.label.slice(obj.label.lastIndexOf(".") + 1))
          ) {
            arr.push(obj);
          }
        });
        // let tmpAllFileName = [...standardiseFiles, ...response.data]
        setStandardiseFiles(arr);
      })
      .catch((e) => {
        callLoader(false);
        console.log(e);
      });
  };

  const getFileColumnNames = () => {
    let url = UrlConstant.base_url + UrlConstant.get_file_columns;
    let accessToken = getTokenLocal() ?? false;
    let payload = {
      id: standardiseFile,
    };
    if (standardiseFile) {
      callLoader(true);
      HTTPService("POST", url, payload, false, accessToken)
        .then((response) => {
          setKeysInUploadedDataset(response.data);
          isEditModeOn
            ? getDatasetForEdit(datasetId)
            : getDatasetForEdit(datasetId, "idCreated");
          callLoader(false);
        })
        .catch((e) => {
          callLoader(false);
          callToast(
            "Something went wrong while fetching columns",
            "error",
            true
          );
          console.log(e);
        });
    }
  };
  const getStandardiziedTemplate = () => {
    let url = UrlConstant.base_url + UrlConstant.standardization_get_data;
    HTTPService("GET", url, false, false, true)
      .then((response) => {
        if (response.status == 200) {
          setDatapointCategories(response?.data);
          let tmpArr = new Array(response?.data.length);
          tmpArr.fill({});
          setDatapointCategory(tmpArr);

          let tmpStandardisedColum = [...standardisedColum];
          tmpStandardisedColum.fill("");
          setStandardisedColumn(tmpStandardisedColum);
          getFileColumnNames();
          setIsFetchedData(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const datapointCategoryChange = (value, index) => {
    let tmpStandardisedColum = [...standardisedColum];
    tmpStandardisedColum[index] = "";
    setStandardisedColumn(tmpStandardisedColum);

    let tmpArr = [...datapointCategory];
    tmpArr[index] = value;
    setDatapointCategory(tmpArr);

    let tmpColumn = [...datapointAttributes];
    tmpArr.forEach((attribute, index) => {
      if (attribute?.datapoint_attributes)
        tmpColumn[index] = Object.keys(attribute.datapoint_attributes);
    });
    setDatapointAttributes(tmpColumn);
  };
  const handleMaskCheckBox = (columnName, index) => {
    let tmpMaskedColumns = [...maskedColumns];
    if (!tmpMaskedColumns.includes(columnName)) {
      tmpMaskedColumns.splice(index, 0, columnName);
    } else {
      const ind = tmpMaskedColumns.indexOf(columnName);
      if (ind > -1) {
        tmpMaskedColumns.splice(ind, 1);
      }
    }
    setMaskedColumns(tmpMaskedColumns);
  };
  const handleStandaiseFile = () => {
    // preparing payload
    let standardisationConfiguration = {};
    keysInUploadedDataset.forEach((column, index) => {
      if (standardisedColum[index]) {
        standardisationConfiguration[column] = standardisedColum[index];
      }
    });

    let config = {};
    keysInUploadedDataset.forEach((column, index) => {
      if (standardisedColum[index]) {
        config[column] = {
          mapped_to: standardisedColum[index],
          mapped_category: datapointCategory[index]?.datapoint_category,
          masked: maskedColumns.includes(column),
        };
      } else if (maskedColumns.includes(column)) {
        config[column] = {
          masked: maskedColumns.includes(column),
        };
      }
    });

    let payload = {
      mask_columns: maskedColumns,
      standardised_configuration: standardisationConfiguration,
      config: config,
    };

    let url =
      UrlConstant.base_url +
      UrlConstant.standardised_file +
      standardiseFile +
      "/";
    callLoader(true);
    HTTPService("PUT", url, payload, false, true)
      .then((response) => {
        callLoader(false);
        callToast("File Standardised successfully!", "success", true);
        let tmpStandardisedFileLink = { ...standardisedFileLink };
        tmpStandardisedFileLink[standardiseFile] =
          response?.data?.standardised_file_path;
        setStandardisedFileLink(tmpStandardisedFileLink);
        getDatasetForEdit(datasetId, "idCreated");
      })
      .catch((e) => {
        callLoader(false);
        callToast(
          "Something went wrong while file standardise!",
          "error",
          true
        );
        console.log(e);
      });
  };
  const getStandardiseFileName = () => {
    const result = standardiseFiles.filter((obj) => {
      return obj.id === standardiseFile;
    });
    if (result) {
      return result[0].label;
    } else {
      return "";
    }
  };
  function isObject(item) {
    return typeof item === "object" && !Array.isArray(item) && item !== null;
  }
  useEffect(() => {
    getAllFileNames();
  }, []);

  useEffect(() => {
    getStandardiziedTemplate();
    if (!isEditModeOn && !standardisedUpcomingFiles?.length) {
      setStandardisedColumn([]);
      setMaskedColumns([]);
      const result = standardiseFiles.filter((obj) => {
        return obj.id === standardiseFile;
      });
      setStandardisedColumn(
        standardiseFiles[result?.[0]?.file]?.standardised_column
      );
      setIsFetchedData(false);
    }
    setExpanded(true);
  }, [standardiseFile]);

  useEffect(() => {
    if (isEditModeOn && standardisedUpcomingFiles && isFetchedData) {
      let tmpArr = standardisedUpcomingFiles.filter(
        (item) => item.id === standardiseFile
      );
      let standardised_obj = tmpArr?.[0]?.standardisation_config;
      let tmpStandardisedColum = [...standardisedColum];
      let tempMaskedColumns = [];
      let tempdPointCategories = [];
      standardised_obj = isObject(standardised_obj) ? standardised_obj : {};
      keysInUploadedDataset.forEach((column, index) => {
        Object.keys(standardised_obj).forEach(function (key, ind) {
          if (column === key) {
            tmpStandardisedColum[index] = standardised_obj[key].mapped_to;
            tempdPointCategories[index] = standardised_obj[key].mapped_category;
            if (standardised_obj[key].masked) {
              tempMaskedColumns[index] = key;
            }
          }
        });
      });
      let finalTemp = [];
      tempdPointCategories.forEach((res, ind) => {
        datapointCategories.forEach((item, index) => {
          if (res === item.datapoint_category) {
            finalTemp[ind] = item;
          }
        });
      });
      let tmpColumn = [...datapointAttributes];

      finalTemp.forEach((attribute, index) => {
        if (attribute?.datapoint_attributes) {
          tmpColumn[index] = Object.keys(attribute.datapoint_attributes);
        }
      });
      setDatapointCategory(finalTemp);
      setDatapointAttributes(tmpColumn);
      setStandardisedColumn(tmpStandardisedColum);
      setMaskedColumns(tempMaskedColumns);
      setIsFetchedData(false);
    }
    if (!isEditModeOn && standardisedUpcomingFiles && isFetchedData) {
      console.log(isEditModeOn, standardisedUpcomingFiles, isFetchedData);
      let tmpArr = standardisedUpcomingFiles.filter(
        (item) => item.id === standardiseFile
      );
      let standardised_obj = tmpArr?.[0]?.standardisation_config;
      let tmpStandardisedColum = [...standardisedColum];
      let tempMaskedColumns = [];
      let tempdPointCategories = [];
      standardised_obj = isObject(standardised_obj) ? standardised_obj : {};
      keysInUploadedDataset.forEach((column, index) => {
        Object.keys(standardised_obj).forEach(function (key, ind) {
          if (column === key) {
            tmpStandardisedColum[index] = standardised_obj[key].mapped_to;
            tempdPointCategories[index] = standardised_obj[key].mapped_category;
            if (standardised_obj[key].masked) {
              tempMaskedColumns[index] = key;
            }
          }
        });
      });
      let finalTemp = [];
      tempdPointCategories.forEach((res, ind) => {
        datapointCategories.forEach((item, index) => {
          if (res === item.datapoint_category) {
            finalTemp[ind] = item;
          }
        });
      });
      let tmpColumn = [...datapointAttributes];

      finalTemp.forEach((attribute, index) => {
        if (attribute?.datapoint_attributes) {
          tmpColumn[index] = Object.keys(attribute.datapoint_attributes);
        }
      });
      console.log(finalTemp);
      setDatapointCategory(finalTemp);
      setDatapointAttributes(tmpColumn);
      setStandardisedColumn(tmpStandardisedColum);
      setMaskedColumns(tempMaskedColumns);
      setIsFetchedData(false);
    }
  }, [standardiseFile, keysInUploadedDataset]);

  return (
    <div className="mt-20">
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
        Standardise
      </Typography>
      <Typography
        className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
      >
        Enhance the quality and consistency of your dataset by applying
        standardized formats and structures.
      </Typography>
      <Box className="text-left mt-30">
        <FormControl fullWidth sx={{ width: mobile ? "100%" : "368px" }}>
          <InputLabel>File name</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="standardi-seselect-file-name"
            value={standardiseFile}
            onChange={(e) => setStandardiseFile(e.target.value)}
            sx={{
              textAlign: "left",
              color: "rgb(0, 171, 85)",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#919EAB",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#919EAB",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#919EAB",
              },
            }}
            label="File name"
            placeholder="File name"
          >
            {standardiseFiles &&
              standardiseFiles?.length &&
              standardiseFiles?.map((item, index) => {
                return (
                  <MenuItem
                    id={`standardise-file-name-${index}`}
                    key={item?.id}
                    value={item?.id}
                  >
                    {item?.label}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <Box className="mt-50">
          {data ? (
            <></>
          ) : (
            <EmptyFile text={"You have not uploaded any files"} />
          )}
        </Box>
        <Box>
          {standardiseFile ? (
            <Accordion
              sx={{
                boxShadow: expanded
                  ? "0px 20px 40px -4px rgba(145, 158, 171, 0.16)"
                  : "",
                borderRadius: expanded ? "8px" : "",
                border: expanded ? "1px solid #919EAB" : "",
              }}
              expanded={expanded}
              onChange={handleChange()}
              data-testid="accordion_component"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
                sx={{
                  "&.MuiAccordionSummary-root": {
                    borderBottom: expanded ? "1px solid #919EAB" : "",
                    backgroundColor: "#eafbf3",
                  },
                }}
              >
                <Box className="w-100 d-flex justify-content-between">
                  <Typography sx={accordionTitleStyle}>
                    {getStandardiseFileName()}
                  </Typography>
                  {/* <img
                    className="mr-55"
                    src={require("../../../Assets/Img/delete_gray.svg")}
                  /> */}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Box sx={{ overflow: "auto" }}>
                    {keysInUploadedDataset?.map((keyName, index) => (
                      <StandardiseRow
                        keyName={keyName}
                        index={index}
                        key={index}
                        templates={templates}
                        setTemplates={setTemplates}
                        template={template}
                        setTemplate={setTemplate}
                        datapointAttributes={datapointAttributes}
                        setDatapointAttributes={setDatapointAttributes}
                        datapointCategories={datapointCategories}
                        datapointCategory={datapointCategory}
                        setDatapointCategory={setDatapointCategory}
                        standardiseNames={standardiseNames}
                        setStandardiseNames={setStandardiseNames}
                        standardiseName={standardiseName}
                        setStandardiseName={setStandardiseName}
                        standardisedColum={standardisedColum}
                        setStandardisedColumn={setStandardisedColumn}
                        maskedColumns={maskedColumns}
                        datapointCategoryChange={datapointCategoryChange}
                        handleMaskCheckBox={handleMaskCheckBox}
                      />
                    ))}
                  </Box>
                  <Box className="text-right mt-30 mb-26">
                    <Button
                      sx={{
                        fontFamily: "Montserrat",
                        fontWeight: 700,
                        fontSize: "14px",
                        width: "86px",
                        height: "36px",
                        background: "#00A94F",
                        borderRadius: "8px",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#00A94F",
                          color: "#fffff",
                        },
                      }}
                      variant="contained"
                      onClick={() => handleStandaiseFile()}
                      id={`standardise-apply-btn`}
                    >
                      Apply
                    </Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Standardise;

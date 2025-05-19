import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import {
  GetErrorKey,
  getTokenLocal,
  getUserMapId,
  goToTop,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import "./AddDataSet.css";
import BasicDetails from "../Datasets_New/TabComponents/BasicDetails";
import UploadFile from "../Datasets_New/TabComponents/UploadFile";
import Categorise from "../Datasets_New/TabComponents/Categorise";
import UsagePolicy from "../Datasets_New/TabComponents/UsagePolicy";
import Standardise from "../Datasets_New/TabComponents/Standardise";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import { GetErrorHandlingRoute } from "../../Utils/Common";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import KalroSpecificMasking from "./TabComponents/KalroSpecificMasking";

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

const AddDataSet = (props) => {
  const history = useHistory();
  const { callLoader, callToast } = useContext(FarmStackContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));

  const containerStyle = {
    marginLeft: mobile || tablet ? "30px" : "144px",
    marginRight: mobile || tablet ? "30px" : "144px",
  };
  const [value, setValue] = useState(0);
  const [validator, setValidator] = useState(false);
  const [standardisationValue, setstandardisationValue] = useState(0);

  // Basic Details
  const [errorDataSetName, seteErrorDataSetName] = useState("");
  const [errorDataSetDescription, setDescriptionErrorMessage] = useState("");

  const [datasetId, setDatasetId] = useState();
  const [dataSetName, setDataSetName] = useState("");
  const [dataSetDescription, setDataSetDescription] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDatasetCreated, setIsDatasetCreated] = useState(false);
  const [fromDateError, setFromDateError] = useState(false);
  const [toDateError, setToDateError] = useState(false);

  // Upload File
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [sqlFiles, setSqlFiles] = useState([]);
  const [postgresFiles, setPostgresFiles] = useState([]);
  const [sqLiteFiles, setSqLiteFiles] = useState([]);
  const [restApifiles, setRestApiFiles] = useState([]);

  // Standardise
  const [allStandardisedFile, setAllStandardisedFile] = useState({});
  const [standardisedFiles, setStandardisedFiles] = useState([]);
  const [standardisedFileLink, setStandardisedFileLink] = useState({});

  // Categories
  const [categorises, setCategorises] = useState({});
  const [geography, setGeography] = useState({
    country: {
      name: "India",
      isoCode: "IN",
      flag: "🇮🇳",
      phonecode: "91",
      currency: "INR",
      latitude: "20.00000000",
      longitude: "77.00000000",
      timezones: [
        {
          zoneName: "Asia/Kolkata",
          gmtOffset: 19800,
          gmtOffsetName: "UTC+05:30",
          abbreviation: "IST",
          tzName: "Indian Standard Time",
        },
      ],
    },
    state: null,
    city: null,
  });
  const [hasThemesKey, setHasThemesKey] = useState(false);
  const [subCategoryIds, setSubCategoryIds] = useState([]);

  // Usage Policy
  const [allFilesAccessibility, setAllFilesAccessibility] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeStandarizationValue = (event, newValue) => {
    setstandardisationValue(newValue);
  };
  console.log("todate1", toDate);

  const handleNext = () => {
    if (value === 0) {
      let tmpTodate = new Date(toDate);
      let tmpFromDate = new Date(fromDate);
      let body = {
        user_map: getUserMapId(),
        name: dataSetName,
        description: dataSetDescription,
        constantly_update: isUpdating,
        data_capture_start: isUpdating
          ? null
          : new Date(
              tmpFromDate.getTime() - tmpFromDate.getTimezoneOffset() * 60000
            ).toJSON(),
        data_capture_end: isUpdating
          ? null
          : new Date(
              tmpTodate.getTime() - tmpTodate.getTimezoneOffset() * 60000
            ).toJSON(),
      };
      let accessToken = getTokenLocal() ?? false;
      let url = "";
      let method = "";
      if ((props.isEditModeOn && props.datasetIdForEdit) || isDatasetCreated) {
        if (props.isEditModeOn && props.datasetIdForEdit) {
          url =
            UrlConstant.base_url +
            UrlConstant.add_basic_dataset +
            props.datasetIdForEdit +
            "/";
        } else {
          url =
            UrlConstant.base_url +
            UrlConstant.add_basic_dataset +
            datasetId +
            "/";
        }
        method = "PUT";
      } else {
        url = UrlConstant.base_url + UrlConstant.add_basic_dataset;
        method = "POST";
      }
      callLoader(true);
      HTTPService(method, url, body, false, true, accessToken)
        .then((res) => {
          callLoader(false);
          if (!props.isEditModeOn && !props.datasetIdForEdit) {
            setDatasetId(res?.data?.id);
            setIsDatasetCreated(true);
          }
          setValue(value + 1);
          getDatasetForEdit(res?.data?.id, "idCreated");
        })
        .catch(async (err) => {
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
                case "name":
                  seteErrorDataSetName(errorMessages[i]);
                  break;
                default:
                  let response = await GetErrorHandlingRoute(err);
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
            let response = await GetErrorHandlingRoute(err);
            console.log("responce in err", response);
            if (response.toast) {
              //callToast(message, type, action)
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
    } else if (value >= 1 && value < 4) {
      setValue(value + 1);
    }
  };

  const isDisabled = () => {
    if (value === 0) {
      if (
        dataSetName &&
        dataSetDescription &&
        !errorDataSetName &&
        !errorDataSetDescription &&
        (isUpdating || (fromDate && toDate))
      ) {
        return false;
      } else {
        return true;
      }
    } else if (value === 1) {
      if (
        uploadedFiles?.length ||
        sqlFiles?.length ||
        postgresFiles?.length ||
        restApifiles?.length
      ) {
        return false;
      } else {
        return true;
      }
    } else if (value === 3) {
      if (geography) {
        if (hasThemesKey) {
          if ("Themes" in categorises && categorises["Themes"].length > 0) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  };

  const shouldTabDisabled = () => {
    if (
      (datasetId || props.datasetIdForEdit) &&
      (sqlFiles?.length > 0 ||
        postgresFiles?.length > 0 ||
        restApifiles?.length > 0 ||
        uploadedFiles?.length > 0)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const shouldLastTabDisabled = () => {
    if (hasThemesKey) {
      if ("Themes" in categorises && categorises["Themes"].length > 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const handleClickRoutes = () => {
    if (isLoggedInUserParticipant() && getTokenLocal()) {
      return "/participant/new_datasets";
    } else if (
      isLoggedInUserAdmin() ||
      (isLoggedInUserCoSteward() && getTokenLocal())
    ) {
      return "/datahub/new_datasets";
    }
  };

  const handleSubmit = () => {
    let body = {
      user_map: getUserMapId(),
      name: dataSetName,
      description: dataSetDescription,
      category: categorises,
      sub_categories_map: subCategoryIds,
      geography: geography,
      constantly_update: isUpdating,
      data_capture_start: !isUpdating && fromDate ? fromDate : null,
      data_capture_end: !isUpdating && toDate ? toDate : null,
    };
    let url = "";
    let method = "";
    if (props.isEditModeOn && props.datasetIdForEdit) {
      url =
        UrlConstant.base_url +
        UrlConstant.add_basic_dataset +
        props.datasetIdForEdit +
        "/";
      method = "PUT";
    } else {
      url =
        UrlConstant.base_url + UrlConstant.add_basic_dataset + datasetId + "/";
      method = "PUT";
    }
    let checkforAcess = getTokenLocal() ?? false;
    callLoader(true);
    HTTPService(method, url, body, false, true, checkforAcess)
      .then((response) => {
        callLoader(false);
        if (props.isEditModeOn && props.datasetIdForEdit) {
          callToast("Dataset updated successfully!", "success", true);
        } else {
          callToast("Dataset added successfully!", "success", true);
        }
        if (isLoggedInUserParticipant() && getTokenLocal()) {
          history.push("/participant/new_datasets");
        } else if (isLoggedInUserAdmin() && getTokenLocal()) {
          history.push("/datahub/new_datasets");
        } else if (isLoggedInUserCoSteward() && getTokenLocal()) {
          history.push("/datahub/new_datasets");
        }
      })
      .catch(async (e) => {
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
        if (error.toast) {
          callToast(
            error?.message ||
              (props.isEditModeOn && props.datasetIdForEdit
                ? "Something went wrong while updating dataset!"
                : "Something went wrong while adding dataset!"),
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
        console.log(e);
      });
  };

  const getDatasetForEdit = (dId, idCreated) => {
    if (props.datasetIdForEdit || idCreated) {
      (() => {
        let accessToken = getTokenLocal() ?? false;
        let url =
          UrlConstant.base_url +
          UrlConstant.datasetview +
          (dId ? dId : props.datasetIdForEdit) +
          "/";
        callLoader(true);
        HTTPService("GET", url, "", false, true, accessToken)
          .then((response) => {
            callLoader(false);
            setDataSetName(response.data.name);
            if (Object.keys(response.data?.geography)?.length) {
              setGeography(response.data?.geography);
            }
            setIsUpdating(response.data.constantly_update);
            setFromDate(
              response.data.data_capture_start
                ? response.data.data_capture_start
                : ""
            );
            // console.log("settodate", toDate, response?.data?.data_capture_end);
            setToDate(
              response.data.data_capture_end
                ? response.data.data_capture_end
                : ""
            );
            setDataSetDescription(response.data.description);
            // preparing files for edit
            let newArr = [...files];
            let tempFiles = response.data.datasets?.filter(
              (dataset) => dataset.source === "file"
            );
            let tempSqlFiles = response.data.datasets?.filter(
              (dataset) => dataset.source === "mysql"
            );
            let tempPostgresFiles = response.data.datasets?.filter(
              (dataset) => dataset.source === "postgresql"
            );
            let tempRestApiFiles = response.data.datasets?.filter(
              (dataset) => dataset.source === "live_api"
            );
            let tempUploadedFiles = [];
            if (tempFiles && tempFiles?.length > 0) {
              tempFiles.forEach((tempFile, index) => {
                tempUploadedFiles.push({
                  id: tempFile.id,
                  file: tempFile.file,
                  source: tempFile.source,
                });
              });
            }
            setUploadedFiles(tempFiles);

            let tempSFiles = [];
            if (tempSqlFiles && tempSqlFiles?.length > 0) {
              tempSqlFiles.forEach((tempFile, index) => {
                tempSFiles.push({
                  id: tempFile.id,
                  file: tempFile.file,
                  source: tempFile.source,
                });
              });
            }
            setSqlFiles(tempSqlFiles);

            let tempPostgressFiles = [];
            if (tempPostgresFiles && tempPostgresFiles?.length > 0) {
              tempPostgresFiles.forEach((tempFile, index) => {
                tempPostgressFiles.push({
                  id: tempFile.id,
                  file: tempFile.file,
                  source: tempFile.source,
                });
              });
            }

            setPostgresFiles(tempPostgresFiles);

            let tempRestApiiFiles = [];
            if (tempRestApiFiles && tempRestApiFiles?.length > 0) {
              tempRestApiFiles.forEach((tempFile, index) => {
                tempRestApiiFiles.push({
                  id: tempFile.id,
                  file: tempFile.file,
                  source: tempFile.source,
                });
              });
            }
            setRestApiFiles(tempRestApiFiles);

            // preparing Standardisation
            let tempStandardisedFiles = [];
            response.data.datasets.forEach((dset) => {
              tempStandardisedFiles.push({
                id: dset.id,
                file: dset.standardised_file,
                standardisation_config: dset.standardisation_config,
              });
            });
            setStandardisedFiles(tempStandardisedFiles);

            setCategorises(response?.data?.categories);

            const updateSubCategoryIds = () => {
              const ids = new Set(
                response?.data?.categories?.flatMap((category) =>
                  category.subcategories.map((subcategory) => subcategory.id)
                )
              );
              setSubCategoryIds([...ids]);
            };
            updateSubCategoryIds();

            // prepare accesibility for all files in usage policy
            let tempAccessibilities = [];
            response.data.datasets.forEach((dset) => {
              tempAccessibilities.push({
                id: dset.id,
                file: dset.file,
                accessibility: dset.accessibility,
              });
            });
            setAllFilesAccessibility(tempAccessibilities);
          })
          .catch(async (e) => {
            callLoader(false);
            // callToast(
            //   "Something went wrong while loading dataset!",
            //   "error",
            //   true
            // );
            let error = await GetErrorHandlingRoute(e);
            console.log("Error obj", error);
            console.log(e);
            if (error.toast) {
              callToast(
                error?.message || "Something went wrong while loading dataset!",
                error?.status === 200 ? "success" : "error",
                true
              );
            }
            if (error.path) {
              history.push(error.path);
            }
          });
      })();
    }
  };
  useEffect(() => {
    // edit Dataset API call
    getDatasetForEdit();
    const getAdminCategories = () => {
      let checkforAccess = getTokenLocal() ?? false;
      HTTPService(
        "GET",
        UrlConstant.base_url + UrlConstant.add_category_edit_category,
        "",
        true,
        true,
        checkforAccess
      )
        .then((response) => {
          let tmpThemeKey =
            "Themes" in response?.data && response?.data["Themes"].length > 0;
          setHasThemesKey(tmpThemeKey);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getAdminCategories();
  }, []);

  useEffect(() => {
    goToTop();
  }, [value]);

  return (
    <Box>
      <Box sx={containerStyle}>
        <div className="text-left mt-50">
          <span
            className="add_light_text cursor-pointer breadcrumbItem"
            onClick={() => history.push(handleClickRoutes())}
            id="add-dataset-breadcrum"
            data-testid="goPrevRoute"
          >
            Datasets
          </span>
          <span className="add_light_text ml-11">
            {/* <img src={require("../../Assets/Img/dot.svg")} /> */}
            <ArrowForwardIosIcon sx={{ fontSize: "14px", fill: "#00A94F" }} />
          </span>
          <span className="add_light_text ml-11 fw600">
            {props.datasetIdForEdit
              ? "Edit Dataset"
              : "Add new Dataset"}
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
          {props.datasetIdForEdit
            ? "Edit Dataset"
            : "Add new Dataet"}
        </Typography>
        <Typography
          className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
        >
          {props.datasetIdForEdit
            ? "Modify and update your existing dataset."
            : "Upload and publish a new dataset for sharing and collaboration."}{" "}
        </Typography>
        <Box
          sx={{
            marginTop: "30px",
            borderBottom: 1,
            borderColor: "divider",
            borderBottom: "1px solid #3D4A52 !important",
          }}
        >
          <Tabs
            className="tabs"
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: "#00A94F !important" },
              "& .MuiTab-root": {
                color: "#637381 !important",
                borderLeft: "none !important",
                borderTop: "none !important",
                borderRight: "none !important",
              },
              "& .Mui-selected": { color: "#00A94F !important" },
            }}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            value={value}
            onChange={handleChange}
          >
            <Tab
              label={
                <span
                  className={value == 0 ? "tab_header_selected" : "tab_header"}
                >
                  Basic details
                </span>
              }
              id="add-dataset-tab-1"
            />
            <Tab
              sx={{
                "&.MuiButtonBase-root": {
                  minWidth: "182.5px",
                },
              }}
              label={
                <span
                  className={value == 1 ? "tab_header_selected" : "tab_header"}
                >
                  Upload or import
                </span>
              }
              disabled={datasetId || props.datasetIdForEdit ? false : true}
              id="add-dataset-tab-2"
            />
            <Tab
              id="add-dataset-tab-3"
              label={
                <span
                  className={value == 2 ? "tab_header_selected" : "tab_header"}
                >
                  Standardise
                </span>
              }
              disabled={shouldTabDisabled()}
            />
            <Tab
              id="add-dataset-tab-4"
              label={
                <span
                  className={value == 3 ? "tab_header_selected" : "tab_header"}
                >
                  Categorise
                </span>
              }
              disabled={shouldTabDisabled()}
            />
            <Tab
              id="add-dataset-tab-5"
              label={
                <span
                  className={value == 4 ? "tab_header_selected" : "tab_header"}
                >
                  Usage policy
                </span>
              }
              disabled={shouldTabDisabled() || shouldLastTabDisabled()}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <BasicDetails
            datasetIdForEdit={props.datasetIdForEdit}
            dataSetName={dataSetName}
            setDataSetName={setDataSetName}
            dataSetDescription={dataSetDescription}
            setDataSetDescription={setDataSetDescription}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
            fromDateError={fromDateError}
            setFromDateError={setFromDateError}
            toDateError={toDateError}
            setToDateError={setToDateError}
            validator={validator}
            errorDataSetName={errorDataSetName}
            seteErrorDataSetName={seteErrorDataSetName}
            errorDataSetDescription={errorDataSetDescription}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UploadFile
            datasetId={
              props.isEditModeOn && props.datasetIdForEdit
                ? props.datasetIdForEdit
                : datasetId
            }
            dataSetName={dataSetName}
            files={files}
            setFiles={setFiles}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            sqlFiles={sqlFiles}
            setSqlFiles={setSqlFiles}
            postgresFiles={postgresFiles}
            setPostgresFiles={setPostgresFiles}
            sqLiteFiles={sqLiteFiles}
            setSqLiteFiles={setSqLiteFiles}
            restApifiles={restApifiles}
            setRestApiFiles={setRestApiFiles}
            validator={validator}
            getDatasetForEdit={getDatasetForEdit}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Box
            sx={{
              marginTop: "30px",
              borderBottom: 1,
              borderColor: "divider",
              // borderBottom: "1px solid #3D4A52 !important",
            }}
          >
            <Tabs
              className="tabs"
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
              }}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              value={standardisationValue}
              onChange={handleChangeStandarizationValue}
            >
              <Tab
                label={
                  <span
                    className={
                      standardisationValue == 0
                        ? "tab_header_selected"
                        : "tab_header"
                    }
                  >
                    Mask
                  </span>
                }
                id="add-dataset-tab-1"
              />
              <Tab
                sx={{
                  "&.MuiButtonBase-root": {
                    minWidth: "182.5px",
                  },
                }}
                label={
                  <span
                    className={
                      standardisationValue == 1
                        ? "tab_header_selected"
                        : "tab_header"
                    }
                  >
                    Rename
                  </span>
                }
                disabled={datasetId || props.datasetIdForEdit ? false : true}
                id="add-dataset-tab-2"
              />
            </Tabs>
          </Box>

          <TabPanel value={standardisationValue} index={0}>
            <KalroSpecificMasking
              datasetId={
                props.isEditModeOn && props.datasetIdForEdit
                  ? props.datasetIdForEdit
                  : datasetId
              }
              isEditModeOn={props.isEditModeOn}
              standardisedUpcomingFiles={standardisedFiles}
              dataSetName={dataSetName}
              allStandardisedFile={allStandardisedFile}
              setAllStandardisedFile={setAllStandardisedFile}
              standardisedFileLink={standardisedFileLink}
              setStandardisedFileLink={setStandardisedFileLink}
              validator={validator}
              getDatasetForEdit={getDatasetForEdit}
            />
          </TabPanel>
          <TabPanel value={standardisationValue} index={1}>
            <Standardise
              datasetId={
                props.isEditModeOn && props.datasetIdForEdit
                  ? props.datasetIdForEdit
                  : datasetId
              }
              isEditModeOn={props.isEditModeOn}
              standardisedUpcomingFiles={standardisedFiles}
              dataSetName={dataSetName}
              allStandardisedFile={allStandardisedFile}
              setAllStandardisedFile={setAllStandardisedFile}
              standardisedFileLink={standardisedFileLink}
              setStandardisedFileLink={setStandardisedFileLink}
              validator={validator}
              getDatasetForEdit={getDatasetForEdit}
            />
          </TabPanel>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Categorise
            datasetId={
              props.isEditModeOn && props.datasetIdForEdit
                ? props.datasetIdForEdit
                : datasetId
            }
            isEditModeOn={props.isEditModeOn}
            categorises={categorises}
            setCategorises={setCategorises}
            geography={geography}
            setGeography={setGeography}
            validator={validator}
            hasThemesKey={hasThemesKey}
            setHasThemesKey={setHasThemesKey}
            setSubCategoryIds={setSubCategoryIds}
            subCategoryIds={subCategoryIds}
          />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <UsagePolicy
            datasetId={
              props.isEditModeOn && props.datasetIdForEdit
                ? props.datasetIdForEdit
                : datasetId
            }
            allFilesAccessibility={allFilesAccessibility}
            setAllFilesAccessibility={setAllFilesAccessibility}
            isEditModeOn={props.isEditModeOn}
          />
        </TabPanel>
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
              value === 4 ? handleSubmit() : handleNext();
            }}
          >
            {value === 4 ? "Submit" : "Next"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddDataSet;

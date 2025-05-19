/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DataSetForm from "../../../Components/Datasets/DataSetForm";

import $ from "jquery";
import {
  GetErrorHandlingRoute,
  validateInputField,
  handleUnwantedSpace,
  HandleSessionTimeout,
  fileUpload,
  getUserMapId,
  GetErrorKey,
} from "../../../Utils/Common";
import RegexConstants from "../../../Constants/RegexConstants";
import THEME_COLORS from "../../../Constants/ColorConstants";
import { useHistory } from "react-router-dom";
import labels from "../../../Constants/labels";
import Button from "@mui/material/Button";
import HTTPService from "../../../Services/HTTPService";
import UrlConstants from "../../../Constants/UrlConstants";
import Loader from "../../../Components/Loader/Loader";
import Success from "../../../Components/Success/Success";

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

export default function AddDataset(props) {
  useEffect(() => {
    setTimeout(() => {
      $(".addDatasetFromdate input.MuiInputBase-input").attr(
        "disabled",
        "disabled"
      );
      $(".addDatasetTodate input.MuiInputBase-input").attr(
        "disabled",
        "disabled"
      );
    }, 100);
  }, []);
  const history = useHistory();
  const [screenlabels, setscreenlabels] = useState(labels["en"]);

  const [reply, setreply] = useState("");
  const [datasetname, setdatasetname] = useState("");
  const [Geography, setGeography] = useState("");
  const [cropdetail, setCropdetail] = useState("");

  const [value, setValue] = React.useState("");
  const [recordsvalue, setrecordsvalue] = React.useState("");
  const [availablevalue, setavailablevalue] = React.useState("");
  const [isPublic, setIsPublic] = useState("");

  //   const [value, setValue] = React.useState("3 months");
  //   const [recordsvalue, setrecordsvalue] = React.useState("100k");
  //   const [availablevalue, setavailablevalue] = React.useState("available");

  //   date picker
  const [fromdate, setfromdate] = React.useState(null);
  const [todate, settodate] = React.useState(null);
  const [CheckEndDate, setCheckEndDate] = useState(false);
  const [file, setFile] = useState(null);
  const [fileValid, setfileValid] = useState("");

  const [nameErrorMessage, setnameErrorMessage] = useState(null);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState(null);
  const [categoryErrorMessage, setCategoryErrorMessage] = useState(null);
  const [geographyErrorMessage, setGeographyErrorMessage] = useState(null);
  const [cropDetailErrorMessage, setCropDetailErrorMessage] = useState(null);
  const [ageErrorMessage, setAgeErrorMessage] = useState(null);
  const [dataCaptureStartErrorMessage, setDataCaptureStartErrorMessage] =
    useState(null);
  const [dataCaptureEndErrorMessage, setDataCaptureEndErrorMessage] =
    useState(null);

  //   loader
  const [isLoader, setIsLoader] = useState(false);
  //   success screen
  const [isSuccess, setisSuccess] = useState(false);

  const handleAddDatasetSubmit = (e) => {
    e.preventDefault();
    console.log("clicked on add dataset submit btn11");
    var id = getUserMapId();
    console.log("user id", id);
    console.log("CHekckmkmc", fromdate, todate);
    setnameErrorMessage(null);
    setDescriptionErrorMessage(null);
    setCategoryErrorMessage(null);
    setGeographyErrorMessage(null);
    setCropDetailErrorMessage(null);
    setAgeErrorMessage(null);
    setDataCaptureStartErrorMessage(null);
    setDataCaptureEndErrorMessage(null);
    setfileValid(null);

    var bodyFormData = new FormData();
    bodyFormData.append("name", datasetname);
    bodyFormData.append("description", reply);
    bodyFormData.append(
      "category",
      JSON.stringify({
        crop_data: Crop_data,
        practice_data: Practice_data,
        farmer_profile: Farmer_profile,
        land_records: Land_records,
        cultivation_data: Cultivation_data,
        soil_data: Soil_data,
        weather_data: Weather_data,
        research_data: Research_data,
        livestock: Livestock,
        diary: Diary,
        poultry: Poultry,
        other: Other,
      })
    );
    bodyFormData.append("geography", Geography);
    if (cropdetail == null) {
      bodyFormData.append("crop_detail", "");
    } else {
      bodyFormData.append("crop_detail", cropdetail);
    }
    bodyFormData.append("constantly_update", Switchchecked);
    // bodyFormData.append("age_of_date", value);
    if (Switchchecked == true) {
      bodyFormData.append("age_of_date", "");
    } else {
      bodyFormData.append("age_of_date", value);
    }
    if (fromdate != null && Switchchecked == false) {
      bodyFormData.append("data_capture_start", fromdate.toISOString());
    }
    if (todate != null && Switchchecked == false) {
      bodyFormData.append("data_capture_end", todate.toISOString());
    }
    fileUpload(bodyFormData, file, "sample_dataset");
    bodyFormData.append("connector_availability", availablevalue);
    bodyFormData.append("is_public", isPublic);
    bodyFormData.append("dataset_size", recordsvalue);
    bodyFormData.append("user_map", id);
    bodyFormData.append("approval_status", "approved");
    setIsLoader(true);
    HTTPService(
      "POST",
      UrlConstants.base_url + UrlConstants.dataset,
      bodyFormData,
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        setisSuccess(true);
        console.log("dataset uploaded!");
      })
      .catch((e) => {
        setIsLoader(false);
        console.log(e);
        //console.log(e.response.data.sample_dataset[0]);
        var returnValues = GetErrorKey(e, bodyFormData.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "name":
                setnameErrorMessage(errorMessages[i]);
                break;
              case "description":
                setDescriptionErrorMessage(errorMessages[i]);
                break;
              case "category":
                setCategoryErrorMessage(errorMessages[i]);
                break;
              case "geography":
                setGeographyErrorMessage(errorMessages[i]);
                break;
              case "crop_detail":
                setCropDetailErrorMessage(errorMessages[i]);
                break;
              case "age_of_date":
                setAgeErrorMessage(errorMessages[i]);
                break;
              case "data_capture_start":
                setDataCaptureStartErrorMessage(errorMessages[i]);
                break;
              case "data_capture_end":
                setDataCaptureEndErrorMessage(errorMessages[i]);
                break;
              case "sample_dataset":
                setfileValid(errorMessages[i]);
                break;
              default:
                history.push(GetErrorHandlingRoute(e));
                break;
            }
          }
        } else {
          history.push(GetErrorHandlingRoute(e));
        }
        //setfileValid(e.response.data.sample_dataset[0]);
        // history.push(GetErrorHandlingRoute(e));
      });
  };

  const handleChange = (event) => {
    console.log(event.target.value);
    setValue(event.target.value);
  };

  const handleChangeRecords = (event) => {
    console.log(event.target.value);
    setrecordsvalue(event.target.value);
  };
  const handleChangeIsPublic = (event) => {
    console.log(event.target.value);
    setIsPublic(event.target.value === "true" ? true : false);
    // Set file to null whenever a public status is changed because the user could set
    // a different filetype than allowed for that specific visibility setting
    if (isPublic) setavailablevalue("Not Available");
    setFile(null);
  };
  const handleChangeAvailable = (event) => {
    console.log(event.target.value);
    setavailablevalue(event.target.value);
  };
  const handleFileChange = (file) => {
    setFile(file);
    console.log(file);
    setfileValid("");
  };
  const handleChangedatasetname = (e) => {
    validateInputField(e.target.value, RegexConstants.connector_name)
      ? setdatasetname(e.target.value)
      : e.preventDefault();
  };
  const handledatasetnameKeydown = (e) => {
    handleUnwantedSpace(datasetname, e);
  };
  const handleChangedescription = (e) => {
    console.log(e.target.value);
    validateInputField(e.target.value, RegexConstants.ORG_NAME_REGEX)
      ? setreply(e.target.value)
      : e.preventDefault();
  };
  const handledescriptionKeydown = (e) => {
    handleUnwantedSpace(reply, e);
  };
  const handleChangeGeography = (e) => {
    console.log(e.target.value);
    validateInputField(e.target.value, RegexConstants.connector_name)
      ? setGeography(e.target.value)
      : e.preventDefault();
  };
  const handleGeographyKeydown = (e) => {
    handleUnwantedSpace(Geography, e);
  };

  const handleChangecropdetail = (e) => {
    console.log(e.target.value);
    validateInputField(e.target.value, RegexConstants.connector_name)
      ? setCropdetail(e.target.value)
      : e.preventDefault();
  };
  const handleCropKeydown = (e) => {
    handleUnwantedSpace(cropdetail, e);
  };
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

  //   switch
  const [Switchchecked, setSwitchchecked] = React.useState(false);

  const handleChangeSwitch = (event) => {
    console.log("switch", event.target.checked);
    setSwitchchecked(event.target.checked);
    settodate(null);
    setfromdate(null);
  };

  //   checkbox
  const [Crop_data, setCrop_data] = React.useState(false);
  const [Practice_data, setPractice_data] = React.useState(false);
  const [Farmer_profile, setFarmer_profile] = React.useState(false);
  const [Land_records, setLand_records] = React.useState(false);
  const [Cultivation_data, setCultivation_data] = React.useState(false);
  const [Soil_data, setSoil_data] = React.useState(false);
  const [Weather_data, setWeather_data] = React.useState(false);
  const [Research_data, setResearch_data] = React.useState(false);

  const [Livestock, setLivestock] = React.useState(false);
  const [Diary, setDiary] = React.useState(false);
  const [Poultry, setPoultry] = React.useState(false);
  const [Other, setOther] = React.useState(false);

  const handleChangeCropData = (event) => {
    console.log(event.target.checked);
    setCrop_data(event.target.checked);
  };
  const handleChangePracticeData = (event) => {
    console.log(event.target.checked);
    setPractice_data(event.target.checked);
  };
  const handleChangeFarmer_profile = (event) => {
    console.log(event.target.checked);
    setFarmer_profile(event.target.checked);
  };
  const handleChangeLand_records = (event) => {
    console.log(event.target.checked);
    setLand_records(event.target.checked);
  };
  const handleChangeCultivationData = (event) => {
    console.log(event.target.checked);
    setCultivation_data(event.target.checked);
  };
  const handleChangeSoilData = (event) => {
    console.log(event.target.checked);
    setSoil_data(event.target.checked);
  };
  const handleChangeWeatherData = (event) => {
    console.log(event.target.checked);
    setWeather_data(event.target.checked);
  };
  const handleChangeResearchData = (event) => {
    console.log(event.target.checked);

    setResearch_data(event.target.checked);
  };

  const handleChangeLivestock = (event) => {
    console.log(event.target.checked);
    setLivestock(event.target.checked);
  };
  const handleChangeDiary = (event) => {
    console.log(event.target.checked);
    setDiary(event.target.checked);
  };
  const handleChangePoultry = (event) => {
    console.log(event.target.checked);
    setPoultry(event.target.checked);
  };
  const handleChangeOther = (event) => {
    console.log(event.target.checked);
    setOther(event.target.checked);
  };

  return (
    <>
      {isLoader ? <Loader /> : ""}
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
          <DataSetForm
            title={"Add Dataset"}
            reply={reply}
            datasetname={datasetname}
            handleChangedatasetname={handleChangedatasetname}
            handledatasetnameKeydown={handledatasetnameKeydown}
            handleChangedescription={handleChangedescription}
            handledescriptionKeydown={handledescriptionKeydown}
            Crop_data={Crop_data}
            handleChangeCropData={handleChangeCropData}
            handleCropKeydown={handleCropKeydown}
            Practice_data={Practice_data}
            handleChangePracticeData={handleChangePracticeData}
            Farmer_profile={Farmer_profile}
            handleChangeFarmer_profile={handleChangeFarmer_profile}
            Land_records={Land_records}
            handleChangeLand_records={handleChangeLand_records}
            Cultivation_data={Cultivation_data}
            handleChangeCultivationData={handleChangeCultivationData}
            Soil_data={Soil_data}
            handleChangeSoilData={handleChangeSoilData}
            Weather_data={Weather_data}
            handleChangeWeatherData={handleChangeWeatherData}
            Research_data={Research_data}
            handleChangeResearchData={handleChangeResearchData}
            Livestock={Livestock}
            handleChangeLivestock={handleChangeLivestock}
            Diary={Diary}
            handleChangeDiary={handleChangeDiary}
            Poultry={Poultry}
            handleChangePoultry={handleChangePoultry}
            Other={Other}
            handleChangeOther={handleChangeOther}
            Geography={Geography}
            handleChangeGeography={handleChangeGeography}
            handleGeographyKeydown={handleGeographyKeydown}
            cropdetail={cropdetail}
            handleChangecropdetail={handleChangecropdetail}
            Switchchecked={Switchchecked}
            handleChangeSwitch={handleChangeSwitch}
            value={value}
            handleChange={handleChange}
            fromdate={fromdate}
            handleChangeFromDate={handleChangeFromDate}
            todate={todate}
            handleChangeToDate={handleChangeToDate}
            recordsvalue={recordsvalue}
            handleChangeRecords={handleChangeRecords}
            availablevalue={availablevalue}
            handleChangeAvailable={handleChangeAvailable}
            isPublic={isPublic}
            handleChangeIsPublic={handleChangeIsPublic}
            handleFileChange={handleFileChange}
            file={file}
            fileValid={fileValid}
            nameErrorMessage={nameErrorMessage}
            descriptionErrorMessage={descriptionErrorMessage}
            categoryErrorMessage={categoryErrorMessage}
            geographyErrorMessage={geographyErrorMessage}
            cropDetailErrorMessage={cropDetailErrorMessage}
            ageErrorMessage={ageErrorMessage}
            dataCaptureStartErrorMessage={dataCaptureStartErrorMessage}
            dataCaptureEndErrorMessage={dataCaptureEndErrorMessage}
          />

          <Row>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              {datasetname &&
                reply &&
                Geography &&
                !CheckEndDate &&
                file &&
                (Switchchecked || fromdate) &&
                // file.size < 2097152 &&
                (Crop_data == true ||
                  Practice_data == true ||
                  Farmer_profile == true ||
                  Land_records == true ||
                  Cultivation_data == true ||
                  Soil_data == true ||
                  Weather_data == true ||
                  Research_data == true ||
                  Livestock == true ||
                  Diary == true ||
                  Poultry == true ||
                  Other) ? (
                <Button
                  onClick={handleAddDatasetSubmit}
                  variant="contained"
                  className="submitbtn"
                  type="submit"
                >
                  {screenlabels.common.submit}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  disabled
                  className="disbalesubmitbtn"
                >
                  {screenlabels.common.submit}
                </Button>
              )}
            </Col>
          </Row>
          <Row style={useStyles.marginrowtop8px}>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={() => history.push("/datahub/datasets")}
                variant="outlined"
                className="cancelbtn"
              >
                {screenlabels.common.cancel}
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

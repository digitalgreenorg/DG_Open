import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router-dom";
import $ from "jquery";
import DataSetForm from "../../../../Components/Datasets/DataSetForm";
import {
  validateInputField,
  handleUnwantedSpace,
  HandleSessionTimeout,
  getUserMapId,
  fileUpload,
  GetErrorHandlingRoute,
  GetErrorKey,
} from "../../../../Utils/Common";
import RegexConstants from "../../../../Constants/RegexConstants";
import THEME_COLORS from "../../../../Constants/ColorConstants";
import { useHistory } from "react-router-dom";
import labels from "../../../../Constants/labels";
import Button from "@mui/material/Button";
import HTTPService from "../../../../Services/HTTPService";
import UrlConstants from "../../../../Constants/UrlConstants";
import Loader from "../../../../Components/Loader/Loader";
import Success from "../../../../Components/Success/Success";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

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

export default function EditDatasetParticipant() {
  const history = useHistory();
  const [screenlabels, setscreenlabels] = useState(labels["en"]);

  const [reply, setreply] = useState("");
  const [datasetname, setdatasetname] = useState("");
  const [Geography, setGeography] = useState("");
  const [cropdetail, setCropdetail] = useState("");

  const [value, setValue] = React.useState("");
  const [recordsvalue, setrecordsvalue] = React.useState("");
  const [availablevalue, setavailablevalue] = React.useState("");

  //   date picker
  const [fromdate, setfromdate] = React.useState(null);
  const [todate, settodate] = React.useState(null);
  const [CheckEndDate, setCheckEndDate] = useState(false);

  const [file, setFile] = useState(null);
  const [filesize, setfilesize] = useState(false);
  const [fileValid, setfileValid] = useState("");

  const [approval_status, setApprovalStatus] = useState("");
  const [isPublic, setIsPublic] = useState("");

  //   loader
  const [isLoader, setIsLoader] = useState(false);
  //   success screen
  const [isSuccess, setisSuccess] = useState(false);

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

  //   retrive id for dataset
  const { id } = useParams();

  //   put request for dataset
  const handleEditDatasetSubmit = (e) => {
    e.preventDefault();
    console.log("clicked on edit dataset submit btn");
    var userid = getUserMapId();
    console.log("user id", userid);

    const datefrom = new Date(fromdate);
    console.log(datefrom);

    const dateto = new Date(todate);
    console.log(dateto);

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
    bodyFormData.append("crop_detail", cropdetail);
    bodyFormData.append("constantly_update", Switchchecked);
    // bodyFormData.append("age_of_date", value);
    if (Switchchecked == true) {
      bodyFormData.append("age_of_date", "");
    } else {
      bodyFormData.append("age_of_date", value);
    }
    // if (value != null) {
    //   bodyFormData.append("age_of_date", value);
    // } else {
    //   bodyFormData.append("age_of_date", "");
    // }

    if (fromdate != null && Switchchecked == false) {
      bodyFormData.append("data_capture_start", datefrom.toISOString());
    }
    if (todate != null && Switchchecked == false) {
      bodyFormData.append("data_capture_end", dateto.toISOString());
    }

    // file upload
    fileUpload(bodyFormData, file, "sample_dataset");
    // console.log(typeof file != "string");
    // if (file != null && typeof file != "string") {
    //   bodyFormData.append("sample_dataset", file);
    // }
    if (availablevalue != null) {
      bodyFormData.append("connector_availability", availablevalue);
    } else {
      bodyFormData.append("connector_availability", "");
    }
    bodyFormData.append("is_public", isPublic);
    if (recordsvalue != null) {
      bodyFormData.append("dataset_size", recordsvalue);
    } else {
      bodyFormData.append("dataset_size", "");
    }
    bodyFormData.append("user_map", userid);

    console.log("edit dataset", bodyFormData);
    setIsLoader(true);
    HTTPService(
      "PUT",
      UrlConstants.base_url + UrlConstants.dataset + id + "/",
      bodyFormData,
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        setisSuccess(true);
        console.log("dataset updated!");
      })
      .catch((e) => {
        setIsLoader(false);
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

  //   get dataset
  const getAccountDetails = async () => {
    // var id = getUserLocal();
    // console.log("user id", id);
    setIsLoader(true);
    console.log(id);

    await HTTPService(
      "GET",
      UrlConstants.base_url + UrlConstants.datasetparticipant + id + "/",
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("get request for edit dataset", response.data);
        setdatasetname(response.data.name);
        setreply(response.data.description);
        setGeography(response.data.geography);

        setSwitchchecked(response.data.constantly_update);
        console.log("testing", response.data.category.crop_detail !== "null");
        setCropdetail(response.data.crop_detail);
        setCrop_data(response.data.category.crop_data);
        setPractice_data(response.data.category.practice_data);
        setFarmer_profile(response.data.category.farmer_profile);
        setLand_records(response.data.category.land_records);
        setCultivation_data(response.data.category.cultivation_data);
        setSoil_data(response.data.category.soil_data);
        setWeather_data(response.data.category.weather_data);
        setResearch_data(response.data.category.research_data);
        setLivestock(response.data.category.livestock);
        setDiary(response.data.category.diary);
        setPoultry(response.data.category.poultry);
        setOther(response.data.category.other);

        setavailablevalue(response.data.connector_availability);
        setrecordsvalue(response.data.dataset_size);
        setValue(response.data.age_of_date);
        settodate(response.data.data_capture_end);
        setfromdate(response.data.data_capture_start);

        setApprovalStatus(response.data.approval_status);
        setIsPublic(response.data.is_public);

        // console.log("picture", response.data.profile_picture);
        // setphonenumber(response.data.phone_number);
        // setfirstname(response.data.first_name);
        // setlastname(response.data.last_name);
        // setemail(response.data.email);
        setFile(response.data.sample_dataset);
        // console.log(typeof typeof file);
        console.log(typeof response.data.sample_dataset);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  useEffect(() => {
    getAccountDetails();
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

  const handleChange = (event) => {
    console.log(event.target.value);
    setValue(event.target.value);
  };

  const handleChangeRecords = (event) => {
    console.log(event.target.value);
    setrecordsvalue(event.target.value);
  };
  const handleChangeAvailable = (event) => {
    console.log(event.target.value);
    setavailablevalue(event.target.value);
  };
  const handleChangeIsPublic = (event) => {
    console.log(event.target.value);
    setIsPublic(event.target.value === "true" ? true : false);
    // Reset sample file to upload
    if (isPublic) setavailablevalue("Not Available");
    setFile(null);
  };
  const handleFileChange = (file) => {
    setFile(file);
    setfileValid("");
    // setprofile_pic(file);
    console.log(file);
    console.log(typeof file);
    // if (file != null && file.size > 2097152) {
    //   setfilesize(true);
    // } else {
    //   setfilesize(false);
    // }
  };
  const handleChangedatasetname = (e) => {
    validateInputField(e.target.value, RegexConstants.DATA_SET_REGEX)
      ? setdatasetname(e.target.value)
      : e.preventDefault();
  };
  const handledatasetnameKeydown = (e) => {
    handleUnwantedSpace(datasetname, e);
  };
  const handleChangedescription = (e) => {
    console.log(e.target.value);
    setreply(e.target.value);
  };
  const handledescriptionKeydown = (e) => {
    handleUnwantedSpace(reply, e);
  };
  const handleChangeGeography = (e) => {
    console.log(e.target.value);
    validateInputField(e.target.value, RegexConstants.DATA_SET_REGEX)
      ? setGeography(e.target.value)
      : e.preventDefault();
  };
  const handleGeographyKeydown = (e) => {
    handleUnwantedSpace(Geography, e);
  };
  const handleChangecropdetail = (e) => {
    console.log(e.target.value);
    validateInputField(e.target.value, RegexConstants.DATA_SET_REGEX)
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
    console.log(event.target.checked);
    setSwitchchecked(event.target.checked);
    setValue(null);
    // if (event.target.checked == true) {
    //   setValue(null);
    // }
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
          okevent={() => history.push("/participant/datasets")}
          route={"participant/datasets"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Dataset updated Successfully"}
          imageText={"Success!"}
          msg={"Your dataset updated successfully!"}
        ></Success>
      ) : (
        <>
          <Row>
            <Col className="supportViewDetailsbackimage">
              <span
                onClick={() => {
                  history.push("/participant/datasets");
                }}
              >
                <img
                  src={require("../../../../Assets/Img/Vector.svg")}
                  alt="new"
                />
              </span>
              <span
                className="supportViewDetailsback"
                onClick={() => {
                  history.push("/participant/datasets");
                }}
              >
                {"Back"}
              </span>
            </Col>
          </Row>
          <div noValidate autoComplete="off">
            <DataSetForm
              title={"Edit Dataset"}
              reply={reply}
              datasetname={datasetname}
              handleChangedatasetname={handleChangedatasetname}
              handledatasetnameKeydown={handledatasetnameKeydown}
              handleChangedescription={handleChangedescription}
              handledescriptionKeydown={handledescriptionKeydown}
              Crop_data={Crop_data}
              handleChangeCropData={handleChangeCropData}
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
              handleCropKeydown={handleCropKeydown}
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
                {approval_status === "approved" ? (
                  <>
                    <Stack
                      sx={{ width: "100%", textAlign: "left" }}
                      spacing={2}
                    >
                      <Alert severity="warning">
                        <strong>
                          Caution! Modifying an already approved dataset will
                          reset the approval status, and this dataset will be
                          available only if approved again.
                        </strong>
                      </Alert>
                    </Stack>
                  </>
                ) : (
                  <></>
                )}
                {datasetname &&
                reply &&
                Geography &&
                !CheckEndDate &&
                file &&
                // !filesize &&
                //   (file ? file.size < 2097152 : false) &&
                //   typeof file == "string" &&
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
                    onClick={handleEditDatasetSubmit}
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
                  onClick={() => history.push("/participant/datasets")}
                  variant="outlined"
                  className="cancelbtn"
                >
                  {screenlabels.common.cancel}
                </Button>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
}

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import styles from "./onboarding.module.css";
import { Col, Row } from "react-bootstrap";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";

import global_style from "../../Assets/CSS/global.module.css";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import FileUploaderMain from "../Generic/FileUploader";
import MuiPhoneNumber from "material-ui-phone-number";
import UrlConstant from "../../Constants/UrlConstants";
import countryList from "react-select-country-list";

import {
  GetErrorHandlingRoute,
  GetErrorKey,
  getTokenLocal,
  getUserLocal,
  goToTop,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
  validateInputField,
} from "../../Utils/Common";
import HTTPService from "../../Services/HTTPService";
import CancelIcon from "@mui/icons-material/Cancel";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import { useHistory } from "react-router-dom";
import getCroppedImg, { isPhoneValid } from "./utils";
import ReactEasyCropperForFarmstack from "../Generic/ReactEasyCropperForFarmstack";
import Modal from "@mui/material/Modal";
import RegexConstants from "../../Constants/RegexConstants";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import parse from "html-react-parser";

const OrganizationDetails = (props) => {
  const history = useHistory();
  const { callLoader, callToast } = useContext(FarmStackContext);
  const [islogoLink, setIsLogoLink] = useState(false);
  const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const fileTypes = ["jpg", "jpeg", "png"];

  const countryNameList = useMemo(() => countryList().getData(), []);
  const { setActiveStep } = props;
  const [alreadyOnboarded, setAlreadyOnboarded] = useState(false);
  const [organisationDetails, setOrganisationDetails] = useState({
    organisation_name: "",
    organisation_mail_id: "",
    organisation_website_link: "",
    organisation_contact_number: "",
    organisation_address: "",
    organisation_country: "",
    organisation_pin_code: "",
    organisation_description: "",
  });
  const [organisationDetailsError, setOrganisationDetailsError] = useState({
    organisation_name_error: "",
    organisation_mail_id_error: "",
    organisation_website_link_error: "",
    organisation_contact_number_error: "",
    organisation_address_error: "",
    organisation_country_error: "",
    organisation_pin_code_error: "",
    organisation_description_error: "",
    organisation_logo_error_logo: "",
  });

  const clearErrors = (name) => {
    console.log(
      "🚀 ~ file: OrganizationDetails.jsx:86 ~ clearErrors ~ name:",
      name
    );

    let Message = "";
    // console.log(name, Message);
    switch (name) {
      case "organisation_mail_id":
        setOrganisationDetailsError({
          ...organisationDetailsError,
          organisation_mail_id_error: Message,
        });
        break;
      case "organisation_website_link":
        setOrganisationDetailsError({
          ...organisationDetailsError,
          organisation_website_link_error: Message,
        });
        break;
      case "organisation_address":
        setOrganisationDetailsError({
          ...organisationDetailsError,
          organisation_address_error: Message,
        });
        break;
      case "organisation_contact_number":
        setOrganisationDetailsError({
          ...organisationDetailsError,
          organisation_contact_number_error: Message,
        });
        break;
      case "organisation_description":
        setOrganisationDetailsError({
          ...organisationDetailsError,
          organisation_description_error: Message,
        });
        break;
      case "organisation_name":
        setOrganisationDetailsError({
          ...organisationDetailsError,
          organisation_name_error: Message,
        });
        break;
    }
  };
  const [uploadedLogo, setUploadedLogo] = useState(null);

  const setOnBoardedTrue = () => {
    let data = {
      user_id: getUserLocal(),
      on_boarded: true,
    };
    var url = UrlConstant.base_url + UrlConstant.onboarded;
    var bodyFormData = new FormData();
    bodyFormData.append("user_id", getUserLocal());
    bodyFormData.append("on_boarded", true);

    // setIsLoader(true);
    HTTPService("POST", url, data, false, true, getTokenLocal())
      .then((response) => {
        // setIsLoader(false);
        callToast("Onboarded successfuly", "success", true);

        // console.log("onboarded true response", response.data);
        if (isLoggedInUserParticipant()) {
          history.push("/participant/new_datasets");
        } else if (isLoggedInUserCoSteward()) {
          history.push("/datahub/new_datasets");
        }
      })
      .catch((e) => {
        callToast("Some error occurred", "error", true);
        // console.log(e);
      });
  };
  const handleOrgChange = (e, countryData) => {
    console.log(
      "🚀 ~ file: OrganizationDetails.jsx:165 ~ handleOrgChange ~ target:",
      e
    );
    if (e.target) {
      clearErrors(e.target.name);
      setOrganisationDetails({
        ...organisationDetails,
        [e.target.name]:
          e.target.name === "organisation_mail_id"
            ? e.target.value.trim()
            : e.target.value.trimStart(),
      });
    } else {
      clearErrors("organisation_contact_number");
      if (!isPhoneValid(e, countryData)) {
        setOrganisationDetailsError((prevState) => ({
          ...prevState,
          organisation_contact_number_error: "Invalid phone number",
        }));
      } else {
        setOrganisationDetailsError((prevState) => ({
          ...prevState,
          organisation_contact_number_error: "",
        }));
      }

      if (e.startsWith(`+${countryData?.dialCode}`)) {
        console.log("e", e, countryData?.dialCode);
        let index = `+${countryData?.dialCode}`.length;
        if (!e.includes(" ", index)) {
          e = e.substr(0, index) + " " + e.substr(index);
          console.log(e, "e");
          setOrganisationDetails({
            ...organisationDetails,
            organisation_contact_number: e ? e : "",
          });
        } else {
          setOrganisationDetails({
            ...organisationDetails,
            organisation_contact_number: e ? e : "",
          });
        }
      }
    }
  };

  const [preview, setPreview] = useState();
  const [tempImage, setTempImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploadedImgName, setUploadedImgName] = useState("");

  const canvasRef = useRef(null);
  const [key, setKey] = useState(0);

  const handleFileForCrop = (file) => {
    // console.log(file);
    setSelectedImage(URL.createObjectURL(file));
    setTempImage(file);
    setOpen(true);
    setKey(key + 1); // generate a new key when a file is uploaded
    setOrganisationDetailsError({
      ...organisationDetailsError,
      organisation_logo_error_logo: "",
    });
  };
  const convertImageUrlToObject = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const contentType = response.headers.get("content-type");
      // console.log(contentType, "contentType");
      const filename = tempImage?.name ?? "logo.png"; // You can implement this function to extract the filename from the URL
      const file = new File([blob], filename, { type: contentType });
      return file;
    } catch (error) {
      // console.log(error);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        selectedImage, // string url
        croppedAreaPixels, // updated as per user x and y and other values
        0
      );
      let croppedImageObjectAfterConvert = await convertImageUrlToObject(
        croppedImage
      );
      // console.log(
      //   "org logo",
      //   croppedImageObjectAfterConvert,
      //   croppedImageObjectAfterConvert?.name
      // );
      setUploadedImgName(croppedImageObjectAfterConvert?.name);
      setUploadedLogo(croppedImageObjectAfterConvert);
      setPreview(croppedImage);
      setIsLogoLink(false);
      setOpen(false);
    } catch (e) {
      // console.error(e);
      setOpen(false);
    }
  }, [croppedAreaPixels]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    // console.log("uploadedLogo", uploadedLogo);
  }, [uploadedLogo]);
  const handleSubmitOrganizationDetails = (e) => {
    e.preventDefault();
    callLoader(true);
    let url;
    let method;
    if (!alreadyOnboarded) {
      method = "POST";
      url = UrlConstant.base_url + UrlConstant.org;
    } else {
      method = "PUT";
      url = UrlConstant.base_url + UrlConstant.org + getUserLocal() + "/";
    }
    var bodyFormData = new FormData();
    bodyFormData.append("user_id", getUserLocal());
    bodyFormData.append(
      "org_email",
      organisationDetails.organisation_mail_id.toLowerCase()
    );
    bodyFormData.append("name", organisationDetails.organisation_name);
    bodyFormData.append(
      "website",
      organisationDetails.organisation_website_link
    );
    bodyFormData.append(
      "address",
      JSON.stringify({
        country: organisationDetails.organisation_country,
        pincode: organisationDetails.organisation_pin_code,
        address: organisationDetails.organisation_address,
        city: "",
      })
    );
    bodyFormData.append(
      "phone_number",
      organisationDetails.organisation_contact_number
    );
    {
      !islogoLink && bodyFormData.append("logo", uploadedLogo);
    }
    bodyFormData.append(
      "org_description",
      organisationDetails.organisation_description
    );
    console.log(isLoggedInUserParticipant(), "local");
    HTTPService(method, url, bodyFormData, true, true, false, false)
      .then((response) => {
        callLoader(false);
        // console.log(response);
        if (isLoggedInUserAdmin() && !props.isOrgSetting) {
          setActiveStep((prev) => prev + 1);
        } else if (
          (isLoggedInUserParticipant() || isLoggedInUserCoSteward()) &&
          !props.isOrgSetting
        ) {
          console.log("inside lk");
          // callToast("Onboarded successfuly", "success", true);
          setOnBoardedTrue();
        }
        if (response.status === 201) {
          if (props.isOrgSetting) {
            callToast(
              "Organisation settings updated successfully!",
              "success",
              true
            );
          } else {
            callToast(
              "Organisation details added successfully!",
              "success",
              true
            );
          }
        }
      })
      .catch(async (e) => {
        callLoader(false);
        var returnValues = GetErrorKey(e, bodyFormData.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          let errorObj = {};
          let keyValueOfErrorAndName = {
            org_email: "organisation_mail_id_error",
            website: "organisation_website_link_error",
            address: "organisation_address_error",
            phone_number: "organisation_contact_number_error",
            org_description: "organisation_description_error",
            name: "organisation_name_error",
            logo: "organisation_logo_error_logo",
          };
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "org_email":
                errorObj["organisation_mail_id_error"] = errorMessages[i];

                break;
              case "website":
                errorObj["organisation_website_link_error"] = errorMessages[i];

                break;
              case "address":
                errorObj["organisation_address_error"] = errorMessages[i];

                break;
              case "phone_number":
                errorObj["organisation_contact_number_error"] =
                  errorMessages[i];

                break;
              case "org_description":
                errorObj["organisation_description_error"] = errorMessages[i];

                break;
              case "name":
                errorObj["organisation_name_error"] = errorMessages[i];

                break;
              case "logo":
                errorObj["organisation_logo_error_logo"] = errorMessages[i];
                break;
              default:
                let error = await GetErrorHandlingRoute(e);
                if (error) {
                  callToast(
                    error?.message,
                    error?.status === 200 ? "success" : "error",
                    true
                  );
                  // console.log(e, error);
                }
                break;
            }
          }
          setOrganisationDetailsError(errorObj);
        } else {
          let error = await GetErrorHandlingRoute(e);
          // console.log("Error obj", error);
          // console.log(e);
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
        }
      });
  };

  // console.log(
  //   "organisation_logo_error_logo",
  //   organisationDetailsError.organisation_logo_error_logo
  // );
  const getOrganizationData = () => {
    callLoader(true);
    let url = UrlConstant.base_url + UrlConstant.org + getUserLocal() + "/";
    console.log(
      "🚀 ~ file: OrganizationDetails.jsx:415 ~ getOrganizationData ~ u:",
      url
    );
    let method = "GET";
    HTTPService(method, url, "", false, true, false, false)
      .then((response) => {
        callLoader(false);

        console.log(response);
        console.log(
          "🚀 ~ file: OrganizationDetails.jsx:421 ~ .then ~ response:",
          response
        );
        let data = response.data;
        let org = response.data.organization;
        if (org != "null") {
          setAlreadyOnboarded(true);
          setOrganisationDetails({
            organisation_name: org?.name,
            organisation_mail_id: org?.org_email,
            organisation_website_link: org?.website,
            organisation_contact_number: org?.phone_number,
            organisation_address: org?.address.address,
            organisation_country: org?.address?.country,
            organisation_pin_code: org?.address?.pincode,
            organisation_description: org?.org_description
              ? parse(org?.org_description)
              : org?.org_description,
          });
          if (org?.logo) {
            setPreview(
              org?.logo ? UrlConstant.base_url_without_slash + org?.logo : null
            );
            setIsLogoLink(true);
          }
        }
        // console.log("success in get", data);
      })
      .catch(async (e) => {
        console.log("gett", e);
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        // console.log(e);
        if (error?.toast) {
          callToast(
            error?.message || "Something went wrong",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error?.path) {
          history.push(error.path);
        }
      });
  };
  useEffect(() => {
    getOrganizationData();
    goToTop(0);
  }, []);

  // console.log("uploadedlogo", uploadedLogo, preview);

  return (
    <>
      <div className={styles.main_box}>
        <div className={styles.main_label}>
          {props.isOrgSetting
            ? "Organisation settings"
            : "Organisation Details"}
          <Typography
            className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
          >
            {props.isOrgSetting
              ? "Manage and update your organization's details to reflect accurate and up-to-date information."
              : ""}
          </Typography>
        </div>

        {props.isOrgSetting ? (
          ""
        ) : (
          <div className={styles.sub_label}>
            Enter your organisation details, we will show to others!
          </div>
        )}
        <div className={styles.all_inputs}>
          <Row>
            <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
              <TextField
                fullWidth
                required
                placeholder="Organisation Name"
                id="organisation_name"
                label="Organisation Name"
                variant="outlined"
                name="organisation_name"
                value={organisationDetails.organisation_name}
                onChange={(e) => handleOrgChange(e)}
                error={
                  organisationDetailsError.organisation_name ? true : false
                }
                helperText={organisationDetailsError.organisation_name_error}
              />
            </Col>
            <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
              <TextField
                fullWidth
                required
                placeholder="Organisation mail id"
                label="Organisation mail id"
                variant="outlined"
                id="organisation_mail_id"
                name="organisation_mail_id"
                value={organisationDetails.organisation_mail_id}
                onChange={(e) => handleOrgChange(e)}
                error={
                  organisationDetailsError.organisation_mail_id_error
                    ? true
                    : false
                }
                helperText={
                  organisationDetailsError.organisation_mail_id_error
                    ? organisationDetailsError.organisation_mail_id_error
                    : ""
                }
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
              <TextField
                fullWidth
                required
                placeholder="Website Link"
                label="Website Link"
                variant="outlined"
                id="organisation_website_link"
                name="organisation_website_link"
                value={organisationDetails.organisation_website_link}
                onChange={(e) => handleOrgChange(e)}
                error={
                  organisationDetailsError.organisation_website_link_error
                    ? true
                    : false
                }
                helperText={
                  organisationDetailsError.organisation_website_link_error
                }
              />
            </Col>
            <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
              <MuiPhoneNumber
                fullWidth
                required
                defaultCountry={"in"}
                countryCodeEditable={false}
                placeholder="Organisation Contact Number"
                label="Organisation Contact Number"
                variant="outlined"
                id="organisation_contact_number"
                name="organisation_contact_number"
                value={organisationDetails.organisation_contact_number}
                onChange={(value, countryData) => {
                  // console.log(value, countryData);
                  handleOrgChange(value, countryData);
                }}
                error={
                  organisationDetailsError.organisation_contact_number_error
                    ? true
                    : false
                }
                helperText={
                  organisationDetailsError.organisation_contact_number_error
                }
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
              <TextField
                fullWidth
                required
                placeholder="Organisation Address"
                label="Organisation Address"
                variant="outlined"
                id="organisation_address"
                name="organisation_address"
                value={organisationDetails.organisation_address}
                onChange={(e) =>
                  e.target.value.length <= 255 ? handleOrgChange(e) : ""
                }
                error={
                  organisationDetailsError.organisation_address_error
                    ? true
                    : false
                }
                helperText={organisationDetailsError.organisation_address_error}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
              <FormControl required fullWidth>
                <InputLabel id="country_label">Country</InputLabel>
                <Select
                  required
                  labelId="country_label"
                  id="country_select"
                  value={organisationDetails.organisation_country}
                  name="organisation_country"
                  onChange={(e) => handleOrgChange(e)}
                  label="Country"
                  error={
                    organisationDetailsError.organisation_country_error
                      ? true
                      : false
                  }
                  helperText={
                    organisationDetailsError.organisation_country_error
                  }
                >
                  {countryNameList?.map((countryName, index) => {
                    return (
                      <MenuItem value={countryName.label}>
                        {countryName.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Col>
            <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
              <TextField
                fullWidth
                required
                placeholder="PIN Code"
                label="PIN Code"
                variant="outlined"
                id="organisation_pin_code"
                name="organisation_pin_code"
                value={organisationDetails.organisation_pin_code}
                onChange={(e) => {
                  if (
                    e.target.value.length <= 10 &&
                    validateInputField(
                      e.target.value,
                      RegexConstants.PINCODE_REGEX_NEWUI
                    )
                  ) {
                    handleOrgChange(e);
                  }
                }}
                error={
                  organisationDetailsError.organisation_pin_code_error
                    ? true
                    : false
                }
                helperText={
                  organisationDetailsError.organisation_pin_code_error
                }
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
              <TextField
                fullWidth
                required
                rows={4}
                multiline
                placeholder="Organisation Description"
                label="Organisation Description"
                variant="outlined"
                id="organisation_description"
                name="organisation_description"
                value={organisationDetails.organisation_description}
                onChange={(e) => handleOrgChange(e)}
                error={
                  organisationDetailsError.organisation_description_error
                    ? true
                    : false
                }
                helperText={
                  organisationDetailsError.organisation_description_error
                }
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
              <FileUploaderMain
                key={key} // set the key prop to force a re-render when the key changes
                texts={
                  <span>
                    {"Drop files here or click "}
                    <a
                      href="#"
                      style={{
                        textDecoration: "underline",
                        color: "#00A94F",
                        display: "inline-block",
                      }}
                    >
                      {" browse "}
                    </a>
                    {" through your machine, File size not more than"}
                  </span>
                }
                maxSize={2}
                isMultiple={false}
                handleChange={handleFileForCrop}
                id="org-upload-file"
                fileTypes={fileTypes}
                setSizeError={() =>
                  setOrganisationDetailsError({
                    ...organisationDetailsError,
                    organisation_logo_error_logo:
                      "Maximum file size allowed is 2MB",
                  })
                }
              />
            </Col>
            <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
              <div
                className={
                  global_style.bold600 +
                  " " +
                  global_style.font20 +
                  " " +
                  styles.text_left
                }
                style={{ marginBottom: "20px", marginLeft: "10px" }}
              >
                {preview && "Uploaded file"}
              </div>
              {preview && (
                <>
                  <div className={styles.text_left + " " + styles.preview_box}>
                    {preview && (
                      <img className={styles.preview_logo} src={preview} />
                    )}
                    <CancelIcon
                      onClick={() => {
                        setPreview(null);
                        setUploadedLogo(null);
                        setKey(key + 1); // generate a new key when a file is deleted
                      }}
                      style={{
                        cursor: "pointer",
                        marginBottom: "70px",
                        fill: "rgba(0, 0, 0, 0.48)",
                      }}
                      fontSize="medium"
                      id="cancel-uploaded-file"
                    />
                  </div>
                  <div
                    className={styles.text_left}
                    style={{ marginLeft: "10px" }}
                  >
                    {preview && uploadedImgName
                      ? uploadedImgName
                      : preview
                      ? preview?.split("/").pop()
                      : uploadedLogo && uploadedLogo?.name}
                  </div>
                </>
              )}
              <div
                className={
                  global_style.size14 +
                  " " +
                  global_style.error +
                  " " +
                  styles.text_left
                }
              >
                {organisationDetailsError.organisation_logo_error_logo}
              </div>
            </Col>
          </Row>
        </div>
        {props.isOrgSetting ? (
          <Row>
            <Col style={{ textAlign: "right", margin: "20px" }}>
              <Button
                id="cancelbutton_org"
                variant="outlined"
                className={global_style.secondary_button}
                onClick={() =>
                  isLoggedInUserParticipant()
                    ? history.push("/participant/new_datasets")
                    : history.push("/datahub/new_datasets")
                }
              >
                Cancel
              </Button>
              <Button
                id="submitbutton_org"
                variant="outlined"
                className={
                  global_style.primary_button + " " + styles.next_button
                }
                disabled={
                  organisationDetails.organisation_address &&
                  organisationDetails.organisation_mail_id &&
                  organisationDetails.organisation_country &&
                  organisationDetails.organisation_description &&
                  organisationDetails.organisation_name &&
                  organisationDetails.organisation_pin_code.length > 4 &&
                  organisationDetails.organisation_contact_number &&
                  !organisationDetailsError.organisation_contact_number_error &&
                  organisationDetails.organisation_website_link &&
                  preview
                    ? false
                    : true
                }
                onClick={(e) => handleSubmitOrganizationDetails(e)}
              >
                Submit
              </Button>
            </Col>
          </Row>
        ) : (
          <div className={styles.button_grp}>
            <Button
              disabled={
                organisationDetails.organisation_address &&
                organisationDetails.organisation_mail_id &&
                organisationDetails.organisation_country &&
                organisationDetails.organisation_description &&
                organisationDetails.organisation_name &&
                organisationDetails.organisation_pin_code.length > 4 &&
                organisationDetails.organisation_contact_number &&
                organisationDetails.organisation_website_link &&
                !organisationDetailsError.organisation_contact_number_error &&
                preview
                  ? false
                  : true
              }
              onClick={(e) => handleSubmitOrganizationDetails(e)}
              className={global_style.primary_button + " " + styles.next_button}
              id="nextbutton_org_onboard"
            >
              {" "}
              {console.log(isLoggedInUserAdmin(), "logged")}
              {isLoggedInUserAdmin() ? "Next" : "Finish"}
            </Button>
          </div>
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ height: "300px", width: "300px" }}>
            {selectedImage && (
              <ReactEasyCropperForFarmstack
                file={selectedImage}
                handleCropComplete={onCropComplete}
                showCroppedImage={showCroppedImage}
              />
            )}
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default OrganizationDetails;

import React, { useState, useEffect, useRef, useMemo } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./ParticipantOrganisationSetting.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MuiPhoneNumber from "material-ui-phone-number";
import labels from "../../../../Constants/labels";
import validator from "validator";
import Select from "react-select";
import countryList from "react-select-country-list";
import MenuItem from "@mui/material/MenuItem";
import RichTextEditor from "react-rte";
import { FileUploader } from "react-drag-drop-files";
// import UploadBanner from "../../../Components/signup/UploadBanner";
import UploadOrgBanner from "./../../organisation/UploadOrgBanner";

import HTTPService from "../../../../Services/HTTPService";
import UrlConstant from "../../../../Constants/UrlConstants";
import HandleSessionTimeout, {
  setTokenLocal,
  getTokenLocal,
  setUserId,
  getUserLocal,
  handleAddressCharacters,
  setUserMapId,
  setOrgId,
  GetErrorKey,
  fileUpload,
  GetErrorHandlingRoute,
  validateInputField,
  stringMinimumLengthCheck,
} from "../../../../Utils/Common";
import RegexConstants from "../../../../Constants/RegexConstants";
// import {
//   GetErrorHandlingRoute,
//   validateInputField,
// } from "../../../../Utils/Common";
import { useHistory } from "react-router-dom";
import Loader from "../../../../Components/Loader/Loader";

const useStyles = {
  marginrowtop: { "margin-top": "20px" },
  marginrowtop8px: { "margin-top": "0px" },
};

export default function ParticipantOrganisationSetting(props) {
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  //   const handleOrgSettingSubmit = (e) => {};
  // org screen
  const [isOrgnameerror, setisOrgnameerror] = useState(false);
  const [isOrgmailerror, setisOrgmailerror] = useState(false);
  // const [isOrgnumbererror, setisOrgnumbererror] = useState(false);
  const [isOrgAddresserror, setisOrgAddresserror] = useState(false);
  const [isOrgcityerror, setisOrgcityerror] = useState(false);
  const [ispincodeerror, setispincodeerror] = useState(false);
  const [iscountryerror, setiscountryerror] = useState(false);
  const [countryvalue, setcountryvalue] = useState("");
  // const [orgdeserror, serorgdeserror] = useState(false);
  // const [orgdesc, setorgdesc] = useState("");
  // const [editorValue, setEditorValue] = React.useState(
  //   RichTextEditor.createValueFromString(orgdesc, "html")
  // );
  // const [textEditorValue, settextEditorValue] = useState("");

  // const [validOrgNumber, setValidOrgnumber] = useState("");
  const [orgfile, setorgfile] = useState(null);

  // const Orgname = useRef();
  // const Orgmail = useRef();
  // const OrgAddress = useRef();
  // const Orgcity = useRef();
  // const pincode = useRef();

  const [orgname, setorgname] = useState("");
  const [address, setaddress] = useState("");
  const [email, setemail] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [city, setcity] = useState("");
  const [pincode, setpincode] = useState("");

  const [Orgnamebtn, setOrgnamebtn] = useState(false);
  const [Orgemailbtn, setOrgemailbtn] = useState(false);
  const [Orgaddressbtn, setOrgaddressbtn] = useState(false);
  // const [Orgnumberbtn, setOrgnumberbtn] = useState(false);
  const [Orgcitybtn, setOrgcitybtn] = useState(false);
  const [Orgcountrybtn, setOrgcountrybtn] = useState(false);
  const [Orgpincodebtn, setOrgpincodebtn] = useState(false);
  // const [Orgdesbtn, setOrgdesbtn] = useState(false);
  const options = useMemo(() => countryList().getData(), []);

  const [orgdesc, setorgdesc] = useState("");

  const [editorValue, setEditorValue] = React.useState(
    RichTextEditor.createValueFromString(orgdesc, "html")
  );

  const fileTypes = ["JPEG", "PNG", "jpg"];
  const [orgfilesize, setorgfilesize] = useState(false);
  const [isPost, setisPost] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [orgWebsite, setOrgWebsite] = useState("");
  const [isOrgWebsiteerror, setisOrgWebsiteerror] = useState(false);

  const [orgNameErrorMessage, setOrgNameErrorMessage] = useState(null);
  const [orgEmailErrorMessage, setOrgEmailErrorMessage] = useState(null);
  const [orgPhoneNumberErrorMessage, setOrgPhoneNumberErrorMessage] =
    useState(null);
  const [orgDescriptionErrorMessage, setOrgDescriptionErrorMessage] =
    useState(null);
  const [orgWebsiteErrorMessage, setOrgWebsiteErrorMessage] = useState(null);

  const history = useHistory();

  // get org details.
  const getOrgDetails = async () => {
    var id = getUserLocal();
    console.log("user id", id);
    setIsLoader(true);
    await HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.org + id + "/",
      false,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("get request for org settings", response.data);
        // console.log(
        //   "org description",
        //   response.data.organization.org_description.toString("html")
        // );
        console.log("org response", response.data.organization);
        // console.log("country", response.data.organization.address.country);
        if (response.data.organization === "null") {
          setisPost(true);
          console.log("setispost true");
        } else {
          setorgname(response.data.organization.name);
          // if (response.data.organization.name) {
          //   setOrgnamebtn(true);
          // }
          setaddress(response.data.organization.address.address);
          // if (response.data.organization.address.address) {
          //   setOrgnamebtn(true);
          // }
          setcity(response.data.organization.address.city);
          setpincode(response.data.organization.address.pincode);
          setcountryvalue(response.data.organization.address.country);
          setemail(response.data.organization.org_email);
          setphonenumber(response.data.organization.phone_number);
          setOrgWebsite(response.data.organization.website);
          // setorgdesc(response.data.organization.org_description.toString("html"));
          setorgfile(response.data.organization.logo);
          console.log(response.data.organization.logo);
          setEditorValue(
            RichTextEditor.createValueFromString(
              response.data.organization.org_description,
              "html"
            )
          );
        }
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  useEffect(() => {
    getOrgDetails();
  }, []);

  //   const [file, setFile] = useState(null);
  // const [Orgdesbtn, setOrgdesbtn] = useState(false);

  // const handleOrgDesChange = (value) => {
  //   setEditorValue(value);
  //   setorgdesc(value.toString("html"));
  //   console.log(value.toString("html"));
  //   // console.log(value.length);
  //   if (value.toString("html") !== "<p><br></p>") {
  //     setOrgdesbtn(true);
  //   } else {
  //     setOrgdesbtn(false);
  //   }
  // };

  const handleOrgSettingSubmit = async (e) => {
    e.preventDefault();
    var id = getUserLocal();
    console.log("user id", id);

    setOrgNameErrorMessage(null);
    setOrgEmailErrorMessage(null);
    setOrgPhoneNumberErrorMessage(null);
    setOrgDescriptionErrorMessage(null);
    setOrgWebsiteErrorMessage(null);

    let puturl = UrlConstant.base_url + UrlConstant.org + id + "/";
    let posturl = UrlConstant.base_url + UrlConstant.org;

    var bodyFormData = new FormData();
    bodyFormData.append("org_email", email.toLowerCase());
    bodyFormData.append("name", orgname);
    bodyFormData.append(
      "address",
      JSON.stringify({
        country: countryvalue,
        pincode: pincode,
        address: address,
        city: city,
      })
    );
    bodyFormData.append("user_id", id);
    bodyFormData.append("phone_number", phonenumber);
    // bodyFormData.append("logo", orgfile);
    // file upload
    fileUpload(bodyFormData, orgfile, "logo");

    bodyFormData.append("org_description", editorValue.toString("html"));
    bodyFormData.append("website", orgWebsite);
    console.log("org details", bodyFormData);
    setIsLoader(true);
    if (isPost) {
      HTTPService("POST", posturl, bodyFormData, true, true)
        .then((response) => {
          setIsLoader(false);
          console.log("response");
          console.log("org details", response.data);
          //   console.log(response.json());
          console.log(response.status);
          if (response.status === 201) {
            props.setisOrgUpdateSuccess();
            setUserMapId(response.data.user_map);

            setOrgId(response.data.org_id);
            // setisPolicies(true);
            // setisOrg(false);
            // setEmail(false);
            // setError(false);
          } else {
            // setError(true);
          }
        })
        .catch((e) => {
          setIsLoader(false);
          var returnValues = GetErrorKey(e, bodyFormData.keys());
          var errorKeys = returnValues[0];
          var errorMessages = returnValues[1];
          if (errorKeys.length > 0) {
            for (var i = 0; i < errorKeys.length; i++) {
              switch (errorKeys[i]) {
                case "phone_number":
                  setOrgPhoneNumberErrorMessage(errorMessages[i]);
                  break;
                case "name":
                  setOrgNameErrorMessage(errorMessages[i]);
                  break;
                case "org_email":
                  setOrgEmailErrorMessage(errorMessages[i]);
                  break;
                case "org_description":
                  setOrgDescriptionErrorMessage(errorMessages[i]);
                  break;
                case "website":
                  setOrgWebsiteErrorMessage(errorMessages[i]);
                  break;
                default:
                  history.push(GetErrorHandlingRoute(e));
                  break;
              }
            }
          } else {
            history.push(GetErrorHandlingRoute(e));
          }
          //   setError(true);
        });
    } else {
      setIsLoader(true);
      HTTPService("PUT", puturl, bodyFormData, true, true)
        .then((response) => {
          setIsLoader(false);
          console.log("response");
          console.log("org details", response.data);
          //   console.log(response.json());
          console.log(response.status);
          if (response.status === 201) {
            setUserMapId(response.data.user_map);
            setOrgId(response.data.org_id);
            props.setisOrgUpdateSuccess();
            // setisPolicies(true);
            // setisOrg(false);
            // setEmail(false);
            // setError(false);
          } else {
            // setError(true);
          }
        })
        .catch((e) => {
          setIsLoader(false);
          var returnValues = GetErrorKey(e, bodyFormData.keys());
          var errorKeys = returnValues[0];
          var errorMessages = returnValues[1];
          if (errorKeys.length > 0) {
            for (var i = 0; i < errorKeys.length; i++) {
              switch (errorKeys[i]) {
                case "phone_number":
                  setOrgPhoneNumberErrorMessage(errorMessages[i]);
                  break;
                case "name":
                  setOrgNameErrorMessage(errorMessages[i]);
                  break;
                case "org_email":
                  setOrgEmailErrorMessage(errorMessages[i]);
                  break;
                case "org_description":
                  setOrgDescriptionErrorMessage(errorMessages[i]);
                  break;
                default:
                  history.push(GetErrorHandlingRoute(e));
                  break;
              }
            }
          } else {
            history.push(GetErrorHandlingRoute(e));
          }
          //   setError(true);
        });
    }
  };

  const handleOrgname = (e) => {
    console.log(e.target.value);
    // var letters = /^[A-Za-z ]*$/;
    var orgname = e.target.value;
    // // if (orgname.length > 0) {
    // //   setisOrgnameerror(false);
    // //   setOrgnextbutton(true);
    // // } else {
    // //   setisOrgnameerror(true);
    // // }
    // if (orgname.match(letters)) {
    //   setisOrgnameerror(false);
    //   setOrgnamebtn(true);
    //   //   setprofilenextbutton(true);
    // } else {
    //   setisOrgnameerror(true);
    //   setOrgnamebtn(false);
    // }
    // if (orgname.length === null) {
    //   setisOrgnameerror(true);
    // } else {
    //   setisOrgnameerror(false);
    // }
    if (validateInputField(e.target.value, RegexConstants.ORG_NAME_REGEX)) {
      setorgname(e.target.value);
      setisOrgnameerror(false);
      // setOrgnamebtn(true);
      // setfirstname(e.target.value.trim());
      // setaccfirstbtn(true);
    } else {
      // e.preventDefault();
      setisOrgnameerror(true);
    }
  };

  const handleOrgmail = (e) => {
    // console.log(e.target.value);
    // var email = e.target.value;
    // const valid = validator.isEmail(email);
    // console.log(valid);
    // const finalEmail = email.trim();
    // console.log(finalEmail);
    // if (valid) {
    //   setisOrgmailerror(false);
    //   setOrgemailbtn(true);
    // } else {
    //   setisOrgmailerror(true);
    //   setOrgemailbtn(false);
    // }
    if (validateInputField(e.target.value, RegexConstants.NO_SPACE_REGEX)) {
      setemail(e.target.value);
      if (validator.isEmail(e.target.value)) {
        setisOrgmailerror(false);
      } else {
        setisOrgmailerror(true);
      }
      // setOrgemailbtn(true);
      // setfirstname(e.target.value.trim());
      // setaccfirstbtn(true);
    } else {
      e.preventDefault();
    }
  };

  const handleOrgnumber = (value) => {
    console.log(value);
    setphonenumber(value);
    // if (value.length === 15) {
    //   setOrgnumberbtn(true);
    // } else {
    //   setOrgnumberbtn(false);
    // }
  };

  const handleOrgWebsite = (e) => {
    e.target.value = e.target.value.trim();
    setOrgWebsite(e.target.value);
    setisOrgWebsiteerror(
      !validateInputField(e.target.value, RegexConstants.NEW_WEBSITE_REGEX) &&
        !validateInputField(e.target.value, RegexConstants.NEW_C_WEBSITE_REGEX)
    );
  };
  // const handleOrgWebsite = (e) => {
  //   if(validateInputField(e.target.value, RegexConstants.NO_SPACE_REGEX)) {
  //   setOrgWebsite(e.target.value);
  //   if(validator.isWebsite(e.target.value)) {
  //     setisOrgWebsiteerror(false);
  //   } else {
  //     setisOrgWebsiteerror(true);
  //   }
  //   } else {
  //     e.preventDefault();
  //   }
  // };

  const handleOrgAddress = (e) => {
    // e.target.value = e.target.value.trim();

    // var address = e.target.value;
    validateInputField(e.target.value, RegexConstants.address)
      ? setaddress(e.target.value)
      : e.preventDefault();

    console.log(e.target.value);
    if (address.length > 0) {
      setisOrgAddresserror(false);
      setOrgaddressbtn(true);
      // setOrgnextbutton(true);
    } else {
      setisOrgAddresserror(true);
      setOrgaddressbtn(false);
    }
  };

  const handleOrgcity = (e) => {
    console.log(e.target.value);
    var letters = /^[A-Za-z]*$/;
    var city = e.target.value;
    // if (city.length > 0) {
    //   setisOrgcityerror(false);
    //   setOrgnextbutton(true);
    // } else {
    //   setisOrgcityerror(true);
    // }
    if (city.match(letters)) {
      setcity(city);
      setisOrgcityerror(false);
      setOrgcitybtn(true);
      //   setprofilenextbutton(true);
    } else {
      setisOrgcityerror(true);
      setOrgcitybtn(false);
    }
  };

  //   const countrychangeHandler = (value) => {
  //     setcountryvalue(value);
  //     setOrgcountrybtn(true);
  //   };

  const handlepincode = (e) => {
    console.log(e.target.value);
    if (e.target.value > 10) e.target.value = e.target.value.substring(0, 10);
    var pincode = e.target.value;
    if (pincode.length >= 5) {
      setispincodeerror(false);
      setOrgpincodebtn(true);
      // setOrgnextbutton(true);
    } else {
      setispincodeerror(true);
      setOrgpincodebtn(false);
    }
    if (validateInputField(pincode, RegexConstants.PINCODE_REGEX)) {
      setpincode(pincode);
    } else {
      e.preventDefault();
    }
  };

  const handleorgFileChange = (file) => {
    // var finalFiles = file.target.files;
    setorgfile(file);
    console.log(file);
    // console.log(file.length);
    console.log(file.size);
    if (file != null && file.size > 2097152) {
      //   setBrandingnextbutton(false);
      setorgfilesize(true);
    } else {
      setorgfilesize(false);
    }
  };

  //   const finishLaterOrgScreen = () => {
  //     console.log("clicked on finish later Org screen");
  //     setisPolicies(true);
  //     setisOrg(false);
  //   };

  //   org des
  const handleOrgDesChange = (value) => {
    setEditorValue(value);
    setorgdesc(value.toString("html"));
    console.log(value.toString("html"));
    // console.log(value.length);

    // if (value.toString("html") !== "<p><br></p>") {
    //   setOrgdesbtn(true);
    // } else {
    //   setOrgdesbtn(false);
    // }

    // textEditorData(value.toString("html"));
  };
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
  const orgsettingcancelbtn = () => {
    setorgfile(null);
    getOrgDetails();
    history.push("/datahub/settings/2");
    window.location.reload();
  };

  return (
    <div className="participantOrgSetting">
      {isLoader ? <Loader /> : ""}
      <div noValidate autoComplete="off">
        <Row>
          <span className="title">Organisation details</span>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <TextField
              required
              id="filled-basic"
              label={screenlabels.org_settings.org_name}
              variant="filled"
              className="name"
              onChange={handleOrgname}
              value={orgname}
              onKeyUp={() =>
                orgname === ""
                  ? setisOrgnameerror(true)
                  : setisOrgnameerror(false)
              }
              // inputRef={Orgname}
              error={isOrgnameerror || orgNameErrorMessage}
              helperText={
                isOrgnameerror && !orgNameErrorMessage
                  ? "Enter Valid Name"
                  : orgNameErrorMessage
              }
            />
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <TextField
              required
              id="filled-basic"
              label={screenlabels.org_settings.email}
              variant="filled"
              className="email"
              onChange={handleOrgmail}
              value={email}
              // inputRef={Orgmail}
              error={isOrgmailerror || orgEmailErrorMessage}
              helperText={
                isOrgmailerror && !orgEmailErrorMessage
                  ? "Enter Valid Email id"
                  : orgEmailErrorMessage
              }
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <TextField
              //   value={phonenumber}
              className="name"
              id="filled-basic"
              label={screenlabels.org_settings.website}
              variant="filled"
              onChange={handleOrgWebsite}
              value={orgWebsite}
              error={isOrgWebsiteerror || orgWebsiteErrorMessage}
              helperText={
                isOrgWebsiteerror ? "Enter Valid URL" : orgWebsiteErrorMessage
              }
              //   inputRef={profilenumber}
              // error={isOrgnumbererror}
              // helperText={isOrgnumbererror ? "Enter Valid Number" : ""}
            />
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <MuiPhoneNumber
              required
              defaultCountry={"in"}
              countryCodeEditable={false}
              //   value={phonenumber}
              className="email"
              id="filled-basic"
              label={screenlabels.org_settings.contact}
              variant="filled"
              onChange={handleOrgnumber}
              value={phonenumber}
              error={orgPhoneNumberErrorMessage ? true : false}
              helperText={orgPhoneNumberErrorMessage}
              //   inputRef={profilenumber}
              // error={isOrgnumbererror}
              // helperText={isOrgnumbererror ? "Enter Valid Number" : ""}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <TextField
              required
              id="filled-basic"
              label={screenlabels.org_settings.address}
              variant="filled"
              className="name"
              onChange={handleOrgAddress}
              // inputRef={OrgAddress}
              value={address}
              //   onKeyDown={(e) => handleAddressCharacters(address, e)}
              error={isOrgAddresserror}
              helperText={isOrgAddresserror ? "Enter Valid Address" : ""}
            />
            {/* <TextField
              // style={useStyles.inputwidth}
              className="name"
              id="filled-basic"
              variant="filled"
              required
              // width="100%"
              value={address}
              onChange={handleChangeConnectorName}
              label={screenlabels.connector_form.connectorName}
              error={props.nameErrorMessage ? true : false}
              helperText={props.nameErrorMessage}
            /> */}
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <TextField
              required
              id="filled-basic"
              label={screenlabels.org_settings.city}
              variant="filled"
              className="email"
              onChange={handleOrgcity}
              onKeyUp={() =>
                city === "" ? setisOrgcityerror(true) : setisOrgcityerror(false)
              }
              // inputRef={Orgcity}
              value={city}
              error={isOrgcityerror}
              helperText={isOrgcityerror ? "Enter Valid City" : ""}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <TextField
              select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              className="name"
              variant="filled"
              required
              value={countryvalue}
              style={{ textAlign: "left" }}
              onChange={(e) => {
                setcountryvalue(e.target.value);
                console.log(e.target.value.length);
                console.log(e.target.value);
                if (e.target.value.length > 0) {
                  // setOrgcountrybtn(true);
                  setiscountryerror(false);
                }
              }}
              isSearchable={true}
              label={screenlabels.addparticipants.country}
            >
              {options.map((rowData, index) => (
                <MenuItem value={rowData.label}>{rowData.label}</MenuItem>
              ))}
            </TextField>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <TextField
              required
              type="number"
              id="filled-basic"
              className="email"
              label={screenlabels.org_settings.pincode}
              onKeyDown={(e) => {
                if (
                  e.key == "-" ||
                  e.key == "e" ||
                  e.key == "E" ||
                  e.key == "+"
                ) {
                  e.preventDefault();
                }
              }}
              variant="filled"
              onChange={handlepincode}
              value={pincode}
              error={ispincodeerror}
              helperText={ispincodeerror ? "Enter vaild pin code" : ""}
            />
          </Col>
        </Row>
        <Row
          style={{
            marginTop: "20px",
            textAlign: "left",
            marginLeft: "-25px",
          }}
        >
          <Col xs={12} sm={12} md={12} lg={12}>
            <span className="orgdestitle">
              Organization description<sup>*</sup>
            </span>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div
              className="invite-participant-text-editor orgrte"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <RichTextEditor
                toolbarConfig={toolbarConfig}
                value={editorValue}
                // value={orgdesc}
                onChange={handleOrgDesChange}
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
                // error={orgDescriptionErrorMessage ? true : false}
                // helperText={orgDescriptionErrorMessage}
              />
              <span
                style={{
                  color: "#ff3d00",
                  textAlign: "left",
                  fontFamily: "Open Sans",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "12px",
                  lineHeight: "16px",
                }}
              >
                {orgDescriptionErrorMessage ? orgDescriptionErrorMessage : ""}
              </span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <FileUploader
              handleChange={handleorgFileChange}
              name="file"
              types={fileTypes}
              children={
                <UploadOrgBanner
                  uploaddes="JPEG and PNG files upto 2MB are supoorted"
                  uploadtitle="Upload the company's logo"
                />
              }
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <div>
              <p className="uploadorgimgname">
                {orgfile
                  ? orgfile.size
                    ? `File name: ${orgfile.name}`
                    : ""
                  : ""}
                {/* {file == null && profile_pic ? (
                <a
                  target="_blank"
                  href={profile_pic}
                  style={{ color: "#C09507", textDecoration: "none" }}>
                  Click here to view uploaded image!
                </a>
              ) : (
                ""
              )} */}
              </p>
              <p className="oversizemb-uploadimgOrglogo">
                {orgfile != null && orgfile.size > 2097152
                  ? "File uploaded is more than 2MB!"
                  : ""}
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={4}></Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            {!isOrgnameerror &&
            !isOrgmailerror &&
            !isOrgAddresserror &&
            !isOrgcityerror &&
            !ispincodeerror &&
            !iscountryerror &&
            !isOrgWebsiteerror &&
            orgfile != null &&
            !orgfilesize &&
            orgname &&
            address &&
            email &&
            city &&
            stringMinimumLengthCheck(pincode, 5) &&
            phonenumber.length >= 9 &&
            editorValue.getEditorState().getCurrentContent().hasText() &&
            countryvalue !== "" ? (
              <Button
                onClick={handleOrgSettingSubmit}
                variant="contained"
                className="submitbtn"
                type="submit"
              >
                <span className="signupbtnname">Submit</span>
              </Button>
            ) : (
              <Button variant="outlined" disabled className="disbalesubmitbtn">
                Submit
              </Button>
            )}
          </Col>
        </Row>
        <Row style={useStyles.marginrowtop8px}>
          <Col xs={12} sm={12} md={6} lg={4}></Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Button
              variant="outlined"
              className="cancelbtn"
              type="button"
              onClick={orgsettingcancelbtn}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

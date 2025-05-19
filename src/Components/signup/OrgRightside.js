import React, { useState, useRef, useMemo, useEffect } from "react";
import "./OrgRightside.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import Select from "@mui/material/Select";

import MuiPhoneNumber from "material-ui-phone-number";

import Select from "react-select";
import countryList from "react-select-country-list";
import { grey } from "@mui/material/colors";

// import { DefaultEditor } from "react-simple-wysiwyg";

// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import RichTextEditor from "react-rte";

import validator from "validator";

import { FileUploader } from "react-drag-drop-files";
import UploadOrgLogo from "./UploadOrgLogo";

import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import {
  GetErrorHandlingRoute,
  handleAddressCharacters,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
  mobileNumberMinimunLengthCheck,
  validateInputField,
} from "../../Utils/Common";
import RegexConstants from "../../Constants/RegexConstants";
import { Autocomplete, MenuItem } from "@mui/material";
import { useHistory } from "react-router-dom";
import Loader from "../Loader/Loader";
import { borderBottom } from "@mui/system";
import Footer from "../Footer/Footer";

export default function OrgRightside(props) {
  // const [isOrgnameerror, setisOrgnameerror] = useState(false);
  // const [isOrgmailerror, setisOrgmailerror] = useState(false);
  // // const [isOrgnumbererror, setisOrgnumbererror] = useState(false);
  // const [isOrgAddresserror, setisOrgAddresserror] = useState(false);
  // const [isOrgcityerror, setisOrgcityerror] = useState(false);
  // const [ispincodeerror, setispincodeerror] = useState(false);
  // const [countryvalue, setcountryvalue] = useState("");
  // // const [orgdeserror, serorgdeserror] = useState(false);
  const [orgdesc, setorgdesc] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  console.log(
    props.validOrgNumber,
    "KAKAKSANDKJDHBUDSBJVDSIUVBFSUYCBDSIUVDWBVDSBCVISDJFVYUDBDSIU"
  );

  const [editorValue, setEditorValue] = React.useState(
    RichTextEditor.createValueFromString(orgdesc, "html")
  );

  const orgNameRef = useRef();
  const orgMailRef = useRef();
  // const OrgAddress = useRef();
  // const Orgcity = useRef();
  // const pincode = useRef();

  var history = useHistory();
  useEffect(() => {
    var id = props.userid;
    setIsLoader(true);
    HTTPService(
      "GET",
      UrlConstant.base_url +
        (isLoggedInUserParticipant() || isLoggedInUserCoSteward()
          ? UrlConstant.participant
          : UrlConstant.org) +
        id +
        "/",
      "",
      false,
      true,
      props.isaccesstoken
    )
      .then((response) => {
        setIsLoader(false);
        // let addressdata=JSON.parse(response.data.organization.address)

        if (response.data.organization) {
          props.setOrgName(response?.data?.organization?.name);
          props.setOrgMail(response?.data?.organization?.org_email);
          props.setOrgWebsite(response?.data?.organization?.website);
          props.setOrgAddress(
            response?.data?.organization?.address?.address ||
              JSON.parse(response?.data?.organization?.address)?.address
          );
          props.setCountryValue(
            response?.data?.organization?.address?.country ||
              JSON.parse(response?.data?.organization?.address)?.country
          );
          if (
            response?.data?.organization?.address?.country ||
            JSON.parse(response?.data?.organization?.address)?.country
          ) {
            props.setOrgcountrybtn(true);
          }
          props.setValidOrgnumber(response?.data?.user?.phone_number);
          props.setOrgPincode(
            response?.data?.organization?.address?.pincode ||
              JSON.parse(response?.data?.organization?.address)?.pincode
          );

          if (
            response?.data?.organization?.name &&
            response?.data?.organization?.name.trim().length > 0
          ) {
            props.setisOrgnameerror(false);
          }

          if (
            response?.data?.organization?.org_email &&
            response?.data?.organization?.org_email.trim().length > 0
          ) {
            props.setisOrgmailerror(false);
            props.setOrgemailbtn(true);
          }

          if (
            response?.data?.organization?.website &&
            response?.data?.organization?.website.trim().length > 0
          ) {
            props.setisOrgWebsiteerror(false);
          }

          if (response.data.organization.address) {
            props.setOrgCity(response.data.organization.address.city);

            if (
              response?.data?.organization?.address?.address &&
              response?.data?.organization?.address?.address.trim().length > 0
            ) {
              props.setisOrgAddresserror(false);
            }
            if (
              response?.data?.organization?.address?.city &&
              response?.data?.organization?.address?.city.trim().length > 0
            ) {
              props.setisOrgcityerror(false);
            }
            if (
              response?.data?.organization?.address?.country &&
              response?.data?.organization?.address?.country.trim().length > 0
            ) {
              props.setOrgcountrybtn(true);
            }
            if (
              response?.data?.organization?.address?.pincode &&
              response?.data?.organization?.address?.pincode.trim().pincode > 0
            ) {
              props.setispincodeerror(false);
            }
          }
          if (response?.data?.organization?.org_description) {
            setEditorValue(
              RichTextEditor.createValueFromString(
                response?.data?.organization?.org_description,
                "html"
              )
            );
            setorgdesc(response?.data?.organization?.org_description);
            props.textEditorData(response?.data?.organization?.org_description);
            if (
              response?.data?.organization?.org_description.toString("html") !==
              "<p><br></p>"
            ) {
              setOrgdesbtn(true);
            }
          }
          props.setOrgId(response?.data?.organization.id);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsLoader(false);
        //history.push(GetErrorHandlingRoute(e));
      });
  }, []);

  // const [validOrgNumber, setValidOrgnumber] = useState("");

  const options = useMemo(() => countryList().getData(), []);

  // // const [Orgnextbutton, setOrgnextbutton] = useState(false);

  // const [file, setFile] = useState(null);

  const fileTypes = ["JPEG", "PNG", "jpg"];

  // const [Orgnamebtn, setOrgnamebtn] = useState(false);
  // const [Orgemailbtn, setOrgemailbtn] = useState(false);
  // const [Orgaddressbtn, setOrgaddressbtn] = useState(false);
  // const [Orgcitybtn, setOrgcitybtn] = useState(false);
  // const [Orgcountrybtn, setOrgcountrybtn] = useState(false);
  // const [Orgpincodebtn, setOrgpincodebtn] = useState(false);
  const [Orgdesbtn, setOrgdesbtn] = useState(false);

  const handleOrgDesChange = (value) => {
    setEditorValue(value);
    setorgdesc(value.toString("html"));
    console.log(value.toString("html"));
    // console.log(value.length);
    if (value.toString("html") !== "<p><br></p>") {
      setOrgdesbtn(true);
    } else {
      setOrgdesbtn(false);
    }
    props.textEditorData(value.toString("html"));
  };

  // const handleOrgSubmit = async (e) => {
  //   e.preventDefault();
  //   let url = UrlConstant.base_url + UrlConstant.org;
  //   // email validation
  //   const emailstring = Orgmail.current.value;
  //   const valid = validator.isEmail(emailstring);
  //   console.log(valid);
  //   const finalEmail = emailstring.trim();

  //   const name = Orgname.current.value;
  //   const finalName = name.trim();

  //   const address = OrgAddress.current.value;
  //   const finalAddress = address.trim();

  //   const city = Orgcity.current.value;
  //   const finalCity = city.trim();

  //   const pinCode = pincode.current.value;
  //   const finalpinCode = pinCode.trim();

  //   var bodyFormData = new FormData();
  //   bodyFormData.append("org_email", finalEmail);
  //   bodyFormData.append("name", finalName);
  //   bodyFormData.append(
  //     "address",
  //     JSON.stringify({
  //       country: countryvalue,
  //       pincode: finalpinCode,
  //       address: finalAddress,
  //       city: finalCity,
  //     })
  //   );
  //   bodyFormData.append("phone_number", validOrgNumber);
  //   bodyFormData.append("logo", file);
  //   bodyFormData.append("org_description", orgdesc);
  //   console.log("dfdfdsf", bodyFormData);

  //   // let data = {
  //   //   org_email: finalEmail,
  //   //   name: finalName,
  //   //   address: {
  //   //     country: countryvalue,
  //   //     pincode: finalpinCode,
  //   //     address: finalAddress,
  //   //     city: finalCity,
  //   //   },
  //   //   phone_number: validOrgNumber,
  //   //   //   logo: file,
  //   //   org_description: orgdesc,
  //   // };

  //   if (!valid) {
  //     setisOrgmailerror(true);
  //   } else {
  //     setisOrgnameerror(false);

  //     HTTPService("POST", url, bodyFormData, true, false)
  //       .then((response) => {
  //         console.log("response");
  //         console.log("org details", response.data);
  //         //   console.log(response.json());
  //         console.log(response.status);
  //         if (response.status === 201) {
  //           // setEmail(false);
  //           // setError(false);
  //         } else {
  //           // setError(true);
  //         }
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //         //   setError(true);
  //       });

  //     //   await fetch(url, {
  //     //     method: "POST",
  //     //     headers: {
  //     //       //   Accept: "application/json",
  //     //       "content-type": "multipart/form-data; boundary=l3ipy71otz",
  //     //     },
  //     //     body: {
  //     //       org_email: finalEmail,
  //     //       name: finalName,
  //     //       address: {
  //     //         country: countryvalue,
  //     //         pincode: finalpinCode,
  //     //         address: finalAddress,
  //     //         city: finalCity,
  //     //       },
  //     //       phone_number: validOrgNumber,
  //     //       logo: file,
  //     //       org_description: orgdesc,

  //     //       //   otp: valid,
  //     //     },
  //     //   })
  //     //     .then((response) => {
  //     //       console.log("response");
  //     //       console.log("org details", response.data);
  //     //       // console.log(response.json());
  //     //       // console.log(response.refresh);
  //     //       // console.log(response.active);
  //     //       if (response.status === 200) {
  //     //         // setOtpError(false);
  //     //       } else {
  //     //         // setOtpError(true);
  //     //       }
  //     //     })
  //     //     .catch((e) => {
  //     //       console.log(e);
  //     //       //   setOtpError(true);
  //     //     });
  //   }
  // };

  // //   const onChange = (value) => {
  // //     console.log(value);
  // //     setorgdesc(value);
  // //   };

  // const handleOrgname = (e) => {
  //   console.log(e.target.value);
  //   var letters = /^[A-Za-z ]*$/;
  //   var orgname = e.target.value;
  //   // if (orgname.length > 0) {
  //   //   setisOrgnameerror(false);
  //   //   setOrgnextbutton(true);
  //   // } else {
  //   //   setisOrgnameerror(true);
  //   // }
  //   if (orgname.match(letters)) {
  //     setisOrgnameerror(false);
  //     setOrgnamebtn(true);
  //     //   setprofilenextbutton(true);
  //   } else {
  //     setisOrgnameerror(true);
  //     setOrgnamebtn(false);
  //   }
  // };

  // const handleOrgmail = (e) => {
  //   // console.log(e.target.value);
  //   var email = e.target.value;
  //   // if (email.length > 0) {
  //   //   setisOrgmailerror(false);
  //   //   // setOrgnextbutton(true);
  //   // } else {
  //   //   setisOrgmailerror(true);
  //   // }
  //   const valid = validator.isEmail(email);
  //   console.log(valid);
  //   const finalEmail = email.trim();
  //   console.log(finalEmail);
  //   if (valid) {
  //     setisOrgmailerror(false);
  //     setOrgemailbtn(true);
  //   } else {
  //     setisOrgmailerror(true);
  //     setOrgemailbtn(false);
  //   }
  // };

  // const handleOrgnumber = (value) => {
  //   console.log(value);
  //   setValidOrgnumber(value);
  // };

  // const handleOrgAddress = (e) => {
  //   console.log(e.target.value);
  //   var address = e.target.value;
  //   if (address.length > 0) {
  //     setisOrgAddresserror(false);
  //     setOrgaddressbtn(true);
  //     // setOrgnextbutton(true);
  //   } else {
  //     setisOrgAddresserror(true);
  //     setOrgaddressbtn(false);
  //   }
  // };

  // const handleOrgcity = (e) => {
  //   console.log(e.target.value);
  //   var letters = /^[A-Za-z]+$/;
  //   var city = e.target.value;
  //   // if (city.length > 0) {
  //   //   setisOrgcityerror(false);
  //   //   setOrgnextbutton(true);
  //   // } else {
  //   //   setisOrgcityerror(true);
  //   // }
  //   if (city.match(letters)) {
  //     setisOrgcityerror(false);
  //     setOrgcitybtn(true);
  //     //   setprofilenextbutton(true);
  //   } else {
  //     setisOrgcityerror(true);
  //     setOrgcitybtn(false);
  //   }
  // };

  // const countrychangeHandler = (value) => {
  //   setcountryvalue(value);
  //   setOrgcountrybtn(true);
  // };

  // const handlepincode = (e) => {
  //   console.log(e.target.value);
  //   var pincode = e.target.value;
  //   if (pincode.length > 0) {
  //     setispincodeerror(false);
  //     setOrgpincodebtn(true);
  //     // setOrgnextbutton(true);
  //   } else {
  //     setispincodeerror(true);
  //     setOrgpincodebtn(false);
  //   }
  // };

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

  // const handleorgFileChange = (file) => {
  //   // var finalFiles = file.target.files;
  //   setFile(file);
  //   console.log(file);
  //   console.log(file.length);
  //   console.log(file.size);
  // };

  //   const onEditorStateChange = (value) => {
  //     console.log(value);
  //   console.log(value.getCurrentContent().getPlainText());
  //   let currentContentAsHTML = convertToHTML(value.getCurrentContent());
  //     console.log(value.createWithContent(currentContentAsHTML));
  //   };

  return (
    <div className="orgright">
      {isLoader ? <Loader /> : ""}
      <div className="orgheader">Organisation details</div>
      <div>
        <div noValidate autoComplete="off">
          <div className="orgname">
            <TextField
              required
              id="orgnametextfield"
              label="Organisation Name"
              variant="filled"
              style={{ width: "420px" }}
              //   className="profilefirstname"
              inputRef={orgNameRef}
              value={props.orgName}
              onKeyUp={() =>
                props.orgName === ""
                  ? props.setisOrgnameerror(true)
                  : props.setisOrgnameerror(false)
              }
              onChange={(e) =>
                validateInputField(
                  e.target.value,
                  RegexConstants.ORG_NAME_REGEX
                )
                  ? props.setOrgName(e.target.value)
                  : e.preventDefault()
              }
              // inputRef={props.Orgname}
              error={props.isOrgnameerror || props.orgNameErrorMessage}
              helperText={
                props.isOrgnameerror && !props.orgNameErrorMessage
                  ? "Enter Name"
                  : props.orgNameErrorMessage
              }
            />
          </div>
          <div className="orgemail">
            <TextField
              required
              type="email"
              id="orgemailtextfield"
              label="Organisation Mail ID"
              variant="filled"
              style={{ width: "420px" }}
              //   className="profilelastname"
              value={props.Orgmail}
              // onChange={(e) => validateInputField(e.target.value,RegexConstants.NO_SPACE_REGEX) ? props.setOrgEmail(e.target.value.trim()) : e.preventDefault()}
              onChange={props.handleOrgmail}
              //inputRef={props.Orgmail}
              error={props.isOrgmailerror || props.orgEmailErrorMessage}
              helperText={
                props.isOrgmailerror && !props.orgEmailErrorMessage
                  ? "Enter Valid Email id"
                  : props.orgEmailErrorMessage
              }
              inputRef={orgMailRef}
            />
          </div>
          <div className="orgwebsite">
            <TextField
              required
              id="orgwebsitetextfield"
              label="Organisation Website"
              variant="filled"
              style={{ width: "420px" }}
              value={props.orgWebsite}
              onChange={props.handleOrgWebsite}
              error={props.isOrgWebsiteerror || props.orgWebsiteErrorMessage}
              helperText={
                props.isOrgWebsiteerror && !props.orgWebsiteErrorMessage
                  ? "Enter Valid URL"
                  : props.orgWebsiteErrorMessage
              }
            />
          </div>
          <div className="orgnumber">
            <MuiPhoneNumber
              required
              defaultCountry={"in"}
              countryCodeEditable={false}
              style={{ width: "420px" }}
              id="orgphonetextfield"
              label="Organisation Contact Number"
              variant="filled"
              value={props.validOrgNumber}
              onChange={props.handleOrgnumber}
              error={props.orgPhoneNumberErrorMessage ? true : false}
              helperText={props.orgPhoneNumberErrorMessage}
              //   inputRef={profilenumber}
              // error={isOrgnumbererror}
              // helperText={isOrgnumbererror ? "Enter Valid Number" : ""}
            />
          </div>
          <div className="orgaddress">
            <TextField
              required
              id="orgaddresstextfield"
              label="Address"
              variant="filled"
              style={{ width: "420px" }}
              //   className="profileemail"
              value={props.orgAddress}
              onKeyDown={(e) => handleAddressCharacters(props.orgAddress, e)}
              onKeyUp={() =>
                props.orgAddress === ""
                  ? props.setisOrgAddresserror(true)
                  : props.setisOrgAddresserror(false)
              }
              onChange={(e) => props.setOrgAddress(e.target.value)}
              // onChange={props.handleOrgAddress}
              // inputRef={props.OrgAddress}
              error={props.isOrgAddresserror}
              helperText={props.isOrgAddresserror ? "Enter Valid Address" : ""}
            />
          </div>
          <div className="orgcity">
            <TextField
              required
              id="orgcitytextfield"
              label="City"
              variant="filled"
              style={{ width: "420px" }}
              //   className="profileemail"
              value={props.orgCity}
              onKeyUp={() =>
                props.orgCity === ""
                  ? props.setisOrgcityerror(true)
                  : props.setisOrgcityerror(false)
              }
              onChange={(e) =>
                validateInputField(e.target.value, RegexConstants.city_name)
                  ? props.setOrgCity(e.target.value)
                  : e.preventDefault()
              }
              // onChange={props.handleOrgcity}
              // inputRef={props.Orgcity}
              error={props.isOrgcityerror}
              helperText={props.isOrgcityerror ? "Enter Valid City" : ""}
            />
          </div>
          <div className="orgcountry">
            <TextField
              select
              required
              id="orgcountryselect"
              variant="filled"
              style={{ width: "420px" }}
              placeholder="Country"
              value={props.countryvalue}
              onChange={props.countrychangeHandler}
              isSearchable={true}
              label="Country"
            >
              {options.map((rowData, index) => (
                <MenuItem value={rowData.label}>{rowData.label}</MenuItem>
              ))}
            </TextField>
            {/*
            <Autocomplete
              disablePortal
              variant="filled"
              id="filled-basic"
              options={options}
              sx={{ width: '420px', 'font-family': 'Open Sans', 'font-style': 'normal';
              font-weight: 400;
              font-size: 14px;
              line-height: 19px; }}
              renderInput={(params) => <TextField variant='filled' {...params} label="Country" />}
          />*/}
          </div>
          <div className="orgpincode">
            <TextField
              required
              type="number"
              id="orgpincodetextfield"
              //   inputProps={{ maxLength: 6 }}
              label="Pin code"
              variant="filled"
              style={{ width: "420px", zIndex: 0 }}
              value={props.orgPincode}
              onKeyUp={() =>
                props.orgPincode === ""
                  ? props.setispincodeerror(true)
                  : props.setispincodeerror(false)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "-" ||
                  e.key === "e" ||
                  e.key === "E" ||
                  e.key === "+"
                ) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                if (e.target.value.length > 10)
                  e.target.value = e.target.value.substring(0, 10);
                validateInputField(e.target.value, RegexConstants.PINCODE_REGEX)
                  ? props.setOrgPincode(e.target.value.trim())
                  : e.preventDefault();
              }}
              // onChange={props.handlepincode}
              // inputRef={props.pincode}
              error={props.ispincodeerror}
              helperText={props.ispincodeerror ? "Enter vaild pin code" : ""}
            />
          </div>
          <div className="orgdes">
            {/* <DefaultEditor value={html} onChange={onChange} /> */}
            {/* <Editor
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              wrapperStyle={{
                width: 420,
                border: "1px solid black",
                zIndex: 4,
              }}
              onEditorStateChange={onEditorStateChange}
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "fontFamily",
                  //   "list",
                  "textAlign",
                  //   "link",
                  //   "embedded",
                  //   "emoji",
                  //   "remove",
                  //   "history",
                ],
              }}
            /> */}
            <p className="orgdestitle" style={{ position: "relative" }}>
              Organisation description<sup>*</sup>
            </p>
            <RichTextEditor
              toolbarConfig={toolbarConfig}
              value={editorValue}
              onChange={handleOrgDesChange}
              required
              id="orgdescriptioneditor"
              name="bodyText"
              type="string"
              multiline
              variant="filled"
              style={{
                minHeight: 410,
                width: 420,
                border: "1px solid black",
                zIndex: 4,
              }}
              // error={props.orgDescriptionErrorMessage ? true : false}
              // helperText={props.orgDescriptionErrorMessage}
            />

            <span
              style={{
                position: "absolute",
                bottom: "-150px",
                left: "0px",
                color: "#ff3d00",
                textAlign: "left",
                minWidth: "420px",
                fontFamily: "Open Sans",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "12px",
                lineHeight: "16px",
              }}
            >
              {props.orgDescriptionErrorMessage
                ? props.orgDescriptionErrorMessage
                : ""}
            </span>
            {/* <TextField style={{width:"100%",position:"absolute", bottom:"-145px",left:0, zIndex:"100", outline:"none", border:"none",}} error={props.orgDescriptionErrorMessage ? true : false} helperText={props.orgDescriptionErrorMessage}>
                  </TextField> */}
          </div>
          {/* <div className="filesupload">
          <p className="uploadheader">Upload logo</p>
            <div className="uploadimg">
              <svg
                width={71}
                height={71}
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle cx={35.5} cy={35.5} r={35.5} fill="#FFF7DC" />
                <circle cx={35.5} cy={35.5} r={29.5} fill="#F9EABC" />
                <circle cx={35.5} cy={35.5} r={23.5} fill="#C09507" />
                <path
                  d="M38 25h-8c-1.1 0-1.99.9-1.99 2L28 43c0 1.1.89 2 1.99 2H42c1.1 0 2-.9 2-2V31l-6-6Zm4 18H30V27h7v5h5v11Zm-10-4.99 1.41 1.41L35 37.84V42h2v-4.16l1.59 1.59L40 38.01 36.01 34 32 38.01Z"
                  fill="#fff"
                />
              </svg>
            </div>
            <p style={{ color: "#A3B0B8" }}>
              Drag and drop or
              <span>
                <button class="orguploadbtn info">Browse</button>
              </span>
              your files
            </p>
            <p style={{ color: "#A3B0B8" }}>
              Supports: JPEG, PNG not more than 2MB file size
            </p>
          </div> */}
          <div className="org">
            <FileUploader
              //   multiple={true}
              id="orgfileuploader"
              handleChange={props.handleorgFileChange}
              name="file"
              types={fileTypes}
              children={
                <UploadOrgLogo
                  uploaddes="JPEG and PNG files upto 2MB are supported."
                  uploadtitle="Upload the company logo"
                />
              }
              //   maxSize={2}
            />
            <p className="filename">
              {props.orgfile
                ? props.orgfile.size
                  ? `File name: ${props.orgfile.name}`
                  : ""
                : "No file uploaded yet"}
            </p>
            <p className="oversizemb">
              {props.orgfile != null && props.orgfile.size > 2097152
                ? "File uploaded is more than 2MB!"
                : ""}
            </p>
          </div>
          <div>
            {/* <Button variant="contained" className="orgbtn" type="submit">
              <span className="signupbtnname">Next</span>
            </Button> */}
            {props.orgName &&
            mobileNumberMinimunLengthCheck(props.validOrgNumber) &&
            !props.isOrgnameerror &&
            props.Orgemailbtn &&
            !props.isOrgmailerror &&
            props.orgAddress &&
            !props.isOrgAddresserror &&
            props.orgCity &&
            !props.isOrgcityerror &&
            props.Orgcountrybtn &&
            props.orgPincode?.length >= 5 &&
            !props.ispincodeerror &&
            Orgdesbtn &&
            props.orgfile != null &&
            props.orgfile?.size < 2097152 ? (
              <Button
                onClick={props.handleOrgSubmit}
                variant="contained"
                className="orgbtn"
                type="submit"
              >
                <span className="signupbtnname">Next</span>
              </Button>
            ) : (
              <Button variant="outlined" disabled className="disableorgbtn">
                Next
              </Button>
            )}
          </div>
          {(isLoggedInUserParticipant() || isLoggedInUserCoSteward()) && (
            <div>
              <Button
                variant="outlined"
                className="finishlaterorgbtn"
                type="button"
                onClick={props.finishLaterOrgScreen}
              >
                Finish later
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="footerimg1">
        <svg
          width={150}
          height={127}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity={0.1} fill="#E7B100">
            <circle cx={5.814} cy={5.728} r={5.728} />
            <circle cx={40.181} cy={5.728} r={5.728} />
            <circle cx={74.547} cy={5.728} r={5.728} />
            <circle cx={108.914} cy={5.728} r={5.728} />
            <circle cx={143.28} cy={5.728} r={5.728} />
            <circle cx={5.814} cy={28.631} r={5.728} />
            <circle cx={40.181} cy={28.631} r={5.728} />
            <circle cx={74.547} cy={28.631} r={5.728} />
            <circle cx={108.914} cy={28.631} r={5.728} />
            <circle cx={143.28} cy={28.631} r={5.728} />
            <circle cx={5.814} cy={51.549} r={5.728} />
            <circle cx={40.181} cy={51.549} r={5.728} />
            <circle cx={74.547} cy={51.549} r={5.728} />
            <circle cx={108.914} cy={51.549} r={5.728} />
            <circle cx={143.28} cy={51.549} r={5.728} />
            <circle cx={5.814} cy={74.461} r={5.728} />
            <circle cx={40.181} cy={74.461} r={5.728} />
            <circle cx={74.547} cy={74.461} r={5.728} />
            <circle cx={108.914} cy={74.461} r={5.728} />
            <circle cx={143.28} cy={74.461} r={5.728} />
            <circle cx={5.814} cy={97.365} r={5.728} />
            <circle cx={40.181} cy={97.365} r={5.728} />
            <circle cx={74.547} cy={97.365} r={5.728} />
            <circle cx={108.914} cy={97.365} r={5.728} />
            <circle cx={143.28} cy={97.365} r={5.728} />
            <circle cx={5.814} cy={120.282} r={5.728} />
            <circle cx={40.181} cy={120.282} r={5.728} />
            <circle cx={74.547} cy={120.282} r={5.728} />
            <circle cx={108.914} cy={120.282} r={5.728} />
            <circle cx={143.28} cy={120.282} r={5.728} />
          </g>
        </svg>
      </div>
      <div style={{ position: "absolute", top: "1700px" }}>
        <Footer />
      </div>
    </div>
  );
}

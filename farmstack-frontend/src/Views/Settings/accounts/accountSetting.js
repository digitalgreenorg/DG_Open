import React, { useState, useEffect, useRef } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./accountsetting.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MuiPhoneNumber from "material-ui-phone-number";
import UploadProfileimg from "../../../Components/Settings/accounts/UploadProfileimg";
import { FileUploader } from "react-drag-drop-files";
import labels from "../../../Constants/labels";
import HTTPService from "../../../Services/HTTPService";
import UrlConstants from "../../../Constants/UrlConstants";
import HandleSessionTimeout, {
  setTokenLocal,
  getTokenLocal,
  setUserId,
  getUserLocal,
  GetErrorKey,
  mobileNumberMinimunLengthCheck,
  fileUpload,
} from "../../../Utils/Common";
import UrlConstant from "../../../Constants/UrlConstants";
import { useHistory } from "react-router-dom";
import RegexConstants from "../../../Constants/RegexConstants";
import {
  GetErrorHandlingRoute,
  validateInputField,
} from "../../../Utils/Common";
import Loader from "../../../Components/Loader/Loader";

const useStyles = {
  marginrowtop: { "margin-top": "20px" },
  marginrowtop8px: { "margin-top": "0px" },
};

export default function AccountSetting(props) {
  const profilefirstname = useRef();
  const profilelastname = useRef();
  const profileemail = useRef();
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setemail] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  // const [profile_pic, setprofile_pic] = useState(null);

  const [ispropfilefirstnameerror, setispropfilefirstnameerror] =
    useState(false);
  const [ispropfilelastnameerror, setispropfilelastnameerror] = useState(false);
  const [ispropfileemailerror, setispropfileemailerror] = useState(false);
  const [validNumber, setValidnumber] = useState("");
  const [accountSettingSubmitbutton, setaccountSettingSubmitbutton] =
    useState(false);
  const fileTypes = ["JPEG", "PNG", "jpg"];
  const [file, setFile] = useState(null);
  const [accfirstnamebtn, setaccfirstbtn] = useState(false);
  const [accfilesize, setaccfilesize] = useState(false);
  const [accnumberbtn, setaccnumberbtn] = useState(false);
  const [screenlabels, setscreenlabels] = useState(labels["en"]);

  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState(null);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState(null);
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState(null);

  const history = useHistory();

  const handleprofilfirstename = (e) => {
    console.log(e.target.value);
    // var letters = /^[A-Za-z]+$/;
    // var profilefirstname = e.target.value;
    // setfirstname(e.target.value);
    // if (profilefirstname.match(letters)) {
    //   setispropfilefirstnameerror(false);
    //   setaccfirstbtn(true);
    //   //   setprofilenextbutton(true);
    // } else {
    //   setispropfilefirstnameerror(true);
    //   //   setprofilenextbutton(false);
    // }

    if (validateInputField(e.target.value, RegexConstants.TEXT_REGEX)) {
      setfirstname(e.target.value.trim());
      setaccfirstbtn(true);
    } else {
      e.preventDefault();
    }
  };

  const handleprofilelastname = (e) => {
    console.log(e.target.value);
    // setlastname(e.target.value);
    // var letters = /^[A-Za-z]+$/;
    // var lastname = e.target.value;
    // if (lastname.match(letters)) {
    //   setispropfilelastnameerror(false);
    //   //   setprofilenextbutton(true);
    // } else {
    //   setispropfilelastnameerror(true);
    //   //   setprofilenextbutton(false);
    // }
    if (validateInputField(e.target.value, RegexConstants.TEXT_REGEX)) {
      setlastname(e.target.value.trim());
    } else {
      e.preventDefault();
    }
  };
  const handleprofileemail = (e) => {
    console.log(e.target.value);
    var email = e.target.value;
    //   // if (email.length > 0) {
    //   //   setispropfileemailerror(false);
    //   //   setprofilenextbutton(true);
    //   // } else {
    //   //   setispropfileemailerror(true);
    //   // }
  };
  const phonenumcheck = (number) => {
    return number.length >= 9
  }
  const handleprofilenumber = (value) => {
    console.log(value);
    console.log(value.length);
    //   // var number = e.target.value;
    //   // if (number.length > 0) {
    //   //   setispropfilenumbererror(false);
    //   //   setprofilenextbutton(true);
    //   // } else {
    //   //   setispropfilenumbererror(true);
    //   // }
    if (phonenumcheck(value)) {
      setaccnumberbtn(true);
    } else {
      setaccnumberbtn(false);
    }
    setValidnumber(value);

    setphonenumber(value);
  };

  const handleBannerFileChange = (file) => {
    setFile(file);
    console.log("stop testing chandra ,move it to done");
    // setprofile_pic(file);
    console.log(file);
    if (file != null && file.size > 2097152) {
      //   setBrandingnextbutton(false);
      setaccfilesize(true);
    } else {
      setaccfilesize(false);
    }
  };

  const accountsettingcancelbtn = (e) => {
    // history.push("/datahub/participants/");
    setFile(null);
    getAccountDetails();
    window.location.reload();
  };

  const handleAccountSettingSubmit = (e) => {
    e.preventDefault();

    var id = getUserLocal();
    console.log("user id", id);

    setFirstNameErrorMessage(null);
    setLastNameErrorMessage(null);
    setPhoneNumberErrorMessage(null);

    var bodyFormData = new FormData();
    bodyFormData.append("first_name", firstname);
    bodyFormData.append("last_name", lastname);
    bodyFormData.append("phone_number", phonenumber);
    // bodyFormData.append("profile_picture", file);

    // file upload
    console.log(file)
    fileUpload(bodyFormData, file, "profile_picture");

    console.log("branding data", bodyFormData);
    setIsLoader(true);
    HTTPService(
      "PUT",
      UrlConstants.base_url + UrlConstants.profile + id + "/",
      bodyFormData,
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("account setting updated!");
        props.setisAccountUpdateSuccess();
        // console.log("get request for account settings", response.data);
        // console.log("picture", response.data.profile_picture);
        // setphonenumber(response.data.phonenumber);
        // setfirstname(response.data.first_name);
        // setlastname(response.data.last_name);
        // setemail(response.data.email);
        // setFile(response.data.profile_picture);
      })
      .catch((e) => {
        setIsLoader(false);
        var returnValues = GetErrorKey(e, bodyFormData.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "first_name":
                setFirstNameErrorMessage(errorMessages[i]);
                break;
              case "last_name":
                setLastNameErrorMessage(errorMessages[i]);
                break;
              //case "email": setEmailErrorMessage(errorMessages[i]); break;
              case "phone_number":
                setPhoneNumberErrorMessage(errorMessages[i]);
                break;
              default:
                history.push(GetErrorHandlingRoute(e));
                break;
            }
          }
        } else {
          history.push(GetErrorHandlingRoute(e));
        }
      });
  };
  const getAccountDetails = async () => {
    var id = getUserLocal();
    console.log("user id", id);
    setIsLoader(true);

    await HTTPService(
      "GET",
      UrlConstants.base_url + UrlConstants.profile + id + "/",
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("get request for account settings", response.data);
        console.log("picture", response.data.profile_picture);
        setphonenumber(response.data.phone_number);
        setfirstname(response.data.first_name);
        setlastname(response.data.last_name);
        setemail(response.data.email);
        setFile(response.data.profile_picture);
        if (response.data.first_name) {
          setaccfirstbtn(true);
        }
        if (response.data.phone_number) {
          if (response.data.phone_number.length > 0) {
            setaccnumberbtn(true);
          }
        }
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  useEffect(() => {
    getAccountDetails();
  }, []);
  return (
    <div className="accountsetting">
      {isLoader ? <Loader /> : ""}
      <div noValidate autoComplete="off" >
        <Row>
          <span className="title">Account settings</span>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <TextField
              required
              id="filled-basic"
              label={screenlabels.account_settings.first_name}
              variant="filled"
              className="firstname"
              value={firstname}
              // style={{ width: "50%" }}
              // className="profilefirstname"
              // onKeyUp={
              //   firstname === ""
              //     ? setispropfilefirstnameerror(true)
              //     : setispropfilefirstnameerror(false)
              // }
              onKeyUp={() =>
                firstname === ""
                  ? setispropfilefirstnameerror(true)
                  : setispropfilefirstnameerror(false)
              }
              onChange={handleprofilfirstename}
              inputRef={profilefirstname}
              error={ispropfilefirstnameerror || firstNameErrorMessage}
              helperText={
                ispropfilefirstnameerror && !firstNameErrorMessage
                  ? "Enter Valid Name"
                  : firstNameErrorMessage
              }
            />
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <TextField
              id="filled-basic"
              label={screenlabels.account_settings.last_name}
              variant="filled"
              value={lastname}
              //   style={{ width: "95%" }}
              //   className="profilelastname"
              className="lastname"
              // onKeyUp={() =>
              //   lastname === ""
              //     ? setispropfilelastnameerror(true)
              //     : setispropfilelastnameerror(false)
              // }
              onChange={handleprofilelastname}
              inputRef={profilelastname}
              error={lastNameErrorMessage ? true : false}
              helperText={lastNameErrorMessage}
            // error={ispropfilelastnameerror}
            // helperText={
            //   ispropfilelastnameerror ? "Enter Valid last name" : ""
            // }
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <TextField
              id="filled-basic"
              label={screenlabels.account_settings.email}
              variant="filled"
              className="email"
              value={email}
              //   style={{ width: "420px" }}
              //   className="profileemail"
              onChange={handleprofileemail}
              inputRef={profileemail}
              inputProps={{ readOnly: true }}
              //   defaultValue={validemail}
              disabled
            // error={props.ispropfileemailerror}
            // helperText={
            //   props.ispropfileemailerror ? "Enter Valid Email id" : ""
            // }
            />
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <MuiPhoneNumber
              required
              countryCodeEditable={false}
              defaultCountry={"in"}
              className="phonenumber"
              value={phonenumber}
              //   style={{ width: "420px" }}
              id="filled-basic"
              label={screenlabels.account_settings.contact}
              variant="filled"
              onChange={handleprofilenumber}
              error={phoneNumberErrorMessage ? true : false}
              helperText={phoneNumberErrorMessage}
            // error={ispropfilenumbererror}
            // helperText={ispropfilenumbererror ? "Enter Valid Email id" : ""}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <FileUploader
              //   multiple={true}
              handleChange={handleBannerFileChange}
              name="file"
              types={fileTypes}
              children={
                <UploadProfileimg
                  uploaddes="JPEG and PNG files upto 2 MB in size are supported."
                  uploadtitle="Upload Profile image"
                />
              }
            //   maxSize={2}
            />
          </Col>
        </Row>

        <Col xs={12} sm={12} md={6} lg={6}>
          <div>
            <p className="uploadimgname">
              {file ? (file.size ? `File name: ${file.name}` : "") : ""}
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
            <p className="oversizemb-uploadimglogo">
              {file != null && file.size > 2097152
                ? "File uploaded is more than 2MB!"
                : ""}
            </p>
          </div>
        </Col>

        <Row>
          <Col xs={12} sm={12} md={6} lg={3}></Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            {/* <Col xs={12} sm={12} md={12} lg={12}> */}
            {/* <div className="accountsubmit"> */}
            {/* <Button
              variant="contained"
              className="accountnextbtn"
              type="submit">
              <span className="">Submit</span>
            </Button> */}
            {!ispropfilefirstnameerror &&
              !accfilesize &&
              accfirstnamebtn &&
              file != null &&
              accnumberbtn ? (
              // <Button variant="contained" className="submitbtn" type="submit">
              //   <span className="signupbtnname">Submit</span>
              // </Button>
              <Button
                onClick={handleAccountSettingSubmit}
                variant="contained"
                className="submitbtn"
                style={{ textTransform: "none" }}
                type="submit">
                {screenlabels.common.submit}
              </Button>
            ) : (
              <Button variant="outlined" style={{ textTransform: "none" }} disabled className="disbalesubmitbtn">
                Submit
              </Button>
            )}
            {/* </div> */}
          </Col>
        </Row>
        <Row style={useStyles.marginrowtop8px}>
          <Col xs={12} sm={12} md={6} lg={3}></Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Button
              variant="outlined"
              className="cancelbtn"
              style={{ textTransform: "none" }}
              type="button"
              onClick={accountsettingcancelbtn}>
              {screenlabels.common.cancel}
            </Button>
            {/* </div> */}
          </Col>
        </Row>
      </div>
    </div>
  );
}

import React, { useState, useRef, useMemo, useEffect } from "react";
import SignInHeader from "../../Components/signup/SignInHeader";
import Leftintro from "../../Components/intros/Leftintro";
import Rightintro from "../../Components/intros/Rightintro";
import SignupEmail from "../../Components/signup/SignupEmail";
import Footerimg from "../../Components/signup/Footerimg";
import Footer from "../../Components/Footer/Footer";
import SignupOtp from "../../Components/signup/SignupOtp";
import "./Login.css";
import validator from "validator";
import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import labels from "../../Constants/labels";

import ProfileRightside from "../../Components/signup/ProfileRightside";
import OrgRightside from "../../Components/signup/OrgRightside";
import PoliciesRightside from "../../Components/signup/PoliciesRightside";
import BrandingRightside from "../../Components/signup/BrandingRightside";
import AddDataset from "../../Components/AdminDatasetConnection/AddDataset";
import HandleSessionTimeout, {
  setTokenLocal,
  getTokenLocal,
  setUserId,
  getUserLocal,
  setUserMapId,
  setOrgId,
  setRoleLocal,
  isLoggedInUserAdmin,
  isLoggedInUserParticipant,
  getRoleLocal,
  getUserMapId,
  GetErrorKey,
  validateInputField,
  isParticipantRoute,
  isLoggedInUserCoSteward,
} from "../../Utils/Common";
import RichTextEditor from "react-rte";
import countryList from "react-select-country-list";
import { useHistory, useLocation, Redirect } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";
import { GetErrorHandlingRoute } from "../../Utils/Common";
import ProfileRightsideParticipant from "../../Components/signup/ProfileRightsideParticipant";
import AddDatasetParticipant from "../Dataset/DatasetParticipant/AddDatasetParticipant";
import RegexConstants from "../../Constants/RegexConstants";
import LeftintroParticipant from "../../Components/intros/LeftIntroParticipant";
import LocalStorageConstants from "../../Constants/LocalStorageConstants";
import AddingCategory from "../../Components/Catergories/AddingCategory";
import { ConsoleSqlOutlined } from "@ant-design/icons";
import StandardizationInOnbord from "../../Components/Standardization/StandardizationInOnbording";
export default function Login(props) {
  const [button, setButton] = useState(false);
  const email = useRef();
  const [iserror, setError] = useState(false);

  const [verifyOtpbutton, setOtpButton] = useState(false);
  const otp = useRef();
  const [otpValue, setOtpValue] = useState("");
  const [isOtperror, setOtpError] = useState(false);
  const [userSuspenderror, setuserSuspenderror] = useState(false);
  const [restartcounter, Setrestartcounter] = useState(0);
  const [disable, setDisable] = useState(true);
  const [errormessage, setErrormessage] = useState("");

  const [validemail, Setvalidemail] = useState("");
  const [screenlabels, setscreenlabels] = useState(labels["en"]);

  const [isemail, setEmail] = useState(true);
  const [isOtp, setisOtp] = useState(false);
  const [isProfile, setisProfile] = useState(false);
  const [isOrg, setisOrg] = useState(false);
  const [isPolicies, setisPolicies] = useState(false);
  const [isBranding, setisBranding] = useState(false);
  const [isDataSet, setIsDataSet] = useState(false);
  const [isCategorySetup, setIsCategorySetup] = useState(false);
  const [isaccesstoken, setisaccesstoken] = useState(false);
  const [isDataStandardization, setIsDataStandardization] = useState(false);
  //const [userid, setUserId] = useState(false)

  const [orgName, setOrgName] = useState("");
  // const [orgEmail, setOrgEmail] = useState("")
  const [orgAddress, setOrgAddress] = useState("");
  const [orgCity, setOrgCity] = useState("");
  const [orgPincode, setOrgPincode] = useState("");
  const [isExistingOrgEmail, setIsExistingOrgEmail] = useState(false);
  const [orgId, setOrgIdState] = useState(null);

  const [profileid, setprofileid] = useState("");

  const [orgNameErrorMessage, setOrgNameErrorMessage] = useState(null);
  const [orgEmailErrorMessage, setOrgEmailErrorMessage] = useState(null);
  const [orgPhoneNumberErrorMessage, setOrgPhoneNumberErrorMessage] =
    useState(null);
  const [orgDescriptionErrorMessage, setOrgDescriptionErrorMessage] =
    useState(null);

  const timerDuration = 120000;
  const [remainingCounterTime, setRemainingCounterTime] =
    useState(timerDuration);
  const onBoardingPage = true

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (getTokenLocal() && isLoggedInUserAdmin()) {
      props.history.push("/datahub/participants");
    }
    else if (getTokenLocal() && isLoggedInUserParticipant()) {
      props.history.push("/participant/datasets");
    }
    else if (getTokenLocal() && isLoggedInUserCoSteward()) {
      props.history.push("/datahub/participants");
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email.current.value);
    const emailString = email.current.value;
    const valid = validator.isEmail(email.current.value);
    console.log(valid);
    const finalEmail = emailString.trim().toLowerCase();
    console.log(finalEmail);
    if (!valid) {
      setError(true);
    } else {
      Setvalidemail(finalEmail);
      let url = UrlConstant.base_url + UrlConstant.login;
      let data = {
        email: finalEmail,
        // role: isParticipantRoute(location.pathname)
        //   ? LocalStorageConstants.ROLES.DATAHUB_PARTICIPANT_ROOT
        //   : LocalStorageConstants.ROLES.DATAHUB_ADMIN
      };
      console.log(data, "EMAILLLLLLLLL")

      setIsLoader(true);

      HTTPService("POST", url, data, false, false)
        .then((response) => {
          setIsLoader(false);
          console.log("email sent");
          console.log("email sent", response.data);
          //   console.log(response.json());
          console.log(response.status);
          if (response.status === 201) {
            console.log(response?.data?.id);
            setprofileid(response?.data?.id);
            setUserId(response?.data?.id);
            setEmail(false);
            setError(false);
            setuserSuspenderror(false);
            setisOtp(true);
          } else {
            setError(true);
            setuserSuspenderror(false);
          }
        })
        .catch((e) => {
          setIsLoader(false);
          console.log(e);
          if (
            e.response != null &&
            e.response != undefined &&
            e.response.status === 401
          ) {
            setuserSuspenderror(false);
            setError(true);
            setErrormessage(
              e.response.data && e.response.data.message
                ? e.response.data.message
                : "User not registered"
            );
          } else if (
            e.response != null &&
            e.response != undefined &&
            e.response.status === 403
          ) {
            setuserSuspenderror(true);
            setError(false);
            setErrormessage(
              e.response.data && e.response.data.message
                ? e.response.data.message
                : "User suspended. Please try after sometime."
            );
          } else {
            history.push(GetErrorHandlingRoute(e));
          }
        });
    }
  };
  const handleEmail = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    e.target.value = e.target.value.trim();
    if (e.target.value.trim().length > 0) {
      setButton(true);
      setError(false);
    } else {
      setButton(false);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    console.log(otp.current.value);
    const valid = otp.current.value;
    var numbers = /^[0-9]+$/;
    let url = UrlConstant.base_url + UrlConstant.otp;

    if (!valid.match(numbers)) {
      setOtpError(true);
    } else {
      setIsLoader(true);
      await HTTPService(
        "POST",
        url,
        {
          email: validemail,
          otp: valid,
        },
        false,
        false
      )
        .then((response) => {
          setIsLoader(false);
          console.log("uid", response.data.user);

          console.log("otp valid");
          console.log("otp valid", response.data);
          console.log("access token", response.data.access);
          console.log("user status", response.data.status);
          console.log("onboarded", response.data.on_boarded);
          console.log("refresh", response.data.refresh)
          localStorage.setItem("refresh", JSON.stringify(response.data.refresh))
          console.log(response.status);
          // if (response.data.status) {
          //   setTokenLocal(response.data.access);
          //   props.history.push("/datahub/participants");
          // }

          if (response.status === 201) {
            setRoleLocal(response?.data?.role);
            setUserMapId(response?.data?.user_map);
            setOrgId(response?.data?.org_id);
            console.log(getRoleLocal());
            console.log("isLoggedInUserAdmin(): " + isLoggedInUserAdmin());
            console.log(
              "isLoggedInUserParticipant(): " + isLoggedInUserParticipant()
            );
            console.log(
              "isLoggedInUserCoSteward(): " + isLoggedInUserCoSteward()
            );

            if (response?.data?.on_boarded) {
              setTokenLocal(response?.data?.access);
              if (isLoggedInUserAdmin()) {
                props.history.push("/datahub/participants");
              } else if (isLoggedInUserParticipant()) {
                props.history.push("/participant/datasets");
              }
              else if (isLoggedInUserCoSteward()) {
                props.history.push("/datahub/participants");
              }
            } else {
              setisaccesstoken(response?.data?.access);

              setOrgIdState(response?.data?.org_id);
              setOtpError(false);
              setisProfile(true);
              // setIsDataStandardization(true)
              // setIsDataStandardization(true)
              setisOtp(false);
            }
            // console.log(response.json());
            // console.log(response.refresh);
            // console.log(response.active);
          } else {
            setOtpError(true);
          }
        })
        .catch((e) => {
          setIsLoader(false);
          //console.log(e.response.status)
          setOtpError(true);
          if (
            e.response != null &&
            e.response != undefined &&
            e.response.status === 401
          ) {
            setOtpError(true);
            setuserSuspenderror(false);
            setErrormessage(
              e.response.data && e.response.data.message
                ? e.response.data.message
                : "Enter valid OTP"
            );
          } else if (
            e.response != null &&
            e.response != undefined &&
            e.response.status === 403
          ) {
            setuserSuspenderror(true);
            setOtpError(false);
            setErrormessage(
              e.response.data && e.response.data.message
                ? e.response.data.message
                : "Maximum attempts taken. Please try after sometime."
            );
          } else {
            history.push(GetErrorHandlingRoute(e));
          }
        });
    }
  };

  const handleOtp = (e) => {
    e.preventDefault();
    let value = e.target.value;
    console.log(value);
    value = value.replace(/[^0-9]/g, "");
    if (value.trim().length > 6) {
      value = value.substring(0, 6);
    }
    e.target.value = value;
    // setOtpValue(value)
    if (value.trim().length === 6) {
      setOtpButton(true);
      setOtpError(false);
    } else {
      setOtpButton(false);
      //   setOtpError(true);
    }
  };
  const hanleResendOTp = async (e) => {
    e.preventDefault();
    console.log("resend otp btn clicked");
    let url = UrlConstant.base_url + UrlConstant.resend_otp;
    // SetCounterTimeout(false);
    // Setrestart(restart + 1);
    Setrestartcounter(restartcounter + 1);
    setRemainingCounterTime(timerDuration);
    setDisable(true);
    // await fetch("https://80a5-106-51-85-143.in.ngrok.io/accounts/resend_otp/", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email: validemail,
    //   }),
    // })
    setIsLoader(true);
    HTTPService(
      "POST",
      url,
      {
        email: validemail,
      },
      false,
      false
    )
      .then((response) => {
        setIsLoader(false);
        console.log("otp valid");
        console.log(response);
      })
      .catch((e) => {
        setIsLoader(false);
        if (
          e.response != null &&
          e.response != undefined &&
          e.response.status === 401
        ) {
          setOtpError(true);
          setuserSuspenderror(false);
          setErrormessage(
            e.response.data && e.response.data.message
              ? e.response.data.message
              : "User not registered"
          );
        } else if (
          e.response != null &&
          e.response != undefined &&
          e.response.status === 403
        ) {
          setuserSuspenderror(true);
          setOtpError(false);
          setErrormessage(
            e.response.data && e.response.data.message
              ? e.response.data.message
              : "User suspended. Please try after sometime."
          );
        } else {
          history.push(GetErrorHandlingRoute(e));
        }
      });
  };

  const [ispropfilefirstnameerror, setispropfilefirstnameerror] =
    useState(false);
  const [ispropfilelastnameerror, setispropfilelastnameerror] = useState(false);
  const [ispropfileemailerror, setispropfileemailerror] = useState(false);
  // const [ispropfilenumbererror, setispropfilenumbererror] = useState(false);
  const [profilenextbutton, setprofilenextbutton] = useState(false);
  const [validNumber, setValidnumber] = useState("");
  const [profilefirstname, setProfileFirstName] = useState("");
  const [profilelastname, setProfileLastName] = useState("");
  const [profileimage, setProfileImageFile] = useState(null);

  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState(null);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState(null);

  const profileemail = useRef();

  const handleprofileSubmit = async (e) => {
    e.preventDefault();
    //console.log(profilefirstname.current.value);
    const firstname = profilefirstname;
    const lastname = profilelastname;
    const email = profileemail.current.value;
    if (profilefirstname.length === 0) {
      setispropfilefirstnameerror(true);
    } else {
      setispropfilefirstnameerror(false);
    }

    setFirstNameErrorMessage(null);
    setLastNameErrorMessage(null);
    setEmailErrorMessage(null);
    setPhoneNumberErrorMessage(null);

    // if (profilelastname.current.value.length === 0) {
    //   setispropfilelastnameerror(true);
    // } else {
    //   setispropfilelastnameerror(false);
    // }
    // if (profileemail.current.value.length === 0) {
    //   setispropfileemailerror(true);
    // } else {
    //   setispropfileemailerror(false);
    // }
    var bodyFormData = new FormData();
    bodyFormData.append("email", email);
    bodyFormData.append("first_name", firstname);
    bodyFormData.append("last_name", lastname);
    bodyFormData.append("phone_number", validNumber);
    //bodyFormData.append("profile_picture", profileimage);

    console.log("profile data", bodyFormData);
    let url = UrlConstant.base_url + UrlConstant.profile + `${profileid}/`;
    setIsLoader(true);
    await HTTPService("PUT", url, bodyFormData, true, true, isaccesstoken)
      .then((response) => {
        setIsLoader(false);
        console.log("profile response");
        console.log("profile details", response.data);
        //   console.log(response.json());
        console.log(response.status);
        // setisOrg(true);
        // setisProfile(false);
        if (response.status === 201) {
          // setEmail(false);
          // setError(false);
          setisProfile(false);
          setisOrg(true);
          //setOnBoardedTrue();
        }
        // } else {
        //   // setError(true);
        //   setisOrg(false);
        // }
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
              case "email":
                setEmailErrorMessage(errorMessages[i]);
                break;
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
        //history.push(GetErrorHandlingRoute(e));
      });
  };
  const handleprofilfirstename = (e) => {
    console.log(e.target.value);
    var letters = /^[A-Za-z]+$/;
    var profilefirstname = e.target.value.trim();
    setProfileFirstName(profilefirstname);
    // if (profilefirstname.length > 0) {
    //   setispropfilefirstnameerror(false);
    //   // setprofilenextbutton(true);
    // } else {
    //   setispropfilefirstnameerror(true);
    // }
    if (profilefirstname.match(letters)) {
      setispropfilefirstnameerror(false);
      setprofilenextbutton(true);
    } else {
      setispropfilefirstnameerror(true);
      setprofilenextbutton(false);
    }
  };
  const handleprofilelastname = (e) => {
    console.log(e.target.value);
    var letters = /^[A-Za-z\s]*$/;
    var lastname = e.target.value.trim();
    setProfileLastName(lastname);
    if (lastname.match(letters)) {
      setispropfilelastnameerror(false);
      // setprofilenextbutton(true);
    } else {
      setispropfilelastnameerror(true);
      // setprofilenextbutton(false);
    }
  };

  // const handleprofileemail = (e) => {
  //   console.log(e.target.value);
  //   var email = e.target.value;
  //   // if (email.length > 0) {
  //   //   setispropfileemailerror(false);
  //   //   setprofilenextbutton(true);
  //   // } else {
  //   //   setispropfileemailerror(true);
  //   // }
  // };
  const handleprofilenumber = (value) => {
    console.log(value);
    // var number = e.target.value;
    // if (number.length > 0) {
    //   setispropfilenumbererror(false);
    //   setprofilenextbutton(true);
    // } else {
    //   setispropfilenumbererror(true);
    // }
    //profilephone.current = value;
    setValidnumber(value);
  };

  const setOnBoardedTrue = () => {
    let data = {
      user_id: getUserLocal(),
      on_boarded: true,
    };
    var url = UrlConstant.base_url + UrlConstant.onboarded;
    var bodyFormData = new FormData();
    bodyFormData.append("user_id", getUserLocal());
    bodyFormData.append("on_boarded", true);

    setIsLoader(true);
    HTTPService("POST", url, data, false, true, isaccesstoken)
      .then((response) => {
        setIsLoader(false);
        console.log("onboarded true response", response.data);
        // if (isLoggedInUserParticipant()) {
        //   history.push("/participant/datasets/");
        // }
      })
      .catch((e) => {
        setIsLoader(false);
        console.log(e);
      });
  };
  const finishLaterProfileScreen = () => {
    console.log("clicked on finish later profile screen");
    setisProfile(false);
    setisOrg(true);
    /*
    if (isLoggedInUserParticipant()) {
      setOnBoardedTrue();
    }*/
  };

  // org screen
  const [isOrgnameerror, setisOrgnameerror] = useState(false);
  const [isOrgmailerror, setisOrgmailerror] = useState(false);
  // const [isOrgnumbererror, setisOrgnumbererror] = useState(false);
  const [isOrgAddresserror, setisOrgAddresserror] = useState(false);
  const [isOrgcityerror, setisOrgcityerror] = useState(false);
  const [ispincodeerror, setispincodeerror] = useState(false);
  const [countryvalue, setcountryvalue] = useState("");
  // const [orgdeserror, serorgdeserror] = useState(false);
  // const [orgdesc, setorgdesc] = useState("");
  // const [editorValue, setEditorValue] = React.useState(
  //   RichTextEditor.createValueFromString(orgdesc, "html")
  // );
  const [textEditorValue, settextEditorValue] = useState("");

  const [validOrgNumber, setValidOrgnumber] = useState('');
  const [orgfile, setorgfile] = useState(null);
  const [orgmail, setOrgMail] = useState("");
  const [Orgnamebtn, setOrgnamebtn] = useState(false);
  const [Orgemailbtn, setOrgemailbtn] = useState(false);
  const [Orgaddressbtn, setOrgaddressbtn] = useState(false);
  const [Orgcitybtn, setOrgcitybtn] = useState(false);
  const [Orgcountrybtn, setOrgcountrybtn] = useState(false);
  const [Orgpincodebtn, setOrgpincodebtn] = useState(false);

  const [isLoader, setIsLoader] = useState(false);

  const [orgWebsite, setOrgWebsite] = useState('')
  const [isOrgWebsiteerror, setisOrgWebsiteerror] = useState(false)
  const [orgWebsiteErrorMessage, setOrgWebsiteErrorMessage] = useState(null)

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

  const handleOrgSubmit = async (e) => {
    e.preventDefault();

    setOrgNameErrorMessage(null)
    setOrgEmailErrorMessage(null)
    setOrgPhoneNumberErrorMessage(null)
    setOrgDescriptionErrorMessage(null)
    setOrgWebsiteErrorMessage(null)

    // email validation
    const emailstring = orgmail;
    const valid = validator.isEmail(emailstring);
    console.log(valid);
    const finalEmail = emailstring.trim();

    // const name = Orgname.current.value;
    const finalName = orgName;

    // const address = OrgAddress.current.value;
    const finalAddress = orgAddress;

    // const city = Orgcity.current.value;
    const finalCity = orgCity;

    // const pinCode = pincode.current.value;
    const finalpinCode = orgPincode;
    var id = getUserLocal();
    console.log("user id", id);

    var bodyFormData = new FormData();
    bodyFormData.append("user_id", id);
    bodyFormData.append("org_email", finalEmail.toLowerCase());
    bodyFormData.append("name", finalName);
    bodyFormData.append("website", orgWebsite);
    bodyFormData.append(
      "address",
      JSON.stringify({
        country: countryvalue,
        pincode: finalpinCode,
        address: finalAddress,
        city: finalCity,
      })
    );
    bodyFormData.append("phone_number", validOrgNumber);
    bodyFormData.append("logo", orgfile);
    bodyFormData.append("org_description", textEditorValue);
    for (const pair of bodyFormData.entries()) {
      console.log(`${pair[0]}, ${pair[1]}`);
    }
    // console.log(bodyFormData, "EMAIL CHECK")

    if (!valid) {
      setisOrgmailerror(true);
    } else {
      setisOrgnameerror(false);
      var method = orgId && orgId.length > 0 ? "PUT" : "POST";
      var url =
        orgId && orgId.length > 0
          ? UrlConstant.base_url + UrlConstant.org + id + "/"
          : UrlConstant.base_url + UrlConstant.org;

      setIsLoader(true);
      HTTPService(method, url, bodyFormData, true, true, isaccesstoken)
        .then((response) => {
          setIsLoader(false);
          console.log("response");
          console.log("org details", response.data);
          //   console.log(response.json());
          console.log(response.status);
          console.log(response.data.user_map);
          console.log(response.data.org_id);
          if (response.status === 201) {
            setisPolicies(true);
            setisOrg(false);
            setUserMapId(response?.data?.user_map);
            setOrgId(response?.data?.org_id);
            setOrgIdState(response?.data?.org_id);

            if (isLoggedInUserParticipant()) {
              console.log("partcheck")
              if (getUserMapId()) {
                console.log("datasetcheck")
                setIsDataSet(true);
                setisOrg(false);
              } else {
                console.log("onboardtrueroute")
                setOnBoardedTrue();
                setTokenLocal(isaccesstoken);
              }
            } else if (isLoggedInUserCoSteward()) {
              console.log("costewardcheck")
              setOnBoardedTrue();
              setTokenLocal(isaccesstoken);
              console.log("isaccesstoken", isaccesstoken)
              props.history.push("/datahub/participants");
              // history.push("/datahub/participants")
              // <Redirect push to="/"/>
            }

            // setEmail(false);
            // setError(false);
          } else {
            // setError(true);
          }
        })
        .catch((e) => {
          setIsLoader(false);
          console.log(e);
          var returnValues = GetErrorKey(e, bodyFormData.keys())
          var errorKeys = returnValues[0]
          var errorMessages = returnValues[1]
          if (errorKeys.length > 0) {
            for (var i = 0; i < errorKeys.length; i++) {
              switch (errorKeys[i]) {
                case "phone_number": setOrgPhoneNumberErrorMessage(errorMessages[i]); break;
                case "name": setOrgNameErrorMessage(errorMessages[i]); break;
                case "org_email": setOrgEmailErrorMessage(errorMessages[i]); break;
                case "website": setOrgWebsiteErrorMessage(errorMessages[i]); break;
                case "org_description": setOrgDescriptionErrorMessage(errorMessages[i]); break;
                default: history.push(GetErrorHandlingRoute(e)); break;
              }
            }
          } else {
            history.push(GetErrorHandlingRoute(e));
          }
        });
    }
  };

  const handleOrgname = (e) => {
    console.log(e.target.value);
    var letters = /^[A-Za-z ]*$/;
    var orgname = e.target.value;
    // if (orgname.length > 0) {
    //   setisOrgnameerror(false);
    //   setOrgnextbutton(true);
    // } else {
    //   setisOrgnameerror(true);
    // }
    if (orgname.match(letters)) {
      setisOrgnameerror(false);
      setOrgnamebtn(true);
      //   setprofilenextbutton(true);
    } else {
      setisOrgnameerror(true);
      setOrgnamebtn(false);
    }
  };

  const handleOrgWebsite = (e) => {
    e.target.value = e.target.value.trim()
    setOrgWebsite(e.target.value)
    setisOrgWebsiteerror(!validateInputField(e.target.value, RegexConstants.NEW_WEBSITE_REGEX) &&
      !validateInputField(e.target.value, RegexConstants.NEW_C_WEBSITE_REGEX))
  };

  const handleOrgmail = (e) => {
    e.target.value = e.target.value.trim()
    // console.log(e.target.value);
    var email = e.target.value;
    // if (email.length > 0) {
    //   setisOrgmailerror(false);
    //   // setOrgnextbutton(true);
    // } else {
    //   setisOrgmailerror(true);
    // }
    setIsExistingOrgEmail(false);
    const valid = validator.isEmail(email);
    console.log(valid);
    const finalEmail = email.trim();
    setOrgMail(finalEmail);
    console.log(finalEmail);
    if (valid) {
      setisOrgmailerror(false);
      setOrgemailbtn(true);
    } else {
      setisOrgmailerror(true);
      setOrgemailbtn(false);
    }
  };

  const handleOrgnumber = (value) => {
    setValidOrgnumber(value ? value : "");
  };

  const handleOrgAddress = (e) => {
    console.log(e.target.value);
    var address = e.target.value;
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
    var letters = /^[A-Za-z]+$/;
    // var letters = /^$|^[a-zA-Z][a-zA-Z ]*$/;
    var city = e.target.value;
    // if (city.length > 0) {
    //   setisOrgcityerror(false);
    //   setOrgnextbutton(true);
    // } else {
    //   setisOrgcityerror(true);
    // }
    if (city.match(letters)) {
      setisOrgcityerror(false);
      setOrgcitybtn(true);
      //   setprofilenextbutton(true);
    } else {
      setisOrgcityerror(true);
      setOrgcitybtn(false);
    }
  };

  const countrychangeHandler = (e) => {
    setcountryvalue(e.target.value);
    console.log(e.target.value);
    setOrgcountrybtn(true);
  };

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
  };

  const handleorgFileChange = (file) => {
    // var finalFiles = file.target.files;
    setorgfile(file);
    console.log(file);
    console.log(file.length);
    console.log(file.size);
  };

  const finishLaterOrgScreen = () => {
    console.log("clicked on finish later Org screen");
    if (isLoggedInUserAdmin()) {
      setisPolicies(true);
      setisOrg(false);
    }
    if (isLoggedInUserParticipant()) {
      if (getUserMapId()) {
        setIsDataSet(true);
        setisOrg(false);
      } else {
        setOnBoardedTrue();
        setTokenLocal(isaccesstoken);
        props.history.push("/participant/datasets/add");
      }

      //props.history.push('/loginadddatasetparticipant');
    }
    if (isLoggedInUserCoSteward()) {
      console.log("costewardcheck")
      setisOrg(false);
      setOnBoardedTrue();
      setTokenLocal(isaccesstoken);
      props.history.push("/datahub/participants");
    }
  };

  return (
    <div className="loginMainDiv">
      {isLoader ? <Loader /> : ""}
      <SignInHeader></SignInHeader>
      {isDataSet && isLoggedInUserParticipant() ? (
        <div>
          <AddDataset
            onBoardingPage={onBoardingPage}
            isaccesstoken={isaccesstoken}
            setOnBoardedTrue={setOnBoardedTrue}
            setTokenLocal={setTokenLocal}
            // okAction={() => {
            //   setOnBoardedTrue();
            //   setTokenLocal(isaccesstoken);
            //   history.push("/participant/datasets/add");
            // }}
            cancelAction={() => {
              setOnBoardedTrue();
              setTokenLocal(isaccesstoken);
              history.push("/participant/datasets");
              // history.push("/participant/datasets");
            }}
          />
          <div style={{ position: "absolute" }}>
            <Footer />
          </div>
        </div>
      ) : (
        <div>
          {!isCategorySetup && !isDataStandardization && <h1 className="headertext">{screenlabels.login.signup_header}</h1>}
          {(isParticipantRoute(location.pathname) && !isCategorySetup  && !isDataStandardization) ? <LeftintroParticipant /> : !isCategorySetup && !isDataStandardization ? <Leftintro /> : ""}

          {isemail || isOtp ? <Rightintro /> : ""}
          {/* <Footerimg /> */}
          {isemail && (
            <SignupEmail
              screenlabels={screenlabels}
              handleSubmit={handleSubmit}
              handleEmail={handleEmail}
              iserror={iserror}
              email={email}
              button={button}
              errormessage={errormessage}
              isuserSuspenderror={userSuspenderror}
            />
          )}
          {isOtp && (
            <SignupOtp
              handleSubmitOtp={handleSubmitOtp}
              handleOtp={handleOtp}
              isOtperror={isOtperror}
              isuserSuspenderror={userSuspenderror}
              otp={otp}
              otpValue={otpValue}
              setOtpValue={setOtpValue}
              button={verifyOtpbutton}
              hanleResendOTp={hanleResendOTp}
              restartcounter={restartcounter}
              disable={disable}
              setDisable={setDisable}
              remainingCounterTime={remainingCounterTime}
              setRemainingCounterTime={setRemainingCounterTime}
              errormessage={errormessage}
            />
          )}
          {isProfile && isLoggedInUserAdmin() && (
            <ProfileRightside
              handleprofileSubmit={handleprofileSubmit}
              handleprofilfirstename={handleprofilfirstename}
              handleprofilelastname={handleprofilelastname}
              handleprofilenumber={handleprofilenumber}
              ispropfilefirstnameerror={ispropfilefirstnameerror}
              ispropfilelastnameerror={ispropfilelastnameerror}
              ispropfileemailerror={ispropfileemailerror}
              profilenextbutton={profilenextbutton}
              profilefirstname={profilefirstname}
              profilelastname={profilelastname}
              profileemail={profileemail}
              validemail={validemail}
              finishLaterProfileScreen={finishLaterProfileScreen}
              isaccesstoken={isaccesstoken}
              firstNameErrorMessage={firstNameErrorMessage}
              lastNameErrorMessage={lastNameErrorMessage}
              emailErrorMessage={emailErrorMessage}
              phoneNumberErrorMessage={phoneNumberErrorMessage}
              setProfileFirstName={setProfileFirstName}
              setProfileLastName={setProfileLastName}
              setValidnumber={setValidnumber}
              profilephone={validNumber}
              setprofilenextbutton={setprofilenextbutton}
              userid={getUserLocal()}
            />
          )}
          {isProfile && (isLoggedInUserParticipant() || isLoggedInUserCoSteward()) && (
            <ProfileRightsideParticipant
              handleprofileSubmit={handleprofileSubmit}
              handleprofilfirstename={handleprofilfirstename}
              handleprofilelastname={handleprofilelastname}
              handleprofilenumber={handleprofilenumber}
              setProfileFirstName={setProfileFirstName}
              setProfileLastName={setProfileLastName}
              setValidnumber={setValidnumber}
              ispropfilefirstnameerror={ispropfilefirstnameerror}
              ispropfilelastnameerror={ispropfilelastnameerror}
              ispropfileemailerror={ispropfileemailerror}
              profilenextbutton={profilenextbutton}
              profilefirstname={profilefirstname}
              profilelastname={profilelastname}
              profileemail={profileemail}
              profilephone={validNumber}
              validemail={validemail}
              profileImageFile={profileimage}
              setProfileImageFile={setProfileImageFile}
              finishLaterProfileScreen={finishLaterProfileScreen}
              setprofilenextbutton={setprofilenextbutton}
              isaccesstoken={isaccesstoken}
              userid={getUserLocal()}
              firstNameErrorMessage={firstNameErrorMessage}
              lastNameErrorMessage={lastNameErrorMessage}
              emailErrorMessage={emailErrorMessage}
              phoneNumberErrorMessage={phoneNumberErrorMessage}
            />
          )}
          {isOrg ? (
            <OrgRightside
              setisOrgWebsiteerror={setisOrgWebsiteerror}
              isOrgnameerror={isOrgnameerror}
              setisOrgnameerror={setisOrgnameerror}
              isOrgmailerror={isOrgmailerror}
              setisOrgmailerror={setisOrgmailerror}
              isOrgAddresserror={isOrgAddresserror}
              setisOrgAddresserror={setisOrgAddresserror}
              isOrgcityerror={isOrgcityerror}
              setisOrgcityerror={setisOrgcityerror}
              ispincodeerror={ispincodeerror}
              setispincodeerror={setispincodeerror}
              countryvalue={countryvalue}
              setCountryValue={setcountryvalue}
              // orgdesc={orgdesc}
              // editorValue={editorValue}
              validOrgNumber={validOrgNumber}
              setValidOrgnumber={setValidOrgnumber}
              orgfile={orgfile}
              orgName={orgName}
              setOrgName={setOrgName}
              // orgEmail={orgEmail}
              // setOrgEmail={setOrgEmail}
              orgAddress={orgAddress}
              setOrgAddress={setOrgAddress}
              orgCity={orgCity}
              setOrgCity={setOrgCity}
              orgPincode={orgPincode}
              setOrgPincode={setOrgPincode}
              isExistingOrgEmail={isExistingOrgEmail}
              // Orgname={Orgname}
              Orgmail={orgmail}
              setOrgMail={setOrgMail}
              // OrgAddress={OrgAddress}
              // Orgcity={Orgcity}
              // pincode={pincode}
              Orgnamebtn={Orgnamebtn}
              Orgemailbtn={Orgemailbtn}
              setOrgemailbtn={setOrgemailbtn}
              Orgaddressbtn={Orgaddressbtn}
              Orgcitybtn={Orgcitybtn}
              Orgcountrybtn={Orgcountrybtn}
              setOrgcountrybtn={setOrgcountrybtn}
              Orgpincodebtn={Orgpincodebtn}
              // Orgdesbtn={Orgdesbtn}
              // handleOrgDesChange={handleOrgDesChange}
              textEditorData={(value) => settextEditorValue(value)}
              handleOrgSubmit={handleOrgSubmit}
              handleOrgmail={handleOrgmail}
              handleOrgnumber={handleOrgnumber}
              handleOrgAddress={handleOrgAddress}
              handleOrgcity={handleOrgcity}
              countrychangeHandler={countrychangeHandler}
              handlepincode={handlepincode}
              handleorgFileChange={handleorgFileChange}
              finishLaterOrgScreen={finishLaterOrgScreen}
              isaccesstoken={isaccesstoken}
              userid={getUserLocal()}
              orgId={orgId}
              setOrgId={setOrgIdState}
              orgNameErrorMessage={orgNameErrorMessage}
              orgEmailErrorMessage={orgEmailErrorMessage}
              orgPhoneNumberErrorMessage={orgPhoneNumberErrorMessage}
              orgDescriptionErrorMessage={orgDescriptionErrorMessage}
              orgWebsite={orgWebsite}
              isOrgWebsiteerror={isOrgWebsiteerror}
              orgWebsiteErrorMessage={orgWebsiteErrorMessage}
              handleOrgWebsite={handleOrgWebsite}
              setOrgWebsite={setOrgWebsite}
            />
          ) : (
            <></>
          )}
          {isPolicies && isLoggedInUserAdmin() && (
            <PoliciesRightside
              isaccesstoken={isaccesstoken}
              showBrandingScreen={() => {
                setisPolicies(false);
                setIsCategorySetup(true)
              }}
            />
          )}
          {isBranding && isLoggedInUserAdmin() && (
            <BrandingRightside
              validemail={validemail}
              isaccesstoken={isaccesstoken}
              setOnBoardedTrue={setOnBoardedTrue}
            />
          )}
          
        </div>
      )}
      {/* <div style={{ position: "absolute", bottom: 0 }}><Footer/></div> */}
      {isCategorySetup && isLoggedInUserAdmin() && (
        <AddingCategory isaccesstoken={isaccesstoken} showBrandingScreen={() => {
          setIsCategorySetup(false)
          // setisBranding(true);
          setIsDataStandardization(true)
        }} isOnborading={true} />
      )}
      {
         isDataStandardization && isLoggedInUserAdmin() && (
         <StandardizationInOnbord isaccesstoken={isaccesstoken} showBrandingScreen={() => {
          setIsDataStandardization(false)
          setisBranding(true);
        }} isOnborading={true}/>
        )
        
        
      }
    </div>
  );
}

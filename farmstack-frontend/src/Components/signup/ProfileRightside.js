import React, { useState, useRef, useEffect } from "react";
import "./profile.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MuiPhoneNumber from "material-ui-phone-number";
import Footerimg from "../../Components/signup/Footerimg";

import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import Footer from "../Footer/Footer";
import { mobileNumberMinimunLengthCheck } from "../../Utils/Common";

// import "react-phone-input-2/lib/material.css";

// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

export default function ProfileRightside(props) {
  // const profilefirstname = useRef();
  // const profilelastname = useRef();
  // const profileemail = useRef();

  // const [ispropfilefirstnameerror, setispropfilefirstnameerror] = useState(
  //   false
  // );
  // const [ispropfilelastnameerror, setispropfilelastnameerror] = useState(false);
  // const [ispropfileemailerror, setispropfileemailerror] = useState(false);
  // // const [ispropfilenumbererror, setispropfilenumbererror] = useState(false);
  // const [profilenextbutton, setprofilenextbutton] = useState(false);
  // const [validNumber, setValidnumber] = useState("");

  // const handleprofileSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log(profilefirstname.current.value);
  //   const firstname = profilefirstname.current.value;
  //   const lastname = profilelastname.current.value;
  //   const email = profileemail.current.value;
  //   if (profilefirstname.current.value.length === 0) {
  //     setispropfilefirstnameerror(true);
  //   } else {
  //     setispropfilefirstnameerror(false);
  //   }
  //   if (profilelastname.current.value.length === 0) {
  //     setispropfilelastnameerror(true);
  //   } else {
  //     setispropfilelastnameerror(false);
  //   }
  //   if (profileemail.current.value.length === 0) {
  //     setispropfileemailerror(true);
  //   } else {
  //     setispropfileemailerror(false);
  //   }
  //   var bodyFormData = new FormData();
  //   bodyFormData.append("email", email);
  //   bodyFormData.append("first_name", firstname);
  //   bodyFormData.append("last_name", lastname);
  //   bodyFormData.append("phone_number", validNumber);

  //   console.log("profile data", bodyFormData);
  //   let url = UrlConstant.base_url + UrlConstant.profile;

  //   await HTTPService("PUT", url, bodyFormData, true, false)
  //     .then((response) => {
  //       console.log("response");
  //       console.log("org details", response.data);
  //       //   console.log(response.json());
  //       console.log(response.status);
  //       if (response.status === 201) {
  //         // setEmail(false);
  //         // setError(false);
  //       } else {
  //         // setError(true);
  //       }
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //       //   setError(true);
  //     });
  // };
  // const handleprofilfirstename = (e) => {
  //   console.log(e.target.value);
  //   var letters = /^[A-Za-z]+$/;
  //   var profilefirstname = e.target.value;
  //   // if (profilefirstname.length > 0) {
  //   //   setispropfilefirstnameerror(false);
  //   //   // setprofilenextbutton(true);
  //   // } else {
  //   //   setispropfilefirstnameerror(true);
  //   // }
  //   if (profilefirstname.match(letters)) {
  //     setispropfilefirstnameerror(false);
  //     setprofilenextbutton(true);
  //   } else {
  //     setispropfilefirstnameerror(true);
  //     setprofilenextbutton(false);
  //   }
  // };
  // const handleprofilelastname = (e) => {
  //   console.log(e.target.value);
  //   var letters = /^[A-Za-z]+$/;
  //   var lastname = e.target.value;
  //   // if (lastname.length > 0) {
  //   //   setispropfilelastnameerror(false);
  //   //   setprofilenextbutton(true);
  //   // } else {
  //   //   setispropfilelastnameerror(true);
  //   // }
  //   if (lastname.match(letters)) {
  //     setispropfilelastnameerror(false);
  //     setprofilenextbutton(true);
  //   } else {
  //     setispropfilelastnameerror(true);
  //     setprofilenextbutton(false);
  //   }
  // };

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
  // const handleprofilenumber = (value) => {
  //   console.log(value);
  //   // var number = e.target.value;
  //   // if (number.length > 0) {
  //   //   setispropfilenumbererror(false);
  //   //   setprofilenextbutton(true);
  //   // } else {
  //   //   setispropfilenumbererror(true);
  //   // }
  //   setValidnumber(value);
  // };

  const [isLoader, setIsLoader] = useState(false);

  useEffect(() => {
    var id = props.userid;
    setIsLoader(true);
    HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.profile + id + "/",
      "",
      false,
      true,
      props.isaccesstoken
    )
      .then((response) => {
        setIsLoader(false);
        console.log("otp valid", response.data);
        if (response.data) {
          // let addressdata=JSON.parse(response.data.organization.address)
          props.setProfileFirstName(
            response?.data?.first_name ? response?.data?.first_name : ""
          );
          props.setProfileLastName(
            response?.data?.last_name ? response?.data?.last_name : ""
          );
          props.setValidnumber(
            response?.data?.phone_number ? response?.data?.phone_number : ""
          );

          if (response?.data?.first_name && response?.data?.first_name?.length > 0) {
            props.setprofilenextbutton(true);
          }
        }
      })
      .catch((e) => {
        setIsLoader(false);
        console.log(e);
        //history.push(GetErrorHandlingRoute(e));
      });
  }, []);

  return (
    <>
      <Footerimg />
      <div className="profileheader">Profile details</div>
      <div>
        <form
          noValidate
          autoComplete="off"
          onSubmit={props.handleprofileSubmit}>
          <div className="profilefirstname">
            <TextField
              required
              id="profile_firstname"
              label="First Name"
              variant="filled"
              style={{ width: "420px" }}
              //   className="profilefirstname"
              onChange={props.handleprofilfirstename}
              //inputRef={props.profilefirstname}
              error={
                props.ispropfilefirstnameerror || props.firstNameErrorMessage
              }
              helperText={
                props.ispropfilefirstnameerror
                  ? "Enter Valid Name"
                  : props.firstNameErrorMessage
              }
              value={props.profilefirstname}
            />
          </div>
          <div className="profilelastname">
            <TextField
              id="profile_lastname"
              label="Last Name"
              variant="filled"
              style={{ width: "420px" }}
              //   className="profilelastname"
              onChange={props.handleprofilelastname}
              //inputRef={props.profilelastname}
              error={
                props.ispropfilelastnameerror || props.lastNameErrorMessage
              }
              helperText={
                props.ispropfilelastnameerror
                  ? "Enter Valid last name"
                  : props.lastNameErrorMessage
              }
              value={props.profilelastname}
            />
          </div>
          <div className="profileemail">
            <TextField
              id="profile_email"
              label="Email"
              variant="filled"
              style={{ width: "420px" }}
              //   className="profileemail"
              onChange={props.handleprofileemail}
              inputRef={props.profileemail}
              inputProps={{ readOnly: true }}
              defaultValue={props.validemail}
              disabled
              error={props.emailErrorMessage ? true : false}
              helperText={props.emailErrorMessage}

              // error={props.ispropfileemailerror}
              // helperText={
              //   props.ispropfileemailerror ? "Enter Valid Email id" : ""
              // }
            />
          </div>
          <div className="profilenumber">
            <MuiPhoneNumber
              defaultCountry={"in"}
              countryCodeEditable={false}
              style={{ width: "420px" }}
              id="profile_number"
              label="Contact Number"
              variant="filled"
              onChange={props.handleprofilenumber}
              error={props.phoneNumberErrorMessage ? true : false}
              helperText={props.phoneNumberErrorMessage}
              value={props.profilephone}
              // error={ispropfilenumbererror}
              // helperText={ispropfilenumbererror ? "Enter Valid Email id" : ""}
            />
          </div>
          <div>
            {props.profilenextbutton &&
            mobileNumberMinimunLengthCheck(props.profilephone)? (
              <Button variant="contained" className="profilebtn" type="submit" id="next_btn">
                <span className="signupbtnname">Next</span>
              </Button>
            ) : (
              <Button variant="outlined" disabled className="disableprofilebtn">
                Next
              </Button>
            )}
          </div>

          <div>
            <Button
              id="finish_laterbtn"
              variant="outlined"
              className="finishlaterbtn"
              type="button"
              onClick={props.finishLaterProfileScreen}>
              Finish later
            </Button>
          </div>
        </form>
        <div style={{ position: "absolute", top: "1000px" }}>
          <Footer />
        </div>
      </div>
    </>
  );
}

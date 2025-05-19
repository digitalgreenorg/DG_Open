import React, { useState, useEffect } from "react";
import GuestUserBanner from "../../Components/GuestUser/GuestUserBanner";
import GuestUserContactForm from "../../Components/GuestUser/GuestUserContactForm";
import GuestUserDescription from "../../Components/GuestUser/GuestUserDescription";
import Loader from "../../Components/Loader/Loader";
import GuestUserNavBar from "../../Components/Navbar/GuestUserNavbar";
import Success from "../../Components/Success/Success";
import { useHistory } from "react-router-dom";
import THEME_COLORS from "../../Constants/ColorConstants";
import labels from "../../Constants/labels";
import Footer from "../../Components/Footer/Footer";
import validator from "validator";
import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";

import {
  adminNotFoundRoute,
  GetErrorHandlingRoute,
  GetErrorKey,
} from "../../Utils/Common";

export default function GuestUserContact(props) {
  // var validator = require('validator');
  const history = useHistory();
  const [isLoader, setIsLoader] = useState(false);
  const [allFieldCorrect, setAllFieldCorrect] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [iscontactnumbererror, setIscontactnumbererror] = useState(false);
  const [isdescriptionerror, setIsDescriptionerror] = useState(false);
  const [emailError, setEmailError] = useState(true);
  const guestUserConstants = labels["en"];
  const [datahubUserDetails, setDatahubUserDetails] = useState({});
  const [useDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    subject: "",
    queryDescription: "",
  });

  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState(null);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  const [contactNumberErrorMessage, setContactNumberErrorMessage] =
    useState(null);
  const [subjectErrorMessage, setSubjectErrorMessage] = useState(null);
  const [describeQueryErrorMessage, setDescribeQueryErrorMessage] =
    useState(null);
  const [adminNotFound, setAdminNotFound] = useState(false);
  const [isOrgmailerror, setisOrgmailerror] = useState(false);

  const handleChange = (e) => {
    // e.preventDefault()
    if (e.target.name == "email") {
      if (validator.isEmail(e.target.value)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    }
    const updatedUser = { ...useDetails, [e.target.name]: e.target.value };
    // console.log(e.target.name, e.target.value);
    setUserDetails({
      ...updatedUser,
    });

    // console.log(useDetails);
  };

  const useStyles = {
    btncolor: {
      color: THEME_COLORS.THEME_COLOR,
      "border-color": THEME_COLORS.THEME_COLOR,
      "border-radius": 0,
    },
    marginrowtop: { "margin-top": "30px" },
    marginrowtop50: { "margin-top": "50px" },
    inputwidth: {
      width: "420px",
      "text-align": "left",
      height: "49px",
      color: "#3D4A52",
    },
    fullWidth: {
      width: "860px",
      // height: "49px",
    },
    marginRight: { "margin-right": "20px" },
    headingbold: { fontWeight: "bold" },
  };

  // Axios Call for getting data from backend
  const addNewGuestUserData = () => {
    setIsLoader(true);

    setFirstNameErrorMessage(null);
    setLastNameErrorMessage(null);
    setEmailErrorMessage(null);
    setSubjectErrorMessage(null);
    setDescribeQueryErrorMessage(null);
    setContactNumberErrorMessage(null);

    // var bodyFormData1 = {
    //   "first_name": useDetails.firstName,
    //   "last_name": useDetails.lastName,
    //   "email": useDetails.email,
    //   "subject": useDetails.subject,
    //   "describe_query": useDetails.queryDescription,
    //   "contact_number": useDetails.contactNumber,
    // };

    var bodyFormData = new FormData();
    // console.log(bodyFormData, 1)
    bodyFormData.append("first_name", useDetails.firstName);
    // bodyFormData.append("first_name", "kanhaiya");
    // // console.log(bodyFormData)

    bodyFormData.append("last_name", useDetails.lastName);
    // // console.log(bodyFormData)

    bodyFormData.append("email", useDetails.email);
    // // console.log(bodyFormData)

    bodyFormData.append("subject", useDetails.subject);
    // bodyFormData.append("subject", "Hello");
    // bodyFormData.append("datahub_admin", "kanhaiya@digitalgreen.org");
    // // console.log(bodyFormData)

    bodyFormData.append("describe_query", useDetails.queryDescription);
    // // console.log(bodyFormData)

    bodyFormData.append("contact_number", useDetails.contactNumber);

    console.log("LENGTH", useDetails.contactNumber.length);

    console.log(bodyFormData);
    HTTPService(
      "POST",
      UrlConstant.base_url + UrlConstant.microsite_contact_form,

      bodyFormData,
      true,
      false
    )
      .then((response) => {
        setIsLoader(false);
        setIsSuccess(true);
      })
      .catch((e) => {
        setIsLoader(false);
        console.log(e);

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
              case "subject":
                setSubjectErrorMessage(errorMessages[i]);
                break;
              case "describe_query":
                setDescribeQueryErrorMessage(errorMessages[i]);
                break;
              case "contact_number":
                setContactNumberErrorMessage(errorMessages[i]);
                break;
              default:
                history.push(GetErrorHandlingRoute(e));
                break;
            }
          }
        } else {
          history.push(GetErrorHandlingRoute(e));
        }

        history.push(GetErrorHandlingRoute(e));
      });
  };

  const getDatahubAdminDetails = () => {
    setIsLoader(true);

    HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.guest_organization_details,
      "",
      false,
      false
    )
      .then((response) => {
        console.log(response);
        const admin = response.data.user;
        const organization = response.data.organization;
        const message = response.data.message;
        // console.log(admin, organization)
        console.log(admin);
        console.log(organization);
        console.log(message);
        setIsLoader(false);
        const adminErrorMessage = (e) => {
          history.push(adminNotFoundRoute(e));
        };
        // console.log({admin_name: admin.first_name,org_name:organization.org_description,address:`${organization.address.address}, ${admin.address.city}`,phone_number:organization.phone_number,admin_email:admin.email,country:organization.address.country,city:organization.address.city,website:organization.website,admin_phone:admin.phone_number,admin_pin_code:organization.address.pincode,email_id:organization.org_email})
        setDatahubUserDetails(
          admin == null
            ? setAdminNotFound(adminErrorMessage)
            : {
                admin_name: admin?.first_name,
                org_name: organization?.name,
                address: `${organization?.address?.address}, ${organization?.address?.city}`,
                phone_number: organization?.phone_number,
                admin_email: admin?.email,
                country: organization?.address?.country,
                city: organization?.address?.city,
                website: organization?.website,
                admin_phone: admin?.phone_number,
                admin_pin_code: organization?.address?.pincode,
                email_id: organization?.org_email,
              }
          // setIsSuccess(true);
        );
      })
      .catch((e) => {
        setIsLoader(false);
        console.log(e);
        // setisexisitinguseremail(true);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  useEffect(() => {
    getDatahubAdminDetails();
  }, []);

  return (
    <div className="center_keeping_conatiner">
      {isLoader ? <Loader /> : ""}
      <GuestUserNavBar />
      <GuestUserBanner />
      {isSuccess ? (
        <Success
          okevent={() => history.push("/home")}
          route={"/home"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Thanks for reaching us."}
          imageText={"Success!"}
          msg={"Your request has been shared successfully!"}
        ></Success>
      ) : (
        <GuestUserContactForm
          isSuccess={isSuccess}
          setIsSuccess={setIsSuccess}
          useDetails={useDetails}
          useStyles={useStyles}
          setUserDetails={setUserDetails}
          guestUserConstants={guestUserConstants}
          handleChange={handleChange}
          validator={validator}
          setEmailError={setEmailError}
          emailError={emailError}
          iscontactnumbererror={iscontactnumbererror}
          datahubUserDetails={datahubUserDetails}
          isdescriptionerror={isdescriptionerror}
          addNewGuestUserData={addNewGuestUserData}
          firstNameErrorMessage={firstNameErrorMessage}
          lastNameErrorMessage={lastNameErrorMessage}
          emailErrorMessage={emailErrorMessage}
          contactNumberErrorMessage={contactNumberErrorMessage}
          subjectErrorMessage={subjectErrorMessage}
          describeQueryErrorMessage={describeQueryErrorMessage}
        />
      )}

      <Footer disableContactLink={true} />
    </div>
  );
}

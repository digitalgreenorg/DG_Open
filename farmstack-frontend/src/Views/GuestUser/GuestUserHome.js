/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import Footer from "../../Components/Footer/Footer";
import GuestUserBanner from "../../Components/GuestUser/GuestUserBanner";
import GuestUserDatasets from "../../Components/GuestUser/GuestUserDatasets";
import GuestUserDescription from "../../Components/GuestUser/GuestUserDescription";
import NoDatasetGuestUserPage from "../../Components/GuestUser/NoDatasetGuestUserPage";
import Loader from "../../Components/Loader/Loader";
import GuestUserNavBar from "../../Components/Navbar/GuestUserNavbar";
import THEME_COLORS from "../../Constants/ColorConstants";
import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import "./GuestUserHome.css";

// const useStyles = {
//   btncolor: {
//     color: "white",
//     "border-color": THEME_COLORS.THEME_COLOR,
//     "background-color": THEME_COLORS.THEME_COLOR,
//     float: "right",
//     "border-radius": 0,
//   },
//   marginrowtop: { "margin-top": "20px" },
//   marginrowtop8px: { "margin-top": "0px" },
// };

export default function GuestUserHome(props) {
  //   loader
  const [isLoader, setIsLoader] = useState(false);
  const [farmstackLogo,setFarmstackLogo] = useState(false);
  const [noDatasetGuestUserPage, setNoDatasetGuestUserPage] = useState(true);
  useEffect(() => {
    setIsLoader(true);
    HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.guest_organization_details,
      "",
      false,
      false
    )
      .then((response) => {
        setIsLoader(false); /*
        if (response.data.organization.hero_image){
          let bannerImageUrl = UrlConstant.base_url_without_slash + response.data.organization.hero_image;
          setBannerImage(bannerImageUrl)
        }*/
        console.log("ereeeetew", response.data.organization);
        if (response.data.organization.status) {
          setFarmstackLogo(false);
          props.setNoDatasetGuestUserPage(true);
        } else {
          props.setNoDatasetGuestUserPage(false);
        }
      })
      .catch((e) => {
        setIsLoader(false);
        //history.push(GetErrorHandlingRoute(e));
      });
  }, []);
  console.log("Onboarded uuuuuu",farmstackLogo);
  return (
    <div className="center_keeping_conatiner">
      {isLoader ? <Loader /> : ""}
    
      <GuestUserNavBar farmstacklogo={farmstackLogo}/>
      {farmstackLogo ? (
        <>
          <NoDatasetGuestUserPage />
        </>
      ) : (
        <>
          <GuestUserBanner
            setNoDatasetGuestUserPage={setNoDatasetGuestUserPage}
          />
          <GuestUserDescription />
          <GuestUserDatasets />
        </>
      )}
      <Footer disableHomeLink={true} />
    </div>
  );
}

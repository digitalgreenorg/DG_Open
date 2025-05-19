/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import Footer from "../../Components/Footer/Footer";
import GuestUserBanner from "../../Components/GuestUser/GuestUserBanner";
import GuestUserDatasets from "../../Components/GuestUser/GuestUserDatasets";
import GuestUserDescription from "../../Components/GuestUser/GuestUserDescription";
import NoDatasetGuestUserPage from "../../Components/GuestUser/NoDatasetGuestUserPage";
import Loader from "../../Components/Loader/Loader";
import GuestUserNavBar from "../../Components/Navbar/GuestUserNavbar";
import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import "./GuestUserHome.css";
import GuestMainPageCarousel from "../../Components/GuestUser/GuestUserMainPage/GuestMainPageCarousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LeftRightDescription from "../../Components/GuestUser/GuestUserMainPage/LeftRightDescription";
import ViewDetail from "../../Components/GuestUser/GuestUserMainPage/ViewDetail";

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

export default function GuestUserMainHomePage(props) {
    //   loader
    const [isLoader, setIsLoader] = useState(false);
    const [farmstackLogo, setFarmstackLogo] = useState(true);
    const [noDatasetGuestUserPage, setNoDatasetGuestUserPage] = useState(true);
    const [costewardData, setCosteward] = useState([])
    const [participant, setParticipant] = useState([])
    const [datasets, setDatasets] = useState([])
    const [isViewDetails, setIsViewDetails] = useState(false)
    const [viewDetailData, setViewDetailData] = useState({})
    const [isExploreDatasetViewOn, setIsExploreDatasetViewOn] = useState(false)
    const getAllDataOfParticipantAndCoSteward = (userType) => {
        HTTPService(
            userType == "dataset" ? "POST" : "GET",
            UrlConstant.base_url + (userType == "costeward" ? UrlConstant.microsite_costeward_end_point : userType == "participant" ? UrlConstant.microsite_participant_end_point : UrlConstant.guest_dataset_filtered_data),
            "",
            false,
            false
        ).then((res) => {
            if (userType == "costeward") {
                setCosteward(res.data.results)
            } else if (userType == "participant") {
                setParticipant(res.data.results)
            } else {
                setDatasets(res.data.results)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

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
        let userType = ""
        userType = "costeward"
        getAllDataOfParticipantAndCoSteward(userType)
        userType = "participant"
        getAllDataOfParticipantAndCoSteward(userType)
        userType = "dataset"
        getAllDataOfParticipantAndCoSteward(userType)

    }, []);
    console.log("Onboarded uuuuuu", farmstackLogo);
    return (
        <div className="center_keeping_conatiner">
            {isLoader ? <Loader /> : ""}

            <GuestUserNavBar farmstacklogo={farmstackLogo} />
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
                    {/* <GuestUserDatasets /> */}
                    {isViewDetails && <ViewDetail viewDetailData={viewDetailData} setIsViewDetails={setIsViewDetails} />}
                    {isExploreDatasetViewOn && !isViewDetails && <GuestUserDatasets setIsExploreDatasetViewOn={setIsExploreDatasetViewOn} />}
                    {!isExploreDatasetViewOn && !isViewDetails && <GuestMainPageCarousel setViewDetailData={setViewDetailData} setIsViewDetails={setIsViewDetails} setIsExploreDatasetViewOn={setIsExploreDatasetViewOn} datasets={datasets} costewardData={costewardData} participant={participant} />}
                    {!isExploreDatasetViewOn && !isViewDetails && <LeftRightDescription setIsExploreDatasetViewOn={setIsExploreDatasetViewOn} />}
                </>
            )}
           {!farmstackLogo ? <Footer disableHomeLink={true} /> : " " }
        </div>
    );
}

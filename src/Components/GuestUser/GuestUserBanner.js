import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Loader from "../../Components/Loader/Loader";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import "./GuestUserBanner.css";

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

export default function GuestUserBanner(props) {
  const [bannerImage, setBannerImage] = useState(
    require("../../Assets/Img/no-image-banner.png")
  );
  const [logoImage, setLogoImage] = useState(
    require("../../Assets/Img/no-image-logo.png")
  );
  const [isLoader, setIsLoader] = useState(false);
  // const history = useHistory();

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
        setIsLoader(false);
        if (response.data.organization.logo) {
          let logoImageUrl =
            UrlConstant.base_url_without_slash +
            response.data.organization.logo;
          setLogoImage(logoImageUrl);
        }
        /*
        if (response.data.organization.hero_image){
          let bannerImageUrl = UrlConstant.base_url_without_slash + response.data.organization.hero_image;
          setBannerImage(bannerImageUrl)
        }*/

        if (response.data.organization == null) {
          props.setNoDatasetGuestUserPage(true);
        } else {
          props.setNoDatasetGuestUserPage(false);
        }
      })
      .catch((e) => {
        setIsLoader(false);
        //history.push(GetErrorHandlingRoute(e));
      });

    HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.microsite_theme,
      "",
      false,
      false
    )
      .then((response) => {
        setIsLoader(false);
        if (response.data.hero_image && response.data.hero_image.banner) {
          let bannerImageUrl =
            UrlConstant.base_url + response.data.hero_image.banner;
          setBannerImage(bannerImageUrl);
        }
      })
      .catch((e) => {
        setIsLoader(false);
        //history.push(GetErrorHandlingRoute(e));
      });
  }, []);

  return (
    <>
      {isLoader ? <Loader /> : ""}
      <div className="banner" align="center">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div
              style={{
                minWidth: "100%",
                minHeight: "220px",
                maxHeight: "220px",
                textAlign: "center",
                //backgroundImage: `url(${bannerImage})`,
                backgroundSize: "contain",
                //backgroundRepeat: 'no-repeat',
                //backgroundPosition: 'center',
                //background: 'rgb(22,22,22)',
                background: `url(${bannerImage}) no-repeat center, 
                            radial-gradient(circle, rgba(192,149,7,1) 0%, rgba(192,149,7,1) 8%, rgba(255,255,255,1) 100%)`,
              }}
              alt="Organisation banner"
              src={bannerImage}
            />
          </Col>
          <Col>
            <div
              className="logo"
              style={{
                backgroundImage: `url(${logoImage})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              {/*<img style={{minWidth: "140px", minHeight: "140px", maxWidth: "140px", maxHeight: "140px", textAlign: "center"}} alt="Organisation logo" src={logoImage} />*/}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

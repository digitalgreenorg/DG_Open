import React, { useEffect, useState } from "react";
import styles from "./new_onboarding_footer.module.css";
import { Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import HTTPService from "../../Services/HTTPService";
import {
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import UrlConstant from "../../Constants/UrlConstants";
import globalStyle from "../../Assets/CSS/global.module.css";
const OnboardingFooter = () => {
  const history = useHistory();
  const [adminData, setAdminData] = useState(null);

  const handleItemClick = (name) => {
    if (name === "datasets") {
      if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
        history.push("/datahub/new_datasets");
      } else if (isLoggedInUserParticipant()) {
        history.push("/participant/new_datasets");
      } else {
        history.push("/home/datasets");
      }
    } else if (name === "participants") {
      if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
        history.push("/datahub/participants");
      } else if (isLoggedInUserParticipant()) {
        history.push("/home/participants");
      } else {
        history.push("/home/participants");
      }
    }
  };
  useEffect(() => {
    let url =
      UrlConstant.base_url + UrlConstant.microsite_admin_organization + "/";

    let method = "GET";
    // let url = UrlConstant.base_url + UrlConstant.microsite_admin_organization
    HTTPService(method, url, "", false, false, false, false, false)
      .then((response) => {
        setAdminData(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <Row className={styles.on_boarding_footer}>
        <Col
          lg={4}
          sm={12}
          md={12}
          onClick={() => history.push("/home")}
          style={{ cursor: "pointer" }}
        >
          <span
            className={`${globalStyle.break_word}`}
            style={{ cursor: "pointer" }}
          >
            About {adminData?.organization?.name ?? ""}
          </span>
        </Col>
        <Col lg={4} sm={12} md={12}>
          About Farmstack
        </Col>
        <Col
          className={`${styles.bold} ${globalStyle.break_word}`}
          lg={4}
          sm={12}
          md={12}
        >
          Contact:{" "}
          <span className={styles.email_id}>
            {" "}
            {adminData?.user?.email ?? ""}
          </span>
        </Col>
      </Row>
    </>
  );
};

export default OnboardingFooter;

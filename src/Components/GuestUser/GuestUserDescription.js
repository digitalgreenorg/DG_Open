import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Loader from "../../Components/Loader/Loader";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import parse from "html-react-parser";
import "./GuestUserBanner.css";

export default function GuestUserDescription(props) {
  const [description, setDescription] = useState(
    "<< Organisation description >>"
  );
  const [isLoader, setIsLoader] = useState(false);

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
        if (response.data.organization.org_description) {
          setDescription(response.data.organization.org_description);
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
      <Container
        style={{
          "margin-top": "50px",
          "margin-left": "180px",
          "margin-right": "180px",
        }}
      >
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            {/* <Tooltip TransitionComponent={Zoom} title={parse(description)}> */}

            <span className="fontweight400andfontsize16pxandcolor3D4A52 classForPtag">
              {parse(description)}
            </span>
            {/* </Tooltip> */}
          </Col>
        </Row>
      </Container>
    </>
  );
}

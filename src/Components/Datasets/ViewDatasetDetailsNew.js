import { Button, Typography } from "@mui/material";
import React from "react";
import { Col, Row } from "react-bootstrap";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import ControlledAccordions from "../Generic/ControlledAccordions";
import LocalStyle from "./ViewDatasetDetails.module.css";

const ViewDatasetDetailsNew = (props) => {
  let data = [
    [
      "something",
      "something",
      "something",
      "something",
      "something",
      "something",
      "something",
      "something",
    ],
    [
      "something",
      "something",
      "something",
      "something",
      "something",
      "something",
      "something",
      "something",
    ],
    [
      "something",
      "something",
      "something",
      "something",
      "something",
      "something",
      "something",
      "something",
    ],
  ];
  return (
    <>
      <Row className={LocalStyle.titleContainer}>
        <Col xs={6} sm={6} md={8} xl={8}>
          <Typography
            id={"title"}
            className={`${GlobalStyle.size32} ${GlobalStyle.bold600} ${LocalStyle.title}`}
          >
            Dataset Details
          </Typography>
        </Col>
      </Row>
      <Row className={LocalStyle.titleContainer}>
        <Col xs={12} sm={12} md={8} xl={8}>
          <Typography
            id={"title"}
            className={`${GlobalStyle.size26} ${GlobalStyle.bold700} ${LocalStyle.title}`}
          >
            Agriculture practice video dissemination data
          </Typography>
          <Typography
            className={`${GlobalStyle.size16} ${GlobalStyle.bold400} ${LocalStyle.description}`}
          >
            Description
          </Typography>
          <Typography
            className={`${GlobalStyle.size16} ${GlobalStyle.bold600} ${LocalStyle.description}`}
            // className={`${GlobalStyle.size16} ${GlobalStyle.bold400} ${LocalStyle.description}`}
          >
            Chilli farmer producer group information is having details of the
            farmer members and their estimated yield information. Chilli farmer
            producer group information is having details of the farmer members
            and their estimated yield information.
          </Typography>
        </Col>
        <Col className={LocalStyle.rightSideText} xs={12} sm={12} md={4} xl={4}>
          <Button variant="outlined"> Public dataset</Button>
          <div>
            <div
              className={`${GlobalStyle.size16} ${GlobalStyle.bold400} ${LocalStyle.description}`}
            >
              Data Capture Interval
            </div>
            <div
              className={`${GlobalStyle.size16} ${GlobalStyle.bold600} ${LocalStyle.description}`}
            >
              02/03/2022 - Present
            </div>
          </div>
          <div>
            <div
              className={`${GlobalStyle.size16} ${GlobalStyle.bold400} ${LocalStyle.description}`}
            >
              Data Capture Interval
            </div>
            <div
              className={`${GlobalStyle.size16} ${GlobalStyle.bold600} ${LocalStyle.description}`}
            >
              02/03/2022 - Present
            </div>
          </div>
          <div>
            <div
              className={`${GlobalStyle.size16} ${GlobalStyle.bold400} ${LocalStyle.description}`}
            >
              Data Capture Interval
            </div>
            <div
              className={`${GlobalStyle.size16} ${GlobalStyle.bold600} ${LocalStyle.description}`}
            >
              02/03/2022 - Present
            </div>
          </div>
        </Col>
      </Row>
      <Row className={LocalStyle.titleContainer}>
        {/* <Col xs={6} sm={6} md={8} xl={8}> */}
        <Typography
          id={"title"}
          className={`${GlobalStyle.size24} ${GlobalStyle.bold600} ${LocalStyle.title}`}
        >
          Categories
        </Typography>
        {/* </Col> */}
      </Row>
      {/* <Row className={LocalStyle.titleContainer}>
        <Col xl={12}>
          Note: This dataset is solely meant to be used as a source of
          information. Even through accuracy is the goal, the steward is not
          accountable for the information. Please let the admin know if you have
          any information you think is inaccurate.
        </Col>
      </Row> */}
      {data?.map((accordionElements, index) => {
        const AccordionComponent = () => {
          return (
            <>
              <Row>
                {accordionElements?.map((item) => {
                  return (
                    <Col style={{ margin: "10px auto" }} xl={2}>
                      {item}
                    </Col>
                  );
                })}
              </Row>
            </>
            // </div>
          );
        };
        return (
          <Row>
            <ControlledAccordions
              accordionDelete={false}
              heading="Category"
              Component={AccordionComponent}
            />
          </Row>
        );
      })}
      <Row className={LocalStyle.titleContainer}>
        {/* <Col xs={6} sm={6} md={8} xl={8}> */}
        <Typography
          id={"title"}
          className={`${GlobalStyle.size24} ${GlobalStyle.bold600} ${LocalStyle.title}`}
        >
          Dataset Details
        </Typography>
        {/* </Col> */}
      </Row>
      <Row className={LocalStyle.titleContainer}>
        {/* <Col xl={12}> */}
        <Typography
          className={`${GlobalStyle.size16} ${GlobalStyle.bold400} ${LocalStyle.description}`}
        >
          Note: This dataset is solely meant to be used as a source of
          information. Even through accuracy is the goal, the steward is not
          accountable for the information. Please let the admin know if you have
          any information you think is inaccurate.
        </Typography>
        {/* </Col> */}
      </Row>
      {data?.map((accordionElements, index) => {
        const AccordionComponent = () => {
          return (
            <>
              <Row>
                {accordionElements?.map((item) => {
                  return (
                    <Col style={{ margin: "10px auto" }} xl={2}>
                      {item}
                    </Col>
                  );
                })}
              </Row>
            </>
            // </div>
          );
        };
        return (
          <Row>
            <ControlledAccordions
              accordionDelete={false}
              heading="Category"
              Component={AccordionComponent}
            />
          </Row>
        );
      })}
    </>
  );
};

export default ViewDatasetDetailsNew;

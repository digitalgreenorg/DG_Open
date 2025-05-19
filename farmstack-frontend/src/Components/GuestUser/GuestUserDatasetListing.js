import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "@mui/material/Button";
import labels from "../../Constants/labels";
import NoDatasetCard from "../../Components/Datasets/NoDatasetCard";
import GuestUserDatasetCard from "./GuestUserDatasetCard";

export default function GuestUserDatasetListing(props) {
  const [screenlabels, setscreenlabels] = useState(labels["en"]);

  return (
    <div>
      <Row
        style={{
          "margin-left": "-44px",
          width: "150%",
          "padding-top": "0px",
          "margin-top": "-20px",
        }}
      >
        {(!props.datasetList || props.datasetList.length == 0) && (
          <NoDatasetCard
            firstText={screenlabels.dataset.no_dataset_text1}
          ></NoDatasetCard>
        )}
        {props.datasetList &&
          props.datasetList.map((dataset) => (
            <GuestUserDatasetCard
              key={dataset.id}
              isMemberTab={props.isMemberTab}
              title={dataset.name}
              orgName={dataset.organization.name}
              visiblity={dataset.is_public}
              publishedon={dataset.updated_at}
              constantly_update={dataset.constantly_update}
              // cropDetail={dataset.crop_detail}
              geography={dataset.geography}
              orgLogo={dataset.organization.logo}
              description={dataset.description}
              id={dataset.id}
              viewCardDetails={() => props.viewCardDetails(dataset.id)}
              margingtop={"supportcard supportcardmargintop20px"}
            />
          ))}
      </Row>
      <Row style={{ "margin-left": "40px", "margin-top": "20px" }}>
        <Col xs={12} sm={12} md={6} lg={3}></Col>
        {props.isShowLoadMoreButton ? (
          <Col xs={12} sm={12} md={6} lg={6}>
            <Button
              onClick={() => props.getDatasetList(true)}
              variant="outlined"
              className="cancelbtn"
              style={{ "text-transform": "none" }}
            >
              Load more
            </Button>
          </Col>
        ) : (
          <></>
        )}
      </Row>
    </div>
  );
}

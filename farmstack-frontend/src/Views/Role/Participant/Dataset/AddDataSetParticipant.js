import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useHistory } from "react-router-dom";
import AddDatasetParticipant from "../../../Dataset/DatasetParticipant/AddDatasetParticipant";
import { getTokenLocal } from "../../../../Utils/Common";

export default function AddDataSetParticipant() {
  const history = useHistory();

  return (
    <>
      <AddDatasetParticipant
        isaccesstoken={getTokenLocal()}
        okAction={() => history.push("/participant/datasets")}
        cancelAction={() => history.push("/participant/datasets")}
        isBackBtn={true}
        successmsg={"Your dataset added successfully!"}
        successimageText={"Success!"}
        successheading={"Thank you for adding your dataset!"}
        cancelBtbnName={true}
      />
    </>
  );
}

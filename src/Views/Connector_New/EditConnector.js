import React, { useState, useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import HTTPService from "../../Services/HTTPService";
import UrlConstants from "../../Constants/UrlConstants";
import labels from "../../Constants/labels";
import {
  GetErrorHandlingRoute,
  getOrgLocal,
  getUserLocal,
} from "../../Utils/Common";
import AddConnector from "./AddConnector";

const EditConnector = () => {
  const history = useHistory();
  //   retrive id for dataset
  const { id } = useParams();

  useEffect(() => {}, []);
  return (
    <div>
      <AddConnector isEditModeOn={true} connectorIdForView={id} />
    </div>
  );
};

export default EditConnector;

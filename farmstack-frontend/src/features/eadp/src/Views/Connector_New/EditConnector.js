import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
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

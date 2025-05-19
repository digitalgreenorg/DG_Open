import React from "react";
import { Container } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import ViewDatasetDetailsNew from "../../Components/Datasets/ViewDatasetDetailsNew";

const DatasetDetailsNew = () => {
  const { id } = useParams();

  return (
    <Container>
      <ViewDatasetDetailsNew />
    </Container>
  );
};

export default DatasetDetailsNew;

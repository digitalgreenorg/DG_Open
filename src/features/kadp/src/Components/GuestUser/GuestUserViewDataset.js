import React from "react";
import DataSetsView from "../Datasets_New/DataSetsView";

const GuestUserViewDataset = () => {
  return (
    <>
      <DataSetsView breadcrumbFromRoute={"Home"} userType="guest" />
    </>
  );
};

export default GuestUserViewDataset;
